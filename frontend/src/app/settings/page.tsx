'use client';

import { useState, useEffect } from 'react';
import { IncidentService } from '@/services/incident-service';
import { TrueForgeService } from '@/services/trueforge';
import { AgentHealthResponse } from '@/types/incident';
import {
  RefreshCw,
  Sliders,
  Lock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function SettingsPage() {
  const [mode, setMode] = useState<'auto' | 'live' | 'mock'>('auto');
  const [health, setHealth] = useState<AgentHealthResponse | null>(null);
  const [checking, setChecking] = useState(true);
  const [pingMs, setPingMs] = useState<number | null>(null);

  const fetchStatus = async () => {
    setChecking(true);
    const startTime = performance.now();
    const currentMode = IncidentService.getMode();
    setMode(currentMode);

    const res = await TrueForgeService.checkHealth();
    const endTime = performance.now();

    if (res) {
      setHealth(res);
      setPingMs(Math.round(endTime - startTime));
    } else {
      setHealth(null);
      setPingMs(null);
    }
    setChecking(false);
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      setChecking(true);
      const startTime = performance.now();
      const currentMode = IncidentService.getMode();
      if (!active) return;
      setMode(currentMode);

      const res = await TrueForgeService.checkHealth();
      const endTime = performance.now();

      if (!active) return;
      if (res) {
        setHealth(res);
        setPingMs(Math.round(endTime - startTime));
      } else {
        setHealth(null);
        setPingMs(null);
      }
      setChecking(false);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleModeChange = (newMode: 'auto' | 'live' | 'mock') => {
    setMode(newMode);
    IncidentService.setMode(newMode);
    fetchStatus();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Agent Integration & Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure TrueForge platform connections, integration mode, and verify agent status.
          </p>
        </div>

        <button
          onClick={fetchStatus}
          className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors self-start sm:self-auto flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
          <span>Ping TrueForge Agent</span>
        </button>
      </div>

      {/* Connection Status Card */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                health
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 glow-emerald'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              {health ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">TrueForge Backend Server Connection</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Endpoint: http://localhost:3000/api/v1
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
              health
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            }`}
          >
            {checking ? 'PINGING...' : health ? 'ONLINE / HEALTHY' : 'UNREACHABLE (FALLBACK TO DEMO)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Agent Identifier</span>
            <span className="font-bold text-indigo-400 mt-1 block">
              {health?.agentId || 'tf-agent-runbook-executor-v1'}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Latency / Ping</span>
            <span className="font-bold text-emerald-400 mt-1 block">
              {pingMs !== null ? `${pingMs} ms` : 'N/A'}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Platform Version</span>
            <span className="font-bold text-slate-200 mt-1 block">
              {health?.platform || 'TrueForge Harness v0.2.0'}
            </span>
          </div>
        </div>
      </div>

      {/* Integration Mode Switcher */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-sm text-slate-100">Integration Mode Configuration</h3>
        </div>

        <p className="text-xs text-slate-400">
          Select how the frontend interfaces with the TrueForge agent backend during testing and evaluation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <button
            onClick={() => handleModeChange('auto')}
            className={`p-4 rounded-xl border text-left transition-all ${
              mode === 'auto'
                ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="font-bold text-xs block text-slate-100">Auto-Detect Mode (Default)</span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Uses Live TrueForge server if available on port 3000; falls back to Demo Mode if offline.
            </span>
          </button>

          <button
            onClick={() => handleModeChange('live')}
            className={`p-4 rounded-xl border text-left transition-all ${
              mode === 'live'
                ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="font-bold text-xs block text-slate-100">Force Live TrueForge</span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Directly routes all incident intake and approval requests to http://localhost:3000/api/v1.
            </span>
          </button>

          <button
            onClick={() => handleModeChange('mock')}
            className={`p-4 rounded-xl border text-left transition-all ${
              mode === 'mock'
                ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="font-bold text-xs block text-slate-100">Force Demo Mode (Mock)</span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Runs in-memory simulation with instant diagnostic timelines & approval gates.
            </span>
          </button>
        </div>
      </div>

      {/* Security & Secret Masking Banner */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Lock className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm text-slate-100">Security & Authentication Specs</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 font-mono">Authentication Header:</span>
            <span className="font-mono text-indigo-400 font-bold">x-api-key</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 font-mono">Configured Secret API Key:</span>
            <span className="font-mono text-emerald-400 font-bold">tf_sk_runbook_executor_***_key</span>
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px]">
            ✓ Compliant with Security Policy: API credentials are stored exclusively in server environment variables and never exposed to client-side JS bundles.
          </div>
        </div>
      </div>
    </div>
  );
}
