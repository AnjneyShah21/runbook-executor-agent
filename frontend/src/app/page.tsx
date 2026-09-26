'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IncidentState } from '@/types/incident';
import { IncidentService } from '@/services/incident-service';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { SeverityDistribution } from '@/components/dashboard/SeverityDistribution';
import { RecentIncidentsTable } from '@/components/dashboard/RecentIncidentsTable';
import { ApprovalCard } from '@/components/approvals/ApprovalCard';
import Link from 'next/link';
import { PlusCircle, ShieldAlert, RefreshCw, Zap, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<IncidentState[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    const { incidents: data } = await IncidentService.getAllIncidents();
    setIncidents(data);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const { incidents: data } = await IncidentService.getAllIncidents();
      if (!active) return;
      setIncidents(data);
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const pendingApprovalIncident = incidents.find((i) => i.status === 'Awaiting Approval');

  return (
    <div className="space-y-10 pb-10">
      {/* Scrolltide Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 p-8 lg:p-10 glass-card glow-indigo"
      >
        {/* Ambient background glow accents */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>TrueForge Agent Harness v0.2.0 • Autonomous SRE Ops</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-slate-100 tracking-tight leading-tight">
              Automated Incident Diagnosis & Runbook Remediation
            </h1>

            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed font-normal">
              Continuous telemetry ingestion, LLM root cause analysis, non-destructive MCP diagnostics, and human-in-the-loop authorization gate.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/incidents/new"
              className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Production Incident</span>
            </Link>

            <button
              onClick={fetchDashboardData}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              title="Refresh Telemetry Data"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Status</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards Grid */}
      <StatsCards incidents={incidents} />

      {/* Human Approval Alert Banner if pending */}
      {pendingApprovalIncident && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 animate-bounce" /> Attention Required: Human Approval Gate Paused
            </h2>
            <Link
              href="/approvals"
              className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1"
            >
              <span>View Approval Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ApprovalCard incident={pendingApprovalIncident} onDecisionSubmitted={fetchDashboardData} />
        </motion.div>
      )}

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentIncidentsTable incidents={incidents} />
        </div>
        <div>
          <SeverityDistribution incidents={incidents} />
        </div>
      </div>
    </div>
  );
}
