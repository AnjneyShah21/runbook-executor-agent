'use client';

import { useState } from 'react';
import { IncidentState, ExecutionLogStep } from '@/types/incident';
import {
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Terminal,
  Activity,
  AlertOctagon,
  XCircle,
  Brain,
  Sparkles,
  Play,
} from 'lucide-react';

interface TimelineStep {
  id: string;
  title: string;
  subtitle: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING' | 'FAILED' | 'AWAITING_APPROVAL';
  logs?: ExecutionLogStep[];
  detail?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function ExecutionTimeline({ incident }: { incident: IncidentState }) {
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  const toggleLog = (id: string) => {
    setExpandedLogs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getSteps = (): TimelineStep[] => {
    const isResolved = incident.status === 'Resolved';
    const isRejected = incident.status === 'Rejected';
    const isAwaiting = incident.status === 'Awaiting Approval';
    const isRemediating = incident.status === 'Remediating';

    return [
      {
        id: 'step-1',
        title: '1. Incident Received & Ingested',
        subtitle: `Service: ${incident.intake.serviceName} | Severity: ${incident.intake.severity}`,
        status: 'COMPLETED',
        detail: incident.intake.description,
        icon: Activity,
      },
      {
        id: 'step-2',
        title: '2. LLM Diagnosis & Root Cause Analysis',
        subtitle: incident.diagnosis
          ? `Confidence: ${(incident.diagnosis.confidenceScore * 100).toFixed(0)}%`
          : 'Analyzing incident metadata...',
        status: incident.diagnosis ? 'COMPLETED' : 'ACTIVE',
        detail: incident.diagnosis?.probableCause || 'Analyzing error traces and log metrics.',
        icon: Brain,
      },
      {
        id: 'step-3',
        title: '3. Runbook Selected',
        subtitle: incident.selectedRunbook?.title || 'Matching Specialized Runbook...',
        status: incident.selectedRunbook ? 'COMPLETED' : 'PENDING',
        detail: incident.selectedRunbook?.description || 'Matched based on incident signatures.',
        icon: Sparkles,
      },
      {
        id: 'step-4',
        title: '4. MCP Diagnostic Tool Execution',
        subtitle: `${incident.executionLogs.filter((l) => l.type === 'DIAGNOSTIC').length} Diagnostic Checks Executed`,
        status: 'COMPLETED',
        logs: incident.executionLogs.filter((l) => l.type === 'DIAGNOSTIC'),
        icon: Terminal,
      },
      {
        id: 'step-5',
        title: '5. TrueForge Human Approval Gate',
        subtitle: incident.approvalRequest
          ? `Action: ${incident.approvalRequest.action} (${incident.approvalRequest.status})`
          : 'Human Approval Gate',
        status: isAwaiting
          ? 'AWAITING_APPROVAL'
          : isRejected
          ? 'FAILED'
          : incident.approvalRequest?.status === 'APPROVED'
          ? 'COMPLETED'
          : 'PENDING',
        detail: incident.approvalRequest
          ? `Target: ${incident.approvalRequest.targetService} | Proposed: ${incident.approvalRequest.proposedCommand}`
          : undefined,
        icon: ShieldCheck,
      },
      {
        id: 'step-6',
        title: '6. Automated Remediation Execution',
        subtitle: incident.remediationResult
          ? incident.remediationResult.actionExecuted
          : isRemediating
          ? 'Executing approved remediation command...'
          : 'Awaiting prior step completion',
        status: incident.remediationResult
          ? 'COMPLETED'
          : isRemediating
          ? 'ACTIVE'
          : isRejected
          ? 'FAILED'
          : 'PENDING',
        detail: incident.remediationResult?.outputDetails,
        icon: Play,
      },
      {
        id: 'step-7',
        title: '7. Closed-Loop Verification & Resolution',
        subtitle: incident.verificationResult
          ? incident.verificationResult.details
          : isResolved
          ? 'Verification Passed'
          : 'Final Status Verification',
        status: isResolved ? 'COMPLETED' : isRejected ? 'FAILED' : 'PENDING',
        detail: incident.verificationResult?.details,
        icon: isResolved ? CheckCircle2 : isRejected ? XCircle : Clock,
      },
    ];
  };

  const steps = getSteps();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" /> Runbook Execution Timeline
        </h3>
        <span className="text-xs text-slate-400 font-mono">
          Duration: {incident.executionDurationMs ? `${(incident.executionDurationMs / 1000).toFixed(1)}s` : 'Active'}
        </span>
      </div>

      <div className="relative pl-6 border-l-2 border-slate-800 space-y-8">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative group">
              {/* Step indicator node */}
              <div
                className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.status === 'COMPLETED'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : step.status === 'AWAITING_APPROVAL'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 animate-pulse'
                    : step.status === 'ACTIVE'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                    : step.status === 'FAILED'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {step.status === 'COMPLETED' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : step.status === 'AWAITING_APPROVAL' ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : step.status === 'FAILED' ? (
                  <AlertOctagon className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
              </div>

              {/* Step Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  step.status === 'AWAITING_APPROVAL'
                    ? 'bg-amber-500/10 border-amber-500/40 glow-amber'
                    : step.status === 'COMPLETED'
                    ? 'bg-slate-900/80 border-slate-800'
                    : step.status === 'ACTIVE'
                    ? 'bg-indigo-500/10 border-indigo-500/40 glow-blue'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{step.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{step.subtitle}</p>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                      step.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : step.status === 'AWAITING_APPROVAL'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : step.status === 'FAILED'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>

                {step.detail && (
                  <p className="text-xs text-slate-300 mt-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-mono">
                    {step.detail}
                  </p>
                )}

                {/* Diagnostic Logs Accordion */}
                {step.logs && step.logs.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={() => toggleLog(step.id)}
                      className="text-xs text-indigo-400 font-medium flex items-center gap-1 hover:text-indigo-300 transition-colors"
                    >
                      {expandedLogs[step.id] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>{expandedLogs[step.id] ? 'Hide Diagnostic Output' : 'Inspect Tool Diagnostic Output'}</span>
                    </button>

                    {expandedLogs[step.id] && (
                      <div className="space-y-2 pt-2">
                        {step.logs.map((log) => (
                          <div
                            key={log.stepId}
                            className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-slate-300">
                              <span className="font-bold text-indigo-400">{log.stepName}</span>
                              <span className="text-[10px] text-slate-500">{log.durationMs}ms</span>
                            </div>
                            {log.outputResult !== undefined && log.outputResult !== null && (
                              <pre className="text-[11px] text-slate-400 bg-slate-900/90 p-2 rounded overflow-x-auto border border-slate-800">
                                {JSON.stringify(log.outputResult, null, 2)}
                              </pre>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
