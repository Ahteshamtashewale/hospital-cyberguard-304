import React, { useState } from "react";
import { Sparkles, HelpCircle, ChevronDown, ChevronUp, ArrowRight, Lightbulb } from "lucide-react";

interface GuestExplainerBannerProps {
  title: string;
  whatItDoes: string;
  whyItMatters: string;
  quickTryAction: string;
}

export const GuestExplainerBanner: React.FC<GuestExplainerBannerProps> = ({
  title,
  whatItDoes,
  whyItMatters,
  quickTryAction,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="bg-gradient-to-r from-blue-950/40 via-[#0f172a]/60 to-[#0d1117] border border-blue-500/30 rounded-xl p-4 shadow-lg mb-6 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                GUEST GUIDE
              </span>
              <h3 className="text-xs font-semibold text-white">
                {title}: <span className="text-blue-200 font-normal">What you are seeing on this screen</span>
              </h3>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/40 hover:text-white p-1 rounded transition-colors text-xs flex items-center space-x-1 cursor-pointer"
        >
          <span className="text-[11px] hidden sm:inline font-mono">
            {isExpanded ? "Hide Guide" : "Show Plain English Guide"}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3.5 pt-3 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-1">
            <div className="text-[10px] font-mono uppercase text-blue-300 font-semibold">
              🎯 In Plain Words:
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {whatItDoes}
            </p>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-1">
            <div className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
              🏥 Why Hospitals Need This:
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {whyItMatters}
            </p>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-1">
            <div className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
              🚀 Try This Right Now:
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {quickTryAction}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
