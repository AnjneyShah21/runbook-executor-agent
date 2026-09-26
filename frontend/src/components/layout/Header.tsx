'use client';

import { useState, useEffect } from 'react';
import { IncidentService } from '@/services/incident-service';
import { TrueForgeService } from '@/services/trueforge';
import { ShieldCheck, Server, AlertCircle, RefreshCw } from 'lucide-react';

export function Header() {
  const [isLive, setIsLive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [agentId, setAgentId] = useState<string>('tf-agent-runbook-executor-v1');

  const checkServerStatus = async () => {
    setLoading(true);
    const live = await IncidentService.isLiveMode();
    setIsLive(live);
    if (live) {
      const health = await TrueForgeService.checkHealth();
      if (health?.agentId) setAgentId(health.agentId);
    }
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const live = await IncidentService.isLiveMode();
      if (!active) return;
      setIsLive(live);
      if (live) {
        const health = await TrueForgeService.checkHealth();
        if (health?.agentId && active) setAgentId(health.agentId);
      }
      if (active) setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search / Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs font-mono">
          <Server className="w-3.5 h-3.5 text-indigo-400" />
          <span>Agent ID:</span>
          <span className="text-slate-100 font-semibold">{agentId}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Connection status badge */}
        <button
          onClick={checkServerStatus}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            loading
              ? 'bg-slate-800 text-slate-400 border-slate-700'
              : isLive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 glow-emerald'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
          title="Click to re-check TrueForge server status"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : isLive ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>{loading ? 'Checking...' : isLive ? 'TrueForge Live' : 'Demo Mode (Mock)'}</span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-indigo-400">
            SRE
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-200">On-Call Operator</p>
            <p className="text-[10px] text-slate-400">Primary Incident Lead</p>
          </div>
        </div>
      </div>
    </header>
  );
}
