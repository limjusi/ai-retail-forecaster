# AI Retail Inventory & Trend Forecaster

MVP web app for small sellers on Shopee, TikTok Shop, and Lazada (Singapore, expandable to Malaysia/Indonesia).

## Features

- **Multi-Platform Integration**: Connect Shopee, TikTok Shop, and Lazada seller accounts via OAuth
- **Category-Agnostic**: Handle ALL product types (fashion, beauty, electronics, home goods, toys, groceries, etc.)
- **Sales Forecasting**: Per-SKU predictions based on historical velocity + external factors (holidays, seasons)
- **Industry Peaks Dashboard**: Monthly peak analysis by category with ASEAN e-commerce insights
- **Smart Recommendations**: Stock suggestions and promo ideas tailored to your product categories
- **AI-Powered**: Gemini API integration for advanced forecasting and trend analysis

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (better-sqlite3)
- **Charts**: Chart.js + react-chartjs-2
- **AI**: Google Gemini API
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Add your API keys (Gemini, platform credentials)

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # OAuth handlers
│   │   ├── sales/        # Sales data endpoints
│   │   ├── forecast/     # Forecasting logic
│   │   └── peaks/        # Industry peaks analysis
│   ├── dashboard/        # Main dashboard page
│   └── layout.tsx        # Root layout
├── components/            # React components
├── lib/                   # Utilities and helpers
│   ├── db.ts             # Database setup
│   ├── forecasting.ts    # Forecasting algorithms
│   └── platforms/        # Platform API integrations
└── data/                  # Static data (ASEAN peaks)
```

## API Integration

The app integrates with official APIs:
- **Shopee**: https://open.shopee.com/
- **TikTok Shop**: https://partner.tiktokshop.com/
- **Lazada**: https://open.lazada.com/

## License

MIT
