'use client';

import { useState } from 'react';
import { IncidentState } from '@/types/incident';
import { IncidentService } from '@/services/incident-service';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Terminal,
  AlertTriangle,
  UserCheck,
  RotateCw,
} from 'lucide-react';

interface ApprovalCardProps {
  incident: IncidentState;
  onDecisionSubmitted?: () => void;
}

export function ApprovalCard({ incident, onDecisionSubmitted }: ApprovalCardProps) {
  const approval = incident.approvalRequest;
  const [approverName, setApproverName] = useState('Alice Cooper (Lead SRE)');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState<'APPROVE' | 'REJECT' | null>(null);

  if (!approval) return null;

  const handleDecision = async (action: 'APPROVE' | 'REJECT') => {
    setSubmitting(true);
    if (action === 'APPROVE') {
      await IncidentService.approveIncident(
        incident.incidentId,
        approverName || 'SRE Lead Operator',
        reason || 'Authorized execution after verifying diagnostic log output.'
      );
    } else {
      await IncidentService.rejectIncident(
        incident.incidentId,
        approverName || 'SRE Lead Operator',
        reason || 'Rejected remediation action due to ongoing system window.'
      );
    }
    setSubmitting(false);
    setShowModal(null);
    if (onDecisionSubmitted) onDecisionSubmitted();
  };

  const isPending = approval.status === 'PENDING' && incident.status === 'Awaiting Approval';

  return (
    <div
      className={`p-5 rounded-xl border transition-all ${
        isPending
          ? 'bg-amber-500/10 border-amber-500/50 glow-amber'
          : approval.status === 'APPROVED'
          ? 'bg-emerald-500/10 border-emerald-500/40'
          : 'bg-rose-500/10 border-rose-500/40'
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm text-slate-100">TrueForge Human Approval Gate</h3>
        </div>
        <span
          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border ${
            isPending
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
              : approval.status === 'APPROVED'
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
          }`}
        >
          {isPending ? 'APPROVAL REQUIRED' : approval.status}
        </span>
      </div>

      {/* Main Details */}
      <div className="space-y-3 text-xs">
        <div>
          <span className="text-slate-400">Incident ID: </span>
          <span className="font-mono text-indigo-400 font-bold">{incident.incidentId}</span>
        </div>

        <div>
          <span className="text-slate-400">Proposed Action: </span>
          <p className="text-slate-200 font-semibold text-sm mt-0.5">{approval.action}</p>
        </div>

        <div>
          <span className="text-slate-400">Target Service: </span>
          <span className="font-mono text-slate-200 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {approval.targetService} ({incident.intake.environment})
          </span>
        </div>

        {approval.proposedCommand && (
          <div>
            <span className="text-slate-400">Proposed Command: </span>
            <div className="mt-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-indigo-300 font-mono text-[11px] flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <code className="overflow-x-auto">{approval.proposedCommand}</code>
            </div>
          </div>
        )}

        <div>
          <span className="text-slate-400">Expected Impact: </span>
          <p className="text-slate-300 mt-0.5 bg-slate-900/60 p-2 rounded border border-slate-800">
            {approval.expectedImpact}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="text-slate-400">Risk Assessment Level: </span>
          <span
            className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase border ${
              approval.riskLevel === 'CRITICAL' || approval.riskLevel === 'HIGH'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {approval.riskLevel} RISK
          </span>
        </div>
      </div>

      {/* Historical approval result if completed */}
      {!isPending && (
        <div className="mt-4 pt-3 border-t border-slate-800 text-xs space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Responded by: {approval.approvedBy || approval.rejectedBy || 'Operator'}</span>
            </span>
            <span className="text-[10px] text-slate-500">{new Date(approval.respondedAt || '').toLocaleString()}</span>
          </div>
          {approval.reason && <p className="text-slate-400 italic text-[11px]">&quot;{approval.reason}&quot;</p>}
        </div>
      )}

      {/* Interactive Action Buttons */}
      {isPending && (
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={() => setShowModal('APPROVE')}
            disabled={submitting}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs shadow-md shadow-emerald-600/30 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>APPROVE REMEDIATION</span>
          </button>
          <button
            onClick={() => setShowModal('REJECT')}
            disabled={submitting}
            className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs shadow-md shadow-rose-600/30 transition-all"
          >
            <XCircle className="w-4 h-4" />
            <span>REJECT ACTION</span>
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              {showModal === 'APPROVE' ? (
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              )}
              <h4 className="font-bold text-slate-100 text-base">
                {showModal === 'APPROVE' ? 'Confirm Action Approval' : 'Confirm Action Rejection'}
              </h4>
            </div>

            <p className="text-xs text-slate-300">
              {showModal === 'APPROVE'
                ? `You are authorizing TrueForge agent to execute '${approval.action}' on ${approval.targetService}.`
                : `You are rejecting the proposed remediation action for ${approval.targetService}.`}
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">SRE Operator Name</label>
                <input
                  type="text"
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Justification Reason</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    showModal === 'APPROVE'
                      ? 'Verified worker thread logs. Safe to execute PID kill.'
                      : 'Load test active. Do not interrupt.'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowModal(null)}
                disabled={submitting}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDecision(showModal)}
                disabled={submitting}
                className={`flex-1 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 ${
                  showModal === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {submitting ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : showModal === 'APPROVE' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>{showModal === 'APPROVE' ? 'Confirm Approval' : 'Confirm Rejection'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
