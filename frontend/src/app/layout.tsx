import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { TideSwirlShader } from '@/components/ui/TideSwirlShader';

export const metadata: Metadata = {
  title: 'Runbook Executor Agent | TrueForge Platform',
  description: 'AI-powered Incident Diagnosis, Runbook Execution, and Human Approval Platform built on TrueForge',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex antialiased selection:bg-indigo-500 selection:text-white relative">
        <TideSwirlShader />
        <Sidebar pendingApprovalsCount={1} />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
          <Header />
          <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
