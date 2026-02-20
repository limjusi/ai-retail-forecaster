import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function analyzeSalesWithAI(
  salesData: { date: string; units: number }[],
  category: string,
  productName: string
): Promise<{ insights: string; peakDates: string[]; recommendations: string[] }> {
  if (!genAI) {
    return {
      insights: 'AI analysis unavailable (no API key configured)',
      peakDates: [],
      recommendations: ['Configure Gemini API key for AI-powered insights'],
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Analyze this e-commerce sales data for a ${category} product "${productName}" in Singapore:

Sales data (last ${salesData.length} days):
${salesData.map(d => `${d.date}: ${d.units} units`).join('\n')}

Provide:
1. Key insights about sales patterns
2. Predicted peak dates in the next 30 days (consider Singapore holidays: CNY, Hari Raya, Christmas, National Day)
3. Actionable recommendations for inventory and promotions

Format as JSON:
{
  "insights": "brief analysis",
  "peakDates": ["YYYY-MM-DD", ...],
  "recommendations": ["action 1", "action 2", ...]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        insights: parsed.insights || 'No insights generated',
        peakDates: parsed.peakDates || [],
        recommendations: parsed.recommendations || [],
      };
    }
    
    return {
      insights: text,
      peakDates: [],
      recommendations: [],
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      insights: 'AI analysis temporarily unavailable',
      peakDates: [],
      recommendations: [],
    };
  }
}

export async function getCategoryPeaksInsights(
  category: string,
  monthlySales: { month: string; units: number }[]
): Promise<string> {
  if (!genAI) {
    return 'Configure Gemini API key for AI-powered category insights';
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Analyze monthly e-commerce sales patterns for ${category} products in Singapore/ASEAN region:

Historical data:
${monthlySales.map(m => `${m.month}: ${m.units} units`).join('\n')}

Provide insights on:
1. Seasonal patterns specific to Singapore/Malaysia/Indonesia
2. Cultural events affecting this category (CNY, Hari Raya, Deepavali, Christmas)
3. Recommended months to increase inventory
4. Promotional strategies for peak months

Keep response concise (2-3 paragraphs).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Category insights error:', error);
    return 'Unable to generate category insights at this time';
  }
}

export async function generatePromoIdeas(
  category: string,
  productName: string,
  upcomingPeakDate?: string
): Promise<string[]> {
  if (!genAI) {
    return [
      'Flash sale: 20% off for 24 hours',
      'Bundle deal: Buy 2 get 10% off',
      'Free shipping on orders above SGD 50',
    ];
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const peakContext = upcomingPeakDate 
      ? `with an upcoming peak on ${upcomingPeakDate}` 
      : '';
    
    const prompt = `Generate 5 creative promotional ideas for a ${category} product "${productName}" on Shopee/TikTok Shop/Lazada in Singapore ${peakContext}.

Consider:
- Platform-specific features (live streaming, flash sales, vouchers)
- Local preferences and shopping behaviors
- Seasonal/cultural relevance

Return as JSON array of strings: ["idea 1", "idea 2", ...]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return text.split('\n').filter(line => line.trim().length > 0).slice(0, 5);
  } catch (error) {
    console.error('Promo ideas error:', error);
    return [
      'Limited time offer: 15% off',
      'Bundle promotion for higher value',
      'Loyalty rewards for repeat customers',
    ];
  }
}
