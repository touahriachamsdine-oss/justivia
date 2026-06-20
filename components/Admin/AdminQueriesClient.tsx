'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Search, Clock, ShieldAlert, CheckCircle2, Shield, Briefcase, 
  GraduationCap, User, Building2, Gavel, FileSignature, 
  ClipboardCheck, BookOpen, FileSearch, ClipboardList, Heart,
  School, Landmark, ShieldCheck, Coins, Languages, Fingerprint
} from "lucide-react";

interface AdminQueriesClientProps {
  queries: any[];
}

export function AdminQueriesClient({ queries }: AdminQueriesClientProps) {
  const { t } = useLanguage();

  const getRoleConfig = (role: string) => {
    const configs: Record<string, { badgeClass: string; icon: any }> = {
      admin: { badgeClass: 'bg-legal-red/10 text-legal-red border-legal-red/20', icon: Shield },
      lawyer: { badgeClass: 'bg-accent-bg text-legal-red border-legal-red/20', icon: Briefcase },
      student: { badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', icon: GraduationCap },
      citizen: { badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20', icon: User },
      company: { badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', icon: Building2 },
      judge: { badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', icon: Gavel },
      notary: { badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', icon: FileSignature },
      bailiff: { badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20', icon: ClipboardCheck },
      jurist: { badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20', icon: BookOpen },
      expert: { badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20', icon: FileSearch },
      clerk: { badgeClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20', icon: ClipboardList },
      enthusiast: { badgeClass: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20', icon: Heart },
      academic: { badgeClass: 'bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20', icon: School },
      administration: { badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20', icon: Landmark },
      customs: { badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20', icon: ShieldCheck },
      tax_inspector: { badgeClass: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20', icon: Coins },
      translator: { badgeClass: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20', icon: Languages },
      police: { badgeClass: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', icon: Fingerprint },
    };
    return configs[role] || { badgeClass: 'bg-soft text-muted border-border-subtle', icon: User };
  };

  return (
    <div className="bg-card rounded-xl border border-border-subtle overflow-hidden shadow-soft">
      <div className="p-6 border-b border-border-subtle flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary">{t('admin.queryLogs')}</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <CheckCircle2 className="w-4 h-4 text-status-success" />
            {t('admin.status.normal')}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <ShieldAlert className="w-4 h-4 text-status-error" />
            {t('admin.status.flagged')}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-soft/50 text-muted text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">{t('admin.table.query')}</th>
              <th className="px-6 py-4 font-semibold">{t('admin.table.user')}</th>
              <th className="px-6 py-4 font-semibold">{t('admin.table.status')}</th>
              <th className="px-6 py-4 font-semibold">{t('admin.table.time')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/30">
            {queries.map((q: any) => {
              const { badgeClass, icon: IconComponent } = getRoleConfig(q.user_role);
              return (
                <tr key={q.id} className={`hover:bg-soft/30 transition-colors ${q.flagged ? 'bg-status-error/5' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <Search className={`w-4 h-4 mt-1 flex-shrink-0 ${q.flagged ? 'text-status-error' : 'text-legal-red'}`} />
                      <span className="text-sm text-primary font-amiri line-clamp-2 italic">&quot;{q.query}&quot;</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-primary truncate max-w-[150px]">{q.email || t('common.guest')}</span>
                      <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded w-fit border flex items-center gap-1 font-bold ${badgeClass}`}>
                        <IconComponent className="w-2.5 h-2.5" />
                        {t(`roles.${q.user_role}`) || q.user_role}
                      </span>
                    </div>
                  </td>
                <td className="px-6 py-4">
                  {q.flagged ? (
                    <span className="text-[10px] bg-status-error/10 text-status-error px-2 py-1 rounded-full flex items-center gap-1 w-fit border border-status-error/20">
                      <ShieldAlert className="w-3 h-3" /> {t('admin.status.flagged')}
                    </span>
                  ) : (
                    <span className="text-[10px] bg-status-success/10 text-status-success px-2 py-1 rounded-full flex items-center gap-1 w-fit border border-status-success/20">
                      <CheckCircle2 className="w-3 h-3" /> {t('admin.status.normal')}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(q.timestamp).toLocaleString()}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
