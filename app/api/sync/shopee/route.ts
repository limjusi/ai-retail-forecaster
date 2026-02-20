import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { syncShopeeProducts, syncShopeeOrders, refreshShopeeToken } from '@/lib/platforms/shopee-sync';

export async function POST() {
  try {
    const accountStmt = db.prepare(`
      SELECT * FROM connected_accounts 
      WHERE platform = 'shopee' 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
    
    const account = accountStmt.get() as any;

    if (!account) {
      return NextResponse.json(
        { error: 'No Shopee account connected' },
        { status: 400 }
      );
    }

    const partnerId = process.env.SHOPEE_PARTNER_ID;
    const partnerKey = process.env.SHOPEE_PARTNER_KEY;

    if (!partnerId || !partnerKey) {
      return NextResponse.json(
        { error: 'Shopee credentials not configured' },
        { status: 500 }
      );
    }

    const expiresAt = new Date(account.expires_at);
    const now = new Date();
    
    let accessToken = account.access_token;

    if (expiresAt <= now) {
      console.log('Token expired, refreshing...');
      const tokens = await refreshShopeeToken(account.id);
      accessToken = tokens.access_token;
    }

    const config = {
      partnerId,
      partnerKey,
      shopId: account.shop_id,
      accessToken,
    };

    console.log('Syncing Shopee products...');
    const productResult = await syncShopeeProducts(account.id, config);

    console.log('Syncing Shopee orders...');
    const orderResult = await syncShopeeOrders(account.id, config, 60);

    return NextResponse.json({
      success: true,
      products: productResult,
      orders: orderResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Shopee sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Sync failed' },
      { status: 500 }
    );
  }
}
