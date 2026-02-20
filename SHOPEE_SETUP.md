# 🛍️ Shopee Integration Setup Guide

## Step 1: Register as Shopee Developer

1. **Visit Shopee Open Platform**
   - Go to: https://open.shopee.com/
   - Click "Sign In" (use your Shopee seller account)

2. **Create a New App**
   - Navigate to "My Apps" → "Create New App"
   - Fill in the details:
     - **App Name**: AI Retail Forecaster
     - **App Type**: Public App
     - **Redirect URL**: `http://localhost:3000/api/auth/shopee/callback`
     - **Description**: AI-powered inventory and trend forecasting tool

3. **Get Your Credentials**
   After creating the app, you'll receive:
   - **Partner ID** (numeric)
   - **Partner Key** (secret string)
   
   You also need your **Shop ID**:
   - Go to Shopee Seller Center
   - Settings → Account Settings
   - Your Shop ID is displayed there

## Step 2: Configure Environment Variables

1. **Create `.env` file** in the project root:
   ```bash
   copy .env.example .env
   ```

2. **Add your Shopee credentials** to `.env`:
   ```env
   # Shopee Configuration
   SHOPEE_PARTNER_ID=your_partner_id_here
   SHOPEE_PARTNER_KEY=your_partner_key_here
   SHOPEE_REDIRECT_URI=http://localhost:3000/api/auth/shopee/callback
   
   # Optional: AI Features
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Step 3: Connect Your Shopee Shop

1. **Start the development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open the dashboard**:
   - Visit: http://localhost:3000/dashboard
   - Click on "Connect Accounts" tab

3. **Click "Connect Account" for Shopee**:
   - You'll be redirected to Shopee's authorization page
   - Log in with your seller account
   - Grant permissions to the app
   - You'll be redirected back to the dashboard

## Step 4: Sync Your Data

1. **Go to "Sales Overview" tab**
2. **Click "Sync Now" button**
3. **Wait for sync to complete** (usually 10-30 seconds)
4. **Refresh the page** to see your real data

The sync will pull:
- ✅ All your products with categories
- ✅ Last 60 days of orders/sales
- ✅ Current inventory levels

## Troubleshooting

### "Shopee credentials not configured"
- Make sure `.env` file exists in project root
- Verify `SHOPEE_PARTNER_ID` and `SHOPEE_PARTNER_KEY` are set
- Restart the dev server after adding credentials

### "No Shopee account connected"
- Complete Step 3 first (Connect Accounts)
- Check if OAuth callback succeeded
- Look for `?connected=shopee` in URL after redirect

### "Sync failed" or API errors
- Verify your Partner ID and Key are correct
- Check if your app is approved in Shopee Partner Portal
- Ensure your Shop ID is correct
- Check API rate limits (Shopee has limits per minute)

### Token expired
- The app automatically refreshes tokens
- If issues persist, reconnect your account (Step 3)

## API Permissions Required

Make sure your Shopee app has these permissions:
- ✅ Product Information
- ✅ Order Management
- ✅ Inventory Management

## Testing with Demo Data

If you don't have Shopee credentials yet, you can test with demo data:

```bash
npm run seed
```

This creates 18 sample products with 60 days of sales data.

## Next Steps

Once connected and synced:
1. View sales forecasts in "Sales Overview"
2. Check "Industry Peaks" for category insights
3. Review "Stock Suggestions" for reorder recommendations
4. Generate "Promo Ideas" with AI

## Support

For Shopee API issues:
- Shopee Developer Docs: https://open.shopee.com/documents
- Partner Support: support@shopee.com

For app issues:
- Check the browser console for errors
- Check terminal logs for API errors
