'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { Scale, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(t('auth.invalidCreds'));
      } else {
        // Fetch session to check role for redirection
        const { getSession } = await import('next-auth/react');
        const session = await getSession();
        
        const targetUrl = (session?.user as any)?.role === 'admin' ? '/admin' : '/';
        window.location.href = targetUrl;
      }
    } catch (err) {
      setError(t('auth.unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-app -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,30,42,0.03)_0%,transparent_60%)] -z-10" />
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-card rounded-2xl p-8 shadow-2xl shadow-primary/5"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-soft rounded-xl">
              <Scale className="w-8 h-8 text-legal-red" />
            </div>
          </div>
          
          <h1 className="text-3xl font-cairo font-bold text-primary text-center mb-2">
            {t('auth.welcomeBack')}
          </h1>
          <p className="text-secondary text-center mb-8 font-inter">
            {t('auth.signInDesc')}
          </p>

        {error && (
          <div className="bg-accent-bg border border-legal-red/30 text-legal-red text-sm px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">{t('auth.email')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-soft rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-legal-red/20 transition-all font-inter placeholder:text-muted"
              placeholder={t('auth.emailPlaceholder') || "you@example.com"}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">{t('auth.password')}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-soft rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-legal-red/20 transition-all font-inter"
              placeholder="••••••••"
            />
          </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-legal-red hover:bg-legal-hover text-on-accent font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center mt-6 disabled:opacity-70 shadow-lg shadow-legal-red/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('auth.login')}
            </button>
          </form>

          <div className="mt-6 text-center text-muted text-sm">
            {t('auth.noAccount')}{' '}
            <Link href="/register" className="text-legal-red hover:text-legal-hover font-medium transition-colors">
              {t('auth.createOne')}
            </Link>
          </div>
      </motion.div>
    </div>
  );
}
