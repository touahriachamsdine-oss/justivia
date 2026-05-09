'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-card shadow-premium mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <span className="font-cairo text-2xl font-black text-primary tracking-[0.2em] uppercase">JUSTIVIA</span>
            <span className="text-muted text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
              © {new Date().getFullYear()}
            </span>
          </div>
          
          <div className="flex items-center gap-10 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-legal-red transition-all duration-300 hover:tracking-[0.3em]">{t('nav.about')}</a>
            <a href="#" className="hover:text-legal-red transition-all duration-300 hover:tracking-[0.3em]">{t('nav.terms')}</a>
            <a href="#" className="hover:text-legal-red transition-all duration-300 hover:tracking-[0.3em]">{t('nav.privacy')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
