'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { SearchBox } from '@/components/UI/SearchBox';
import { LawCard } from '@/components/UI/LawCard';
import { LawDetailModal } from '@/components/UI/LawDetailModal';
import { useEffect, useState } from 'react';
import { Loader2, BookOpen, AlertCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function LawIndexPage() {
  const { t } = useLanguage();
  const [laws, setLaws] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLaw, setSelectedLaw] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: t('search.all') },
    { id: 'adminActs', name: t('domains.adminActs') },
    { id: 'civilService', name: t('domains.civilService') },
    { id: 'publicContracts', name: t('domains.publicContracts') },
    { id: 'adminJustice', name: t('domains.adminJustice') },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [lawsRes, statsRes] = await Promise.all([
          fetch('/api/laws'),
          fetch('/api/laws/stats')
        ]);
        
        const lawsData = await lawsRes.json();
        
        if (!lawsRes.ok) {
          if (lawsRes.status === 501) {
            setLaws([]);
          } else {
            throw new Error(lawsData.error || 'Failed to fetch laws');
          }
        } else {
          setLaws(lawsData.laws || []);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleOpenDetails = (law: any) => {
    setSelectedLaw(law);
    setIsModalOpen(true);
  };

  const filteredLaws = laws.filter(law => {
    const matchesSearch = 
      (law.title?.ar || '').includes(searchTerm) || 
      (law.official_number?.ar || '').includes(searchTerm) ||
      (law.law_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || law.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-accent-bg text-legal-red text-[10px] font-black mb-10 shadow-premium uppercase tracking-[0.3em] animate-float"
        >
          <BookOpen className="w-4 h-4" />
          {t('nav.laws')}
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-cairo font-black text-primary mb-4 uppercase">
          {t('laws.indexTitle')}
        </h1>
        <p className="text-secondary max-w-2xl mx-auto font-inter">
          {t('law.simulationDesc')}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-12 space-y-6">
        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute inset-y-0 ltr:left-6 rtl:right-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-muted group-focus-within:text-legal-red transition-colors" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('laws.searchPlaceholder')}
            className="w-full bg-card shadow-premium rounded-2xl py-5 ltr:pl-16 rtl:pr-16 px-8 text-primary focus:outline-none focus:ring-0 transition-all duration-500 text-lg placeholder:text-muted/50 font-inter border-none"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[10px] font-black transition-all duration-500 uppercase tracking-widest",
                selectedCategory === category.id
                  ? "bg-legal-red text-on-accent shadow-glow"
                  : "bg-card text-secondary shadow-premium hover:shadow-glow hover:text-legal-red"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-legal-red mb-4" />
          <p className="text-muted animate-pulse font-inter">{t('common.loading')}</p>
        </div>
      ) : error ? (
        <div className="bg-status-error/5 rounded-3xl p-12 text-center max-w-2xl mx-auto shadow-premium animate-reveal">
          <AlertCircle className="w-16 h-16 text-status-error mx-auto mb-6" />
          <h3 className="text-status-error font-black font-cairo text-2xl mb-3 uppercase tracking-tight">{t('common.error')}</h3>
          <p className="text-secondary text-lg font-inter">{error}</p>
        </div>
      ) : filteredLaws.length > 0 ? (
        <div className="space-y-16">
          {categories.filter(c => c.id !== 'all').map(category => {
            const categoryLaws = filteredLaws.filter(l => l.category === category.id || (category.id === 'investment' && l.law_name?.includes('Investment')));
            if (categoryLaws.length === 0) return null;

            return (
              <div key={category.id} className="space-y-10 animate-reveal">
                <div className="flex items-center gap-6">
                  <h2 className="text-2xl font-cairo font-black text-legal-red shrink-0 uppercase tracking-[0.2em]">
                    {category.name}
                  </h2>
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-legal-red/20 via-legal-red/5 to-transparent" />
                  <span className="text-[10px] font-black text-secondary px-4 py-2 rounded-xl bg-card shadow-premium uppercase tracking-[0.2em]">
                    {categoryLaws.length}
                  </span>
                </div>

                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {categoryLaws.map((law, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      key={law.id || idx}
                    >
                      <LawCard 
                        law={law} 
                        onOpenDetails={handleOpenDetails} 
                        articleCount={stats[law.law_name] || 0}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            );
          })}
          
          {/* Catch-all for uncategorized or when searching across all */}
          {selectedCategory === 'all' && filteredLaws.some(l => !categories.find(c => c.id === l.category)) && (
            <div className="space-y-8">
               <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-cairo font-black text-legal-red shrink-0 uppercase tracking-tighter">
                    Other Laws
                  </h2>
                  <div className="h-0.5 w-full bg-legal-red/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredLaws.filter(l => !categories.find(c => c.id === l.category)).map((law, idx) => (
                    <LawCard 
                      key={idx} 
                      law={law} 
                      onOpenDetails={handleOpenDetails} 
                      articleCount={stats[law.law_name] || 0}
                    />
                  ))}
                </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-card rounded-3xl p-20 text-center max-w-4xl mx-auto shadow-premium animate-reveal">
          <div className="w-24 h-24 bg-soft rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-premium">
            <BookOpen className="w-12 h-12 text-muted" />
          </div>
          <h3 className="text-2xl font-cairo font-black text-primary mb-4 uppercase">
            {t('search.noResults')}
          </h3>
          <p className="text-secondary font-inter mb-8">
            {searchTerm || selectedCategory !== 'all' 
              ? "Try adjusting your filters or search term to find what you're looking for."
              : t('law.simulationDesc')}
          </p>
          {(searchTerm || selectedCategory !== 'all') ? (
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="px-8 py-3 bg-legal-red text-on-accent font-bold rounded-xl hover:bg-legal-hover transition-all shadow-lg shadow-legal-red/20 uppercase tracking-wider"
            >
              Clear Filters
            </button>
          ) : (
            <button 
              onClick={() => window.location.href = '/search'}
              className="px-8 py-3 bg-legal-red text-on-accent font-bold rounded-xl hover:bg-legal-hover transition-all shadow-lg shadow-legal-red/20 uppercase tracking-wider"
            >
              {t('nav.search')}
            </button>
          )}
        </div>
      )}

      <LawDetailModal 
        law={selectedLaw} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

