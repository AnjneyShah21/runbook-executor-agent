import { IncidentState } from '@/types/incident';

export function SeverityDistribution({ incidents }: { incidents: IncidentState[] }) {
  const counts = {
    CRITICAL: incidents.filter((i) => i.intake.severity === 'CRITICAL').length,
    HIGH: incidents.filter((i) => i.intake.severity === 'HIGH').length,
    MEDIUM: incidents.filter((i) => i.intake.severity === 'MEDIUM').length,
    LOW: incidents.filter((i) => i.intake.severity === 'LOW').length,
  };

  const total = incidents.length || 1;

  const items = [
    { label: 'CRITICAL', count: counts.CRITICAL, color: 'bg-rose-500', text: 'text-rose-400' },
    { label: 'HIGH', count: counts.HIGH, color: 'bg-orange-500', text: 'text-orange-400' },
    { label: 'MEDIUM', count: counts.MEDIUM, color: 'bg-amber-500', text: 'text-amber-400' },
    { label: 'LOW', count: counts.LOW, color: 'bg-slate-500', text: 'text-slate-400' },
  ];

  return (
    <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-200">Incident Severity Distribution</h3>
        <span className="text-xs text-slate-400 font-mono">{incidents.length} Total</span>
      </div>

      {/* Progress bar stack */}
      <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex">
        {items.map((item) => {
          const pct = (item.count / total) * 100;
          if (pct === 0) return null;
          return <div key={item.label} className={`h-full ${item.color}`} style={{ width: `${pct}%` }} />;
        })}
      </div>

      {/* Item counts breakdown */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-xs font-semibold text-slate-300">{item.label}</span>
            </div>
            <span className={`text-xs font-extrabold ${item.text}`}>{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
