import React, { useState } from 'react';
import { Trade } from '../types';
import { analyzeTrades } from '../services/geminiService';
import { BrainCircuit, Sparkles } from 'lucide-react';

interface AIAnalysisProps {
  trades: Trade[];
  balance: number;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ trades, balance }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (trades.length < 3) {
      setAnalysis("Please log at least 3 trades to get a meaningful analysis.");
      return;
    }
    setLoading(true);
    const result = await analyzeTrades(trades, balance);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-decoder-navy to-decoder-card p-8 rounded-xl border border-decoder-blue/30 shadow-2xl text-center">
        <div className="flex justify-center mb-4">
           <div className="p-4 bg-decoder-blue/20 rounded-full">
             <BrainCircuit className="w-10 h-10 text-decoder-blue" />
           </div>
        </div>
        <h2 className="text-2xl font-bold text-decoder-cream mb-2">Decoders AI Mentor</h2>
        <p className="text-gray-400 mb-6">
          Get personalized feedback on your trading psychology, risk management, and strategy execution using Gemini AI.
        </p>
        
        {!analysis && !loading && (
          <button 
            onClick={handleAnalyze}
            className="bg-decoder-cream text-decoder-navy px-8 py-3 rounded-full font-bold hover:bg-white transition-transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <Sparkles size={18} /> Analyze My Journal
          </button>
        )}

        {loading && (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-4 border-decoder-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-decoder-blue animate-pulse">Decoding market patterns...</p>
          </div>
        )}

        {analysis && !loading && (
          <div className="mt-8 text-left bg-decoder-dark/50 p-6 rounded-lg border border-decoder-green/20">
            <h3 className="text-lg font-semibold text-decoder-green mb-4">Mentor Insights</h3>
            <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-line">
              {analysis}
            </div>
            <button 
              onClick={() => setAnalysis(null)}
              className="mt-6 text-sm text-decoder-blue hover:underline"
            >
              Clear Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;
