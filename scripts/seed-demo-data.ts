import db from '../lib/db';
import { subDays, format } from 'date-fns';

console.log('🌱 Seeding multi-platform demo data...\n');

const platforms = ['shopee', 'tiktok', 'lazada'];

const categories = [
  { 
    name: 'electronics', 
    products: [
      { name: 'Wireless Earbuds Pro', platforms: ['shopee', 'tiktok'] },
      { name: 'Smart Watch X1', platforms: ['shopee', 'lazada'] },
      { name: 'Phone Case Premium', platforms: ['tiktok', 'lazada'] },
      { name: 'USB-C Cable 2m', platforms: ['shopee'] },
      { name: 'Power Bank 20000mAh', platforms: ['tiktok'] },
    ]
  },
  { 
    name: 'fashion', 
    products: [
      { name: 'Cotton T-Shirt', platforms: ['shopee', 'tiktok', 'lazada'] },
      { name: 'Denim Jeans', platforms: ['shopee', 'lazada'] },
      { name: 'Sneakers Classic', platforms: ['tiktok', 'lazada'] },
      { name: 'Summer Dress', platforms: ['shopee', 'tiktok'] },
    ]
  },
  { 
    name: 'beauty', 
    products: [
      { name: 'Face Serum Vitamin C', platforms: ['shopee', 'tiktok'] },
      { name: 'Moisturizer SPF 50', platforms: ['shopee', 'lazada'] },
      { name: 'Lip Tint Natural', platforms: ['tiktok'] },
      { name: 'Sheet Mask 10-Pack', platforms: ['shopee', 'tiktok', 'lazada'] },
    ]
  },
  { 
    name: 'home-living', 
    products: [
      { name: 'Bedsheet Set Queen', platforms: ['shopee', 'lazada'] },
      { name: 'Storage Box 3-Pack', platforms: ['shopee', 'tiktok'] },
      { name: 'LED Desk Lamp', platforms: ['lazada'] },
      { name: 'Throw Pillow Set', platforms: ['shopee', 'tiktok'] },
    ]
  },
  { 
    name: 'toys', 
    products: [
      { name: 'Building Blocks 500pcs', platforms: ['shopee', 'tiktok'] },
      { name: 'Puzzle Game Kids', platforms: ['tiktok', 'lazada'] },
      { name: 'Action Figure Hero', platforms: ['shopee'] },
    ]
  },
  { 
    name: 'groceries', 
    products: [
      { name: 'Organic Oats 1kg', platforms: ['shopee', 'lazada'] },
      { name: 'Green Tea Pack', platforms: ['shopee', 'tiktok'] },
      { name: 'Honey Pure 500g', platforms: ['lazada'] },
    ]
  },
];

try {
  const userStmt = db.prepare(`
    INSERT INTO users (email) VALUES (?)
    ON CONFLICT(email) DO UPDATE SET email=email
    RETURNING id
  `);
  const user = userStmt.get('demo@example.com') as any;
  const userId = user.id;
  console.log(`✅ User created: demo@example.com (ID: ${userId})\n`);

  const accountStmt = db.prepare(`
    INSERT INTO connected_accounts (user_id, platform, shop_id, access_token, shop_name)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, platform, shop_id) DO UPDATE SET shop_name=excluded.shop_name
    RETURNING id
  `);
  
  const accounts: Record<string, number> = {};
  
  const shopeeAccount = accountStmt.get(userId, 'shopee', 'demo_shop_shopee', 'demo_token_shopee', 'Demo Shopee Store') as any;
  accounts['shopee'] = shopeeAccount.id;
  console.log(`✅ Connected: Demo Shopee Store (ID: ${shopeeAccount.id})`);
  
  const tiktokAccount = accountStmt.get(userId, 'tiktok', 'demo_shop_tiktok', 'demo_token_tiktok', 'Demo TikTok Shop') as any;
  accounts['tiktok'] = tiktokAccount.id;
  console.log(`✅ Connected: Demo TikTok Shop (ID: ${tiktokAccount.id})`);
  
  const lazadaAccount = accountStmt.get(userId, 'lazada', 'demo_shop_lazada', 'demo_token_lazada', 'Demo Lazada Store') as any;
  accounts['lazada'] = lazadaAccount.id;
  console.log(`✅ Connected: Demo Lazada Store (ID: ${lazadaAccount.id})\n`);

  let totalProducts = 0;
  let totalSales = 0;

  for (const category of categories) {
    console.log(`📦 Adding ${category.name} products...`);
    
    for (const productInfo of category.products) {
      const productStmt = db.prepare(`
        INSERT INTO products (account_id, platform, product_id, sku, name, category_id, category_name, price, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(account_id, platform, product_id) DO UPDATE SET stock=excluded.stock
        RETURNING id
      `);
      
      for (const platform of productInfo.platforms) {
        const productId = `PROD_${platform}_${category.name}_${totalProducts}`;
        const sku = `SKU-${platform.toUpperCase()}-${totalProducts.toString().padStart(4, '0')}`;
        const basePrice = Math.floor(Math.random() * 100) + 20;
        const platformMultiplier = platform === 'tiktok' ? 0.95 : platform === 'lazada' ? 1.05 : 1.0;
        const price = Math.round(basePrice * platformMultiplier);
        const stock = Math.floor(Math.random() * 200) + 50;
        
        const product = productStmt.get(
          accounts[platform],
          platform,
          productId,
          sku,
          productInfo.name,
          category.name,
          category.name,
          price,
          stock
        ) as any;
        
        totalProducts++;

        const salesStmt = db.prepare(`
          INSERT INTO sales (account_id, product_id, platform, order_id, sale_date, units_sold, revenue)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        const platformPerformance = platform === 'tiktok' ? 1.2 : platform === 'shopee' ? 1.0 : 0.9;

        for (let i = 0; i < 60; i++) {
          const saleDate = subDays(new Date(), i);
          const dateStr = format(saleDate, 'yyyy-MM-dd');
          
          let baseUnits = Math.floor(Math.random() * 10) + 1;
          
          const month = saleDate.getMonth();
          if (category.name === 'electronics' && (month === 10 || month === 11)) {
            baseUnits *= 2.5;
          } else if (category.name === 'fashion' && (month === 0 || month === 1)) {
            baseUnits *= 2.0;
          } else if (category.name === 'groceries' && (month === 0 || month === 1)) {
            baseUnits *= 1.6;
          } else if (category.name === 'beauty' && platform === 'tiktok') {
            baseUnits *= 1.5;
          }
          
          const units = Math.floor(baseUnits * platformPerformance);
          const revenue = units * price;
          
          if (units > 0) {
            salesStmt.run(
              accounts[platform],
              product.id,
              platform,
              `ORDER_${platform}_${totalSales}`,
              dateStr,
              units,
              revenue
            );
            totalSales++;
          }
        }
      }
    }
  }

  console.log(`\n✨ Multi-platform demo data seeded successfully!`);
  console.log(`   🏪 Platforms: Shopee, TikTok Shop, Lazada`);
  console.log(`   📦 Total products: ${totalProducts}`);
  console.log(`   💰 Total sales records: ${totalSales}`);
  console.log(`\n🚀 Start the app with: npm run dev`);
  console.log(`   Then visit: http://localhost:3000/dashboard\n`);

} catch (error) {
  console.error('❌ Error seeding data:', error);
  process.exit(1);
}
