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
import {
  PlusCircle,
  ShieldAlert,
  RefreshCw,
  Zap,
  ArrowRight,
  Filter,
  UserCheck,
} from 'lucide-react';

const CATEGORY_PILLS = [
  { id: 'ALL', label: 'All Incidents' },
  { id: 'CPU', label: 'High CPU Runbooks →' },
  { id: 'AVAILABILITY', label: 'Service Availability →' },
  { id: 'DATABASE', label: 'Database Pools →' },
  { id: 'APPROVAL', label: 'Human Gates' },
  { id: 'RESOLVED', label: 'Verified Audits' },
];

export default function OperationalDashboardPage() {
  const [incidents, setIncidents] = useState<IncidentState[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePill, setActivePill] = useState('ALL');
  const [userDesignation] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sre_user_designation') || 'Lead SRE';
    }
    return 'Lead SRE';
  });

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
    <div className="space-y-10 pb-12">
      {/* Dashboard Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 p-8 glass-card glow-indigo"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> SRE Operational Workspace
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                Role: <strong className="text-slate-100">{userDesignation}</strong>
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-100 tracking-tight">
              Production Incident Telemetry & Gate Controls
            </h1>
            <p className="text-xs text-slate-300">
              Active incident queue, automated MCP diagnostic traces, human authorization gates, and runbook execution metrics.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/incidents/new"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Incident</span>
            </Link>

            <button
              onClick={fetchDashboardData}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
              title="Refresh Telemetry Data"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Category Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Telemetry Filter</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">{filteredIncidents.length} Incidents Filtered</span>
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

      {/* Stats Overview */}
      <StatsCards incidents={incidents} />

      {/* Pending Approval Banner */}
      {pendingApprovalIncident && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 animate-bounce" /> Action Required: Human Approval Gate Paused
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

      {/* Incidents & Severity Distribution */}
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
