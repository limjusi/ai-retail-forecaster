import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { generatePromoIdeas } from '@/lib/ai';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const generate = searchParams.get('generate') === 'true';

    const productsQuery = db.prepare(`
      SELECT 
        p.id,
        p.name,
        p.category_name
      FROM products p
      WHERE p.category_name IS NOT NULL
      LIMIT 5
    `);
    
    const products = productsQuery.all();
    
    if (!products || products.length === 0) {
      return NextResponse.json({ ideas: [] });
    }

    const ideas = [];

    for (const product of products as any[]) {
      let promoIdeas: string[] = [];
      
      if (generate) {
        try {
          promoIdeas = await generatePromoIdeas(product.category_name, product.name);
        } catch (error) {
          console.error('AI promo generation error:', error);
          promoIdeas = [
            `Flash sale: 20% off ${product.name}`,
            `Bundle deal: Buy 2 get 15% off`,
            `Free shipping for orders above SGD 50`,
            `Limited time offer: First 100 customers get extra discount`,
            `Live stream exclusive: Special pricing during broadcast`,
          ];
        }
      } else {
        promoIdeas = [
          `Flash sale: 20% off ${product.name}`,
          `Bundle deal: Buy 2 get 15% off`,
          `Free shipping for orders above SGD 50`,
          `Limited time offer: First 100 customers get extra discount`,
          `Live stream exclusive: Special pricing during broadcast`,
        ];
      }

      ideas.push({
        category: product.category_name,
        productName: product.name,
        ideas: promoIdeas,
      });
    }

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('Promo ideas error:', error);
    return NextResponse.json({ error: 'Failed to generate promo ideas' }, { status: 500 });
  }
}
