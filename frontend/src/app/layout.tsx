import type { Metadata } from 'next';
import './globals.css';
import { TideSwirlShader } from '@/components/ui/TideSwirlShader';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { AppShell } from '@/components/providers/AppShell';

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
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white relative">
        <AuthProvider>
          <TideSwirlShader />
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
