'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide Sidebar and Global Header completely on Homepage (/), Sign In (/signin), Sign Up (/signup), and Onboarding (/onboarding)
  const isHomepageOrAuth = pathname === '/' || pathname === '/signin' || pathname === '/signup' || pathname === '/onboarding';

  if (isHomepageOrAuth) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 text-slate-100 relative overflow-x-hidden">
        <main className="w-full min-h-screen">{children}</main>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex antialiased selection:bg-indigo-500 selection:text-white relative w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        <Header />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
