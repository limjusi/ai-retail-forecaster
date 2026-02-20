'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';

interface PromoIdea {
  category: string;
  productName: string;
  ideas: string[];
}

export default function PromoIdeas() {
  const [promoIdeas, setPromoIdeas] = useState<PromoIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPromoIdeas();
  }, []);

  const fetchPromoIdeas = async () => {
    try {
      const response = await fetch('/api/forecast/promo-ideas');
      const data = await response.json();
      setPromoIdeas(data.ideas || []);
    } catch (error) {
      console.error('Error fetching promo ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewIdeas = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/forecast/promo-ideas?generate=true');
      const data = await response.json();
      setPromoIdeas(data.ideas || []);
    } catch (error) {
      console.error('Error generating ideas:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">AI Promo Ideas</h2>
          <p className="text-gray-600">Category-specific promotional strategies</p>
        </div>
        <button
          onClick={generateNewIdeas}
          disabled={generating}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          {generating ? 'Generating...' : 'Generate New Ideas'}
        </button>
      </div>

      {promoIdeas.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="mb-2">No promo ideas yet</p>
          <p className="text-sm">Click "Generate New Ideas" to get AI-powered suggestions</p>
        </div>
      ) : (
        <div className="space-y-6">
          {promoIdeas.map((promo, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{promo.productName}</h3>
                  <p className="text-sm text-gray-500">{promo.category}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {promo.ideas.map((idea, ideaIdx) => (
                  <li key={ideaIdx} className="flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">•</span>
                    <span className="text-gray-700">{idea}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
