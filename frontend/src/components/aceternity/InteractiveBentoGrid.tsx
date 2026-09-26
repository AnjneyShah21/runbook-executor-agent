'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SpotlightCard } from './SpotlightCard';
import { Cpu, Server, Database, ShieldCheck, Activity, Terminal } from 'lucide-react';
import Link from 'next/link';

export function InteractiveBentoGrid() {
  const bentoItems = [
    {
      id: 'cpu',
      title: 'High CPU Usage Runbook',
      category: 'CPU Telemetry',
      icon: Cpu,
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
      description: 'Detects CPU utilization spikes (>80%), analyzes process trees, flags runaway PIDs, and terminates culprit worker threads after human sign-off.',
      toolList: ['check_cpu_usage', 'inspect_processes', 'simulate_remediation', 'verify_service_health'],
      colSpan: 'lg:col-span-2',
      spotlightColor: 'rgba(245, 158, 11, 0.12)'
    },
    {
      id: 'availability',
      title: 'Service Availability Runbook',
      category: 'HTTP 5xx & Health Probes',
      icon: Server,
      color: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
      description: 'Identifies HTTP 503 errors and CrashLoopBackOff states, scans logs for OutOfMemory exceptions, and issues container restarts with rescaled memory limits.',
      toolList: ['check_service_health', 'get_service_logs', 'simulate_remediation', 'verify_service_health'],
      colSpan: 'lg:col-span-1',
      spotlightColor: 'rgba(244, 63, 94, 0.12)'
    },
    {
      id: 'database',
      title: 'Database Connection Failure Runbook',
      category: 'DB Connection Pool',
      icon: Database,
      color: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
      description: 'Probes TCP sockets, identifies connection pool leaks (100/100 active backend slots), and terminates orphaned idle sessions upon approval.',
      toolList: ['check_database_connectivity', 'inspect_connection_errors', 'simulate_remediation', 'verify_service_health'],
      colSpan: 'lg:col-span-1',
      spotlightColor: 'rgba(6, 182, 212, 0.12)'
    },
    {
      id: 'approval',
      title: 'TrueForge Human Approval Gate',
      category: 'Safety & Governance',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
      description: 'Halts workflow execution before state-mutating actions. Displays proposed commands, risk evaluation, and expected SLA impact for SRE sign-off.',
      toolList: ['PENDING', 'APPROVED', 'REJECTED'],
      colSpan: 'lg:col-span-2',
      spotlightColor: 'rgba(16, 185, 129, 0.12)'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <span>Supported Production Runbooks</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Predefined automated diagnostic and remediation execution plans built into TrueForge.</p>
        </div>

        <Link
          href="/incidents/new"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          <span>Run Interactive Test</span>
          <span>&rarr;</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {bentoItems.map((item) => {
          const Icon = item.icon;
          return (
            <SpotlightCard
              key={item.id}
              className={`${item.colSpan}`}
              spotlightColor={item.spotlightColor}
            >
              <div className="flex flex-col h-full justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${item.badgeBg}`}>
                      {item.category}
                    </span>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mb-2">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>MCP Tools Attached:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.toolList.map((tool, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
}
