'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { IncidentState } from '@/types/incident';
import { IncidentService } from '@/services/incident-service';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { SeverityDistribution } from '@/components/dashboard/SeverityDistribution';
import { RecentIncidentsTable } from '@/components/dashboard/RecentIncidentsTable';
import { ApprovalCard } from '@/components/approvals/ApprovalCard';
import Link from 'next/link';
import {
  PlusCircle,
  ShieldAlert,
  RefreshCw,
  Zap,
  ArrowRight,
  Filter,
  Brain,
  Terminal,
  ShieldCheck,
  RotateCw,
  FileText,
  Activity,
  LogIn,
  UserPlus,
} from 'lucide-react';

const CATEGORY_PILLS = [
  { id: 'ALL', label: 'All Incidents' },
  { id: 'CPU', label: 'High CPU Runbooks →' },
  { id: 'AVAILABILITY', label: 'Service Availability →' },
  { id: 'DATABASE', label: 'Database Pools →' },
  { id: 'APPROVAL', label: 'Human Gates' },
  { id: 'RESOLVED', label: 'Verified Audits' },
];

const PLATFORM_FEATURES = [
  {
    title: '1. Incident Telemetry Intake',
    description: 'Ingests Datadog, Prometheus, and PagerDuty telemetry alerts with severity & environment classification.',
    icon: Activity,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/30 glow-indigo',
  },
  {
    title: '2. LLM Root Cause Diagnosis',
    description: 'Analyzes error traces, scores confidence (>90%), and matches incidents to specialized runbooks.',
    icon: Brain,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/30 glow-cyan',
  },
  {
    title: '3. MCP Diagnostic Tool Execution',
    description: 'Runs non-destructive inspection tools (CPU, process inspect, health probes) automatically.',
    icon: Terminal,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30 glow-amber',
  },
  {
    title: '4. TrueForge Human Approval Gate',
    description: 'Halts workflow before state-mutating remediation, requiring human authorization & risk review.',
    icon: ShieldCheck,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/30 glow-rose',
  },
  {
    title: '5. Automated Remediation',
    description: 'Executes authorized fixes (graceful restarts, process termination, connection pool flush).',
    icon: RotateCw,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30 glow-emerald',
  },
  {
    title: '6. Structured Incident Reporting',
    description: 'Generates comprehensive post-incident execution reports downloadable as Markdown or JSON.',
    icon: FileText,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30 glow-indigo',
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
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
    if (activePill === 'AVAILABILITY')
      return (
        inc.intake.serviceName.toLowerCase().includes('gateway') ||
        inc.intake.title.toLowerCase().includes('unavailable')
      );
    if (activePill === 'DATABASE')
      return (
        inc.intake.serviceName.toLowerCase().includes('db') ||
        inc.intake.title.toLowerCase().includes('database')
      );
    if (activePill === 'APPROVAL') return inc.status === 'Awaiting Approval';
    if (activePill === 'RESOLVED') return inc.status === 'Resolved';
    return true;
  });

  const pendingApprovalIncident = incidents.find((i) => i.status === 'Awaiting Approval');

  return (
    <div className="space-y-12 pb-12">
      {/* Scrolltide Hero & Auth Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 p-8 lg:p-10 glass-card glow-indigo"
      >
        {/* Ambient background glow accents */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>TrueForge Agent Harness v0.2.0 • Autonomous SRE Ops</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-slate-100 tracking-tight leading-tight">
              Runbook Executor Agent
            </h1>

            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed font-normal">
              Autonomous production incident intake, LLM diagnosis, non-destructive diagnostic execution, human approval gates, and closed-loop verification.
            </p>
          </div>

          {/* Top Auth & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {!session && (
              <>
                <Link
                  href="/signin"
                  className="bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-all"
                >
                  <LogIn className="w-4 h-4 text-indigo-400" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up Free</span>
                </Link>
              </>
            )}

            <Link
              href="/incidents/new"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Incident</span>
            </Link>

            <button
              onClick={fetchDashboardData}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              title="Refresh Telemetry Data"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Platform Features Showcase Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-black text-slate-100 tracking-tight flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" /> Platform Architecture & Capabilities
          </h2>
          <span className="text-xs text-slate-400 font-mono">6 Core Operational Modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLATFORM_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -2 }}
                className={`p-5 rounded-2xl border ${feat.bg} glass-card glass-card-hover space-y-2`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <Icon className={`w-4 h-4 ${feat.color}`} />
                  </div>
                  <h3 className="font-bold text-sm text-slate-100">{feat.title}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-1">{feat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Scrolltide Category Filter Pills */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>The Telemetry Directory, at a glance</span>
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
          <RecentIncidentsTable incidents={filteredIncidents} />
        </div>
        <div>
          <SeverityDistribution incidents={incidents} />
        </div>
      </div>
    </div>
  );
}
