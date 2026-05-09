'use client';

import { useEffect, useState, use } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LangTabs } from '@/components/UI/LangTabs';
import { Loader2, Hash, Calendar, Shield, ExternalLink, ChevronRight, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LawDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, currentLang } = useLanguage();
  const [law, setLaw] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLaw() {
      try {
        const res = await fetch(`/api/laws/${id}`);
        const data = await res.json();
        if (res.ok) {
          setLaw(data);
        }
      } catch (err) {
        console.error("Failed to fetch law:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLaw();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-12 h-12 animate-spin text-legal-red mb-4" />
        <p className="text-secondary animate-pulse font-inter">{t('law.loadingDoc')}</p>
      </div>
    );
  }

  if (!law) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h1 className="text-4xl font-cairo font-black text-primary mb-4 uppercase tracking-tight">{t('law.notFound')}</h1>
        <p className="text-secondary font-inter">{t('law.notFoundDesc')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-6 animate-reveal">
          <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-accent-bg text-legal-red rounded-xl shadow-premium">
            {law.domain}
          </span>
          <div className="flex items-center text-muted text-[10px] font-black bg-soft px-4 py-1.5 rounded-xl shadow-premium uppercase tracking-[0.2em]">
            <Hash className="w-3 h-3 rtl:ml-2 ltr:mr-2" />
            <span className="font-mono">{law.officialNumber || law.number}</span>
          </div>
          <div className="flex items-center text-muted text-[10px] font-black bg-soft px-4 py-1.5 rounded-xl shadow-premium uppercase tracking-[0.2em]">
            <Calendar className="w-3 h-3 rtl:ml-2 ltr:mr-2" />
            <span>{law.gazette?.issueDate || law.gazette?.date}</span>
          </div>
          {law.status === 'active' && (
            <div className="flex items-center text-emerald-600 text-[10px] font-black bg-emerald-500/10 px-4 py-1.5 rounded-xl shadow-premium ml-auto rtl:mr-auto rtl:ml-0 uppercase tracking-[0.2em]">
              <Shield className="w-3 h-3 rtl:ml-2 ltr:mr-2" />
              <span>{t('search.active')}</span>
            </div>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-cairo font-black text-primary mb-6 leading-tight uppercase tracking-tighter">
          {law.title[currentLang]}
        </h1>
        
        {law.gazette?.officialUrl && (
          <a 
            href={law.gazette.officialUrl} 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-legal-red hover:text-legal-hover transition-colors font-bold text-sm uppercase tracking-wider"
          >
            <ExternalLink className="w-4 h-4" />
            {t('law.viewInGazette').replace('{issue}', law.gazette.issueNumber || '')}
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-cairo font-black text-primary mb-6 flex items-center gap-3 uppercase tracking-tight">
              <span className="w-2 h-8 bg-legal-red rounded-full"></span>
              {t('law.explanation')}
            </h2>
            <div className="bg-card rounded-3xl overflow-hidden shadow-premium animate-reveal delay-100">
              <LangTabs 
                content={{
                  ar: law.summary?.ar || law.description?.ar || t('law.notAvailable'),
                  fr: law.summary?.fr || law.description?.fr || t('law.notAvailable'),
                  en: law.summary?.en || law.description?.en || t('law.notAvailable')
                }} 
              />
            </div>
          </section>

          {law.citizenSummary && (
            <section className="bg-card rounded-3xl p-8 relative overflow-hidden shadow-premium animate-reveal delay-200">
              <div className="absolute top-0 right-0 w-64 h-64 bg-legal-red/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
              <h2 className="text-xl font-cairo font-black text-primary mb-6 flex items-center gap-3 uppercase tracking-wide">
                <Users className="w-6 h-6 text-legal-red" />
                {t('law.citizenSummary')}
              </h2>
              <p className="text-primary leading-relaxed font-inter text-lg">
                {law.citizenSummary[currentLang]}
              </p>
            </section>
          )}

          {law.keyArticles && law.keyArticles.length > 0 && (
            <section>
              <h2 className="text-2xl font-cairo font-black text-primary mb-6 flex items-center gap-3 uppercase tracking-tight">
                <span className="w-2 h-8 bg-legal-red rounded-full"></span>
                {t('law.keyArticles')}
              </h2>
              <div className="space-y-6">
                {law.keyArticles.map((article: any, idx: number) => (
                  <div key={idx} className="bg-card rounded-3xl p-8 hover:-translate-y-1 transition-all duration-500 group shadow-premium hover:shadow-card-hover animate-reveal" style={{ animationDelay: `${(idx + 3) * 100}ms` }}>
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <span className="bg-accent-bg text-legal-red text-[10px] font-black px-4 py-2 rounded-xl shadow-premium uppercase tracking-[0.2em]">
                        {t('law.article')} {article.number}
                      </span>
                      <h3 className="font-cairo font-black text-primary text-lg uppercase tracking-tight group-hover:text-legal-red transition-colors">
                        {article.title?.[currentLang]}
                      </h3>
                    </div>
                    <p className="text-primary font-inter leading-relaxed text-lg">
                      {article.text?.[currentLang]}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-card rounded-3xl p-8 shadow-premium animate-reveal delay-300">
            <h3 className="font-cairo font-black text-primary mb-8 uppercase tracking-[0.2em] text-sm text-center">{t('common.details')}</h3>
            <div className="space-y-8">
              <div className="relative">
                <span className="block text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-3">{t('law.subdomain')}</span>
                <span className="text-primary font-inter font-bold text-lg">{law.subdomain}</span>
              </div>
              <div className="relative">
                <span className="block text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-3">{t('law.enacted')}</span>
                <span className="text-primary font-inter font-bold text-lg">{law.dates?.enacted}</span>
              </div>
              <div className="relative">
                <span className="block text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-3">{t('law.effectiveFrom')}</span>
                <span className="text-primary font-inter font-bold text-lg">{law.dates?.effectiveFrom}</span>
              </div>
              <div className="relative">
                <span className="block text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-4">{t('law.tags')}</span>
                <div className="flex flex-wrap gap-3">
                  {law.keywords?.map((kw: string, i: number) => (
                    <span key={i} className="text-[10px] font-black bg-soft text-muted px-4 py-2 rounded-xl shadow-premium hover:bg-accent-bg hover:text-legal-red transition-all cursor-default uppercase tracking-widest">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>


          <button className="group w-full py-4 px-6 bg-primary text-on-accent hover:bg-legal-red rounded-2xl transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest shadow-xl shadow-primary/10">
            <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {t('law.saveToBookmarks')}
          </button>
        </div>
      </div>
    </div>
  );
}

// Ensure icons used in the file are imported
import { AlertCircle, Users } from 'lucide-react';
