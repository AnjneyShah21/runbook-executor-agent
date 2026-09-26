'use client';

import { motion } from 'framer-motion';
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
      subtitle: 'Ingested telemetry events',
      icon: Activity,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/30 glow-indigo',
      glow: 'glow-indigo',
    },
    {
      title: 'Active Incidents',
      value: active,
      subtitle: 'Processing in agent workflow',
      icon: AlertTriangle,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30 glow-cyan',
      glow: 'glow-cyan',
    },
    {
      title: 'Awaiting Approval',
      value: awaiting,
      subtitle: 'Paused at TrueForge Gate',
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30 glow-amber',
      glow: 'glow-amber',
      highlight: awaiting > 0,
    },
    {
      title: 'Resolved Incidents',
      value: resolved,
      subtitle: 'Closed-loop verified',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30 glow-emerald',
      glow: 'glow-emerald',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            whileHover={{ y: -3, scale: 1.01 }}
            className={`p-5 rounded-2xl border ${card.bg} glass-card transition-all duration-300 relative overflow-hidden group`}
          >
            {/* Top ambient glow light */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all duration-300" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-100 tracking-tight">{card.value}</span>
              {card.highlight && (
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  Sign-Off Needed
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-1 font-medium">{card.subtitle}</p>

            {/* Micro visual meter */}
            <div className="w-full h-1 bg-slate-950 rounded-full mt-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (card.value / (total || 1)) * 100)}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`h-full ${card.color.replace('text-', 'bg-')}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
