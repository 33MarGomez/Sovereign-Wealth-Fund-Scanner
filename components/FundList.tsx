import React from 'react';
import { Fund } from '../types';
import { Building2, Calendar, DollarSign, PieChart } from 'lucide-react';

interface FundListProps {
  funds: Fund[];
}

const FundList: React.FC<FundListProps> = ({ funds }) => {
  if (funds.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <p className="text-slate-500">No major sovereign wealth funds found for this query.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Detailed Breakdown</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {funds.map((fund, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              
              {/* Left Column: Info & Description */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                   <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                   </div>
                   <h4 className="text-xl font-bold text-slate-900">{fund.name}</h4>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 pl-0 lg:pl-11">
                  {fund.description}
                </p>

                {/* Sector Allocations */}
                {fund.sector_allocations && fund.sector_allocations.length > 0 && (
                  <div className="lg:pl-11 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <PieChart className="w-4 h-4 text-slate-400" />
                      <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Sector Allocations</h5>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                      {fund.sector_allocations.slice(0, 6).map((alloc, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs font-medium text-slate-600 w-24 truncate" title={alloc.sector}>
                            {alloc.sector}
                          </span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full" 
                              style={{ width: `${Math.min(alloc.percentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700 w-8 text-right">
                            {alloc.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column: Stats */}
              <div className="flex flex-row lg:flex-col gap-4 lg:gap-2 lg:items-end min-w-[150px] border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl lg:bg-transparent lg:p-0">
                  <DollarSign className="w-5 h-5" />
                  <div>
                    <span className="block text-xl font-bold leading-none">${fund.assets_in_billions.toLocaleString()} B</span>
                    <span className="text-[10px] uppercase font-semibold text-emerald-600/70 lg:hidden">AUM</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-2 rounded-xl lg:bg-transparent lg:p-0">
                  <Calendar className="w-4 h-4" />
                   <div>
                    <span className="block text-sm font-medium leading-none">Est. {fund.inception_year}</span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 lg:hidden">Founded</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FundList;