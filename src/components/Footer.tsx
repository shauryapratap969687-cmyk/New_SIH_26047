import React from 'react';
import { ShieldCheck, HeartPulse } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-teal-600 flex items-center justify-center text-white">
              <HeartPulse className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-white tracking-wide">AYUSH CaseFlow</span>
              <span className="text-slate-400 text-[11px] ml-2">SIH26047 Prototype</span>
            </div>
          </div>

          <div className="text-center md:text-left text-[11px] text-slate-400">
            Designed for Ministry of Ayush • Smart Automation in Clinical Record-Taking
          </div>

          <div className="flex items-center gap-2 text-[11px] text-amber-400/90 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Prototype Only • Not for real clinical diagnosis</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
