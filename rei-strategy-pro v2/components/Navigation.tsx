
import React from 'react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Market Dashboard', icon: '📊' },
    { id: 'simulator', label: 'ROI Simulator', icon: '🧪' },
    { id: 'comparison', label: 'Comparison View', icon: '⚖️' },
    { id: 'scanner', label: 'Listing Scanner', icon: '🔍' },
    { id: 'monitor', label: 'ZIP Monitors', icon: '📍' },
  ];

  return (
    <nav className="w-64 bg-slate-900 h-screen sticky top-0 border-r border-slate-800 p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/20">
          R
        </div>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          REI Strategy Pro
        </h1>
      </div>

      <div className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
        <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2">Strategy Account</div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 text-xs">
            JD
          </div>
          <div className="text-sm font-medium">Quant Investor</div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
