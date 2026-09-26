import Link from 'next/link';
import { IncidentState } from '@/types/incident';
import { IncidentStatusBadge } from '@/components/incidents/IncidentStatusBadge';
import { IncidentSeverityBadge } from '@/components/incidents/IncidentSeverityBadge';
import { ExternalLink, ArrowRight } from 'lucide-react';

export function RecentIncidentsTable({ incidents }: { incidents: IncidentState[] }) {
  return (
    <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-200">Recent Incident Activity</h3>
        <Link
          href="/incidents"
          className="text-xs text-indigo-400 font-semibold hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          <span>View All Directory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Incident ID</th>
              <th className="py-2.5 px-3">Title & Service</th>
              <th className="py-2.5 px-3">Severity</th>
              <th className="py-2.5 px-3">Runbook</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {incidents.slice(0, 5).map((inc) => (
              <tr key={inc.incidentId} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-indigo-400">
                  <Link href={`/incidents/${inc.incidentId}`} className="hover:underline">
                    {inc.incidentId}
                  </Link>
                </td>
                <td className="py-3 px-3">
                  <p className="font-semibold text-slate-200 truncate max-w-xs">{inc.intake.title}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{inc.intake.serviceName} ({inc.intake.environment})</p>
                </td>
                <td className="py-3 px-3">
                  <IncidentSeverityBadge severity={inc.intake.severity} />
                </td>
                <td className="py-3 px-3 font-mono text-slate-300">
                  {inc.selectedRunbook?.title || 'Matching...'}
                </td>
                <td className="py-3 px-3">
                  <IncidentStatusBadge status={inc.status} />
                </td>
                <td className="py-3 px-3 text-right">
                  <Link
                    href={`/incidents/${inc.incidentId}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 font-medium transition-colors"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
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
