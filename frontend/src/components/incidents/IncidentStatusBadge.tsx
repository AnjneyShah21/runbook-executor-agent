import { IncidentStatus } from '@/types/incident';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  XCircle,
  BrainCircuit,
  BookOpen,
} from 'lucide-react';

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  switch (status) {
    case 'Resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Resolved</span>
        </span>
      );
    case 'Awaiting Approval':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/40 animate-pulse">
          <Clock className="w-3.5 h-3.5" />
          <span>Awaiting Approval</span>
        </span>
      );
    case 'Remediating':
    case 'Executing Diagnostics':
    case 'Verifying':
    case 'Analyzing':
    case 'Diagnosing':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
          <RotateCw className="w-3.5 h-3.5 animate-spin" />
          <span>{status}</span>
        </span>
      );
    case 'Runbook Selected':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Runbook Selected</span>
        </span>
      );
    case 'Rejected':
    case 'Unresolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <XCircle className="w-3.5 h-3.5" />
          <span>{status}</span>
        </span>
      );
    case 'Partially Resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Partially Resolved</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>{status}</span>
        </span>
      );
  }
}
