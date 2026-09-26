'use client';

import { useState, useEffect, use } from 'react';
import { IncidentState } from '@/types/incident';
import { IncidentService } from '@/services/incident-service';
import { IncidentStatusBadge } from '@/components/incidents/IncidentStatusBadge';
import { IncidentSeverityBadge } from '@/components/incidents/IncidentSeverityBadge';
import { ExecutionTimeline } from '@/components/execution/ExecutionTimeline';
import { ApprovalCard } from '@/components/approvals/ApprovalCard';
import { BlastRadiusCard } from '@/components/approvals/BlastRadiusCard';
import { TerminalLogTrace } from '@/components/execution/TerminalLogTrace';
import { PostMortemExporter } from '@/components/execution/PostMortemExporter';
import Link from 'next/link';
import {
  ArrowLeft,
  Brain,
  FileText,
  Clock,
  Sparkles,
  RefreshCw,
  Server,
  ShieldAlert,
} from 'lucide-react';

export default function IncidentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const incidentId = resolvedParams.id;

  const [incident, setIncident] = useState<IncidentState | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    setLoading(true);
    const { incident: data } = await IncidentService.getIncidentById(incidentId);
    setIncident(data);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const { incident: data } = await IncidentService.getIncidentById(incidentId);
      if (!active) return;
      setIncident(data);
      setLoading(false);
    };
    load();

    const interval = setInterval(async () => {
      const { incident: data } = await IncidentService.getIncidentById(incidentId);
      if (active) {
        setIncident(data);
      }
    }, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [incidentId]);

  if (loading && !incident) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Fetching incident telemetry from TrueForge...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-200">Incident Not Found</h2>
        <p className="text-xs text-slate-400">Incident ID &apos;{incidentId}&apos; could not be retrieved.</p>
        <Link
          href="/incidents"
          className="inline-flex items-center gap-2 text-xs text-indigo-400 font-semibold hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Incidents Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <Link
            href="/incidents"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100 tracking-tight">{incident.intake.title}</h1>
            <span className="font-mono text-xs font-bold text-indigo-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              {incident.incidentId}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-slate-500" />
              <span>Service:</span>
              <strong className="text-slate-200">{incident.intake.serviceName}</strong>
            </span>
            <span>•</span>
            <span>Env: <strong className="text-slate-200">{incident.intake.environment}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Created: {new Date(incident.startedAt).toLocaleString()}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <IncidentSeverityBadge severity={incident.intake.severity} />
          <IncidentStatusBadge status={incident.status} />
          <Link
            href={`/reports`}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Incident Report</span>
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: AI Diagnosis & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* AI Diagnosis Card */}
          <div className="p-5 rounded-xl border border-indigo-500/30 bg-slate-900/80 backdrop-blur-md glow-blue space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-100">LLM Diagnosis & Root Cause Assessment</h3>
              </div>
              {incident.diagnosis?.confidenceScore && (
                <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {(incident.diagnosis.confidenceScore * 100).toFixed(0)}% Confidence
                </span>
              )}
            </div>

            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Probable Root Cause</span>
              <p className="text-xs font-semibold text-slate-200 mt-1 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
                {incident.diagnosis?.probableCause || 'Diagnosis in progress...'}
              </p>
            </div>

            {incident.diagnosis?.summary && (
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Agent Executive Summary</span>
                <p className="text-xs text-slate-300 mt-1">{incident.diagnosis.summary}</p>
              </div>
            )}

            {incident.selectedRunbook && (
              <div className="flex items-center gap-2 pt-1">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-400">Selected Runbook: </span>
                <span className="text-xs font-bold text-cyan-300 font-mono">
                  {incident.selectedRunbook.title} ({incident.selectedRunbook.id})
                </span>
              </div>
            )}
          </div>

          {/* AI Blast Radius & Impact Predictor */}
          <BlastRadiusCard blastRadius={incident.approvalRequest?.blastRadius} serviceName={incident.intake.serviceName} />

          {/* Live Diagnostic Terminal Sandbox & Trace Replay */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Live Diagnostic Terminal Sandbox & Trace Replay
            </h3>
            <TerminalLogTrace logs={incident.executionLogs} serviceName={incident.intake.serviceName} />
          </div>

          {/* Visual Execution Timeline */}
          <ExecutionTimeline incident={incident} />

          {/* Post-Mortem & Webhook Dispatcher */}
          <PostMortemExporter incident={incident} />
        </div>

        {/* Right Col: Approval Card & Incident Specs */}
        <div className="space-y-6">
          {/* Approval Card */}
          {incident.approvalRequest ? (
            <ApprovalCard incident={incident} onDecisionSubmitted={fetchDetails} />
          ) : (
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <ShieldAlert className="w-4 h-4 text-slate-400" />
                <span>TrueForge Gate Status</span>
              </div>
              <p className="text-slate-400">
                Non-destructive diagnostic tools executed automatically. No pending state-mutating actions requiring human sign-off.
              </p>
            </div>
          )}

          {/* Telemetry Intake Context */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3 text-xs">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2">Ingestion Metadata</h3>
            <div>
              <span className="text-slate-400">Alert Description:</span>
              <p className="text-slate-300 font-mono text-[11px] mt-1 bg-slate-950 p-2.5 rounded border border-slate-800">
                {incident.intake.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
              <div>
                <span className="text-slate-500">Service:</span>
                <p className="font-semibold text-slate-300 font-mono">{incident.intake.serviceName}</p>
              </div>
              <div>
                <span className="text-slate-500">Environment:</span>
                <p className="font-semibold text-slate-300 font-mono">{incident.intake.environment}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
