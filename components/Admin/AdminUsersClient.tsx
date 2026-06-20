'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Mail, Shield, Calendar, GraduationCap, Heart, Briefcase, User,
  Building2, Gavel, FileSignature, ClipboardCheck, BookOpen, FileSearch, ClipboardList,
  School, Landmark, ShieldCheck, Coins, Languages, Fingerprint
} from "lucide-react";

interface AdminUsersClientProps {
  users: any[];
}

export function AdminUsersClient({ users }: AdminUsersClientProps) {
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
        <h2 className="text-xl font-bold text-primary">{t('admin.directory')}</h2>
        <span className="text-sm text-muted">
          {t('admin.registeredAccounts').replace('{count}', users.length.toString())}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-soft/50 text-muted text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">{t('admin.table.user')}</th>
              <th className="px-6 py-4 font-semibold">{t('admin.table.role')}</th>
              <th className="px-6 py-4 font-semibold text-center">{t('admin.table.usage')}</th>
              <th className="px-6 py-4 font-semibold text-center">{t('admin.table.lifetime')}</th>
              <th className="px-6 py-4 font-semibold">{t('admin.table.activity')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/30">
            {users.map((user: any) => {
              const { badgeClass, icon: IconComponent } = getRoleConfig(user.role);
              return (
                <tr key={user.id} className="hover:bg-soft/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-bg flex items-center justify-center text-legal-red font-bold text-xs border border-legal-red/10">
                        {(user.name || user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-primary">{user.name || t('common.notAvailable')}</div>
                        <div className="text-xs text-secondary flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight flex items-center gap-1 w-fit border ${badgeClass}`}>
                      <IconComponent className="w-3 h-3" />
                      {t(`roles.${user.role}`) || user.role}
                    </span>
                  </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-mono text-primary">{user.queries_used_today || 0}</span>
                    <div className="w-12 h-1 bg-soft rounded-full overflow-hidden border border-border-subtle">
                       <div className="h-full bg-legal-red" style={{ width: `${Math.min((user.queries_used_today || 0) / 30 * 100, 100)}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-primary font-mono">{user.total_queries_all_time || 0}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {user.last_query_reset ? new Date(user.last_query_reset).toLocaleDateString() : t('common.never')}
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
