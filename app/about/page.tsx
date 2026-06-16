'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { LawWatermark } from '@/components/UI/LawWatermark';
import { FloatingBackground } from '@/components/UI/FloatingBackground';
import { motion } from 'framer-motion';
import { Award, BookOpen, GraduationCap, Scale, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AboutPage() {
  const { t, language } = useLanguage();
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
      <LawWatermark type="pillar" className="opacity-[0.01]" />
      
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
            <GraduationCap className="w-4 h-4" />
            {t('about.university')}
          </div>
          <h1 className="font-cairo text-4xl md:text-6xl font-black text-primary mb-4 tracking-tighter uppercase leading-none">
            {t('about.title')}
          </h1>
          <p className="text-sm md:text-lg text-secondary font-bold max-w-2xl mx-auto uppercase tracking-wide">
            {t('about.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {/* Main Description */}
          <motion.div 
            variants={itemVariants}
            className="p-8 md:p-12 rounded-3xl bg-card shadow-premium border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-legal-red to-transparent" />
            <h2 className="font-cairo text-2xl font-black text-primary mb-4 uppercase flex items-center gap-3">
              <Scale className="w-6 h-6 text-legal-red" />
              JUSTIVIA
            </h2>
            <p className="text-secondary leading-relaxed font-inter text-sm md:text-base">
              {t('about.description')}
            </p>
          </motion.div>

          {/* Cards for student and supervisor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              className="p-8 rounded-3xl bg-card shadow-premium border border-white/5 text-center relative group transition-all duration-500"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-legal-red transition-all duration-500" />
              <div className="w-16 h-16 mx-auto bg-soft rounded-2xl flex items-center justify-center mb-6 shadow-premium group-hover:shadow-glow transition-all duration-500">
                <User className="w-8 h-8 text-legal-red" />
              </div>
              <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block mb-2">
                {t('about.creatorLabel')}
              </span>
              <h3 className="font-cairo text-2xl font-black text-primary mb-3">
                {t('about.creator')}
              </h3>
              <p className="text-xs text-muted">
                {t('about.faculty')}
              </p>
            </motion.div>

            {/* Supervisor card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              className="p-8 rounded-3xl bg-card shadow-premium border border-white/5 text-center relative group transition-all duration-500"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-legal-red transition-all duration-500" />
              <div className="w-16 h-16 mx-auto bg-soft rounded-2xl flex items-center justify-center mb-6 shadow-premium group-hover:shadow-glow transition-all duration-500">
                <Users className="w-8 h-8 text-legal-red" />
              </div>
              <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block mb-2">
                {t('about.supervisorLabel')}
              </span>
              <h3 className="font-cairo text-2xl font-black text-primary mb-3">
                {t('about.supervisor')}
              </h3>
              <p className="text-xs text-muted">
                {t('about.faculty')}
              </p>
            </motion.div>
          </div>

          {/* Acknowledgments */}
          <motion.div 
            variants={itemVariants}
            className="p-8 md:p-12 rounded-3xl bg-card/60 backdrop-blur-md shadow-premium border border-white/5 relative overflow-hidden text-center"
          >
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-legal-red to-transparent" />
            <div className="w-16 h-16 mx-auto bg-legal-red/10 rounded-full flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-legal-red" />
            </div>
            <h2 className="font-cairo text-3xl font-black text-primary mb-6">
              {t('about.acknowledgment')}
            </h2>
            <p className="text-secondary leading-relaxed font-cairo text-base md:text-lg max-w-3xl mx-auto italic">
              "{t('about.acknowledgmentText')}"
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
