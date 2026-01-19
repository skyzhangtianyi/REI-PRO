
import React, { useMemo, useState } from 'react';
import { Property } from '../types';
import { analyzeRedfinLink } from '../geminiService';
import { calculateROI } from '../utils/finance';

interface DashboardProps {
  properties: Property[];
  onAddProperty: (p: Property) => void;
}

// Fixed 'key' prop error by moving component outside and using React.FC
interface PropertyCardProps {
  prop: Property;
  isPick?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ prop, isPick }) => (
  <div className={`bg-slate-800/50 rounded-2xl border ${isPick ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/10' : 'border-slate-700/50'} p-6 hover:border-blue-500/30 transition-all group`}>
    {isPick && (
      <div className="flex items-center gap-2 mb-4 bg-indigo-500/10 w-fit px-3 py-1 rounded-full border border-indigo-500/20">
        <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Recommended by</span>
        <span className="text-xs font-bold text-indigo-300">{prop.agentName}</span>
      </div>
    )}
    <div className="flex justify-between items-start mb-4">
      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">ZIP: {prop.zip}</span>
      <span className="text-emerald-400 font-bold text-lg">{(prop.totalROI * 100).toFixed(1)}% ROI</span>
    </div>
    <h4 className="text-lg font-semibold mb-1 group-hover:text-blue-400 transition-colors">{prop.address}</h4>
    <p className="text-slate-400 text-sm mb-4">{prop.city}, AZ</p>
    
    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
      <div>
        <span className="text-xs text-slate-500 block uppercase">Price</span>
        <span className="font-mono text-lg font-semibold">${prop.price.toLocaleString()}</span>
      </div>
      <div>
        <span className="text-xs text-slate-500 block uppercase">Rent (Est)</span>
        <span className="font-mono text-lg font-semibold text-emerald-400">${prop.rent}/mo</span>
      </div>
    </div>

    {/* Display grounding sources for compliance with Search Grounding rules */}
    {prop.sources && prop.sources.length > 0 && (
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2 block">AI Citations</span>
        <div className="flex flex-wrap gap-2">
          {prop.sources.map((source: any, idx: number) => {
            const uri = source.web?.uri || source.maps?.uri;
            const title = source.web?.title || source.maps?.title || 'Source';
            if (!uri) return null;
            return (
              <a 
                key={idx}
                href={uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] bg-slate-900 text-blue-400 px-2 py-1 rounded hover:bg-slate-800 transition-colors truncate max-w-[120px]"
                title={title}
              >
                {title}
              </a>
            );
          })}
        </div>
      </div>
    )}
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ properties, onAddProperty }) => {
  const [showModal, setShowModal] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [redfinUrl, setRedfinUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { picks, opportunities } = useMemo(() => {
    return {
      picks: properties.filter(p => !!p.agentName),
      opportunities: properties.filter(p => !p.agentName)
    };
  }, [properties]);

  const groupedOpps = useMemo(() => {
    return opportunities.reduce((acc, prop) => {
      if (!acc[prop.city]) acc[prop.city] = [];
      acc[prop.city].push(prop);
      return acc;
    }, {} as Record<string, Property[]>);
  }, [opportunities]);

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName || !redfinUrl) return;

    setIsSubmitting(true);
    try {
      const result = await analyzeRedfinLink(redfinUrl);
      if (result) {
        const { data, sources } = result;
        const roiResult = calculateROI({
          price: data.price,
          downPaymentPct: 20,
          interestRate: 6.5,
          monthlyRent: data.rent,
          appreciationRate: 4,
          marginalTaxRate: 24
        });

        const newProp: Property = {
          id: `agent-${Date.now()}`,
          address: data.address,
          city: data.city,
          zip: data.zip,
          price: data.price,
          rent: data.rent,
          totalROI: roiResult.totalROI,
          agentName: agentName,
          timestamp: Date.now(),
          sources: sources, // Save sources for citation
        };

        onAddProperty(newProp);
        setShowModal(false);
        setAgentName('');
        setRedfinUrl('');
      }
    } catch (err) {
      alert("Error analyzing link. Please ensure it's a valid Redfin URL.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Market Dashboard</h2>
          <p className="text-slate-400">Track professional recommendations and organic opportunities.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <span className="text-xl">🤝</span> Agents' Recommendation
          </button>
        </div>
      </header>

      {/* Agents' Picks Section */}
      {picks.length > 0 && (
        <section className="bg-slate-900/40 p-8 rounded-3xl border border-indigo-500/10">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-2.5 h-8 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
              Agent Picks
            </h3>
            <div className="h-px flex-1 bg-indigo-500/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {picks.map(prop => <PropertyCard key={prop.id} prop={prop} isPick />)}
          </div>
        </section>
      )}

      {/* Standard Market Opportunities */}
      <div className="space-y-12">
        {Object.entries(groupedOpps).map(([city, props]) => (
          <section key={city}>
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                {city}
              </h3>
              <div className="h-px flex-1 bg-slate-800"></div>
              <span className="text-xs text-slate-500">{(props as Property[]).length} Market Scans</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(props as Property[]).map((prop) => (
                <PropertyCard key={prop.id} prop={prop} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Modal for Recommendation */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-8 relative animate-in zoom-in-95 duration-200 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Agent Submission</h3>
            <p className="text-slate-400 text-sm mb-6">Provide a Redfin link to let AI analyze the investment value.</p>
            
            <form onSubmit={handleRecommend} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Agent Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sarah Miller"
                  value={agentName}
                  onChange={e => setAgentName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Redfin URL</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://www.redfin.com/..."
                  value={redfinUrl}
                  onChange={e => setRedfinUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 py-4 rounded-xl font-bold flex items-center justify-center gap-3"
              >
                {isSubmitting ? 'Analyzing link...' : 'Submit Recommendation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
