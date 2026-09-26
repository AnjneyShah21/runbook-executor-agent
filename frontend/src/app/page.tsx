'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
import { InteractiveMeshBackground } from '@/components/aceternity/InteractiveMeshBackground';
import { InteractiveBentoGrid } from '@/components/aceternity/InteractiveBentoGrid';

const PLATFORM_FEATURES = [
  {
    id: 'multi-agent',
    step: '01',
    title: 'Multi-Agent LLM & RAG Engine',
    subtitle: 'Vector Pattern Match & 96.8% Confidence',
    description:
      '3-agent ensemble reasoning loop (Telemetry Analyst, Root Cause Specialist, Safety Guardian) cross-references incoming alerts against vector incident memory.',
    icon: Brain,
    color: 'text-indigo-400',
    border: 'border-indigo-500/30 hover:border-indigo-500/60',
    bg: 'bg-indigo-500/10 glow-indigo',
    metrics: '96.8% Multi-Agent Consensus Accuracy',
    capabilities: [
      'RAG historical incident similarity vector search',
      '3-agent collaborative reasoning consensus loop',
      'Hypothesis generation & validation scoring',
    ],
  },
  {
    id: 'blast-radius',
    step: '02',
    title: 'AI Blast Radius & Downtime Predictor',
    subtitle: 'Financial Impact & User Footprint Score',
    description:
      'Calculates risk score (0-100%), affected user estimate, downtime cost ($/min), and microservice dependencies before any human approval is requested.',
    icon: Activity,
    color: 'text-cyan-400',
    border: 'border-cyan-500/30 hover:border-cyan-500/60',
    bg: 'bg-cyan-500/10 glow-cyan',
    metrics: 'Real-time Financial & Blast Radius Score',
    capabilities: [
      'Estimated affected user count calculation',
      'Downtime financial cost predictor ($/min)',
      'Dependency graph blast radius categorization',
    ],
  },
  {
    id: 'terminal-sandbox',
    step: '03',
    title: 'Live Terminal Trace Sandbox',
    subtitle: 'Real-time CLI Execution Stream & Replay',
    description:
      'Interactive terminal sandbox rendering live diagnostic tool output, stdout/stderr logs, execution duration, and 1-click clipboard export.',
    icon: Terminal,
    color: 'text-amber-400',
    border: 'border-amber-500/30 hover:border-amber-500/60',
    bg: 'bg-amber-500/10 glow-amber',
    metrics: '100% Non-Destructive Standard Policy Enforced',
    capabilities: [
      'Live CLI command execution trace stream',
      'Diagnostic vs Remediation log tab filters',
      '1-click raw trace log copy to clipboard',
    ],
  },
  {
    id: 'approval',
    step: '04',
    title: 'TrueForge Human Approval Gate',
    subtitle: 'Zero Unintended Action Guarantee',
    description:
      'Pauses workflow prior to state-mutating execution. Captures logged-in SRE operator identity and designation for role-based authorization sign-off.',
    icon: ShieldCheck,
    color: 'text-rose-400',
    border: 'border-rose-500/30 hover:border-rose-500/60',
    bg: 'bg-rose-500/10 glow-rose',
    metrics: 'Logged-in Session Identity Authorization',
    capabilities: [
      'Single-click approve & reject with justification',
      'Dynamic logged-in operator identity binding',
      'Audit log transcript preservation',
    ],
  },
  {
    id: 'auto-policy',
    step: '05',
    title: 'Self-Healing Auto-Approve Engine',
    subtitle: 'Automated Safe Remediation Execution',
    description:
      'Evaluates risk score thresholds. For low/medium-risk non-destructive runbooks, the agent auto-approves and executes safe self-healing recovery.',
    icon: RotateCw,
    color: 'text-emerald-400',
    border: 'border-emerald-500/30 hover:border-emerald-500/60',
    bg: 'bg-emerald-500/10 glow-emerald',
    metrics: '99.4% Self-Healing Recovery Rate',
    capabilities: [
      'Low-risk automated policy evaluation',
      'Graceful process restart & pool flush hooks',
      'Closed-loop post-remediation SLA verification',
    ],
  },
  {
    id: 'post-mortem',
    step: '06',
    title: 'Post-Mortem & Webhook Dispatcher',
    subtitle: 'Markdown Export & Slack Alert Dispatcher',
    description:
      'Generates structured Markdown incident post-mortems with complete timelines, diagnosis, and approval logs ready to dispatch to Slack webhooks.',
    icon: FileText,
    color: 'text-purple-400',
    border: 'border-purple-500/30 hover:border-purple-500/60',
    bg: 'bg-purple-500/10 glow-indigo',
    metrics: 'Instant Markdown & Slack Webhook Dispatch',
    capabilities: [
      '1-click Markdown post-mortem document download',
      'Simulated Slack & Teams webhook alert dispatcher',
      'Mean Time To Resolution (MTTR) analytics',
    ],
  },
];

export default function FeaturesHomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeFeature, setActiveFeature] = useState<string>('multi-agent');

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
   * If user already has a saved designation (i.e., previously onboarded), go to dashboard.
   * Otherwise send them to the sign-in page — they must authenticate first.
   */
  const handleLogIn = () => {
    const savedDesignation = getStoredDesignation();
    if (session && savedDesignation) {
      // Fully authenticated + onboarded → go straight to dashboard
      router.push('/dashboard');
    } else if (session && !savedDesignation) {
      // Authenticated but never set designation → force onboarding
      router.push('/onboarding');
    } else {
      // Not authenticated → go to sign-in page
      router.push('/signin');
    }
  };

  /**
   * Handle Sign Up Button Click:
   * Navigates to the dedicated /signup page where the user can register
   * via Google OAuth or email, then proceeds to /onboarding for designation.
   */
  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <div className="relative min-h-screen space-y-16 pb-20 overflow-hidden bg-neutral-950">
      {/* Interactive Cyber Mesh Background */}
      <InteractiveMeshBackground />

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
