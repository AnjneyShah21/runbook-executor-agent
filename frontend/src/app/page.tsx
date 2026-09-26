'use client';

import { useState, useEffect } from 'react';
import { IncidentState } from '@/types/incident';
import { IncidentService } from '@/services/incident-service';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { SeverityDistribution } from '@/components/dashboard/SeverityDistribution';
import { RecentIncidentsTable } from '@/components/dashboard/RecentIncidentsTable';
import { ApprovalCard } from '@/components/approvals/ApprovalCard';
import Link from 'next/link';
import { PlusCircle, ShieldAlert, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<IncidentState[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    const { incidents: data, isLive: mode } = await IncidentService.getAllIncidents();
    setIncidents(data);
    setIsLive(mode);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const { incidents: data, isLive: mode } = await IncidentService.getAllIncidents();
      if (!active) return;
      setIncidents(data);
      setIsLive(mode);
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const pendingApprovalIncident = incidents.find((i) => i.status === 'Awaiting Approval');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">SRE Incident Operations</h1>
            <span
              className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border ${
                isLive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {isLive ? 'TrueForge Live' : 'Demo Mode'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time incident diagnosis, runbook execution, and human approval platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/incidents/new"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ingest New Incident</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards incidents={incidents} />

      {/* Human Approval Alert Banner if pending */}
      {pendingApprovalIncident && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 animate-bounce" /> Attention Required: Pending Human Approval Gate
            </h2>
            <Link href="/approvals" className="text-xs text-amber-400 hover:underline font-semibold">
              View Approval Center →
            </Link>
          </div>
          <ApprovalCard incident={pendingApprovalIncident} onDecisionSubmitted={fetchDashboardData} />
        </div>
      )}

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
