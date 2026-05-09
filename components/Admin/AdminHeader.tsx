'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AdminHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    { label: t('admin.overview'), href: '/admin' },
    { label: t('admin.users'), href: '/admin/users' },
    { label: t('admin.queries'), href: '/admin/queries' },
  ];

  return (
    <header className="mb-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-reveal">
      <div>
        <h1 className="text-3xl font-cairo font-black text-primary uppercase tracking-tighter hover:text-legal-red transition-colors cursor-default">
          {t('admin.console')}
        </h1>
        <p className="text-muted mt-1">{t('admin.managePlatform')}</p>
      </div>
      <div className="flex gap-2 p-1.5 bg-card rounded-2xl shadow-premium">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-xs px-5 py-2.5 rounded-xl transition-all duration-500 font-black uppercase tracking-widest",
              pathname === item.href
                ? "bg-legal-red text-on-accent shadow-legal scale-105"
                : "text-muted hover:text-primary hover:bg-soft"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
