import Link from 'next/link';
import { IncidentState } from '@/types/incident';
import { IncidentStatusBadge } from '@/components/incidents/IncidentStatusBadge';
import { IncidentSeverityBadge } from '@/components/incidents/IncidentSeverityBadge';
import { ExternalLink, ArrowRight } from 'lucide-react';

export function RecentIncidentsTable({ incidents }: { incidents: IncidentState[] }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md space-y-4 glass-card">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-slate-100 tracking-wide">Recent Incident Activity</h3>
        <Link
          href="/incidents"
          className="text-xs text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          <span>View All Directory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/40">
              <th className="py-3 px-3 whitespace-nowrap">Incident ID</th>
              <th className="py-3 px-3">Title & Service</th>
              <th className="py-3 px-3 whitespace-nowrap">Severity</th>
              <th className="py-3 px-3 whitespace-nowrap">Selected Runbook</th>
              <th className="py-3 px-3 whitespace-nowrap">Status</th>
              <th className="py-3 px-3 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {incidents.slice(0, 5).map((inc) => (
              <tr key={inc.incidentId} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-3 font-mono font-extrabold text-indigo-400 whitespace-nowrap">
                  <Link href={`/incidents/${inc.incidentId}`} className="hover:underline">
                    {inc.incidentId}
                  </Link>
                </td>
                <td className="py-3.5 px-3">
                  <p className="font-bold text-slate-100 truncate max-w-xs">{inc.intake.title}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{inc.intake.serviceName} ({inc.intake.environment})</p>
                </td>
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <IncidentSeverityBadge severity={inc.intake.severity} />
                </td>
                <td className="py-3.5 px-3 font-mono text-slate-200 whitespace-nowrap">
                  {inc.selectedRunbook?.title || 'Matching...'}
                </td>
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <IncidentStatusBadge status={inc.status} />
                </td>
                <td className="py-3.5 px-3 text-right whitespace-nowrap">
                  <Link
                    href={`/incidents/${inc.incidentId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600 hover:text-white text-indigo-300 font-semibold border border-indigo-500/30 transition-all"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
