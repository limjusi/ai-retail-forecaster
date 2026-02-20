import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { normalizeCategory } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 });
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const requiredHeaders = ['date', 'product_name', 'category', 'platform', 'units_sold', 'price'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { error: `Missing required columns: ${missingHeaders.join(', ')}` },
        { status: 400 }
      );
    }

    const userStmt = db.prepare(`
      INSERT INTO users (email) VALUES (?)
      ON CONFLICT(email) DO UPDATE SET email=email
      RETURNING id
    `);
    const user = userStmt.get('csv_import@example.com') as any;

    const accountStmt = db.prepare(`
      INSERT INTO connected_accounts (user_id, platform, shop_id, access_token, shop_name)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, platform, shop_id) DO UPDATE SET shop_name=excluded.shop_name
      RETURNING id
    `);

    const accounts: Record<string, number> = {};
    const platforms = ['shopee', 'tiktok', 'lazada'];
    
    for (const platform of platforms) {
      const account = accountStmt.get(
        user.id,
        platform,
        `csv_import_${platform}`,
        'csv_token',
        `CSV Import ${platform.charAt(0).toUpperCase() + platform.slice(1)}`
      ) as any;
      accounts[platform] = account.id;
    }

    const productStmt = db.prepare(`
      INSERT INTO products (account_id, platform, product_id, sku, name, category_id, category_name, price, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(account_id, platform, product_id) DO UPDATE SET 
        price=excluded.price,
        updated_at=CURRENT_TIMESTAMP
      RETURNING id
    `);

    const salesStmt = db.prepare(`
      INSERT INTO sales (account_id, product_id, platform, order_id, sale_date, units_sold, revenue)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    let productsCreated = 0;
    let salesCreated = 0;
    const productCache: Record<string, number> = {};

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length < requiredHeaders.length) continue;

      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      const platform = row.platform.toLowerCase();
      if (!platforms.includes(platform)) {
        console.warn(`Invalid platform: ${platform}, skipping row ${i + 1}`);
        continue;
      }

      const accountId = accounts[platform];
      const productName = row.product_name;
      const category = normalizeCategory(row.category);
      const sku = row.sku || `CSV-${i}`;
      const price = parseFloat(row.price) || 0;
      const unitsSold = parseInt(row.units_sold) || 0;
      const saleDate = row.date;

      const productKey = `${platform}_${productName}`;
      
      let productId: number;
      
      if (productCache[productKey]) {
        productId = productCache[productKey];
      } else {
        const product = productStmt.get(
          accountId,
          platform,
          `CSV_${platform}_${i}`,
          sku,
          productName,
          category,
          category,
          price,
          100
        ) as any;
        
        productId = product.id;
        productCache[productKey] = productId;
        productsCreated++;
      }

      const revenue = unitsSold * price;
      
      salesStmt.run(
        accountId,
        productId,
        platform,
        `CSV_ORDER_${i}`,
        saleDate,
        unitsSold,
        revenue
      );
      
      salesCreated++;
    }

    return NextResponse.json({
      success: true,
      productsCreated,
      salesCreated,
      message: `Successfully imported ${productsCreated} products and ${salesCreated} sales records`,
    });
  } catch (error: any) {
    console.error('CSV import error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import CSV' },
      { status: 500 }
    );
  }
}
