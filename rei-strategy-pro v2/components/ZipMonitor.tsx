
import React, { useState } from 'react';
import { ZipMonitor as ZipMonitorType } from '../types';

interface ZipMonitorProps {
  monitors: ZipMonitorType[];
  onAddZip: (zip: string, state: string) => void;
  onRemoveZip: (zip: string) => void;
}

const ZipMonitor: React.FC<ZipMonitorProps> = ({ monitors, onAddZip, onRemoveZip }) => {
  const [newZip, setNewZip] = useState('');
  const [newState, setNewState] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newZip && newState) {
      onAddZip(newZip, newState);
      setNewZip('');
      setNewState('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-2">Active ZIP Monitors</h2>
          <p className="text-slate-400">Managing watchlists for high-yield geographies.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            type="text" placeholder="Zip (e.g. 85295)" 
            className="bg-slate-800 border border-slate-700 rounded-lg p-2 w-32 focus:border-blue-500 outline-none"
            value={newZip}
            onChange={e => setNewZip(e.target.value)}
          />
          <input 
            type="text" placeholder="State" 
            className="bg-slate-800 border border-slate-700 rounded-lg p-2 w-20 focus:border-blue-500 outline-none"
            value={newState}
            onChange={e => setNewState(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold">
            Add
          </button>
        </form>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {monitors.map((m) => (
          <div key={m.zip} className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onRemoveZip(m.zip)}
                className="text-slate-500 hover:text-red-400"
              >
                ✕
              </button>
            </div>
            <span className="text-xs text-blue-400 font-bold uppercase tracking-widest">{m.state}</span>
            <h4 className="text-3xl font-bold mt-1">{m.zip}</h4>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Active Listings</span>
              <span className="bg-slate-900 px-2 py-1 rounded text-xs font-mono">{m.count} tracked</span>
            </div>
            <div className="mt-6 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (m.count/25)*100)}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZipMonitor;
