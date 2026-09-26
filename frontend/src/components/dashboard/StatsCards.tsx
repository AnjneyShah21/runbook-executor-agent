import { IncidentState } from '@/types/incident';
import { AlertTriangle, Clock, CheckCircle2, Activity } from 'lucide-react';

export function StatsCards({ incidents }: { incidents: IncidentState[] }) {
  const total = incidents.length;
  const awaiting = incidents.filter((i) => i.status === 'Awaiting Approval').length;
  const active = incidents.filter(
    (i) => i.status !== 'Resolved' && i.status !== 'Rejected' && i.status !== 'Unresolved'
  ).length;
  const resolved = incidents.filter((i) => i.status === 'Resolved').length;

  const cards = [
    {
      title: 'Total Incidents',
      value: total,
      subtitle: 'Ingested by agent',
      icon: Activity,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/30',
    },
    {
      title: 'Active Incidents',
      value: active,
      subtitle: 'Currently processing',
      icon: AlertTriangle,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30',
    },
    {
      title: 'Awaiting Approval',
      value: awaiting,
      subtitle: 'Human gate paused',
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30 glow-amber',
      highlight: awaiting > 0,
    },
    {
      title: 'Resolved Incidents',
      value: resolved,
      subtitle: 'Verified operational',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`p-5 rounded-xl border ${card.bg} backdrop-blur-md transition-all duration-200 hover:scale-[1.01]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</span>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-100">{card.value}</span>
              {card.highlight && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  Action Needed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
