'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { InteractiveMeshBackground } from '@/components/aceternity/InteractiveMeshBackground';

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/onboarding' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-10 px-4 relative overflow-hidden bg-neutral-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Interactive Mesh Background */}
      <InteractiveMeshBackground />

      {/* Top Header */}
      <div className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors">
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="font-bold text-sm tracking-wide text-slate-200">RUNBOOK AGENT</span>
        </Link>

        <div className="text-xs text-slate-400 font-medium">
          Already registered?{' '}
          <Link href="/signin" className="text-indigo-400 font-bold hover:underline">
            Log In →
          </Link>
        </div>
      </div>

      {/* Main Sign Up Card */}
      <main className="relative z-10 max-w-md w-full mx-auto my-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 space-y-7 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono font-semibold uppercase tracking-wider">
              Step 1 of 3: Google Identity
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Create SRE Account</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sign in with your Google account to access autonomous incident diagnosis and gate controls.
            </p>
          </div>

          {/* Trust Highlights */}
          <div className="space-y-2.5 py-2 border-y border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>TrueForge Human-in-the-loop Gate Enforcement</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Role-Based SRE Designation Verification</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>100% Non-Destructive MCP Diagnostic Suite</span>
            </div>
          </div>

          {/* Clean Google Auth Button */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-150 shadow-lg active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-500" />
            </button>

            <p className="text-center text-[11px] text-slate-500 font-mono">
              Next step: Set your operational SRE designation
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-[11px] text-slate-500 font-mono">
        TrueForge Agent Platform v0.2.0 • Secured by OAuth 2.0
      </footer>
    </div>
  );
}
