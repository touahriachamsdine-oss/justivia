'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LangTabsProps {
  content: {
    ar: string;
    fr: string;
    en: string;
  };
  className?: string;
}

export function LangTabs({ content, className }: LangTabsProps) {
  const [activeTab, setActiveTab] = useState<'ar' | 'fr' | 'en'>('ar');

  const tabs = [
    { id: 'ar', label: 'العربية', dir: 'rtl' },
    { id: 'fr', label: 'Français', dir: 'ltr' },
    { id: 'en', label: 'English', dir: 'ltr' },
  ] as const;

  return (
    <div className={cn("flex flex-col w-full bg-card rounded-3xl shadow-premium overflow-hidden animate-reveal", className)}>
      <div className="flex bg-soft/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'ar' | 'fr' | 'en')}
            className={cn(
              "flex-1 py-4 px-6 text-xs font-black transition-all relative uppercase tracking-widest",
              activeTab === tab.id 
                ? "text-legal-red bg-card shadow-soft z-10" 
                : "text-muted hover:text-primary hover:bg-soft/50"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-1 bg-legal-red shadow-[0_-2px_10px_rgba(196,30,42,0.3)]"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="p-8 relative min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 p-8 overflow-y-auto custom-scrollbar"
            dir={tabs.find(t => t.id === activeTab)?.dir}
          >
            <div className={cn(
              "max-w-none text-primary leading-relaxed",
              activeTab === 'ar' ? 'font-cairo text-lg' : 'font-inter'
            )}>
              {content[activeTab]}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

