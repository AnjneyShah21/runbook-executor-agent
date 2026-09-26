'use client';

import { useState, useEffect } from 'react';

export function TypewriterTitle() {
  const line1Text = 'Autonomous Production';
  const line2Text = 'Incident Diagnosis & Runbook Execution';

  const [displayedLine1, setDisplayedLine1] = useState('');
  const [displayedLine2, setDisplayedLine2] = useState('');
  const [phase, setPhase] = useState<'line1' | 'line2' | 'complete'>('line1');

  useEffect(() => {
    if (phase === 'line1') {
      if (displayedLine1.length < line1Text.length) {
        const timeout = setTimeout(() => {
          setDisplayedLine1(line1Text.slice(0, displayedLine1.length + 1));
        }, 45);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setPhase('line2'), 250);
        return () => clearTimeout(timeout);
      }
    } else if (phase === 'line2') {
      if (displayedLine2.length < line2Text.length) {
        const timeout = setTimeout(() => {
          setDisplayedLine2(line2Text.slice(0, displayedLine2.length + 1));
        }, 35);
        return () => clearTimeout(timeout);
      } else {
        setPhase('complete');
      }
    }
  }, [displayedLine1, displayedLine2, phase]);

  return (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight font-sans">
      <span>{displayedLine1}</span>
      {phase === 'line1' && (
        <span className="text-indigo-400 font-mono animate-pulse inline-block ml-1">|</span>
      )}
      <br />
      <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
        {displayedLine2}
      </span>
      {phase !== 'line1' && (
        <span className="text-cyan-400 font-mono animate-pulse inline-block ml-1">|</span>
      )}
    </h1>
  );
}
