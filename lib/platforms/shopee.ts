import axios from 'axios';
import crypto from 'crypto';

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

export async function getShopeeProducts(config: ShopeeConfig) {
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
        page_size: 100,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Shopee API error:', error);
    throw error;
  }
}

export async function getShopeeOrders(
  config: ShopeeConfig,
  startDate: Date,
  endDate: Date
) {
  const path = '/api/v2/order/get_order_list';
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
        time_range_field: 'create_time',
        time_from: Math.floor(startDate.getTime() / 1000),
        time_to: Math.floor(endDate.getTime() / 1000),
        page_size: 100,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Shopee orders error:', error);
    throw error;
  }
}

export async function getShopeeProductDetails(
  config: ShopeeConfig,
  itemIds: number[]
) {
  const path = '/api/v2/product/get_item_base_info';
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
        item_id_list: itemIds.join(','),
      },
    });

    return response.data;
  } catch (error) {
    console.error('Shopee product details error:', error);
    throw error;
  }
}

export function getShopeeAuthUrl(partnerId: string, redirectUri: string): string {
  const path = '/api/v2/shop/auth_partner';
  return `${SHOPEE_API_BASE}${path}?partner_id=${partnerId}&redirect=${encodeURIComponent(redirectUri)}`;
}
