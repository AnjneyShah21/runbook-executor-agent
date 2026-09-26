'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Zap,
  Lock,
} from 'lucide-react';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';

const STEPS = [
  { num: '01', label: 'Google Sign Up', done: false, active: true },
  { num: '02', label: 'Set Designation', done: false, active: false },
  { num: '03', label: 'Enter Dashboard', done: false, active: false },
];

const PERKS = [
  { icon: ShieldCheck, text: 'Human-in-the-loop approval gates' },
  { icon: Zap, text: 'Autonomous runbook execution' },
  { icon: Lock, text: 'Role-based designation access control' },
];

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setLoading(true);
    // Always use real Google OAuth → on success redirects to /onboarding
    await signIn('google', { callbackUrl: '/onboarding' });
  };

  // Dev-only fallback when no Google credentials are configured
  const handleDevSignUp = () => {
    router.push('/onboarding');
  };

  const isGoogleConfigured = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== undefined;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden bg-neutral-950">
      <BackgroundBeams />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg relative z-10 space-y-5"
      >
        {/* Header badge */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <UserPlus className="w-3.5 h-3.5" /> New Account Registration
          </span>
        </div>

        {/* Main card */}
        <div className="p-8 rounded-3xl border border-emerald-500/25 bg-slate-900/90 backdrop-blur-xl shadow-2xl space-y-7"
          style={{ boxShadow: '0 0 50px -10px rgba(16,185,129,0.2)' }}>

          {/* Brand + Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
              <Cpu className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight leading-tight">
                Create Your Account
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Join the TrueForge SRE Operations Platform
              </p>
            </div>
          </div>

          {/* Step Progress */}
          <div className="flex items-center gap-0">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 ${step.active ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${
                    step.active
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                      : 'border-slate-700 text-slate-500'
                  }`}>
                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                  </div>
                  <span className={`text-[11px] font-semibold hidden sm:block ${step.active ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 ${i === 0 ? 'bg-slate-700' : 'bg-slate-800'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Perks */}
          <div className="space-y-2.5 py-1">
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800/80" />

          {/* Google Sign Up CTA */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm py-4 px-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/30 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#fff" fillOpacity="0.9" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#fff" fillOpacity="0.9" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#fff" fillOpacity="0.9" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#fff" fillOpacity="0.9" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{loading ? 'Redirecting to Google...' : 'Sign Up with Google'}</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </button>

            <p className="text-center text-[11px] text-slate-500 font-mono">
              After Google auth you&apos;ll set your operational designation
            </p>
          </div>
        </div>

        {/* Footer link to login */}
        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
          >
            Log In instead →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
