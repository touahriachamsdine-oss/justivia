'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Scale, LogOut, LayoutDashboard, Heart, User, Bot, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { t, language } = useLanguage();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = (session?.user as any)?.role === 'admin';
  const isLoading = status === 'loading';

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <nav 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="glass-effect sticky top-0 z-[9990] shadow-premium border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/" className="flex items-center gap-2 md:gap-3 group" onClick={() => setIsOpen(false)}>
              <div className="p-2 md:p-2.5 bg-accent-bg rounded-xl shadow-soft group-hover:bg-legal-red/10 transition-all duration-500 group-hover:scale-110 border border-white/5">
                <Scale className="w-5 h-5 md:w-6 md:h-6 text-legal-red" />
              </div>
              <div className="flex flex-col">
                <span className="font-cairo text-lg md:text-2xl font-black tracking-tighter text-primary uppercase leading-none">
                  JUSTIVIA
                </span>
                <span className="text-[8px] md:text-[10px] font-bold text-legal-red tracking-[0.2em] mt-0.5 md:mt-1 opacity-80 uppercase leading-none">
                  Algeria
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center md:hidden gap-3">
            <ThemeSwitcher />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 bg-soft text-primary rounded-xl shadow-premium border border-white/5"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 pr-6 border-r border-white/10">
              <Link href="/chat" className="text-muted hover:text-legal-red transition-all font-black text-xs uppercase tracking-widest flex items-center gap-2 group">
                <Bot className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                {t('nav.chat')}
              </Link>
              <Link href="/search" className="text-muted hover:text-legal-red transition-all font-black text-xs uppercase tracking-widest">
                {t('nav.search')}
              </Link>
              <Link href="/laws" className="text-muted hover:text-legal-red transition-all font-black text-xs uppercase tracking-widest">
                {t('nav.laws')}
              </Link>
            </div>

            <div className="flex items-center gap-6 pl-2">
              {isLoading ? (
                <div className="w-24 h-9 bg-soft animate-pulse rounded-xl" />
              ) : status === 'authenticated' ? (
                <div className="flex items-center gap-6">
                  <Link href="/favorites" className="flex items-center gap-2 text-muted hover:text-legal-red transition-all font-black text-xs uppercase tracking-widest group">
                    <Heart className="w-4 h-4 group-hover:fill-legal-red transition-all" />
                    {t('nav.favorites')}
                  </Link>
                  
                  {isAdmin && (
                    <Link href="/admin" className="flex items-center gap-2 text-on-accent bg-legal-red hover:bg-legal-hover transition-all font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-legal hover:scale-105 active:scale-95">
                      <LayoutDashboard className="w-4 h-4" />
                      {t('nav.admin')}
                    </Link>
                  )}

                  <div className="h-6 w-[1px] bg-white/10" />
                  
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-2 text-muted hover:text-legal-red transition-all font-black text-xs uppercase tracking-widest group"
                  >
                    <div className="p-2 bg-soft rounded-lg group-hover:bg-legal-red/10 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="hidden lg:inline">{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 px-6 py-2.5 bg-legal-red text-on-accent hover:bg-legal-hover shadow-legal rounded-xl transition-all font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95">
                  <User className="w-4 h-4" />
                  {t('nav.login')}
                </Link>
              )}

              <div className="h-6 w-[1px] bg-white/10 mx-2" />
              
              <div className="flex items-center gap-3">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Side Panel */}
      <div className={cn(
        "fixed inset-0 z-[9999] transition-opacity duration-500 md:hidden",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        {/* Backdrop with better blur */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Panel with improved styling */}
        <div 
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          className={cn(
            "absolute top-0 bottom-0 h-full w-[300px] bg-card border-x border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-in-out flex flex-col",
            language === 'ar' 
              ? (isOpen ? "left-0 translate-x-0" : "left-0 -translate-x-full")
              : (isOpen ? "right-0 translate-x-0" : "right-0 translate-x-full")
          )}
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <span className="font-cairo text-xl font-black text-primary uppercase">{t('nav.menu')}</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 bg-soft text-muted rounded-lg hover:text-legal-red transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            <Link 
              href="/chat" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl bg-accent-bg border border-legal-red/10 text-primary font-black uppercase text-sm"
            >
              <div className="p-2 bg-legal-red rounded-xl text-white">
                <Bot className="w-5 h-5" />
              </div>
              {t('nav.chat')}
            </Link>

            <div className="space-y-1">
              <Link href="/search" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 text-muted font-black uppercase text-xs hover:bg-soft rounded-xl transition-colors">
                {t('nav.search')}
              </Link>
              <Link href="/laws" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 text-muted font-black uppercase text-xs hover:bg-soft rounded-xl transition-colors">
                {t('nav.laws')}
              </Link>
              <Link href="/favorites" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 text-muted font-black uppercase text-xs hover:bg-soft rounded-xl transition-colors">
                <Heart className="w-4 h-4" />
                {t('nav.favorites')}
              </Link>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              {isAdmin && (
                <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full py-4 bg-legal-red text-white font-black rounded-2xl shadow-legal uppercase text-sm">
                  <LayoutDashboard className="w-5 h-5" />
                  {t('nav.admin')}
                </Link>
              )}

              {status === 'authenticated' && (
                <button 
                  onClick={() => { signOut({ callbackUrl: '/' }); setIsOpen(false); }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-text-secondary hover:text-legal-red hover:bg-legal-red/5 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">{t('nav.logout')}</span>
                </button>
              )}
              {!session && (
                <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full py-4 bg-legal-red text-white font-black rounded-2xl shadow-legal uppercase text-sm">
                  <User className="w-5 h-5" />
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-white/5 flex items-center justify-center gap-6">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
