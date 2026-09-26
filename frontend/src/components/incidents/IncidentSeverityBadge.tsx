import { IncidentSeverity } from '@/types/incident';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';

export function IncidentSeverityBadge({ severity }: { severity: IncidentSeverity }) {
  switch (severity) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40">
          <ShieldAlert className="w-3 h-3" />
          <span>CRITICAL</span>
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/40">
          <AlertTriangle className="w-3 h-3" />
          <span>HIGH</span>
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <AlertTriangle className="w-3 h-3" />
          <span>MEDIUM</span>
        </span>
      );
    case 'LOW':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
          <Info className="w-3 h-3" />
          <span>LOW</span>
        </span>
      );
  }
}
