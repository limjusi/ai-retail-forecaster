# 🚀 Deployment Guide - AI Retail Forecaster

## Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier works)

### Step 1: Prepare Your Code

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - AI Retail Forecaster"
```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., "ai-retail-forecaster")
   - Don't initialize with README (we already have one)

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-retail-forecaster.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com/
2. **Sign up/Login** with your GitHub account
3. **Import Project**:
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

4. **Configure Build Settings**:
   - Framework Preset: **Next.js** (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. **Add Environment Variables**:
   Click "Environment Variables" and add:
   
   ```
   # Optional: AI Features (Gemini API)
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Optional: Shopee Integration
   SHOPEE_PARTNER_ID=your_partner_id
   SHOPEE_PARTNER_KEY=your_partner_key
   SHOPEE_REDIRECT_URI=https://your-app.vercel.app/api/auth/shopee/callback
   
   # Optional: TikTok Shop Integration
   TIKTOK_APP_KEY=your_app_key
   TIKTOK_APP_SECRET=your_app_secret
   TIKTOK_REDIRECT_URI=https://your-app.vercel.app/api/auth/tiktok/callback
   
   # Optional: Lazada Integration
   LAZADA_APP_KEY=your_app_key
   LAZADA_APP_SECRET=your_app_secret
   LAZADA_REDIRECT_URI=https://your-app.vercel.app/api/auth/lazada/callback
   ```

6. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at `https://your-app.vercel.app`

### Step 3: Post-Deployment

1. **Update OAuth Redirect URIs**:
   - Go to Shopee/TikTok/Lazada developer portals
   - Update redirect URIs to use your Vercel domain
   - Example: `https://your-app.vercel.app/api/auth/shopee/callback`

2. **Test the App**:
   - Visit your deployed URL
   - Test demo data (works without API keys)
   - Test platform connections (requires API credentials)

3. **Custom Domain** (Optional):
   - In Vercel dashboard → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

---

## Alternative: Deploy to Netlify

### Step 1: Build Configuration

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Step 2: Deploy

1. Go to https://netlify.com/
2. Connect GitHub repository
3. Configure build settings
4. Add environment variables
5. Deploy

---

## Environment Variables Explained

### Required for Demo Mode
**None!** The app works with demo data out of the box.

### Optional for AI Features
- `GEMINI_API_KEY`: Get from https://makersuite.google.com/app/apikey
  - Enables AI-powered insights and recommendations
  - Free tier: 60 requests/minute

### Optional for Platform Integration
Only needed if connecting real seller accounts:

**Shopee**:
- Register at https://open.shopee.com/
- Get Partner ID and Partner Key
- Requires business registration

**TikTok Shop**:
- Register at https://partner.tiktokshop.com/
- Get App Key and App Secret
- Requires seller account

**Lazada**:
- Register at https://open.lazada.com/
- Get App Key and App Secret
- Requires seller account

---

## Database Considerations

### Current Setup (SQLite)
- ✅ Works great for MVP and demo
- ✅ No external database needed
- ⚠️ Data resets on each deployment
- ⚠️ Not suitable for production with real users

### For Production (Future)
Consider migrating to:
- **Vercel Postgres** (serverless, easy integration)
- **Supabase** (PostgreSQL with real-time features)
- **PlanetScale** (MySQL, generous free tier)
- **MongoDB Atlas** (NoSQL option)

---

## Troubleshooting

### Build Fails
- Check `npm run build` works locally
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility

### Database Errors
- SQLite works on Vercel but data is ephemeral
- For persistent data, use external database

### API Errors
- Verify environment variables are set correctly
- Check API keys are valid
- Ensure redirect URIs match deployment URL

### Chart Not Displaying
- Charts require client-side rendering
- Ensure `'use client'` directive is present
- Check browser console for errors

---

## Performance Optimization

### Already Implemented
- ✅ Next.js 14 with App Router
- ✅ Server-side rendering
- ✅ Automatic code splitting
- ✅ Image optimization

### Recommended Additions
- Add caching for API responses
- Implement incremental static regeneration
- Use CDN for static assets
- Add loading skeletons

---

## Security Checklist

- ✅ Environment variables for secrets
- ✅ API keys not in code
- ✅ `.gitignore` configured
- ⚠️ Add rate limiting for production
- ⚠️ Add authentication for multi-user
- ⚠️ Validate all user inputs

---

## Monitoring & Analytics

### Vercel Built-in
- Real-time logs
- Performance metrics
- Error tracking

### Optional Additions
- Google Analytics
- Sentry for error tracking
- PostHog for product analytics

---

## Cost Estimate

### Free Tier (Vercel)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ✅ Automatic HTTPS
- ✅ Custom domains

### Paid Features (if needed)
- More bandwidth: $20/month
- Team collaboration: $20/user/month
- Advanced analytics: Included in Pro

---

## Next Steps After Deployment

1. **Share Your App**: Send the URL to potential users
2. **Gather Feedback**: See how people use it
3. **Add Analytics**: Track usage and popular features
4. **Iterate**: Add features based on feedback
5. **Scale**: Move to production database when ready

---

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- GitHub Issues: Create issues in your repo
