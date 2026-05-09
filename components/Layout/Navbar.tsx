'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Scale, LogOut, LayoutDashboard, Heart, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { t, language } = useLanguage();
  const { data: session, status } = useSession();
  const isAdmin = (session?.user as any)?.role === 'admin';
  const isLoading = status === 'loading';

  return (
    <nav className="glass-effect sticky top-0 z-50 shadow-premium border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-accent-bg rounded-xl shadow-soft group-hover:bg-legal-red/10 transition-all duration-500 group-hover:scale-110 border border-white/5">
                <Scale className="w-6 h-6 text-legal-red" />
              </div>
              <div className="flex flex-col">
                <span className="font-cairo text-2xl font-black tracking-tighter text-primary uppercase leading-none">
                  JUSTIVIA
                </span>
                <span className="text-[10px] font-bold text-legal-red tracking-[0.2em] mt-1 opacity-80 uppercase leading-none">
                  Algeria
                </span>
              </div>
            </Link>
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
    </nav>
  );
}
