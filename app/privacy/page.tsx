'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { LawWatermark } from '@/components/UI/LawWatermark';
import { FloatingBackground } from '@/components/UI/FloatingBackground';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PrivacyPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden py-16 px-4">
      {/* Background elements */}
      <div className="absolute inset-0 bg-app -z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-legal-alpha)_0%,transparent_70%)] -z-10" />
      <LawWatermark type="scales" className="opacity-[0.01]" />
      
      {/* Animated floating icons */}
      {mounted && <FloatingBackground />}
      
      <div className="w-full max-w-4xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-card shadow-premium text-legal-red text-[10px] font-black mb-6 hover:shadow-glow transition-all duration-500 uppercase tracking-[0.3em] cursor-default">
            <Shield className="w-4 h-4" />
            {t('nav.privacy')}
          </div>
          <h1 className="font-cairo text-4xl md:text-6xl font-black text-primary mb-4 tracking-tighter uppercase leading-none">
            {t('privacy.title')}
          </h1>
          <p className="text-sm md:text-lg text-secondary font-bold max-w-2xl mx-auto uppercase tracking-wide">
            {t('privacy.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Introduction block */}
          <motion.div 
            variants={itemVariants}
            className="p-8 md:p-10 rounded-3xl bg-card shadow-premium border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-legal-red to-transparent" />
            <p className="text-secondary leading-relaxed font-cairo text-base md:text-lg italic">
              {t('privacy.intro')}
            </p>
          </motion.div>

          {/* Section 1 */}
          <motion.div 
            variants={itemVariants}
            className="p-8 rounded-3xl bg-card shadow-premium border border-white/5 relative group transition-all duration-500"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-soft rounded-2xl flex items-center justify-center shrink-0 shadow-premium">
                <Eye className="w-6 h-6 text-legal-red" />
              </div>
              <div>
                <h2 className="font-cairo text-xl font-black text-primary mb-3">
                  {t('privacy.section1Title')}
                </h2>
                <p className="text-secondary leading-relaxed text-sm md:text-base">
                  {t('privacy.section1Text')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 2 */}
          <motion.div 
            variants={itemVariants}
            className="p-8 rounded-3xl bg-card shadow-premium border border-white/5 relative group transition-all duration-500"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-soft rounded-2xl flex items-center justify-center shrink-0 shadow-premium">
                <Lock className="w-6 h-6 text-legal-red" />
              </div>
              <div>
                <h2 className="font-cairo text-xl font-black text-primary mb-3">
                  {t('privacy.section2Title')}
                </h2>
                <p className="text-secondary leading-relaxed text-sm md:text-base">
                  {t('privacy.section2Text')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 3 */}
          <motion.div 
            variants={itemVariants}
            className="p-8 rounded-3xl bg-card shadow-premium border border-white/5 relative group transition-all duration-500"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-soft rounded-2xl flex items-center justify-center shrink-0 shadow-premium">
                <UserCheck className="w-6 h-6 text-legal-red" />
              </div>
              <div>
                <h2 className="font-cairo text-xl font-black text-primary mb-3">
                  {t('privacy.section3Title')}
                </h2>
                <p className="text-secondary leading-relaxed text-sm md:text-base">
                  {t('privacy.section3Text')}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
