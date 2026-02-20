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
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">AI-Powered Promo Ideas</h2>
          <p className="text-sm md:text-base text-gray-400">Marketing suggestions based on your product performance</p>
        </div>
        <button
          onClick={generateNewIdeas}
          disabled={generating}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base whitespace-nowrap"
        >
          <Sparkles className={`w-4 h-4 md:w-5 md:h-5 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generating...' : 'Generate New Ideas'}
        </button>
      </div>

      {promoIdeas.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Lightbulb className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-600" />
          <p className="mb-2 text-sm md:text-base">No promo ideas available</p>
          <p className="text-xs md:text-sm text-gray-500">Click "Generate New Ideas" to get AI-powered suggestions</p>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {promoIdeas.map((idea, idx) => (
            <div key={idx} className="border border-slate-600 rounded-lg p-4 md:p-6 bg-slate-700 bg-opacity-50 hover:bg-opacity-70 transition-all">
              <div className="flex items-start gap-3 mb-4">
                <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-white capitalize">{idea.category}</h3>
                  <p className="text-xs md:text-sm text-gray-400">{idea.productName}</p>
                </div>
              </div>
              <ul className="space-y-2 md:space-y-3">
                {idea.ideas.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-1">•</span>
                    <span className="text-sm md:text-base text-gray-300">{suggestion}</span>
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
