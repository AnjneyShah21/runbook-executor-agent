'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Copy,
  Check,
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleLog = (id: string) => {
    setExpandedLogs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyJSON = (id: string, obj: unknown) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
        <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
          Duration: {incident.executionDurationMs ? `${(incident.executionDurationMs / 1000).toFixed(1)}s` : 'Active'}
        </span>
      </div>

      <div className="relative pl-7 border-l-2 border-slate-800/80 space-y-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="relative group"
            >
              {/* Step indicator node */}
              <div
                className={`absolute -left-[35px] top-0 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step.status === 'COMPLETED'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 glow-emerald'
                    : step.status === 'AWAITING_APPROVAL'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 glow-amber animate-pulse'
                    : step.status === 'ACTIVE'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 glow-blue ring-4 ring-indigo-500/10'
                    : step.status === 'FAILED'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 glow-rose'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {step.status === 'COMPLETED' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : step.status === 'AWAITING_APPROVAL' ? (
                  <Clock className="w-4 h-4 text-amber-400" />
                ) : step.status === 'FAILED' ? (
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Step Card */}
              <div
                className={`p-5 rounded-2xl border transition-all duration-200 glass-card glass-card-hover ${
                  step.status === 'AWAITING_APPROVAL'
                    ? 'bg-amber-500/10 border-amber-500/50 glow-amber'
                    : step.status === 'COMPLETED'
                    ? 'bg-slate-900/80 border-slate-800/80'
                    : step.status === 'ACTIVE'
                    ? 'bg-indigo-500/10 border-indigo-500/40 glow-blue'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{step.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">{step.subtitle}</p>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase font-extrabold px-2.5 py-0.5 rounded border ${
                      step.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : step.status === 'AWAITING_APPROVAL'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
                        : step.status === 'FAILED'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>

                {step.detail && (
                  <p className="text-xs text-slate-300 mt-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 font-mono leading-relaxed">
                    {step.detail}
                  </p>
                )}

                {/* Diagnostic Logs Accordion */}
                {step.logs && step.logs.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={() => toggleLog(step.id)}
                      className="text-xs text-indigo-400 font-semibold flex items-center gap-1.5 hover:text-indigo-300 transition-colors"
                    >
                      {expandedLogs[step.id] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>{expandedLogs[step.id] ? 'Collapse Tool Output' : 'Inspect Diagnostic Tool Output Logs'}</span>
                    </button>

                    <AnimatePresence>
                      {expandedLogs[step.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 pt-2 overflow-hidden"
                        >
                          {step.logs.map((log) => (
                            <div
                              key={log.stepId}
                              className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2"
                            >
                              <div className="flex items-center justify-between text-slate-300 border-b border-slate-900 pb-2">
                                <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                                  <Terminal className="w-3.5 h-3.5" />
                                  <span>{log.stepName}</span>
                                </span>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] text-slate-500">{log.durationMs}ms</span>
                                  {log.outputResult !== undefined && log.outputResult !== null && (
                                    <button
                                      onClick={() => handleCopyJSON(log.stepId, log.outputResult)}
                                      className="text-slate-400 hover:text-indigo-300 transition-colors"
                                      title="Copy JSON"
                                    >
                                      {copiedId === log.stepId ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                              {log.outputResult !== undefined && log.outputResult !== null && (
                                <pre className="text-[11px] text-indigo-200 bg-slate-900/90 p-3 rounded-lg overflow-x-auto border border-slate-800/80 leading-relaxed">
                                  {JSON.stringify(log.outputResult, null, 2)}
                                </pre>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
