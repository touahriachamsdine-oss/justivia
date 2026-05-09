'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { currentLang, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse shadow-inner rounded-lg p-1 bg-soft">
      <button
        onClick={() => setLanguage('ar')}
        className={cn(
          "px-3 py-1 text-xs font-bold rounded-md transition-all uppercase tracking-tight",
          currentLang === 'ar' 
            ? "bg-legal-red text-on-accent shadow-sm" 
            : "text-muted hover:text-legal-red"
        )}
      >
        العربية
      </button>
      <button
        onClick={() => setLanguage('fr')}
        className={cn(
          "px-3 py-1 text-xs font-bold rounded-md transition-all uppercase tracking-tight",
          currentLang === 'fr' 
            ? "bg-legal-red text-on-accent shadow-sm" 
            : "text-muted hover:text-legal-red"
        )}
      >
        FR
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          "px-3 py-1 text-xs font-bold rounded-md transition-all uppercase tracking-tight",
          currentLang === 'en' 
            ? "bg-legal-red text-on-accent shadow-sm" 
            : "text-muted hover:text-legal-red"
        )}
      >
        EN
      </button>
    </div>

  );
}
