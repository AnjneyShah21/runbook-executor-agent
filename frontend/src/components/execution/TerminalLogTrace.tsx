'use client';

import { useState } from 'react';
import { Terminal, Copy, Check, Play, RefreshCw } from 'lucide-react';
import { ExecutionLogStep } from '@/types/incident';

interface TerminalLogTraceProps {
  logs: ExecutionLogStep[];
  serviceName?: string;
}

export function TerminalLogTrace({ logs, serviceName = 'payment-service' }: TerminalLogTraceProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'diagnostic' | 'remediation'>('all');

  const filteredLogs = logs.filter((log) => {
    if (activeTab === 'diagnostic') return log.type === 'DIAGNOSTIC';
    if (activeTab === 'remediation') return log.type === 'REMEDIATION' || log.type === 'VERIFICATION';
    return true;
  });

  const handleCopy = () => {
    const rawText = logs
      .map(
        (l) =>
          `[${l.timestamp}] [${l.type}] ${l.stepName}\nStatus: ${l.status}\nOutput: ${JSON.stringify(
            l.outputResult || l.error,
            null,
            2
          )}`
      )
      .join('\n\n----------------------------------------\n\n');

    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono shadow-2xl">
      {/* Terminal Top Window Bar */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-2 ml-3 text-xs text-slate-400 font-sans font-medium">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>trueforge-cli @ {serviceName} (~/runbook-agent)</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 font-sans">
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'all' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Logs
            </button>
            <button
              onClick={() => setActiveTab('diagnostic')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'diagnostic' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Diagnostics
            </button>
            <button
              onClick={() => setActiveTab('remediation')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'remediation' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Remediation
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Trace'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Execution Body */}
      <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto text-xs leading-relaxed text-slate-300 select-text">
        <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-900 flex items-center justify-between">
          <span>TrueForge Execution Engine v0.2.0-mcp</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" /> Live Stream
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-slate-500 italic py-4">No log traces recorded for selected filter.</p>
        ) : (
          filteredLogs.map((log, idx) => (
            <div key={log.stepId || idx} className="space-y-1.5 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">$</span>
                  <span className="text-indigo-300 font-semibold">{log.stepName}</span>
                  {log.toolName && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                      tool: {log.toolName}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-sans">
                  {new Date(log.timestamp).toLocaleTimeString()} {log.durationMs ? `(${log.durationMs}ms)` : ''}
                </span>
              </div>

              {/* Console Output Block */}
              <div className="pl-4 border-l-2 border-slate-800 group-hover:border-indigo-500/50 transition-colors py-1">
                <pre className="text-slate-300 text-[11px] whitespace-pre-wrap font-mono overflow-x-auto bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                  {JSON.stringify(log.outputResult || log.error || { status: log.status }, null, 2)}
                </pre>
              </div>
            </div>
          ))
        )}

        <div className="flex items-center gap-2 text-indigo-400 pt-2 animate-pulse">
          <Play className="w-3 h-3" />
          <span>Listening for MCP diagnostic telemetry...</span>
        </div>
      </div>
    </div>
  );
}
