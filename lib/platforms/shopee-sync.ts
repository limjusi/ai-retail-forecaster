import axios from 'axios';
import crypto from 'crypto';
import db from '@/lib/db';
import { normalizeCategory } from '@/lib/utils';
import { subDays, format } from 'date-fns';

const SHOPEE_API_BASE = 'https://partner.shopeemobile.com';

interface ShopeeConfig {
  partnerId: string;
  partnerKey: string;
  shopId: string;
  accessToken: string;
}

function generateSignature(
  partnerKey: string,
  path: string,
  timestamp: number
): string {
  const baseString = `${partnerKey}${path}${timestamp}`;
  return crypto.createHmac('sha256', partnerKey).update(baseString).digest('hex');
}

export async function syncShopeeProducts(accountId: number, config: ShopeeConfig) {
  const path = '/api/v2/product/get_item_list';
  const timestamp = Math.floor(Date.now() / 1000);
  const sign = generateSignature(config.partnerKey, path, timestamp);

  try {
    const response = await axios.get(`${SHOPEE_API_BASE}${path}`, {
      params: {
        partner_id: config.partnerId,
        shop_id: config.shopId,
        access_token: config.accessToken,
        timestamp,
        sign,
        offset: 0,
        page_size: 50,
      },
    });

    const itemList = response.data.response?.item || [];
    
    if (itemList.length === 0) {
      return { synced: 0, message: 'No products found' };
    }

    const itemIds = itemList.map((item: any) => item.item_id);
    const detailsPath = '/api/v2/product/get_item_base_info';
    const detailsTimestamp = Math.floor(Date.now() / 1000);
    const detailsSign = generateSignature(config.partnerKey, detailsPath, detailsTimestamp);

    const detailsResponse = await axios.get(`${SHOPEE_API_BASE}${detailsPath}`, {
      params: {
        partner_id: config.partnerId,
        shop_id: config.shopId,
        access_token: config.accessToken,
        timestamp: detailsTimestamp,
        sign: detailsSign,
        item_id_list: itemIds.join(','),
      },
    });

    const products = detailsResponse.data.response?.item_list || [];

    const productStmt = db.prepare(`
      INSERT INTO products 
        (account_id, platform, product_id, sku, name, category_id, category_name, price, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(account_id, platform, product_id) 
      DO UPDATE SET 
        name=excluded.name,
        price=excluded.price,
        stock=excluded.stock,
        updated_at=CURRENT_TIMESTAMP
    `);

    let syncedCount = 0;

    for (const product of products) {
      const categoryId = product.category_id?.toString() || 'unknown';
      const categoryName = normalizeCategory(product.category_name || 'other');
      const price = product.price_info?.[0]?.current_price || 0;
      const stock = product.stock_info?.[0]?.current_stock || 0;

      productStmt.run(
        accountId,
        'shopee',
        product.item_id.toString(),
        product.item_sku || `SKU-${product.item_id}`,
        product.item_name,
        categoryId,
        categoryName,
        price / 100000,
        stock
      );

      syncedCount++;
    }

    return { synced: syncedCount, message: `Synced ${syncedCount} products` };
  } catch (error: any) {
    console.error('Shopee product sync error:', error.response?.data || error);
    throw new Error(`Failed to sync products: ${error.message}`);
  }
}

export async function syncShopeeOrders(accountId: number, config: ShopeeConfig, days: number = 60) {
  const path = '/api/v2/order/get_order_list';
  const timestamp = Math.floor(Date.now() / 1000);
  const sign = generateSignature(config.partnerKey, path, timestamp);

  const startDate = subDays(new Date(), days);
  const endDate = new Date();

  try {
    const response = await axios.get(`${SHOPEE_API_BASE}${path}`, {
      params: {
        partner_id: config.partnerId,
        shop_id: config.shopId,
        access_token: config.accessToken,
        timestamp,
        sign,
        time_range_field: 'create_time',
        time_from: Math.floor(startDate.getTime() / 1000),
        time_to: Math.floor(endDate.getTime() / 1000),
        page_size: 100,
        response_optional_fields: 'item_list',
      },
    });

    const orderList = response.data.response?.order_list || [];

    if (orderList.length === 0) {
      return { synced: 0, message: 'No orders found in date range' };
    }

    const orderSnList = orderList.map((order: any) => order.order_sn);
    const detailsPath = '/api/v2/order/get_order_detail';
    const detailsTimestamp = Math.floor(Date.now() / 1000);
    const detailsSign = generateSignature(config.partnerKey, detailsPath, detailsTimestamp);

    const detailsResponse = await axios.get(`${SHOPEE_API_BASE}${detailsPath}`, {
      params: {
        partner_id: config.partnerId,
        shop_id: config.shopId,
        access_token: config.accessToken,
        timestamp: detailsTimestamp,
        sign: detailsSign,
        order_sn_list: orderSnList.join(','),
        response_optional_fields: 'item_list',
      },
    });

    const orders = detailsResponse.data.response?.order_list || [];

    const salesStmt = db.prepare(`
      INSERT INTO sales 
        (account_id, product_id, platform, order_id, sale_date, units_sold, revenue)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `);

    const productLookup = db.prepare(`
      SELECT id FROM products 
      WHERE account_id = ? AND platform = 'shopee' AND product_id = ?
    `);

    let syncedCount = 0;

    for (const order of orders) {
      const orderDate = new Date(order.create_time * 1000);
      const dateStr = format(orderDate, 'yyyy-MM-dd');

      for (const item of order.item_list || []) {
        const product = productLookup.get(accountId, item.item_id.toString()) as any;

        if (product) {
          const units = item.model_quantity_purchased || 1;
          const revenue = (item.model_discounted_price || item.model_original_price || 0) / 100000;

          salesStmt.run(
            accountId,
            product.id,
            'shopee',
            order.order_sn,
            dateStr,
            units,
            revenue * units
          );

          syncedCount++;
        }
      }
    }

    return { synced: syncedCount, message: `Synced ${syncedCount} sales records` };
  } catch (error: any) {
    console.error('Shopee order sync error:', error.response?.data || error);
    throw new Error(`Failed to sync orders: ${error.message}`);
  }
}

export async function refreshShopeeToken(accountId: number) {
  const accountStmt = db.prepare(`
    SELECT * FROM connected_accounts WHERE id = ? AND platform = 'shopee'
  `);
  const account = accountStmt.get(accountId) as any;

  if (!account || !account.refresh_token) {
    throw new Error('Account not found or missing refresh token');
  }

  const partnerId = process.env.SHOPEE_PARTNER_ID!;
  const partnerKey = process.env.SHOPEE_PARTNER_KEY!;
  
  const path = '/api/v2/auth/access_token/get';
  const timestamp = Math.floor(Date.now() / 1000);
  const sign = generateSignature(partnerKey, path, timestamp);

  try {
    const response = await axios.post(
      `${SHOPEE_API_BASE}${path}`,
      {
        refresh_token: account.refresh_token,
        shop_id: parseInt(account.shop_id),
        partner_id: parseInt(partnerId),
      },
      {
        params: {
          partner_id: partnerId,
          timestamp,
          sign,
        },
      }
    );

    const { access_token, refresh_token, expire_in } = response.data;
    const expiresAt = new Date(Date.now() + expire_in * 1000);

    const updateStmt = db.prepare(`
      UPDATE connected_accounts 
      SET access_token = ?, refresh_token = ?, expires_at = ?
      WHERE id = ?
    `);

    updateStmt.run(access_token, refresh_token, expiresAt.toISOString(), accountId);

    return { access_token, refresh_token };
  } catch (error: any) {
    console.error('Token refresh error:', error.response?.data || error);
    throw new Error('Failed to refresh access token');
  }
}
