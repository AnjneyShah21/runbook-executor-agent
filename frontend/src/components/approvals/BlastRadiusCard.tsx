'use client';

import { ShieldAlert, Users, DollarSign, Layers, Activity } from 'lucide-react';
import { BlastRadiusInfo } from '@/types/incident';

interface BlastRadiusCardProps {
  blastRadius?: BlastRadiusInfo;
  serviceName: string;
}

export function BlastRadiusCard({ blastRadius, serviceName }: BlastRadiusCardProps) {
  const defaultBlast: BlastRadiusInfo = blastRadius || {
    riskScore: 78,
    affectedUsersEstimate: 1420,
    downtimeCostPerMin: 320,
    affectedMicroservices: [serviceName, 'api-gateway', 'auth-service'],
    blastRadiusCategory: 'HIGH',
  };

  const { riskScore, affectedUsersEstimate, downtimeCostPerMin, affectedMicroservices, blastRadiusCategory } =
    defaultBlast;

  const getRiskColor = (cat: string) => {
    switch (cat) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'HIGH':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'MEDIUM':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">AI Blast Radius & Impact Predictor</h3>
            <p className="text-xs text-slate-400">Automated financial & user footprint assessment</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(blastRadiusCategory)}`}>
          {blastRadiusCategory} RISK ({riskScore}%)
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Risk Score Bar */}
        <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Risk Score
            </span>
            <span className="font-bold text-slate-200">{riskScore}/100</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                riskScore > 75 ? 'bg-rose-500' : riskScore > 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>

        {/* Affected Users */}
        <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-medium">
            <Users className="w-3.5 h-3.5 text-cyan-400" /> Est. Affected Users
          </div>
          <p className="text-lg font-extrabold text-slate-100">{affectedUsersEstimate.toLocaleString()}</p>
        </div>

        {/* Financial Impact */}
        <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-medium">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Downtime Cost / Min
          </div>
          <p className="text-lg font-extrabold text-emerald-400">${downtimeCostPerMin}/min</p>
        </div>
      </div>

      {/* Affected Microservices dependencies */}
      <div className="pt-2 border-t border-slate-800/60">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" /> Impacted Dependent Services ({affectedMicroservices.length})
        </span>
        <div className="flex flex-wrap gap-2">
          {affectedMicroservices.map((svc) => (
            <span
              key={svc}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-mono"
            >
              {svc}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
