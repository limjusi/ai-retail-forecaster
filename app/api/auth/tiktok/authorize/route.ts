import { NextResponse } from 'next/server';
import { getTikTokAuthUrl } from '@/lib/platforms/tiktok';

export async function GET() {
  try {
    const appKey = process.env.TIKTOK_APP_KEY;
    const redirectUri = process.env.TIKTOK_REDIRECT_URI;

    if (!appKey || !redirectUri) {
      return NextResponse.json(
        { error: 'TikTok credentials not configured' },
        { status: 400 }
      );
    }

    const authUrl = getTikTokAuthUrl(appKey, redirectUri);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('TikTok auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
