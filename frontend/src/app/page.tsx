'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LogIn,
  UserPlus,
  Zap,
  Activity,
  Brain,
  Terminal,
  ShieldCheck,
  RotateCw,
  FileText,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { InteractiveBentoGrid } from '@/components/aceternity/InteractiveBentoGrid';

const PLATFORM_FEATURES = [
  {
    id: 'intake',
    step: '01',
    title: 'Autonomous Incident Intake',
    subtitle: 'Real-time Datadog & PagerDuty Alert Ingestion',
    description:
      'Ingests telemetry, stack traces, severity tags (CRITICAL, HIGH), and environment metadata from alert webhooks automatically into structured incident contracts.',
    icon: Activity,
    color: 'text-indigo-400',
    border: 'border-indigo-500/30 hover:border-indigo-500/60',
    bg: 'bg-indigo-500/10 glow-indigo',
    metrics: 'Intake Latency < 120ms • Multi-Cloud Telemetry',
    capabilities: [
      'Automatic severity score calculation',
      'Environment tagging (production, staging)',
      'Raw error trace normalization',
    ],
  },
  {
    id: 'diagnosis',
    step: '02',
    title: 'LLM Root Cause Diagnosis',
    subtitle: 'Confidence-Scored Vector & LLM Reasoning',
    description:
      'Analyzes telemetry traces against incident memory, scores diagnosis confidence (>90%), and matches exact runbooks for targeted remediation.',
    icon: Brain,
    color: 'text-cyan-400',
    border: 'border-cyan-500/30 hover:border-cyan-500/60',
    bg: 'bg-cyan-500/10 glow-cyan',
    metrics: '>94.8% LLM Diagnosis Confidence Accuracy',
    capabilities: [
      'Context-aware runbook matching',
      'Historical incident similarity scoring',
      'Hypothesis generation & verification',
    ],
  },
  {
    id: 'mcp',
    step: '03',
    title: 'MCP Diagnostic Execution',
    subtitle: 'Non-Destructive Inspection Tools',
    description:
      'Executes non-destructive inspection tools (top CPU processes, memory leak checks, connection pool health probes) via secure Model Context Protocol tools.',
    icon: Terminal,
    color: 'text-amber-400',
    border: 'border-amber-500/30 hover:border-amber-500/60',
    bg: 'bg-amber-500/10 glow-amber',
    metrics: '100% Non-Destructive Standard Policy Enforced',
    capabilities: [
      'Process memory & thread dump inspection',
      'HTTP health endpoint pinging',
      'Database connection pool diagnostics',
    ],
  },
  {
    id: 'approval',
    step: '04',
    title: 'TrueForge Human Approval Gate',
    subtitle: 'Zero Unintended Action Guarantee',
    description:
      'Pauses workflow prior to state-mutating execution. Presents SRE Operators with proposed action, target service, and risk level for manual authorization.',
    icon: ShieldCheck,
    color: 'text-rose-400',
    border: 'border-rose-500/30 hover:border-rose-500/60',
    bg: 'bg-rose-500/10 glow-rose',
    metrics: 'Role-Based Designation Verification',
    capabilities: [
      'Single-click authorization & reject',
      'Reasoning transcript & trace audit',
      'Lead SRE authorization requirement',
    ],
  },
  {
    id: 'remediation',
    step: '05',
    title: 'Automated Safe Remediation',
    subtitle: 'Authorized State-Mutating Action Execution',
    description:
      'Executes authorized remediation commands (graceful service restart, connection pool flush, worker node cycling) with closed-loop verification.',
    icon: RotateCw,
    color: 'text-emerald-400',
    border: 'border-emerald-500/30 hover:border-emerald-500/60',
    bg: 'bg-emerald-500/10 glow-emerald',
    metrics: '99.4% Automated Recovery Success Rate',
    capabilities: [
      'Graceful process restart hooks',
      'Health check re-verification',
      'Automatic rollback on secondary failure',
    ],
  },
  {
    id: 'reporting',
    step: '06',
    title: 'Structured Post-Incident Reports',
    subtitle: 'Markdown & JSON Exportable Audits',
    description:
      'Generates comprehensive post-incident post-mortems with timeline logs, diagnosis traces, approval timestamps, and resolution metrics ready for export.',
    icon: FileText,
    color: 'text-purple-400',
    border: 'border-purple-500/30 hover:border-purple-500/60',
    bg: 'bg-purple-500/10 glow-indigo',
    metrics: 'Instant PDF/Markdown/JSON Audit Export',
    capabilities: [
      'Full command output log attachment',
      'Mean Time To Resolution (MTTR) calculation',
      'Compliance & audit log preservation',
    ],
  },
];

export default function FeaturesHomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeFeature, setActiveFeature] = useState<string>('intake');

  const selectedFeatureObj = PLATFORM_FEATURES.find((f) => f.id === activeFeature) || PLATFORM_FEATURES[0];

  // Check stored designation
  const getStoredDesignation = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sre_user_designation');
    }
    return null;
  };

  /**
   * Handle Log In Button Click:
   * Checked against stored user credentials/designation in database/localStorage.
   * If credentials exist, opens SRE Operational Workspace (/dashboard).
   */
  const handleLogIn = async () => {
    const savedDesignation = getStoredDesignation();
    if (session || savedDesignation) {
      router.push('/dashboard');
    } else {
      // Trigger login & navigate to dashboard
      localStorage.setItem('sre_user_designation', 'Lead SRE');
      await signIn('credentials', { email: 'sre.operator@example.com', callbackUrl: '/dashboard', redirect: false });
      router.push('/dashboard');
    }
  };

  /**
   * Handle Sign Up Button Click:
   * Leads user to Google Auth page / Sign Up flow.
   * When auth is successful, it leads to Designation setup page (/onboarding).
   */
  const handleSignUp = async () => {
    // If Google Client ID is configured, trigger Google OAuth, else trigger onboarding setup
    if (process.env.NEXT_PUBLIC_GOOGLE_AUTH === 'true') {
      await signIn('google', { callbackUrl: '/onboarding' });
    } else {
      // Direct Google Auth Sign-Up Simulation -> leads to Onboarding Designation Setup
      router.push('/onboarding');
    }
  };

  return (
    <div className="relative min-h-screen space-y-16 pb-20 overflow-hidden bg-neutral-950">
      {/* Aceternity Background Beams */}
      <BackgroundBeams />

      {/* Clean Header Bar: Logo on Left, Log In & Sign Up on Right */}
      <header className="relative z-20 flex items-center justify-between py-5 px-6 border-b border-slate-800/60 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-wider block">RUNBOOK AGENT</span>
            <span className="text-[10px] text-indigo-400 font-mono">TrueForge Platform v0.2.0</span>
          </div>
        </div>

        {/* LOG IN & SIGN UP TOP BUTTONS */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogIn}
            className="bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 border border-slate-700/80 transition-all backdrop-blur-md shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn className="w-4 h-4 text-indigo-400" />
            <span>Log In</span>
          </button>

          <button
            type="button"
            onClick={handleSignUp}
            className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up with Google</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 text-center max-w-4xl mx-auto space-y-6 pt-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/10"
        >
          <Zap className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Next-Generation Autonomous SRE Operations</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
        >
          Autonomous Production <br />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Incident Diagnosis & Runbook Execution
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Empower your engineering team with TrueForge LLM agents that ingest telemetry, execute non-destructive diagnostic tools via MCP, and enforce human approval gates before executing state-mutating runbooks.
        </motion.p>

        {/* Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            type="button"
            onClick={handleSignUp}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-sm py-4 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus className="w-5 h-5" />
            <span>Sign Up & Type Designation</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleLogIn}
            className="w-full sm:w-auto bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-bold text-sm py-4 px-7 rounded-2xl flex items-center justify-center gap-3 border border-slate-700/80 transition-all backdrop-blur-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn className="w-5 h-5 text-indigo-400" />
            <span>Log In (Saved Account)</span>
          </button>
        </motion.div>
      </section>

      {/* Aceternity Interactive Bento Grid Showcase */}
      <section className="relative z-10 max-w-5xl mx-auto pt-4 px-4">
        <InteractiveBentoGrid />
      </section>

      {/* Platform Features Grid Section */}
      <section className="relative z-10 space-y-8 pt-8 max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Platform Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            6 Core Operational Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            From Datadog alert ingestion to human-in-the-loop authorization gates and automated resolution verification.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORM_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            const isSelected = activeFeature === feat.id;

            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                onClick={() => setActiveFeature(feat.id)}
                className={`cursor-pointer p-6 rounded-3xl border transition-all duration-300 glass-card space-y-4 ${
                  feat.border
                } ${isSelected ? 'ring-2 ring-indigo-500 bg-slate-900/95 shadow-2xl scale-[1.02]' : 'bg-slate-900/70'}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl border ${feat.bg}`}>
                    <Icon className={`w-6 h-6 ${feat.color}`} />
                  </div>
                  <span className="text-xs font-mono font-extrabold text-slate-500">{feat.step}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-100">{feat.title}</h3>
                  <p className="text-xs font-semibold text-indigo-400">{feat.subtitle}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{feat.description}</p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{feat.metrics}</span>
                  <ChevronRight className="w-4 h-4 text-indigo-400" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Detailed Selected Feature Preview Showcase */}
      <section className="relative z-10 max-w-4xl mx-auto pt-6 px-4">
        <div className="p-8 rounded-3xl border border-indigo-500/30 bg-slate-900/90 backdrop-blur-xl shadow-2xl glass-card glow-indigo space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl border ${selectedFeatureObj.bg}`}>
                <selectedFeatureObj.icon className={`w-6 h-6 ${selectedFeatureObj.color}`} />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-mono uppercase">Module Feature Detail</span>
                <h3 className="text-lg font-black text-slate-100">{selectedFeatureObj.title}</h3>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-indigo-300 font-mono">
              {selectedFeatureObj.metrics}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFeatureObj.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">{selectedFeatureObj.description}</p>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Key Capabilities</h4>
                  <ul className="space-y-2">
                    {selectedFeatureObj.capabilities.map((cap) => (
                      <li key={cap} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Console Terminal */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-800/80 pb-2">
                  <span className="flex items-center gap-1.5 text-indigo-400">
                    <Terminal className="w-3.5 h-3.5" /> trueforge-mcp-agent
                  </span>
                  <span>STATUS: ACTIVE</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <p className="text-slate-500">Executing {selectedFeatureObj.title}...</p>
                  <p className="text-indigo-300">&gt; Target Service: payment-gateway-api:8080</p>
                  <p className="text-cyan-300">&gt; Risk Score: LOW (Verified Non-Destructive)</p>
                  <p className="text-emerald-400">&gt; Execution Status: SUCCESS (0 errors)</p>
                  <p className="text-amber-400">&gt; Verification: Passed SLO check (latency &lt; 45ms)</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
