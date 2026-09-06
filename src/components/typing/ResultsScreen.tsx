"use client";

import React from "react";
import { 
  AreaChart,
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { RotateCcw, Play, Share2, Trophy, Zap, Crosshair, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { TestResult } from "@/types";

interface ResultsScreenProps {
  result: TestResult;
  onRetry: () => void;
  onNewTest: () => void;
}

export default function ResultsScreen({ result, onRetry, onNewTest }: ResultsScreenProps) {
  const { wpm, accuracy, errors, kps, wpmData } = result;

  const getWpmBadge = (wpmValue: number) => {
    if (wpmValue < 30) return { label: "Beginner", color: "bg-slate-500/20 text-slate-300 border-slate-500/30" };
    if (wpmValue < 50) return { label: "Average", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" };
    if (wpmValue < 70) return { label: "Proficient", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
    if (wpmValue < 90) return { label: "Fast Typist", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" };
    return { label: "Elite Typist", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" };
  };

  const getAccuracyColor = (acc: number) => {
    if (acc >= 96) return "text-emerald-400";
    if (acc >= 88) return "text-amber-300";
    return "text-rose-400";
  };

  const badge = getWpmBadge(wpm);

  const handleShare = () => {
    const text = `I just typed ${wpm} WPM with ${accuracy.toFixed(1)}% accuracy on TypeLy! ⌨️🔥`;
    navigator.clipboard.writeText(text);
    alert("Results copied to clipboard!");
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 py-4 animate-in fade-in slide-in-from-bottom-3 duration-400">
      
      {/* Title with Trophy icon */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-1 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          Test Completed
        </div>
        <h2 className="text-3xl font-black text-foreground tracking-tight">
          Performance Breakdown
        </h2>
        <p className="text-xs text-muted-foreground">Detailed speed and accuracy statistics</p>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* WPM Card */}
        <div className="bg-card/70 border border-border/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1.5 backdrop-blur-xs relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="flex items-center text-muted-foreground gap-1 text-[11px] font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>WPM</span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-indigo-400 dark:text-indigo-300 tracking-tight font-mono">
            {wpm}
          </div>
          <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", badge.color)}>
            {badge.label}
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="bg-card/70 border border-border/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1.5 backdrop-blur-xs group hover:border-primary/40 transition-colors">
          <div className="flex items-center text-muted-foreground gap-1 text-[11px] font-semibold uppercase tracking-wider">
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            <span>Accuracy</span>
          </div>
          <div className={cn("text-4xl sm:text-5xl font-black tracking-tight font-mono", getAccuracyColor(accuracy))}>
            {accuracy.toFixed(0)}%
          </div>
          <div className="text-[10px] font-medium text-muted-foreground">
            {accuracy >= 95 ? "High Precision" : "Keep Practicing"}
          </div>
        </div>

        {/* Errors Card */}
        <div className="bg-card/70 border border-border/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1.5 backdrop-blur-xs group hover:border-primary/40 transition-colors">
          <div className="flex items-center text-muted-foreground gap-1 text-[11px] font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Errors</span>
          </div>
          <div className={cn("text-4xl sm:text-5xl font-black tracking-tight font-mono", errors > 0 ? "text-rose-400" : "text-foreground")}>
            {errors}
          </div>
          <div className="text-[10px] font-medium text-muted-foreground">
            {errors === 0 ? "Flawless run" : `${errors} typos`}
          </div>
        </div>

        {/* KPS Card */}
        <div className="bg-card/70 border border-border/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1.5 backdrop-blur-xs group hover:border-primary/40 transition-colors">
          <div className="flex items-center text-muted-foreground gap-1 text-[11px] font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>KPS</span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-foreground tracking-tight font-mono">
            {kps.toFixed(1)}
          </div>
          <div className="text-[10px] font-medium text-muted-foreground">
            Keys / second
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-card/70 border border-border/80 rounded-2xl p-5 backdrop-blur-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-primary" />
            Typing Speed Trajectory
          </h3>
          <span className="text-[11px] text-muted-foreground font-mono">WPM over test duration</span>
        </div>

        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={wpmData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
              <XAxis 
                dataKey="second" 
                tickLine={false} 
                axisLine={false}
                className="text-[10px] fill-muted-foreground font-mono"
                tickFormatter={(val) => `${val}s`}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                className="text-[10px] fill-muted-foreground font-mono"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(18, 19, 32, 0.95)', 
                  borderColor: 'rgba(99, 102, 241, 0.3)',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
                formatter={(value: any) => [`${value} WPM`, 'Speed']}
                labelFormatter={(val) => `Second: ${val}s`}
              />
              <Area 
                type="monotone" 
                dataKey="wpm" 
                stroke="#6366f1" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#wpmGradient)"
                activeDot={{ r: 5, fill: "#818cf8", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-secondary/80 hover:bg-secondary text-foreground transition-all duration-150 border border-border/80 hover:border-primary/40 shadow-xs active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-muted-foreground" />
          Retry Test
        </button>
        <button
          onClick={onNewTest}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          New Text
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border border-border/80 bg-card/60 hover:bg-card text-muted-foreground hover:text-foreground transition-all duration-150 shadow-xs active:scale-95"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
}
