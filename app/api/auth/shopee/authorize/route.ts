import { NextResponse } from 'next/server';
import { getShopeeAuthUrl } from '@/lib/platforms/shopee';

export async function GET() {
  try {
    const partnerId = process.env.SHOPEE_PARTNER_ID;
    const redirectUri = process.env.SHOPEE_REDIRECT_URI;

    if (!partnerId || !redirectUri) {
      return NextResponse.json(
        { error: 'Shopee credentials not configured' },
        { status: 400 }
      );
    }

    const authUrl = getShopeeAuthUrl(partnerId, redirectUri);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Shopee auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
