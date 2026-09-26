'use client';

import { useState, useEffect } from 'react';
import { IncidentState } from '@/types/incident';
import { IncidentService } from '@/services/incident-service';
import { IncidentStatusBadge } from '@/components/incidents/IncidentStatusBadge';
import { IncidentSeverityBadge } from '@/components/incidents/IncidentSeverityBadge';
import Link from 'next/link';
import { Search, Filter, PlusCircle, ExternalLink, RefreshCw } from 'lucide-react';

export default function IncidentsListPage() {
  const [incidents, setIncidents] = useState<IncidentState[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchIncidents = async () => {
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
    const matchesSearch =
      inc.incidentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.intake.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.intake.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || inc.intake.severity === severityFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && inc.status !== 'Resolved' && inc.status !== 'Rejected') ||
      inc.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Incident Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, filter, and inspect all ingested production incidents.
          </p>
        </div>

        <Link
          href="/incidents/new"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ingest New Incident</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, title, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Awaiting Approval">Awaiting Approval</option>
              <option value="ACTIVE">Active / Processing</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <button
            onClick={fetchIncidents}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/60">
                <th className="py-3 px-4 whitespace-nowrap">Incident ID</th>
                <th className="py-3 px-4">Title & Context</th>
                <th className="py-3 px-4 whitespace-nowrap">Service</th>
                <th className="py-3 px-4 whitespace-nowrap">Severity</th>
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 whitespace-nowrap">Runbook</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                    No matching incidents found.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr key={inc.incidentId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-extrabold text-indigo-400 whitespace-nowrap">
                      <Link href={`/incidents/${inc.incidentId}`} className="hover:underline">
                        {inc.incidentId}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-100">{inc.intake.title}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs">{inc.intake.description}</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                        {inc.intake.serviceName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <IncidentSeverityBadge severity={inc.intake.severity} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <IncidentStatusBadge status={inc.status} />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                      {inc.selectedRunbook?.title || 'Matching...'}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/incidents/${inc.incidentId}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600 hover:text-white text-indigo-300 font-semibold border border-indigo-500/30 transition-all"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
