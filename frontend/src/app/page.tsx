'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IncidentState } from '@/types/incident';
import { IncidentService } from '@/services/incident-service';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { SeverityDistribution } from '@/components/dashboard/SeverityDistribution';
import { RecentIncidentsTable } from '@/components/dashboard/RecentIncidentsTable';
import { ApprovalCard } from '@/components/approvals/ApprovalCard';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { InteractiveBentoGrid } from '@/components/aceternity/InteractiveBentoGrid';
import { SpotlightCard } from '@/components/aceternity/SpotlightCard';
import Link from 'next/link';
import { PlusCircle, ShieldAlert, RefreshCw, Zap, ArrowRight, Filter, Sparkles, CheckCircle2 } from 'lucide-react';

const CATEGORY_PILLS = [
  { id: 'ALL', label: 'All Incidents' },
  { id: 'CPU', label: 'High CPU Runbooks →' },
  { id: 'AVAILABILITY', label: 'Service Availability →' },
  { id: 'DATABASE', label: 'Database Pools →' },
  { id: 'APPROVAL', label: 'Human Gates' },
  { id: 'RESOLVED', label: 'Verified Audits' },
];

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<IncidentState[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePill, setActivePill] = useState('ALL');

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

  const filteredIncidents = incidents.filter((inc) => {
    if (activePill === 'ALL') return true;
    if (activePill === 'CPU') return inc.intake.title.toLowerCase().includes('cpu');
    if (activePill === 'AVAILABILITY') return inc.intake.serviceName.toLowerCase().includes('gateway') || inc.intake.title.toLowerCase().includes('unavailable');
    if (activePill === 'DATABASE') return inc.intake.serviceName.toLowerCase().includes('db') || inc.intake.title.toLowerCase().includes('database');
    if (activePill === 'APPROVAL') return inc.status === 'Awaiting Approval';
    if (activePill === 'RESOLVED') return inc.status === 'Resolved';
    return true;
  });

  const pendingApprovalIncident = incidents.find((i) => i.status === 'Awaiting Approval');

  return (
    <div className="relative space-y-12 pb-16">
      {/* Aceternity Background Beams */}
      <BackgroundBeams />

      {/* Hero Banner with Glassmorphic Spotlight Glow */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-slate-950/90 via-indigo-950/40 to-slate-950/90 p-8 lg:p-12 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>TrueForge Agent Harness v0.2.0 • Autonomous SRE Ops</span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Automated Incident Diagnosis & Runbook Remediation
            </h1>

            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed font-normal">
              Continuous telemetry ingestion, LLM root cause analysis, non-destructive MCP diagnostics, and human-in-the-loop authorization gate.
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>3 Simulated Runbooks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Human-in-the-Loop Gate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Closed-Loop Verification</span>
              </div>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/incidents/new"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-6 py-4 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/50 active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Production Incident</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <button
              onClick={fetchDashboardData}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Refresh Telemetry Data"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Telemetry</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Category Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>The Telemetry Library, at a glance</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">{filteredIncidents.length} Filtered Results</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_PILLS.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActivePill(pill.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activePill === pill.id
                  ? 'bg-slate-100 text-slate-950 shadow-lg shadow-indigo-500/20 scale-105'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

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
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm tracking-wide uppercase">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <span>TrueForge Gate Action Required</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Incident ID: {pendingApprovalIncident.incidentId}</span>
          </div>

          <ApprovalCard
            incident={pendingApprovalIncident}
            onDecisionSubmitted={fetchDashboardData}
          />
        </motion.div>
      )}

      {/* Aceternity Interactive Bento Grid */}
      <InteractiveBentoGrid />

      {/* Analytics & Table Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentIncidentsTable incidents={filteredIncidents} />
        </div>
        <div className="lg:col-span-1">
          <SeverityDistribution incidents={incidents} />
        </div>
      </div>
    </div>
  );
}
