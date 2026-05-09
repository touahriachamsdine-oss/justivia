'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Layout/Navbar';
import { Footer } from '@/components/Layout/Footer';
import { LawCard } from '@/components/UI/LawCard';
import { LawDetailModal } from '@/components/UI/LawDetailModal';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Heart, Loader2, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FavoritesPage() {
  const { t, currentLang } = useLanguage();
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLaw, setSelectedLaw] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/login';
      return;
    }

    if (status === 'authenticated') {
      fetchFavorites();
    }
  }, [status]);

  async function fetchFavorites() {
    try {
      const res = await fetch('/api/favorites');
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenDetails = (law: any) => {
    setSelectedLaw(law);
    setIsModalOpen(true);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-app flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-legal-red" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center gap-4 mb-12 animate-reveal">
          <div className="p-4 bg-accent-bg rounded-2xl shadow-premium">
            <Heart className="w-8 h-8 text-legal-red fill-current" />
          </div>
          <div>
            <h1 className="text-4xl font-cairo font-black text-primary uppercase tracking-tighter">
              {t('favorites.title')}
            </h1>
            <p className="text-secondary font-inter uppercase tracking-[0.2em] text-[10px] font-black opacity-60">
              {favorites.length} {t('favorites.itemsCount') || 'ITEMS SAVED'}
            </p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-card rounded-[2rem] p-24 text-center flex flex-col items-center shadow-premium animate-reveal">
            <div className="p-6 bg-soft rounded-full mb-8 shadow-soft">
              <Bookmark className="w-12 h-12 text-muted/30" />
            </div>
            <h2 className="text-2xl font-cairo font-black text-primary mb-4 uppercase tracking-tight">{t('favorites.empty')}</h2>
            <p className="text-secondary max-w-md mx-auto mb-10 font-inter leading-relaxed">
              {t('favorites.emptyDescription') || 'Explore the law index or search for specific legal cases to save them for later.'}
            </p>
            <a 
              href="/search" 
              className="px-12 py-4 bg-legal-red text-on-accent font-black rounded-xl hover:bg-legal-hover transition-all shadow-glow uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95"
            >
              {t('nav.search')}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((fav, idx) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <LawCard 
                  law={fav.item_data} 
                  isInitialFavorite={true}
                  onOpenDetails={handleOpenDetails}
                  onToggle={(isFav) => {
                    if (!isFav) {
                      setFavorites(prev => prev.filter(f => f.id !== fav.id));
                    }
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <LawDetailModal 
        law={selectedLaw} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <Footer />
    </div>
  );
}

