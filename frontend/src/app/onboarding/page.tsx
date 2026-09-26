'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Briefcase, ArrowRight, User, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';

const DESIGNATIONS = [
  {
    title: 'Lead SRE',
    desc: 'Maintains platform reliability, defines SLO/SLAs, and authorizes high-severity runbook executions.',
    icon: ShieldCheck,
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
  },
  {
    title: 'Principal DevOps Engineer',
    desc: 'Manages Kubernetes clusters, CI/CD pipelines, and automated MCP diagnostic integrations.',
    icon: Cpu,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  },
  {
    title: 'Incident Commander',
    desc: 'Leads real-time production outage response, approves human gates, and oversees post-mortems.',
    icon: Briefcase,
    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  },
  {
    title: 'Platform Engineer',
    desc: 'Builds infrastructure tooling, internal developer platforms, and cloud telemetry pipelines.',
    icon: Sparkles,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    title: 'Infrastructure Architect',
    desc: 'Designs resilient cloud systems, microservice topologies, and disaster recovery strategies.',
    icon: User,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [selectedRole, setSelectedRole] = useState<string>('Lead SRE');
  const [customDesignation, setCustomDesignation] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const userName = session?.user?.name || 'SRE Operator';
  const userEmail = session?.user?.email || 'sre.operator@example.com';
  const userAvatar = session?.user?.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${userEmail}`;

  const handleCompleteOnboarding = () => {
    setErrorMsg('');
    const finalDesignation = isCustom ? customDesignation.trim() : selectedRole;

    if (!finalDesignation) {
      setErrorMsg('Please enter or select a valid operational designation before entering the dashboard.');
      return;
    }

    setLoading(true);
    localStorage.setItem('sre_user_designation', finalDesignation);
    localStorage.setItem('sre_user_onboarded', 'true');

    // Unlock & redirect to operational SRE dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden bg-neutral-950">
      <BackgroundBeams />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl p-8 rounded-3xl border border-indigo-500/30 bg-slate-900/90 backdrop-blur-xl shadow-2xl space-y-8 relative z-10 glass-card glow-indigo"
      >
        {/* User Welcome Header (NO SKIP LINK) */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/30 shrink-0">
            <div className="w-full h-full rounded-[14px] bg-slate-950 overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-3 h-3" /> Auth Successful
            </div>
            <h1 className="text-xl font-black text-slate-100 tracking-tight">Welcome, {userName}!</h1>
            <p className="text-xs text-slate-400 font-mono">{userEmail}</p>
          </div>
        </div>

        {/* Title & Mandatory Designation Instructions */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" /> Enter Your Operational Designation (Mandatory)
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            You must specify your designation before accessing the main SRE Operational Workspace. This sets your approval matrix and governance permissions.
          </p>
        </div>

        {/* Validation Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DESIGNATIONS.map((d) => {
            const Icon = d.icon;
            const isSelected = !isCustom && selectedRole === d.title;
            return (
              <button
                key={d.title}
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setIsCustom(false);
                  setSelectedRole(d.title);
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-600/20 shadow-lg shadow-indigo-600/20 scale-[1.02]'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${d.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-100">{d.title}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{d.desc}</p>
              </button>
            );
          })}

          {/* Custom Designation Option */}
          <button
            type="button"
            onClick={() => {
              setErrorMsg('');
              setIsCustom(true);
            }}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 ${
              isCustom
                ? 'border-indigo-500 bg-indigo-600/20 shadow-lg shadow-indigo-600/20 scale-[1.02]'
                : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/40 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-slate-100">Custom Designation</span>
              </div>
              {isCustom && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Type custom designation (e.g. Lead Cloud Infrastructure Architect)
            </p>
          </button>
        </div>

        {/* Custom Input Field if selected */}
        {isCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
            className="space-y-2 pt-2"
          >
            <label className="block text-xs font-semibold text-slate-300">Enter Your Operational Designation *</label>
            <input
              type="text"
              value={customDesignation}
              onChange={(e) => {
                setErrorMsg('');
                setCustomDesignation(e.target.value);
              }}
              placeholder="e.g. Lead Cloud Infrastructure Architect"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </motion.div>
        )}

        {/* Mandatory Complete Onboarding Button */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-mono">
            Designation: <span className="text-indigo-400 font-bold">{isCustom ? customDesignation || 'Not Entered' : selectedRole}</span>
          </p>

          <button
            type="button"
            onClick={handleCompleteOnboarding}
            disabled={loading}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Save Designation & Unlock SRE Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
