'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { SearchBox } from '@/components/UI/SearchBox';
import { LawDetailModal } from '@/components/UI/LawDetailModal';
import { LawCard } from '@/components/UI/LawCard';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, Filter, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function SearchResults() {
  const { t, currentLang } = useLanguage();
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLaw, setSelectedLaw] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetails = (law: any) => {
    setSelectedLaw(law);
    setIsModalOpen(true);
  };

  useEffect(() => {
    async function fetchResults() {
      if (!query) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, language: currentLang }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          const errorMessage = typeof data.error === 'object' 
            ? (data.error[currentLang] || data.error.en || 'Error') 
            : (data.error || 'Failed to fetch results');
          throw new Error(errorMessage);
        }
        
        // Ensure data.laws is an array
        setResults(data.laws || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-app">
      <div className="mb-8">
        <SearchBox />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-card rounded-3xl p-8 sticky top-24 shadow-premium animate-reveal">
            <div className="flex items-center gap-3 mb-8 text-primary font-black font-cairo text-lg uppercase tracking-tight">
              <Filter className="w-5 h-5 text-legal-red" />
              {t('search.filters')}
            </div>
            
            {/* Filter sections */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black text-muted mb-3 uppercase tracking-widest">{t('search.type')}</h4>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 text-primary text-sm hover:text-legal-red cursor-pointer font-black group transition-all uppercase tracking-widest">
                    <input type="checkbox" className="w-5 h-5 rounded-lg border-none bg-soft text-legal-red focus:ring-2 focus:ring-legal-red/20 shadow-premium" />
                    {t('search.law')}
                  </label>
                  <label className="flex items-center gap-3 text-primary text-sm hover:text-legal-red cursor-pointer font-black group transition-all uppercase tracking-widest">
                    <input type="checkbox" className="w-5 h-5 rounded-lg border-none bg-soft text-legal-red focus:ring-2 focus:ring-legal-red/20 shadow-premium" />
                    {t('search.decree')}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted">
              <Loader2 className="w-10 h-10 animate-spin text-legal-red mb-4" />
              <p className="font-inter animate-pulse font-bold">{t('search.analyzing')}</p>
            </div>
          ) : error ? (
            <div className="bg-accent-bg rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-premium animate-reveal">
              <AlertCircle className="w-12 h-12 text-legal-red mb-6" />
              <h3 className="text-legal-red font-black font-cairo text-xl mb-3 uppercase tracking-tight">{t('search.error')}</h3>
              <p className="text-primary text-lg font-inter">{error}</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-8 animate-reveal">
              <div className="text-xs font-black text-muted uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-muted/20 to-transparent" />
                {t('search.resultsCount').replace('{count}', results.length.toString()).replace('{query}', query || '')}
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-muted/20 to-transparent" />
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {results.map((law, idx) => (
                  <motion.div
                    key={law.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <LawCard law={law} onOpenDetails={handleOpenDetails} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : query ? (
            <div className="text-center py-24 bg-card rounded-3xl shadow-premium animate-reveal">
              <p className="text-secondary font-inter font-black uppercase tracking-[0.2em]">{t('search.noResults')}</p>
            </div>
          ) : (
            <div className="text-center py-24 bg-card rounded-3xl shadow-premium animate-reveal">
              <p className="text-secondary font-inter font-black uppercase tracking-[0.2em]">{t('search.enterQuery')}</p>
            </div>
          )}
        </div>
      </div>

      <LawDetailModal 
        law={selectedLaw} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-legal-red" /></div>}>
      <SearchResults />
    </Suspense>
  );
}
