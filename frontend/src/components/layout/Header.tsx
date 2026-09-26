'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { IncidentService } from '@/services/incident-service';
import { TrueForgeService } from '@/services/trueforge';
import { ShieldCheck, AlertCircle, RefreshCw, LogOut, UserCheck } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();
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

  const userName = session?.user?.name || 'SRE Operator';
  const userEmail = session?.user?.email || 'sre.operator@example.com';
  const userAvatar = session?.user?.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${userEmail}`;

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search / Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs font-mono">
          <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
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

        {/* User Account Session Info */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
          <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-indigo-300 overflow-hidden">
            {userAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              userName.substring(0, 2).toUpperCase()
            )}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-100">{userName}</p>
            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{userEmail}</p>
          </div>

          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: '/signin' })}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="/signin"
              className="text-xs font-bold px-2.5 py-1 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
