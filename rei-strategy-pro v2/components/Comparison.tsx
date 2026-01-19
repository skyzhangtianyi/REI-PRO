
import React, { useState, useMemo } from 'react';
import { FinancialInputs } from '../types';
import { projectWealth } from '../utils/finance';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Comparison: React.FC = () => {
  const [strategyA, setStrategyA] = useState<FinancialInputs>({
    price: 450000,
    downPaymentPct: 20,
    interestRate: 6.5,
    monthlyRent: 2800,
    appreciationRate: 3.5,
    marginalTaxRate: 24
  });

  const [strategyB, setStrategyB] = useState<FinancialInputs>({
    price: 600000,
    downPaymentPct: 25,
    interestRate: 6.0,
    monthlyRent: 3800,
    appreciationRate: 5,
    marginalTaxRate: 24
  });

  const years = 10;
  const projectionA = useMemo(() => projectWealth(strategyA, years), [strategyA]);
  const projectionB = useMemo(() => projectWealth(strategyB, years), [strategyB]);

  const chartData = Array.from({ length: years }).map((_, i) => ({
    year: `Year ${i + 1}`,
    StrategyA: projectionA[i],
    StrategyB: projectionB[i],
  }));

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Comparison View</h2>
          <p className="text-slate-400">Compare long-term equity growth between two strategies.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
           <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div> Strategy A (Standard)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="number" placeholder="Price" value={strategyA.price}
              onChange={e => setStrategyA({...strategyA, price: Number(e.target.value)})}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3"
            />
            <input 
              type="number" placeholder="Rent" value={strategyA.monthlyRent}
              onChange={e => setStrategyA({...strategyA, monthlyRent: Number(e.target.value)})}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3"
            />
            <input 
              type="number" placeholder="Rate" value={strategyA.interestRate}
              onChange={e => setStrategyA({...strategyA, interestRate: Number(e.target.value)})}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3"
            />
            <input 
              type="number" placeholder="Appr %" value={strategyA.appreciationRate}
              onChange={e => setStrategyA({...strategyA, appreciationRate: Number(e.target.value)})}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3"
            />
          </div>
        </div>

        <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
           <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Strategy B (High Growth)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="number" placeholder="Price" value={strategyB.price}
              onChange={e => setStrategyB({...strategyB, price: Number(e.target.value)})}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3"
            />
            <input 
              type="number" placeholder="Rent" value={strategyB.monthlyRent}
              onChange={e => setStrategyB({...strategyB, monthlyRent: Number(e.target.value)})}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3"
            />
            <input 
              type="number" placeholder="Rate" value={strategyB.interestRate}
              onChange={e => setStrategyB({...strategyB, interestRate: Number(e.target.value)})}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3"
            />
            <input 
              type="number" placeholder="Appr %" value={strategyB.appreciationRate}
              onChange={e => setStrategyB({...strategyB, appreciationRate: Number(e.target.value)})}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
        <h3 className="text-xl font-bold mb-8">10-Year Cumulative Wealth Projection</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="StrategyA" stroke="#3b82f6" fillOpacity={1} fill="url(#colorA)" />
              <Area type="monotone" dataKey="StrategyB" stroke="#10b981" fillOpacity={1} fill="url(#colorB)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="text-center p-4">
            <span className="text-slate-500 text-xs block uppercase">A: 5yr Value</span>
            <span className="text-xl font-bold text-blue-400">${projectionA[4].toLocaleString()}</span>
          </div>
          <div className="text-center p-4">
            <span className="text-slate-500 text-xs block uppercase">B: 5yr Value</span>
            <span className="text-xl font-bold text-emerald-400">${projectionB[4].toLocaleString()}</span>
          </div>
          <div className="text-center p-4">
            <span className="text-slate-500 text-xs block uppercase">A: 10yr Value</span>
            <span className="text-xl font-bold text-blue-400">${projectionA[9].toLocaleString()}</span>
          </div>
          <div className="text-center p-4">
            <span className="text-slate-500 text-xs block uppercase">B: 10yr Value</span>
            <span className="text-xl font-bold text-emerald-400">${projectionB[9].toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
