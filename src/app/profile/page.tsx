import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Award, Zap, Crosshair, Sparkles, ArrowLeft, Calendar, ShieldCheck } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  let results: any[] = [];
  try {
    results = await prisma.testResult.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    results = [];
  }

  // Fallback to local file results if database had no results or is unconfigured
  if (results.length === 0) {
    const { getLocalResults } = await import("@/lib/userStore");
    results = getLocalResults((session.user as any).id);
  }

  // Deduplicate results if any identical tests were saved within 3 seconds of each other
  const uniqueResults: any[] = [];
  for (const r of results) {
    const isDup = uniqueResults.some(existing => 
      existing.wpm === r.wpm &&
      existing.accuracy === r.accuracy &&
      existing.duration === r.duration &&
      Math.abs(new Date(existing.createdAt).getTime() - new Date(r.createdAt).getTime()) < 3000
    );
    if (!isDup) {
      uniqueResults.push(r);
    }
  }
  results = uniqueResults;

  const totalTests = results.length;
  const bestWpm = results.reduce((max, r) => Math.max(max, r.wpm), 0);
  const avgAccuracy = totalTests > 0 
    ? results.reduce((sum, r) => sum + r.accuracy, 0) / totalTests 
    : 0;
  const bestKps = results.reduce((max, r) => Math.max(max, r.kps), 0);

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8 flex flex-col gap-6 flex-1 animate-in fade-in duration-300">
      
      {/* Header Profile Card */}
      <div className="bg-card/80 border border-border/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center gap-6 justify-between backdrop-blur-md">
        <div className="flex items-center gap-4">
          {session.user.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name || "User"} 
              className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/40"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              {session.user.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-foreground tracking-tight">{session.user.name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{session.user.email}</p>
          </div>
        </div>
        <Link 
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(99,102,241,0.35)] active:scale-98"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Test
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card/70 border border-border/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-xs">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <Award className="w-3.5 h-3.5 text-primary" />
            Tests Taken
          </div>
          <p className="text-3xl font-black font-mono text-foreground">{totalTests}</p>
        </div>

        <div className="bg-card/70 border border-border/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-xs">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Highest WPM
          </div>
          <p className="text-3xl font-black font-mono text-indigo-400 dark:text-indigo-300">{bestWpm}</p>
        </div>

        <div className="bg-card/70 border border-border/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-xs">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            Avg Accuracy
          </div>
          <p className="text-3xl font-black font-mono text-emerald-400">
            {totalTests > 0 ? `${avgAccuracy.toFixed(0)}%` : "—"}
          </p>
        </div>

        <div className="bg-card/70 border border-border/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-xs">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Best KPS
          </div>
          <p className="text-3xl font-black font-mono text-foreground">{bestKps.toFixed(1)}</p>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-card/70 border border-border/80 rounded-2xl shadow-xl overflow-hidden flex flex-col flex-1 backdrop-blur-xs">
        <div className="px-6 py-4 border-b border-border/70 flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Test History
          </h2>
          <span className="text-xs text-muted-foreground font-mono">Recent sessions</span>
        </div>
        
        {totalTests === 0 ? (
          <div className="p-12 text-center text-muted-foreground space-y-3">
            <p className="text-sm">No test sessions recorded yet on this account.</p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-semibold transition-colors"
            >
              Start your first test &rarr;
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left text-muted-foreground">
              <thead className="text-[11px] text-muted-foreground uppercase bg-muted/40 border-b border-border/70 font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Mode</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">WPM</th>
                  <th className="px-6 py-3">Accuracy</th>
                  <th className="px-6 py-3">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3.5 whitespace-nowrap text-foreground">
                      {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(result.createdAt))}
                    </td>
                    <td className="px-6 py-3.5 capitalize font-medium">{result.textMode}</td>
                    <td className="px-6 py-3.5 font-mono">{result.duration}s</td>
                    <td className="px-6 py-3.5 font-black font-mono text-indigo-400 dark:text-indigo-300 text-base">{result.wpm}</td>
                    <td className="px-6 py-3.5 font-mono text-emerald-400 font-semibold">{result.accuracy}%</td>
                    <td className="px-6 py-3.5 font-mono">{result.errors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
