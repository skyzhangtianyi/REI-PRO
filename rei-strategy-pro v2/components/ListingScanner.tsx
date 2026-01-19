
import React, { useState } from 'react';
import { extractPropertyData } from '../geminiService';
import { Property } from '../types';
import { calculateROI } from '../utils/finance';

interface ListingScannerProps {
  onAddProperty: (p: Property) => void;
}

const ListingScanner: React.FC<ListingScannerProps> = ({ onAddProperty }) => {
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!pastedText.trim()) return;
    setIsProcessing(true);
    setError(null);

    try {
      const data = await extractPropertyData(pastedText);
      if (data) {
        // Run internal ROI check
        const roiResult = calculateROI({
          price: data.price,
          downPaymentPct: 20,
          interestRate: 6.5,
          monthlyRent: data.rent,
          appreciationRate: 4,
          marginalTaxRate: 24
        });

        const newProp: Property = {
          id: Math.random().toString(36).substr(2, 9),
          address: data.address,
          city: data.city,
          zip: data.zip,
          price: data.price,
          rent: data.rent,
          totalROI: roiResult.totalROI,
          timestamp: Date.now(),
        };

        onAddProperty(newProp);
        setPastedText('');
      } else {
        setError("Could not extract data. Try copying more details from the listing page.");
      }
    } catch (err) {
      setError("An error occurred while processing the text.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-top-4 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Smart Listing Scanner</h2>
        <p className="text-slate-400">
          Paste the description or key details from Redfin or Zillow below. 
          Our AI will extract the financial data automatically.
        </p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 space-y-6">
        <textarea
          rows={10}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-6 text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
          placeholder="Paste property description, listing price, and Zillow rent estimates here..."
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
        ></textarea>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleScan}
          disabled={isProcessing || !pastedText.trim()}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
            isProcessing || !pastedText.trim()
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
          }`}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing via AI...
            </>
          ) : (
            'Scan Listing & Calculate ROI'
          )}
        </button>

        <div className="flex items-center gap-4 text-xs text-slate-500 uppercase font-bold tracking-widest">
          <div className="h-px flex-1 bg-slate-700"></div>
          Instructions
          <div className="h-px flex-1 bg-slate-700"></div>
        </div>

        <ul className="text-sm text-slate-400 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-400">1.</span>
            Go to any property on Redfin or Zillow.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400">2.</span>
            Select all text on the page (Ctrl+A / Cmd+A) and Copy.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400">3.</span>
            Paste it here. The engine will arbiter between the sale price and potential rent.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ListingScanner;
