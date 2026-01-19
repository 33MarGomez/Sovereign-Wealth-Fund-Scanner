import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Fund } from '../types';

interface FundChartProps {
  funds: Fund[];
}

const COLORS = ['#4f46e5', '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const FundChart: React.FC<FundChartProps> = ({ funds }) => {
  if (funds.length === 0) return null;

  // Format data for chart
  const data = funds.map(f => ({
    name: f.name.length > 20 ? f.name.substring(0, 20) + '...' : f.name,
    fullName: f.name,
    value: f.assets_in_billions
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Asset Distribution (Billions USD)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f1f5f9" />
          <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `$${val}B`} />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={150} 
            stroke="#64748b" 
            fontSize={12} 
            tick={{fill: '#475569'}}
          />
          <Tooltip 
            cursor={{fill: '#f8fafc'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`$${value.toFixed(2)} Billion`, 'AUM']}
            labelFormatter={(label) => {
               const original = data.find(d => d.name === label);
               return original ? original.fullName : label;
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FundChart;