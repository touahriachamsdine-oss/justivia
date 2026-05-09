'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { SearchBox } from '@/components/UI/SearchBox';
import { LawWatermark } from '@/components/UI/LawWatermark';
import { FloatingBackground } from '@/components/UI/FloatingBackground';
import { motion } from 'framer-motion';
import { Scale, Shield, Building2, Users, TrendingUp, BookOpen, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const domains = [
    {
      icon: FileText,
      title: 'adminActs',
      desc: 'decisions, circulars, regulations',
    },
    {
      icon: Users,
      title: 'civilService',
      desc: 'officials, rights, obligations',
    },
    {
      icon: Shield,
      title: 'publicContracts',
      desc: 'procurement, deals, agreements',
    },
    {
      icon: Scale,
      title: 'adminJustice',
      desc: 'litigation, appeals, liability',
    },
  ];

  const stats = [
    { label: 'indexedLaws', value: t('home.stats.indexedLawsValue'), icon: BookOpen },
    { label: 'dailyUpdates', value: t('home.stats.dailyUpdatesValue'), icon: TrendingUp },
    { label: 'legalArticles', value: t('home.stats.legalArticlesValue'), icon: FileText },
  ];

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background elements */}
      <div className="absolute inset-0 bg-app -z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-legal-alpha)_0%,transparent_70%)] -z-10" />
      <LawWatermark type="scales" className="opacity-[0.01]" />
      
      {/* Animated floating icons */}
      {mounted && <FloatingBackground />}
      
      {/* Hero Content */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center mt-12 mb-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="mb-8 relative"
        >
          <div className="absolute -inset-4 bg-legal-red/5 blur-3xl -z-10 rounded-full" />
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-card shadow-premium text-legal-red text-[10px] font-black mb-10 hover:shadow-glow transition-all duration-500 cursor-default uppercase tracking-[0.3em] animate-float">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-legal-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-legal-red"></span>
            </span>
            {t('home.quickSearch')}
          </div>
          
          <h1 className="font-cairo text-4xl md:text-7xl lg:text-8xl font-black text-primary mb-4 md:mb-6 tracking-tighter drop-shadow-sm leading-none uppercase">
            {t('home.title')}{' '}
          </h1>
          
          <p className="text-lg md:text-2xl text-secondary max-w-2xl mx-auto font-inter font-normal leading-relaxed px-2">
            {t('home.tagline')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full flex flex-col items-center mb-16"
        >
          <div className="w-full max-w-3xl relative">
            <SearchBox className="shadow-legal w-full" />
            
            {/* Trending searches */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-secondary"
            >
              <span className="flex items-center gap-1 font-bold text-muted">
                <TrendingUp className="w-4 h-4 text-legal-red/70" />
                {t('home.trending')}
              </span>
              {['law2218', 'investment', 'familyCode', 'civilCode'].map((trendKey) => (
                <button 
                  key={trendKey} 
                  onClick={() => router.push(`/search?q=${encodeURIComponent(t(`home.trends.${trendKey}`))}`)}
                  className="px-4 py-2 rounded-xl bg-card hover:text-legal-red transition-all shadow-premium hover:shadow-glow font-black text-[10px] uppercase tracking-widest"
                >
                  {t(`home.trends.${trendKey}`)}
                </button>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-8 flex items-center gap-4"
          >
            <button 
              onClick={() => router.push('/laws')}
              className="px-6 md:px-10 py-3 md:py-4 rounded-2xl bg-legal-red text-on-accent hover:bg-legal-hover transition-all duration-500 font-black uppercase tracking-[0.15em] md:tracking-[0.2em] flex items-center gap-2 md:gap-3 group shadow-2xl shadow-legal-red/30 hover:shadow-legal-red/50 animate-reveal text-sm md:text-base"
            >
              <BookOpen className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
              {t('home.browseIndex')}
            </button>
          </motion.div>
        </motion.div>

        {/* Domain Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-20"
        >
          {domains.map((domain, idx) => {
            const Icon = domain.icon;
            return (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-6 md:p-10 rounded-3xl bg-card shadow-premium hover:shadow-card-hover transition-all duration-500 text-center overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-transparent group-hover:bg-legal-red transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-soft opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-soft rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-legal-red/5 transition-all duration-500 relative z-10 shadow-premium group-hover:shadow-glow">
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-legal-red transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h3 className="font-cairo text-xl md:text-2xl font-black text-primary mb-3 md:mb-4 group-hover:text-legal-red transition-colors relative z-10 uppercase tracking-tight">
                  {t(`domains.${domain.title}`)}
                </h3>
                <p className="text-secondary relative z-10 font-inter leading-relaxed text-xs md:text-sm">
                  {t(`domains.${domain.title}Desc`)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-12 py-16"
        >
          {stats.map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center justify-center p-6 md:p-8 relative animate-reveal shadow-premium rounded-3xl bg-card/50 backdrop-blur-sm" style={{ animationDelay: `${(idx + 1) * 200}ms` }}>
                <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-4">
                  <StatIcon className="w-5 h-5 md:w-6 md:h-6 text-legal-red" />
                  <span className="text-4xl md:text-5xl font-cairo font-black text-primary drop-shadow-md tracking-tighter">{stat.value}</span>
                </div>
                <span className="text-[8px] md:text-[10px] font-black text-muted uppercase tracking-[0.2em] md:tracking-[0.3em] text-center">
                  {t(`home.stats.${stat.label}`)}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Decorative blurred blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-legal-red/10 rounded-full blur-[120px] pointer-events-none -z-10" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-legal-red/10 rounded-full blur-[120px] pointer-events-none -z-10" 
      />
    </div>
  );
}
