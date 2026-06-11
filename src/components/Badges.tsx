import React from 'react';
import { Zap } from 'lucide-react';
import type { ThreatLevel } from '../types';
import { LEVEL_STYLE } from '../constants';

export function LevelBadge({ level }: { level: ThreatLevel }) {
  const s = LEVEL_STYLE[level];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot} ${level === 'Critical' ? 'animate-pulse' : ''}`} />
      {level}
    </span>
  );
}

export function PillBadge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${className}`}>
      {children}
    </span>
  );
}

export function DemoBadge() {
  return (
    <PillBadge className="bg-purple-100 text-purple-700 border border-purple-200">
      <Zap className="w-2.5 h-2.5" /> Demo
    </PillBadge>
  );
}

export function LiveBadge() {
  return (
    <PillBadge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
        <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-500" />
      </span>
      Live
    </PillBadge>
  );
}