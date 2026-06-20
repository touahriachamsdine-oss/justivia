'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Search, AlertTriangle, TrendingUp, Zap, Globe, Award } from "lucide-react";
import Link from 'next/link';

interface AdminOverviewClientProps {
  stats: {
    totalUsers: number;
    totalQueries: number;
    recentQueriesCount: number;
    flaggedQueries: number;
  };
  recentQueries: any[];
  userDistribution: any[];
  mostSearched: any[];
  systemStats: {
    avgResponseTime: number;
    languageDist: any[];
    activeUsers: any[];
  };
}

export function AdminOverviewClient({ 
  stats, 
  recentQueries, 
  userDistribution,
  mostSearched,
  systemStats
}: AdminOverviewClientProps) {
  const { t } = useLanguage();

  const statCards = [
    { label: t('admin.stats.totalUsers'), value: stats.totalUsers, icon: Users, color: "text-primary", bg: "bg-soft" },
    { label: t('admin.stats.totalQueries'), value: stats.totalQueries, icon: Search, color: "text-legal-red", bg: "bg-accent-bg" },
    { label: t('admin.stats.queries24h'), value: stats.recentQueriesCount, icon: TrendingUp, color: "text-primary", bg: "bg-soft" },
    { label: t('admin.stats.flagged'), value: stats.flaggedQueries, icon: AlertTriangle, color: "text-legal-red", bg: "bg-accent-bg" },
  ];

  const getRoleBarColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-legal-red',
      lawyer: 'bg-legal-red/80',
      student: 'bg-amber-500',
      citizen: 'bg-slate-500',
      company: 'bg-blue-500',
      judge: 'bg-purple-500',
      notary: 'bg-emerald-500',
      bailiff: 'bg-rose-500',
      jurist: 'bg-indigo-500',
      expert: 'bg-cyan-500',
      clerk: 'bg-teal-500',
      enthusiast: 'bg-pink-500',
      academic: 'bg-lime-500',
      administration: 'bg-sky-500',
      customs: 'bg-orange-500',
      tax_inspector: 'bg-violet-500',
      translator: 'bg-fuchsia-500',
      police: 'bg-red-500',
    };
    return colors[role] || 'bg-muted';
  };

  const getRoleBadgeClass = (role: string) => {
    const badges: Record<string, string> = {
      admin: 'bg-legal-red/10 text-legal-red border-legal-red/20',
      lawyer: 'bg-accent-bg text-legal-red border-legal-red/20',
      student: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      citizen: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
      company: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      judge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      notary: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      bailiff: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      jurist: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      expert: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      clerk: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      enthusiast: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
      academic: 'bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20',
      administration: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      customs: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
      tax_inspector: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
      translator: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20',
      police: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    };
    return badges[role] || 'bg-soft text-muted border-border-subtle';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-legal-red/20 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-xs font-black uppercase tracking-widest">{card.label}</p>
                <h3 className="text-4xl font-black text-primary mt-2 tabular-nums font-cairo uppercase">{card.value.toLocaleString()}</h3>
              </div>
              <div className={`p-4 rounded-xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-300 border border-border-subtle`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Most Searched Queries */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-24 h-24 text-legal-red rotate-12" />
          </div>
          <h3 className="text-xl font-black text-primary mb-6 flex items-center gap-3 relative z-10 font-cairo uppercase">
            <div className="p-2 bg-accent-bg rounded-lg border border-legal-red/10">
              <Search className="w-5 h-5 text-legal-red" />
            </div>
            {t('admin.stats.mostSearched')}
          </h3>
          <div className="space-y-4 relative z-10">
            {mostSearched.map((s: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-4 bg-soft/50 rounded-xl border border-border-subtle hover:bg-soft transition-colors group/item">
                <div className="flex items-center gap-3">
                  <span className="text-legal-red font-black text-lg w-6 font-cairo">#{i+1}</span>
                  <span className="text-secondary font-bold font-cairo">&quot;{s.query}&quot;</span>
                </div>
                <span className="bg-card text-muted px-3 py-1 rounded-full text-xs font-black border border-border uppercase">
                  {s.search_count} searches
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pure Statistics / System Insights */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm lg:col-span-2">
          <h3 className="text-xl font-black text-primary mb-6 flex items-center gap-3 font-cairo uppercase">
            <div className="p-2 bg-soft rounded-lg border border-border-subtle">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            {t('admin.stats.systemStats')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Avg Response Time */}
              <div className="p-5 bg-soft/50 rounded-xl border border-border-subtle">
                <p className="text-secondary text-sm font-bold flex items-center gap-2 mb-2 font-inter">
                  <Zap className="w-4 h-4 text-legal-red" /> {t('admin.stats.avgResponseTime')}
                </p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-3xl font-black text-primary font-cairo">{systemStats.avgResponseTime}</h4>
                  <span className="text-muted font-bold font-inter">ms</span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-soft rounded-full overflow-hidden">
                  <div className="h-full bg-legal-red" style={{ width: '65%' }} />
                </div>
              </div>

              {/* Language Distribution */}
              <div className="p-5 bg-soft/50 rounded-xl border border-border-subtle">
                <p className="text-secondary text-sm font-bold flex items-center gap-2 mb-4 font-inter">
                  <Globe className="w-4 h-4 text-legal-red" /> {t('admin.stats.languageUsage')}
                </p>
                <div className="flex flex-wrap gap-4">
                  {systemStats.languageDist.map((l: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl border border-border shadow-sm">
                      <span className="uppercase text-legal-red font-black font-cairo text-sm">{l.language}</span>
                      <span className="text-secondary font-bold font-inter">{l.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Most Active Users */}
            <div className="space-y-4">
               <p className="text-secondary text-sm font-bold flex items-center gap-2 px-2 font-inter">
                  <Award className="w-4 h-4 text-legal-red" /> {t('admin.stats.activeUsers')}
               </p>
               <div className="space-y-3">
                 {systemStats.activeUsers.map((u: any, i: number) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-soft/30 rounded-xl border border-border-subtle hover:bg-soft transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-bg flex items-center justify-center text-legal-red font-black text-xs border border-legal-red/10 font-cairo">
                          {u.name[0]}
                        </div>
                        <span className="text-secondary font-bold font-inter">{u.name}</span>
                     </div>
                     <span className="text-muted text-xs font-bold font-inter">{u.query_count} queries</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Queries Preview */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-black text-primary mb-6 flex items-center gap-2 font-cairo uppercase">
            <Search className="w-5 h-5 text-legal-red" />
            {t('admin.recentQueries')}
          </h3>
          <div className="space-y-3">
            {recentQueries.map((q: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-4 bg-soft/50 rounded-xl border border-border-subtle hover:bg-soft transition-all text-sm group">
                <span className="text-secondary truncate max-w-[300px] font-bold font-cairo group-hover:text-legal-red transition-colors text-base">&quot;{q.query}&quot;</span>
                <div className="flex gap-4 text-muted text-xs items-center font-bold font-inter">
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight border ${getRoleBadgeClass(q.user_role)}`}>
                     {t(`roles.${q.user_role}`) || q.user_role}
                   </span>
                   <span>{new Date(q.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/queries" className="block text-center mt-6 text-legal-red text-sm font-black hover:bg-legal-red hover:text-white transition-all uppercase tracking-widest bg-accent-bg py-3.5 rounded-xl border border-legal-red/10 font-cairo shadow-sm">
            {t('admin.viewAll')}
          </Link>
        </div>

        {/* User Distribution */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-black text-primary mb-6 flex items-center gap-2 font-cairo uppercase">
            <Users className="w-5 h-5 text-legal-red" />
            {t('admin.userDistribution')}
          </h3>
          <div className="space-y-6">
             {userDistribution.map((r: any, i: number) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-sm font-bold font-inter">
                    <span className="text-muted font-black uppercase tracking-wider">{t(`roles.${r.role}`) || r.role}</span>
                    <span className="text-primary">{r.count}</span>
                  </div>
                  <div className="h-3 w-full bg-soft rounded-full overflow-hidden border border-border-subtle shadow-inner">
                    <div 
                      className={`h-full transition-all duration-1000 ${getRoleBarColor(r.role)}`} 
                      style={{ width: `${(r.count / (stats.totalUsers || 1)) * 100}%` }}
                    />
                  </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
