'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { BookOpen, Calendar, Hash, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';
import { LawWatermark } from './LawWatermark';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface LawCardProps {
  law: {
    id?: string | number;
    official_number: { ar: string; fr: string; en: string };
    title: { ar: string; fr: string; en: string };
    gazette: {
      issue_number: string;
      publication_date: { ar: string; fr: string; en: string; iso: string };
    };
    citizen_summary: { ar: string; fr: string; en: string };
    relevance_score: number;
    uncertain?: boolean;
  };
  className?: string;
  onOpenDetails?: (law: any) => void;
  isInitialFavorite?: boolean;
  onToggle?: (isFavorited: boolean) => void;
  articleCount?: number;
}

export function LawCard({ law, className, onOpenDetails, isInitialFavorite = false, onToggle, articleCount = 0 }: LawCardProps) {
  const { language, t } = useLanguage();
  const { data: session } = useSession();
  const currentLang = language as 'ar' | 'fr' | 'en';
  const [isFavorited, setIsFavorited] = useState(isInitialFavorite);
  const [isToggling, setIsToggling] = useState(false);

  // Use official number as unique ID if ID is missing (common for search results)
  const itemId = law.id?.toString() || law.official_number?.ar || 'unknown';

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) {
      window.location.href = '/login';
      return;
    }

    setIsToggling(true);
    try {
      const method = isFavorited ? 'DELETE' : 'POST';
      const res = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          itemType: 'law',
          itemData: law
        }),
      });

      if (res.ok) {
        const newState = !isFavorited;
        setIsFavorited(newState);
        if (onToggle) onToggle(newState);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setIsToggling(false);
    }
  };

  // Extract type from official number (ar) - simple heuristic
  const typeAr = law.official_number?.ar || '';
  const isDecree = typeAr.includes('مرسوم');
  const isLaw = typeAr.includes('قانون') || typeAr.includes('أمر');
  const lawType = isDecree ? t('law.decree') : isLaw ? t('law.lawType') : t('law.legislation');

  return (
    <div className={cn(
      "group relative flex flex-col bg-card shadow-premium hover:shadow-card-hover rounded-2xl p-6 transition-all duration-500 overflow-hidden hover:-translate-y-1 animate-reveal",
      className
    )}>
      <LawWatermark className="opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-500" type="scales" />
      
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-accent-bg text-legal-red rounded-xl shadow-premium flex items-center gap-1.5 font-cairo">
            <ShieldCheck className="w-3 h-3" />
            {lawType}
          </span>
          {law.uncertain && (
            <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-legal-red/10 text-legal-red shadow-premium rounded-xl">
              {t('search.unverified') || 'Unverified'}
            </span>
          )}
          <div className="flex items-center text-muted text-[10px] gap-2 font-black uppercase tracking-[0.2em] font-inter bg-soft px-3 py-1.5 rounded-xl shadow-premium">
            <Hash className="w-3 h-3" />
            <span className="truncate max-w-[120px]">{law.official_number?.[currentLang] || law.official_number?.ar || '---'}</span>
          </div>
          {articleCount > 0 && (
            <span className="px-3 py-1.5 text-[10px] font-black bg-legal-red text-on-accent rounded-xl uppercase tracking-widest font-cairo shadow-glow">
              {articleCount}+ {t('law.articles') || 'Articles'}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFavorite}
            disabled={isToggling}
            className={cn(
              "p-2.5 rounded-full transition-all duration-500 shadow-premium hover:shadow-glow",
              isFavorited 
                ? "bg-accent-bg text-legal-red" 
                : "bg-soft text-muted hover:text-legal-red"
            )}
          >
            <Heart className={cn("w-4 h-4 transition-transform duration-500", isFavorited && "fill-current scale-110", "group-hover/fav:scale-125")} />
          </button>
          
          <div className="flex items-center text-muted text-[10px] font-black gap-2 bg-soft shadow-premium px-3 py-1.5 rounded-xl font-inter uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5" />
            <span>{law.gazette?.publication_date?.[currentLang] || law.gazette?.publication_date?.ar || '---'}</span>
          </div>
        </div>
      </div>

      <h3 className="relative z-10 font-cairo text-lg font-black text-primary mb-2 line-clamp-2 group-hover:text-legal-red transition-colors uppercase leading-tight">
        {law.title?.[currentLang] || law.title?.ar || t('law.noTitle')}
      </h3>
      
      <p className="relative z-10 text-secondary text-sm line-clamp-3 mb-8 flex-grow font-inter leading-relaxed">
        {law.citizen_summary?.[currentLang] || law.citizen_summary?.ar || (typeof law.citizen_summary === 'string' ? law.citizen_summary : t('law.noSummary'))}
      </p>

      <div className="relative z-10 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 bg-soft rounded-full overflow-hidden">
            <div 
              className="h-full bg-legal-red transition-all duration-1000" 
              style={{ width: `${(law.relevance_score || 0.95) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-muted font-bold uppercase tracking-tighter font-inter">
            {t('law.match')}: {Math.round((law.relevance_score || 0.95) * 100)}%
          </span>
        </div>
        
        <button 
          className="flex items-center gap-2 text-sm font-black text-legal-red hover:translate-x-1 rtl:hover:-translate-x-1 transition-transform font-cairo uppercase"
          onClick={() => onOpenDetails?.(law)}
        >
          {t('laws.readMore')}
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
