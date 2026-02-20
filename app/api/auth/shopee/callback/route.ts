import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const shopId = searchParams.get('shop_id');

    if (!code || !shopId) {
      return NextResponse.redirect(
        new URL('/dashboard?error=missing_params', request.url)
      );
    }

    const partnerId = process.env.SHOPEE_PARTNER_ID!;
    const partnerKey = process.env.SHOPEE_PARTNER_KEY!;
    
    const path = '/api/v2/auth/token/get';
    const timestamp = Math.floor(Date.now() / 1000);
    
    const baseString = `${partnerId}${path}${timestamp}`;
    const sign = crypto
      .createHmac('sha256', partnerKey)
      .update(baseString)
      .digest('hex');

    const tokenResponse = await axios.post(
      `https://partner.shopeemobile.com${path}`,
      {
        code,
        shop_id: parseInt(shopId),
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

    const { access_token, refresh_token, expire_in } = tokenResponse.data;

    const expiresAt = new Date(Date.now() + expire_in * 1000);

    const userStmt = db.prepare(`
      INSERT INTO users (email) VALUES (?)
      ON CONFLICT(email) DO UPDATE SET email=email
      RETURNING id
    `);
    const user = userStmt.get('shopee_user@temp.com') as any;

    const accountStmt = db.prepare(`
      INSERT INTO connected_accounts 
        (user_id, platform, shop_id, access_token, refresh_token, expires_at, shop_name)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, platform, shop_id) 
      DO UPDATE SET 
        access_token=excluded.access_token,
        refresh_token=excluded.refresh_token,
        expires_at=excluded.expires_at
      RETURNING id
    `);

    accountStmt.run(
      user.id,
      'shopee',
      shopId,
      access_token,
      refresh_token,
      expiresAt.toISOString(),
      `Shopee Shop ${shopId}`
    );

    return NextResponse.redirect(
      new URL('/dashboard?connected=shopee', request.url)
    );
  } catch (error: any) {
    console.error('Shopee OAuth callback error:', error.response?.data || error);
    return NextResponse.redirect(
      new URL('/dashboard?error=auth_failed', request.url)
    );
  }
}
