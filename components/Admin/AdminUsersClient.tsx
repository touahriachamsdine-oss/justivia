'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Shield, Calendar, GraduationCap, Heart, Briefcase, User } from "lucide-react";

interface AdminUsersClientProps {
  users: any[];
}

export function AdminUsersClient({ users }: AdminUsersClientProps) {
  const { t } = useLanguage();

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
            {users.map((user: any) => (
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
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight flex items-center gap-1 w-fit border ${
                    user.role === 'admin' ? 'bg-legal-red/10 text-legal-red border-legal-red/20' : 
                    user.role === 'lawyer' ? 'bg-accent-bg text-legal-red border-legal-red/20' : 
                    user.role === 'student' ? 'bg-soft text-primary border-border-subtle' : 
                    user.role === 'citizen' ? 'bg-soft text-secondary border-border-subtle' : 
                    'bg-soft text-muted'
                  }`}>
                    {user.role === 'admin' ? <Shield className="w-3 h-3" /> :
                     user.role === 'lawyer' ? <Briefcase className="w-3 h-3" /> :
                     user.role === 'student' ? <GraduationCap className="w-3 h-3" /> :
                     user.role === 'citizen' ? <User className="w-3 h-3" /> :
                     <User className="w-3 h-3" />}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
