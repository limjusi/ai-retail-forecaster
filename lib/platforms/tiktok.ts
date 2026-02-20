import axios from 'axios';
import crypto from 'crypto';

const TIKTOK_API_BASE = 'https://open-api.tiktokglobalshop.com';

interface TikTokConfig {
  appKey: string;
  appSecret: string;
  shopId: string;
  accessToken: string;
}

function generateTikTokSignature(
  appSecret: string,
  path: string,
  params: Record<string, any>
): string {
  const sortedKeys = Object.keys(params).sort();
  const paramStr = sortedKeys.map(key => `${key}${params[key]}`).join('');
  const baseString = `${path}${paramStr}`;
  return crypto.createHmac('sha256', appSecret).update(baseString).digest('hex');
}

export async function getTikTokProducts(config: TikTokConfig) {
  const path = '/api/v2/product/get_product_list';
  const timestamp = Math.floor(Date.now() / 1000);
  
  const params = {
    app_key: config.appKey,
    access_token: config.accessToken,
    timestamp,
    shop_id: config.shopId,
    page_size: 100,
  };

  const sign = generateTikTokSignature(config.appSecret, path, params);

  try {
    const response = await axios.get(`${TIKTOK_API_BASE}${path}`, {
      params: { ...params, sign },
    });

    return response.data;
  } catch (error) {
    console.error('TikTok API error:', error);
    throw error;
  }
}

export async function getTikTokOrders(
  config: TikTokConfig,
  startDate: Date,
  endDate: Date
) {
  const path = '/api/v2/order/get_order_list';
  const timestamp = Math.floor(Date.now() / 1000);
  
  const params = {
    app_key: config.appKey,
    access_token: config.accessToken,
    timestamp,
    shop_id: config.shopId,
    create_time_from: Math.floor(startDate.getTime() / 1000),
    create_time_to: Math.floor(endDate.getTime() / 1000),
    page_size: 100,
  };

  const sign = generateTikTokSignature(config.appSecret, path, params);

  try {
    const response = await axios.get(`${TIKTOK_API_BASE}${path}`, {
      params: { ...params, sign },
    });

    return response.data;
  } catch (error) {
    console.error('TikTok orders error:', error);
    throw error;
  }
}

export function getTikTokAuthUrl(appKey: string, redirectUri: string): string {
  return `${TIKTOK_API_BASE}/oauth/authorize?app_key=${appKey}&redirect_uri=${encodeURIComponent(redirectUri)}`;
}
