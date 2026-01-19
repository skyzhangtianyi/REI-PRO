
import React, { useState, useMemo } from 'react';
import { FinancialInputs } from '../types';
import { calculateROI } from '../utils/finance';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Simulator: React.FC = () => {
  const [inputs, setInputs] = useState<FinancialInputs>({
    price: 550000,
    downPaymentPct: 20,
    interestRate: 6.5,
    monthlyRent: 3200,
    appreciationRate: 4,
    marginalTaxRate: 24
  });

  const roi = useMemo(() => calculateROI(inputs), [inputs]);

  const pieData = [
    { name: 'Cash Flow', value: Math.max(0, roi.annualCashFlow), color: '#10b981' },
    { name: 'Principal', value: roi.annualPrincipal, color: '#3b82f6' },
    { name: 'Appreciation', value: roi.annualAppreciation, color: '#8b5cf6' },
    { name: 'Tax Benefit', value: roi.annualTaxBenefit, color: '#f59e0b' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 space-y-6">
        <h3 className="text-xl font-bold mb-4">Parameters</h3>
        
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs text-slate-400 uppercase font-bold flex justify-between">
              House Price <span>${inputs.price.toLocaleString()}</span>
            </span>
            <input 
              type="range" min="100000" max="2000000" step="10000"
              value={inputs.price}
              onChange={(e) => setInputs({...inputs, price: Number(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
            />
          </label>

          <label className="block">
            <span className="text-xs text-slate-400 uppercase font-bold flex justify-between">
              Down Payment <span>{inputs.downPaymentPct}%</span>
            </span>
            <input 
              type="range" min="0" max="100" step="5"
              value={inputs.downPaymentPct}
              onChange={(e) => setInputs({...inputs, downPaymentPct: Number(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
            />
          </label>

          <label className="block">
            <span className="text-xs text-slate-400 uppercase font-bold flex justify-between">
              Interest Rate <span>{inputs.interestRate}%</span>
            </span>
            <input 
              type="range" min="0" max="15" step="0.1"
              value={inputs.interestRate}
              onChange={(e) => setInputs({...inputs, interestRate: Number(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
            />
          </label>

          <label className="block">
            <span className="text-xs text-slate-400 uppercase font-bold flex justify-between">
              Monthly Rent <span>${inputs.monthlyRent}</span>
            </span>
            <input 
              type="range" min="500" max="10000" step="50"
              value={inputs.monthlyRent}
              onChange={(e) => setInputs({...inputs, monthlyRent: Number(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
            />
          </label>

          <label className="block">
            <span className="text-xs text-slate-400 uppercase font-bold flex justify-between">
              Appreciation Rate <span>{inputs.appreciationRate}%</span>
            </span>
            <input 
              type="range" min="-5" max="15" step="0.5"
              value={inputs.appreciationRate}
              onChange={(e) => setInputs({...inputs, appreciationRate: Number(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
            />
          </label>
        </div>
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8 flex-1">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-bold">Total Estimated ROI</h3>
              <p className="text-slate-400">Aggregated annual return components</p>
            </div>
            <div className="text-right">
              <span className="text-5xl font-black text-emerald-400">{(roi.totalROI * 100).toFixed(2)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-[250px] relative">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-xs text-slate-500 uppercase font-bold block">Annual</span>
                <span className="text-xl font-bold">${Math.round(roi.annualCashFlow + roi.annualPrincipal + roi.annualAppreciation + roi.annualTaxBenefit).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/30">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">${Math.round(item.value).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Down Payment</span>
            <span className="text-xl font-bold">${roi.downPayment.toLocaleString()}</span>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Monthly Cost</span>
            <span className="text-xl font-bold text-red-400">-${Math.round(roi.monthlyCost).toLocaleString()}</span>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Monthly Cash Flow</span>
            <span className="text-xl font-bold text-emerald-400">${Math.round(roi.annualCashFlow / 12).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
