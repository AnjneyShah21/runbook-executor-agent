'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IncidentIntakeInput, IncidentSeverity, IncidentEnvironment } from '@/types/incident';
import { IncidentService } from '@/services/incident-service';
import {
  AlertTriangle,
  Sparkles,
  Send,
  RotateCw,
  Cpu,
  Server,
  Database,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

const SCENARIOS = [
  {
    name: 'High CPU Usage',
    icon: Cpu,
    title: 'High CPU spike on payment-service worker pool',
    description: 'Datadog Alert: Host CPU utilization sustained at 94.8% for > 5 minutes. Latency p99 increased to 4200ms.',
    serviceName: 'payment-service',
    severity: 'CRITICAL' as IncidentSeverity,
    environment: 'production' as IncidentEnvironment,
  },
  {
    name: 'Service Unavailable',
    icon: Server,
    title: 'Service Unavailable on checkout-gateway API',
    description: 'HTTP 503 Service Unavailable rates elevated to 88% on checkout endpoints following upstream redis failover.',
    serviceName: 'checkout-gateway',
    severity: 'HIGH' as IncidentSeverity,
    environment: 'production' as IncidentEnvironment,
  },
  {
    name: 'Database Exhaustion',
    icon: Database,
    title: 'Database Connection Pool Exhaustion on order-db',
    description: 'Active client connections reached max_connections limit (500/500). Transactions queued.',
    serviceName: 'order-db',
    severity: 'CRITICAL' as IncidentSeverity,
    environment: 'production' as IncidentEnvironment,
  },
  {
    name: 'K8s OOMKill Threat',
    icon: Cpu,
    title: 'Kubernetes Pod OOMKilled Memory Leak on auth-service',
    description: 'Pod memory RSS exceeded cgroup quota (512MiB/512MiB). Container restarted 14 times in 1 hour.',
    serviceName: 'auth-service',
    severity: 'HIGH' as IncidentSeverity,
    environment: 'production' as IncidentEnvironment,
  },
  {
    name: 'Disk Storage Full',
    icon: Server,
    title: 'Disk Storage Volume Saturation (99%) on logging-node-01',
    description: 'Mounted block storage /var/log reached 99.4% disk capacity. Log rotate process stuck.',
    serviceName: 'logging-node-01',
    severity: 'MEDIUM' as IncidentSeverity,
    environment: 'production' as IncidentEnvironment,
  },
  {
    name: 'Kafka Queue Lag',
    icon: Database,
    title: 'Kafka Message Queue Backpressure & Consumer Lag spike',
    description: 'Consumer group analytics-worker lag surpassed 58,000 unread partition messages.',
    serviceName: 'analytics-worker',
    severity: 'HIGH' as IncidentSeverity,
    environment: 'production' as IncidentEnvironment,
  },
];

export default function CreateIncidentPage() {
  const router = useRouter();

  const [form, setForm] = useState<IncidentIntakeInput>({
    title: '',
    description: '',
    serviceName: '',
    severity: 'HIGH',
    environment: 'production',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyScenario = (scenario: typeof SCENARIOS[0]) => {
    setForm({
      title: scenario.title,
      description: scenario.description,
      serviceName: scenario.serviceName,
      severity: scenario.severity,
      environment: scenario.environment,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.serviceName) {
      setError('Please complete all required incident fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { incident } = await IncidentService.submitIncident(form);
      if (incident?.incidentId) {
        router.push(`/incidents/${incident.incidentId}`);
      } else {
        setError('Failed to submit incident. Please check server configuration.');
        setSubmitting(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unexpected error occurred.';
      setError(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <Link
            href="/incidents"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Incidents
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Report Production Incident</h1>
          <p className="text-xs text-slate-400 mt-1">
            Ingest incident alert metadata to trigger TrueForge automated diagnosis & runbook execution.
          </p>
        </div>
      </div>

      {/* Preset Demo Scenarios */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Pre-fill Sample Demo Scenarios
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SCENARIOS.map((sc) => {
            const Icon = sc.icon;
            return (
              <button
                key={sc.name}
                type="button"
                onClick={() => applyScenario(sc)}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-indigo-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200">{sc.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 truncate">{sc.serviceName}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Incident Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g., High CPU spike on payment-service worker pool"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Service Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.serviceName}
              onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
              placeholder="payment-service"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Severity Level</label>
            <select
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value as IncidentSeverity })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Environment</label>
            <select
              value={form.environment}
              onChange={(e) => setForm({ ...form, environment: e.target.value as IncidentEnvironment })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="production">production</option>
              <option value="staging">staging</option>
              <option value="development">development</option>
              <option value="demo">demo</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Incident Description & Alert Trace <span className="text-rose-400">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Paste telemetry alert summary, stack traces, latency p99 metrics, or anomaly details..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
          <Link
            href="/incidents"
            className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-5 rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            {submitting ? <RotateCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{submitting ? 'Triggering TrueForge Agent...' : 'Submit Incident & Trigger Agent'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
