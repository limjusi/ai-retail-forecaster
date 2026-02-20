import { NextResponse } from 'next/server';
import { getLazadaAuthUrl } from '@/lib/platforms/lazada';

export async function GET() {
  try {
    const appKey = process.env.LAZADA_APP_KEY;
    const redirectUri = process.env.LAZADA_REDIRECT_URI;

    if (!appKey || !redirectUri) {
      return NextResponse.json(
        { error: 'Lazada credentials not configured' },
        { status: 400 }
      );
    }

    const authUrl = getLazadaAuthUrl(appKey, redirectUri);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Lazada auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
