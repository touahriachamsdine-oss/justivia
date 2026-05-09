'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { Scale, Loader2, AlertCircle, Briefcase, GraduationCap, Heart, User, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('auth.registrationFailed'));
      } else {
        router.push('/login?registered=true');
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
          className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-2xl shadow-primary/5"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-soft rounded-xl border border-border">
              <Scale className="w-8 h-8 text-legal-red" />
            </div>
          </div>
          
          <h1 className="text-3xl font-cairo font-bold text-primary text-center mb-2">
            {t('auth.joinJustivia')}
          </h1>
          <p className="text-secondary text-center mb-8 font-inter">
            {t('auth.registerDesc')}
          </p>

        {error && (
          <div className="bg-accent-bg border border-legal-red/30 text-legal-red text-sm px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">{t('auth.fullName')}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-soft border border-border rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-legal-red focus:ring-1 focus:ring-legal-red/50 transition-all font-inter placeholder:text-muted"
              placeholder={t('auth.fullNamePlaceholder') || "John Doe"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">{t('auth.email')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-soft border border-border rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-legal-red focus:ring-1 focus:ring-legal-red/50 transition-all font-inter placeholder:text-muted"
              placeholder={t('auth.emailPlaceholder') || "you@example.com"}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary mb-3">{t('search.type')}</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'citizen', label: t('roles.citizen'), icon: User },
                { id: 'lawyer', label: t('roles.lawyer'), icon: Briefcase },
                { id: 'student', label: t('roles.student'), icon: GraduationCap },
                { id: 'admin', label: t('roles.admin'), icon: Shield },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 group ${
                      role === r.id 
                        ? 'bg-accent-bg border-legal-red text-legal-red shadow-sm' 
                        : 'bg-soft border-border text-muted hover:border-border-strong'
                    }`}
                >
                  <r.icon className={`w-5 h-5 mb-1.5 transition-transform ${role === r.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1.5 font-inter">{t('auth.password')}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-soft border border-border rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-legal-red focus:ring-1 focus:ring-legal-red/50 transition-all font-inter"
              placeholder="••••••••"
            />
          </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-legal-red hover:bg-legal-hover text-on-accent font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center mt-6 disabled:opacity-70 shadow-lg shadow-legal-red/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('auth.register')}
            </button>
          </form>

          <div className="mt-6 text-center text-muted text-sm">
            {t('auth.haveAccount')}{' '}
            <Link href="/login" className="text-legal-red hover:text-legal-hover font-medium transition-colors">
              {t('auth.login')}
            </Link>
          </div>
      </motion.div>
    </div>
  );
}
