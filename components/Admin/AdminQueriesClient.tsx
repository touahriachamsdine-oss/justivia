'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";

interface AdminQueriesClientProps {
  queries: any[];
}

export function AdminQueriesClient({ queries }: AdminQueriesClientProps) {
  const { t } = useLanguage();

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
            {queries.map((q: any) => (
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
                    <span className="text-[10px] text-legal-red uppercase bg-accent-bg px-1.5 py-0.5 rounded w-fit border border-legal-red/10">{t(`roles.${q.user_role}`) || q.user_role}</span>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
