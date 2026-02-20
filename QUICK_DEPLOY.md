# ⚡ Quick Deploy Guide

## 🚀 Deploy in 5 Minutes

### Option 1: One-Click Deploy to Vercel (Easiest)

1. **Push to GitHub**:
```bash
# Initialize git (if not done)
git init
git add .
git commit -m "AI Retail Forecaster MVP"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ai-retail-forecaster.git
git branch -M main
git push -u origin main
```

2. **Deploy to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Click "Deploy" (no configuration needed!)
   - Done! Your app is live in ~2 minutes

3. **Access Your App**:
   - Vercel will give you a URL like: `https://ai-retail-forecaster.vercel.app`
   - The demo data works immediately - no API keys needed!

---

## 🔑 Optional: Add API Keys Later

After deployment, add environment variables in Vercel dashboard:

**For AI Features** (optional):
```
GEMINI_API_KEY=your_key_here
```
Get free key: https://makersuite.google.com/app/apikey

**For Platform Integration** (optional, requires business registration):
- Shopee, TikTok, Lazada credentials
- See DEPLOYMENT.md for details

---

## ✅ What Works Out of the Box

Without any API keys, your deployed app has:
- ✅ Full demo data (42 products, 2,487 sales)
- ✅ All charts and visualizations
- ✅ Platform comparison
- ✅ Stock suggestions
- ✅ CSV import
- ✅ Mobile-responsive dark theme

---

## 📱 Share Your App

Once deployed, share the URL with:
- Potential clients
- Investors
- Team members
- Anyone who wants to see your MVP!

---

## 🔄 Updates

To update your deployed app:
```bash
git add .
git commit -m "Update features"
git push
```
Vercel auto-deploys on every push to main branch!

---

## 💡 Pro Tips

1. **Custom Domain**: Add in Vercel → Settings → Domains
2. **Analytics**: Enable in Vercel dashboard for free
3. **Logs**: Check Vercel dashboard for errors
4. **Environment Variables**: Add in Vercel → Settings → Environment Variables

---

## 🆘 Troubleshooting

**"Repository not found"**
- Make sure repo is public or Vercel has access

**"Build failed"**
- Vercel will build automatically - local build not required
- Check build logs in Vercel dashboard

**"Database errors"**
- SQLite works on Vercel but data resets on redeploy
- This is fine for demo/MVP
- For production, migrate to Vercel Postgres

---

## 🎯 Next Steps

1. Deploy now (5 minutes)
2. Test the live app
3. Share with stakeholders
4. Gather feedback
5. Iterate and improve!

**Ready? Start with step 1 above! 🚀**
