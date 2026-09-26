'use client';

import { useState, useEffect } from 'react';
import { IncidentState } from '@/types/incident';
import { IncidentService } from '@/services/incident-service';
import { ApprovalCard } from '@/components/approvals/ApprovalCard';
import { ShieldCheck, Clock, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export default function ApprovalCenterPage() {
  const [incidents, setIncidents] = useState<IncidentState[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    setLoading(true);
    const { incidents: data } = await IncidentService.getAllIncidents();
    setIncidents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const pendingApprovals = incidents.filter(
    (i) => i.status === 'Awaiting Approval' || i.approvalRequest?.status === 'PENDING'
  );
  const completedApprovals = incidents.filter(
    (i) => i.approvalRequest && i.approvalRequest.status !== 'PENDING'
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Human Approval Center</h1>
            {pendingApprovals.length > 0 && (
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                {pendingApprovals.length} Pending Sign-Off
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review, authorize, or reject state-mutating remediation actions proposed by TrueForge Agent.
          </p>
        </div>

        <button
          onClick={fetchApprovals}
          className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors self-start sm:self-auto"
          title="Refresh Approval Requests"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Pending Approvals Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4" /> Pending Approval Gates ({pendingApprovals.length})
        </h2>

        {pendingApprovals.length === 0 ? (
          <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-300">All Human Approval Gates Cleared</p>
            <p className="text-xs text-slate-500">There are currently no remediation actions waiting for authorization.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingApprovals.map((inc) => (
              <ApprovalCard key={inc.incidentId} incident={inc} onDecisionSubmitted={fetchApprovals} />
            ))}
          </div>
        )}
      </div>

      {/* Historical Approvals Section */}
      {completedApprovals.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" /> Audit Log: Completed Approval Decisions ({completedApprovals.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedApprovals.map((inc) => (
              <ApprovalCard key={inc.incidentId} incident={inc} onDecisionSubmitted={fetchApprovals} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
