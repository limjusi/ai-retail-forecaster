import axios from 'axios';
import crypto from 'crypto';

const LAZADA_API_BASE = 'https://api.lazada.sg/rest';

interface LazadaConfig {
  appKey: string;
  appSecret: string;
  accessToken: string;
}

function generateLazadaSignature(
  appSecret: string,
  path: string,
  params: Record<string, any>
): string {
  const sortedKeys = Object.keys(params).sort();
  const concatenated = sortedKeys.map(key => `${key}${params[key]}`).join('');
  const signString = `${path}${concatenated}`;
  return crypto.createHmac('sha256', appSecret).update(signString).digest('hex').toUpperCase();
}

export async function getLazadaProducts(config: LazadaConfig) {
  const path = '/products/get';
  const timestamp = Date.now().toString();
  
  const params = {
    app_key: config.appKey,
    access_token: config.accessToken,
    timestamp,
    sign_method: 'sha256',
    filter: 'all',
    limit: '100',
  };

  const sign = generateLazadaSignature(config.appSecret, path, params);

  try {
    const response = await axios.get(`${LAZADA_API_BASE}${path}`, {
      params: { ...params, sign },
    });

    return response.data;
  } catch (error) {
    console.error('Lazada API error:', error);
    throw error;
  }
}

export async function getLazadaOrders(
  config: LazadaConfig,
  startDate: Date,
  endDate: Date
) {
  const path = '/orders/get';
  const timestamp = Date.now().toString();
  
  const params = {
    app_key: config.appKey,
    access_token: config.accessToken,
    timestamp,
    sign_method: 'sha256',
    created_after: startDate.toISOString(),
    created_before: endDate.toISOString(),
    limit: '100',
  };

  const sign = generateLazadaSignature(config.appSecret, path, params);

  try {
    const response = await axios.get(`${LAZADA_API_BASE}${path}`, {
      params: { ...params, sign },
    });

    return response.data;
  } catch (error) {
    console.error('Lazada orders error:', error);
    throw error;
  }
}

export function getLazadaAuthUrl(appKey: string, redirectUri: string): string {
  return `https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${appKey}`;
}
