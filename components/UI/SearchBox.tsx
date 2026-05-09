'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function SearchBox({ className }: { className?: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    // Push to chat page with query parameter to start conversation
    router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className={cn("relative max-w-3xl w-full", className)}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('home.searchPlaceholder')}
          className="w-full bg-card shadow-premium rounded-full py-5 px-8 rtl:pl-20 ltr:pr-20 text-primary focus:outline-none focus:ring-2 focus:ring-legal-red/20 transition-all duration-500 text-xl placeholder:text-muted font-inter"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute rtl:left-2.5 ltr:right-2.5 p-4 bg-legal-red text-on-accent rounded-full hover:bg-legal-hover transition-all duration-500 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 justify-center text-sm text-muted font-bold font-inter">
        <span className="opacity-70 uppercase tracking-tight">{t('search.examples')}:</span>
        <button type="button" onClick={() => setQuery(t('examples.familyLaw'))} className="hover:text-legal-red transition-colors">{t('examples.familyLaw')}</button>
        <span className="opacity-30">•</span>
        <button type="button" onClick={() => setQuery(t('examples.commerceCode'))} className="hover:text-legal-red transition-colors">{t('examples.commerceCode')}</button>
        <span className="opacity-30">•</span>
        <button type="button" onClick={() => setQuery(t('examples.realEstate'))} className="hover:text-legal-red transition-colors">{t('examples.realEstate')}</button>
      </div>
    </form>
  );
}
