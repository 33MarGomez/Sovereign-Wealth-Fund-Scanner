import React, { useState } from 'react';
import { Landmark, AlertCircle } from 'lucide-react';
import SearchForm from './components/SearchForm';
import FundChart from './components/FundChart';
import FundList from './components/FundList';
import Sources from './components/Sources';
import { fetchSovereignWealthFunds } from './services/geminiService';
import { SWFData, GroundingMetadata } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SWFData | null>(null);
  const [metadata, setMetadata] = useState<GroundingMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (country: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    setMetadata(null);

    try {
      const result = await fetchSovereignWealthFunds(country);
      setData(result.data);
      setMetadata(result.groundingMetadata);
    } catch (err: any) {
      console.error(err);
      setError("Failed to retrieve data. Please try again later or check your API key configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Sovereign Wealth Scanner
            </span>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Gemini 2.0 Integration
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Analyze Global Sovereign Wealth
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get instant, AI-generated breakdowns of sovereign wealth funds, assets under management, and historical data grounded in real-time search.
          </p>
        </div>

        <SearchForm onSearch={handleSearch} isLoading={loading} />

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
             <div className="h-40 bg-slate-200 rounded-2xl w-full"></div>
             <div className="grid md:grid-cols-2 gap-8">
                <div className="h-80 bg-slate-200 rounded-2xl"></div>
                <div className="space-y-4">
                    <div className="h-24 bg-slate-200 rounded-2xl"></div>
                    <div className="h-24 bg-slate-200 rounded-2xl"></div>
                    <div className="h-24 bg-slate-200 rounded-2xl"></div>
                </div>
             </div>
          </div>
        )}

        {/* Results Section */}
        {!loading && data && (
          <div className="max-w-6xl mx-auto animate-fade-in-up">
            
            {/* Summary Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{data.country}</h2>
                  <p className="text-slate-500 font-medium">Sovereign Wealth Overview</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Total Tracked Funds</div>
                  <div className="text-3xl font-bold text-indigo-600">
                     {data.funds.length}
                  </div>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed text-lg border-l-4 border-indigo-500 pl-4 bg-indigo-50/50 py-2 rounded-r-lg">
                {data.summary}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Chart Column */}
              <div className="lg:col-span-1">
                 <div className="sticky top-24">
                   <FundChart funds={data.funds} />
                 </div>
              </div>

              {/* List Column */}
              <div className="lg:col-span-2">
                <FundList funds={data.funds} />
                <Sources metadata={metadata} />
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;