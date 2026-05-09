'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, BookOpen, Calendar, Hash, ShieldCheck, 
  ArrowRight, Users, Scale, FileText, ExternalLink,
  Info, AlertCircle, History, Briefcase, Plus, Book,
  Heart, Copy, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LangTabs } from './LangTabs';

interface LawDetailModalProps {
  law: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LawDetailModal({ law, isOpen, onClose }: LawDetailModalProps) {
  const { language, t } = useLanguage();
  const currentLang = language as 'ar' | 'fr' | 'en';
  const [extraArticles, setExtraArticles] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data: session } = useSession();

  // Helper for localized content with safe fallbacks
  const getLocalizedContent = (field: any, fallbackKey?: string) => {
    if (!field) return fallbackKey ? t(fallbackKey) : '---';
    if (typeof field === 'string') return field;
    return field[currentLang] || field.ar || field.fr || field.en || (fallbackKey ? t(fallbackKey) : '---');
  };

  // Stable ID for favorites
  const itemId = law?.id?.toString() || (typeof law?.official_number === 'object' ? law.official_number.ar : law?.official_number) || 'unknown';

  useEffect(() => {
    async function checkFavorite() {
      if (!session || !law) return;
      try {
        const res = await fetch(`/api/favorites?itemId=${encodeURIComponent(itemId)}&itemType=law`);
        const data = await res.json();
        setIsFavorited(data.isFavorited);
      } catch (err) {
        console.error("Error checking favorite status:", err);
      }
    }
    if (isOpen && law) {
      checkFavorite();
    }
  }, [isOpen, law, itemId, session]);

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
        setIsFavorited(!isFavorited);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setIsToggling(false);
    }
  };

  const loadMoreArticles = async () => {
    setIsLoadingMore(true);
    setLoadError(null);
    try {
      // Find the highest article number currently displayed
      const allArticles = displayedArticles;
      const maxCurrent = allArticles.length > 0 
        ? Math.max(...allArticles.map(a => {
            const numStr = String(a.number).replace(/[^0-9]/g, '');
            return numStr ? parseInt(numStr) : 0;
          }))
        : 0;
      
      const response = await fetch('/api/laws/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lawName: law.id || (typeof law.title === 'string' ? law.title : (law.title?.en || law.title?.ar)),
          startArticle: maxCurrent + 1,
          count: 20 // Fetch 20 at a time (2 segments of 10)
        })
      });
      
      const data = await response.json();
      if (data.articles && data.articles.length > 0) {
        setExtraArticles(prev => [...prev, ...data.articles]);
      } else if (data.error) {
        setLoadError(data.error);
      } else {
        setLoadError(t('law.noMoreArticles') || "No more articles found.");
      }
    } catch (err) {
      setLoadError("Failed to load more articles.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // De-duplicate and sort articles numerically
  const displayedArticles = [...(law?.relevant_articles || law?.articles || []), ...extraArticles]
    .reduce((acc: any[], current: any) => {
      // De-duplicate by article number
      const existing = acc.find(item => String(item.number) === String(current.number));
      if (!existing) return acc.concat([current]);
      return acc;
    }, [])
    .sort((a, b) => {
      // Sort numerically by extracting digits
      const numA = parseInt(String(a.number).replace(/[^0-9]/g, '')) || 0;
      const numB = parseInt(String(b.number).replace(/[^0-9]/g, '')) || 0;
      return numA - numB;
    });

  // Reset extra articles when the law changes
  useEffect(() => {
    setExtraArticles([]);
    setLoadError(null);
  }, [law?.title?.ar, law?.title?.en]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!law && isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container Wrapper */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-card rounded-3xl shadow-premium overflow-hidden flex flex-col"
            >
              {/* Header */}
            <div className="relative p-8 bg-soft/40 glass-effect">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={toggleFavorite}
                  disabled={isToggling}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300 shadow-sm",
                    isFavorited 
                      ? "bg-accent-bg text-legal-red" 
                      : "bg-soft text-secondary hover:text-legal-red"
                  )}
                  title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
                </button>

                <button
                  onClick={() => {
                    const citation = `${law.title[currentLang]} (${law.official_number[currentLang]}), JORA No. ${law.gazette.issue_number}, ${law.gazette.publication_date[currentLang]}`;
                    navigator.clipboard.writeText(citation);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-2 rounded-xl bg-card text-secondary hover:text-legal-red transition-all duration-300 shadow-soft relative"
                  title="Copy Citation"
                >
                  {copied ? <Check className="w-5 h-5 text-status-success" /> : <Copy className="w-5 h-5" />}
                  {copied && (
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-status-success text-on-accent px-2 py-0.5 rounded animate-bounce">
                      Copied!
                    </span>
                  )}
                </button>
                
                <button 
                  onClick={onClose}
                  className="p-2 text-muted hover:text-legal-red transition-colors rounded-xl hover:bg-accent-bg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-4 pr-20">
                <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-accent-bg text-legal-red rounded-xl flex items-center gap-1 shadow-soft">
                  <ShieldCheck className="w-3 h-3" />
                  {getLocalizedContent(law.domain || law.category, 'law.legislation')}
                </span>
                <div className="flex items-center text-muted text-[10px] font-black uppercase tracking-tight gap-1.5 bg-card px-3 py-1.5 rounded-xl shadow-soft">
                  <Hash className="w-3.5 h-3.5" />
                  <span>{getLocalizedContent(law.official_number)}</span>
                </div>
                <div className="flex items-center text-muted text-[10px] font-black uppercase tracking-tight gap-1.5 bg-card px-3 py-1.5 rounded-xl shadow-soft">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{getLocalizedContent(law.gazette?.publication_date || law.publication_date)}</span>
                </div>
              </div>

              <h2 className="font-cairo text-2xl md:text-3xl font-bold text-primary leading-tight pr-20">
                {getLocalizedContent(law.title)}
              </h2>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
              
              {/* Uncertainty Warning */}
              {law.uncertain && (
                <div className="bg-accent-bg rounded-2xl p-6 flex items-start gap-5 mb-8 shadow-premium animate-reveal">
                  <div className="p-3 bg-legal-red/10 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-legal-red shrink-0" />
                  </div>
                  <div>
                    <h4 className="text-legal-red font-black text-xs uppercase tracking-widest mb-2">
                      {t('search.unverified') || 'Unverified Data'}
                    </h4>
                    <p className="text-secondary text-sm leading-relaxed font-inter">
                      {t('search.unverifiedDesc') || 'This information was generated by AI based on context and may not be exact. Please verify with the official gazette.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Citizen Summary Section */}
              <section className="bg-soft rounded-3xl p-8 relative overflow-hidden shadow-premium animate-reveal">
                <div className="absolute top-0 right-0 w-32 h-32 bg-legal-red/5 rounded-full blur-3xl -mr-12 -mt-12" />
                <h3 className="text-legal-red font-black flex items-center gap-2 mb-4 text-sm uppercase tracking-widest">
                  <Users className="w-5 h-5" />
                  {t('law.citizenSummary')}
                </h3>
                <p className="text-primary text-lg leading-relaxed font-cairo italic border-l-4 border-legal-red/30 pl-6">
                  {getLocalizedContent(law.citizen_summary, 'law.noSummary')}
                </p>
              </section>

              {/* Detailed Explanation */}
              <section className="animate-reveal [animation-delay:200ms]">
                <h3 className="text-primary font-black flex items-center gap-2 mb-6 text-xl uppercase tracking-tighter">
                  <FileText className="w-6 h-6 text-legal-red" />
                  {t('law.explanation')}
                </h3>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <div className="text-secondary leading-relaxed font-inter whitespace-pre-wrap space-y-4">
                    {getLocalizedContent(law.explanation)}
                  </div>
                </div>
              </section>

              {/* Relevant Articles */}
              {displayedArticles && displayedArticles.length > 0 && (
                <section className="animate-reveal [animation-delay:400ms]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-primary font-black flex items-center gap-2 text-xl uppercase tracking-tighter">
                      <Scale className="w-6 h-6 text-legal-red" />
                      {t('law.keyArticles')}
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-accent-bg text-legal-red px-4 py-1.5 rounded-full shadow-soft">
                      {displayedArticles.length} / {law.total_articles_in_law || '???'} {t('law.articles')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {displayedArticles.map((art: any, i: number) => (
                      <div key={i} className="bg-card p-6 rounded-2xl shadow-premium hover:shadow-card-hover transition-all duration-500 group">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-legal-red font-black text-[10px] uppercase tracking-widest bg-accent-bg px-3 py-1 rounded-lg shadow-soft">{typeof art.number === 'string' && (art.number.includes('المادة') || art.number.toLowerCase().includes('article')) ? art.number : `${t('law.article')} ${art.number}`}</span>
                            {art.significance === 'critical' && (
                              <span className="text-[10px] uppercase font-black tracking-tighter text-on-accent bg-legal-red px-3 py-1 rounded-lg shadow-legal animate-pulse-accent">{t('law.critical')}</span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              const text = getLocalizedContent(art.text || art.content);
                              const heading = getLocalizedContent(art.heading || art.title);
                              const num = art.number;
                              const copyText = `المادة ${num}: ${heading}\n\n${text}`;
                              navigator.clipboard.writeText(copyText);
                            }}
                            className="p-2 rounded-lg bg-soft text-secondary hover:text-legal-red transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100"
                            title="Copy Article"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-primary font-black mb-4 text-lg leading-tight uppercase tracking-tight group-hover:text-legal-red transition-colors">
                          {(() => {
                            const rawTitle = getLocalizedContent(art.heading || art.title);
                            return rawTitle.replace(/^(المادة|Article|Matière)\s+\d+[:\s-]*/i, '').trim() || t('law.articleContent');
                          })()}
                        </h4>
                        <p className="text-secondary text-sm font-inter leading-relaxed bg-soft/50 p-5 rounded-2xl whitespace-pre-wrap transition-colors group-hover:bg-soft">
                          {getLocalizedContent(art.text || art.content, 'law.noText')}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* LOAD MORE BUTTON */}
                  <div className="mt-10 flex flex-col items-center gap-4">
                    {loadError && <p className="text-legal-red text-xs font-black uppercase tracking-widest">{loadError}</p>}
                    <button
                      onClick={loadMoreArticles}
                      disabled={isLoadingMore}
                      className="group relative px-10 py-4 bg-card shadow-premium rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-500 disabled:opacity-50 flex items-center gap-3 hover:-translate-y-1 active:scale-95"
                    >
                      {isLoadingMore ? (
                        <div className="w-5 h-5 border-2 border-legal-red border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-5 h-5 text-legal-red group-hover:rotate-90 transition-transform duration-500" />
                      )}
                      <span className="text-primary font-black text-xs uppercase tracking-widest">
                        {isLoadingMore ? t('common.loading') : t('law.loadMore')}
                      </span>
                    </button>
                    <p className="text-[10px] text-muted uppercase tracking-widest italic opacity-60 font-black">
                      {t('law.deepExtractNote') || "Fetch next official articles from the Gazette"}
                    </p>
                  </div>
                </section>
              )}

              {/* Practical Example */}
              {law.practical_example && (
                <section className="bg-soft rounded-3xl p-8 shadow-premium animate-reveal">
                  <h3 className="text-legal-red font-black flex items-center gap-2 mb-6 text-sm uppercase tracking-widest">
                    <Briefcase className="w-5 h-5" />
                    {t('law.practicalExample')}
                  </h3>
                  <div className="space-y-6">
                    <div className="bg-card rounded-2xl p-6 shadow-premium">
                      <h4 className="text-[10px] font-black text-muted uppercase mb-3 tracking-[0.2em]">{t('law.scenario')}</h4>
                      <p className="text-secondary text-sm leading-relaxed">{law.practical_example.scenario?.[currentLang]}</p>
                    </div>
                    <div className="bg-accent-bg rounded-2xl p-6 shadow-premium">
                      <h4 className="text-[10px] font-black text-legal-red uppercase mb-3 tracking-[0.2em]">{t('law.outcome')}</h4>
                      <p className="text-primary text-sm font-black leading-relaxed">{law.practical_example.outcome?.[currentLang]}</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Scope of Application */}
              {law.scope && (
                <section className="animate-reveal">
                  <h3 className="text-primary font-black flex items-center gap-2 mb-6 text-xl uppercase tracking-tighter">
                    <Info className="w-6 h-6 text-legal-red" />
                    {t('law.scope')}
                  </h3>
                  <div className="text-secondary text-sm leading-relaxed bg-soft p-8 rounded-3xl shadow-premium italic font-cairo">
                    {law.scope?.[currentLang] || law.scope}
                  </div>
                </section>
              )}

              {/* Roles and Obligations */}
              {law.roles && law.roles.length > 0 && (
                <section className="animate-reveal">
                  <h3 className="text-primary font-black flex items-center gap-2 mb-8 text-xl uppercase tracking-tighter">
                    <Users className="w-6 h-6 text-legal-red" />
                    {t('law.roles')}
                  </h3>
                  <div className="space-y-6">
                    {law.roles.map((role: any, i: number) => (
                      <div key={i} className="bg-card rounded-3xl overflow-hidden shadow-premium hover:shadow-card-hover transition-all duration-500">
                        <div className="bg-soft/50 p-5 font-black text-primary text-sm uppercase tracking-widest flex items-center gap-3">
                          <div className="w-1.5 h-8 bg-legal-red rounded-full" />
                          {role.party?.[currentLang] || role.party}
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-soft/30 p-6 rounded-2xl">
                            <h4 className="text-[10px] font-black text-status-success uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-status-success" />
                              {t('law.rights')}
                            </h4>
                            <ul className="space-y-3">
                              {(role.rights?.[currentLang] || role.rights)?.map((r: string, idx: number) => (
                                <li key={idx} className="text-xs text-secondary leading-relaxed font-inter pl-4 relative">
                                  <div className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-status-success/30" />
                                  {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-soft/30 p-6 rounded-2xl">
                            <h4 className="text-[10px] font-black text-legal-red uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-legal-red" />
                              {t('law.obligations')}
                            </h4>
                            <ul className="space-y-3">
                              {(role.obligations?.[currentLang] || role.obligations)?.map((o: string, idx: number) => (
                                <li key={idx} className="text-xs text-secondary leading-relaxed font-inter pl-4 relative">
                                  <div className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-legal-red/30" />
                                  {o}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Amendments */}
              {law.amendments && law.amendments.length > 0 && (
                <section className="animate-reveal">
                  <h3 className="text-primary font-black flex items-center gap-2 mb-8 text-xl uppercase tracking-tighter">
                    <History className="w-6 h-6 text-legal-red" />
                    {t('law.amendments')}
                  </h3>
                  <div className="space-y-4">
                    {law.amendments.map((amend: any, i: number) => (
                      <div key={i} className="bg-soft p-8 rounded-3xl shadow-premium hover:shadow-card-hover transition-all duration-500">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-legal-red text-xs font-black uppercase tracking-widest">{amend.official_number?.[currentLang] || amend.official_number}</span>
                          <span className="text-muted text-[10px] font-black uppercase tracking-widest opacity-60">{amend.gazette?.date?.[currentLang] || amend.gazette?.date}</span>
                        </div>
                        <p className="text-secondary text-sm leading-relaxed font-inter">{amend.description?.[currentLang] || amend.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Related Laws */}
              {law.related_laws && law.related_laws.length > 0 && (
                <section className="animate-reveal">
                  <h3 className="text-primary font-black flex items-center gap-2 mb-8 text-xl uppercase tracking-tighter">
                    <BookOpen className="w-6 h-6 text-legal-red" />
                    {t('law.relatedLaws')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {law.related_laws.map((rel: any, i: number) => (
                      <div key={i} className="bg-soft p-6 rounded-3xl shadow-premium hover:shadow-card-hover transition-all duration-500 flex items-start gap-5 group">
                        <div className="p-3 bg-accent-bg rounded-2xl group-hover:bg-legal-red/10 transition-colors shadow-premium">
                          <Scale className="w-5 h-5 text-legal-red" />
                        </div>
                        <div>
                          <h4 className="text-primary text-sm font-black mb-2 leading-snug group-hover:text-legal-red transition-colors">{rel.title?.[currentLang] || rel.title}</h4>
                          <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{rel.relationship?.[currentLang] || rel.relationship}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>

            {/* Footer */}
            <div className="p-8 bg-soft/40 flex items-center justify-between glass-effect">
              {law.gazette?.official_url && (
                <a 
                  href={law.gazette.official_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-legal-red hover:text-legal-hover transition-all text-xs font-black uppercase tracking-widest hover:scale-105"
                >
                  <ExternalLink className="w-5 h-5" />
                  {t('law.viewGazette')}
                </a>
              )}
              <div className="text-[10px] text-muted uppercase tracking-widest font-black flex items-center gap-3 bg-card px-4 py-2 rounded-xl shadow-soft">
                <AlertCircle className="w-4 h-4 text-legal-red animate-pulse" />
                {t('law.aiVerification')}: {Math.round((law.relevance_score || 0.98) * 100)}% {t('law.match')}
              </div>
            </div>
          </motion.div>
        </div>
      </>
      )}
    </AnimatePresence>
  );
}
