import React from "react";
import {
  Shield,
  Activity,
  Lock,
  Radio,
  FileCheck2,
  MailWarning,
  Sliders,
  Sparkles,
  GitBranch,
  Play,
  GraduationCap,
  Volume2,
} from "lucide-react";
import { TabType } from "../types";

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  threatCount: number;
  onOpenTour: () => void;
  onOpenEvaluatorGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  threatCount,
  onOpenTour,
  onOpenEvaluatorGuide,
}) => {
  const navItems: {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    isHighlighted?: boolean;
  }[] = [
    {
      id: "guest_overview",
      label: "🌟 Guest & Evaluator Hub",
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      badge: "START HERE",
      isHighlighted: true,
    },
    {
      id: "soc_dashboard",
      label: "SOC Threat Monitor",
      icon: <Activity className="w-4 h-4" />,
      badge: `${threatCount} Active`,
    },
    {
      id: "api_scanner",
      label: "API Scanner",
      icon: <Radio className="w-4 h-4" />,
    },
    {
      id: "crypto_verifier",
      label: "Record Signatures",
      icon: <FileCheck2 className="w-4 h-4" />,
    },
    {
      id: "phishing_shield",
      label: "AI Phishing Shield",
      icon: <MailWarning className="w-4 h-4" />,
    },
    {
      id: "zero_trust_iam",
      label: "Zero-Trust & Break-Glass",
      icon: <Lock className="w-4 h-4" />,
    },
    {
      id: "iomt_hardware",
      label: "IoMT & HSM",
      icon: <Sliders className="w-4 h-4" />,
    },
    {
      id: "privacy_governance",
      label: "DPDP & HIPAA Privacy",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "github_export",
      label: "Export & Docs",
      icon: <GitBranch className="w-4 h-4" />,
      badge: "Package",
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d12] border-b border-white/10 shadow-2xl backdrop-blur-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div
            onClick={() => setActiveTab("guest_overview")}
            className="flex items-center space-x-3.5 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/30 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-serif font-bold tracking-tight text-white group-hover:text-blue-300 transition-colors">
                  SENTINEL PRIVACY VAULT
                </h1>
                <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                  ID-304
                </span>
              </div>
              <p className="text-[11px] text-white/40 font-mono">
                HOSPITAL CYBER DEFENSE & PRIVACY GOVERNANCE
              </p>
            </div>
          </div>

          {/* Right Action: Evaluator Guide, Teleprompter, Guided Tour */}
          <div className="flex items-center space-x-2.5 text-xs">
            {/* Evaluator Guide Button */}
            <button
              onClick={onOpenEvaluatorGuide}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)] font-bold transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Evaluator Guide & Script</span>
            </button>

            {/* Guided Tour */}
            <button
              onClick={onOpenTour}
              className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Tour</span>
            </button>

            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1.5 bg-emerald-500/5 rounded-lg border border-emerald-500/20 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-[11px]">
                <strong className="text-emerald-400">DEFENSE ACTIVE</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-2.5 pt-1 border-t border-white/5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? item.isHighlighted
                      ? "bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)] font-bold"
                      : "bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.25)] font-semibold"
                    : item.isHighlighted
                    ? "text-amber-300/80 hover:text-amber-200 hover:bg-amber-500/10 border border-amber-500/20"
                    : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <span className={isActive ? (item.isHighlighted ? "text-amber-400" : "text-blue-400") : "text-white/40"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      item.isHighlighted
                        ? "bg-amber-500/25 text-amber-300 border border-amber-500/30"
                        : isActive
                        ? "bg-blue-500/30 text-blue-200 border border-blue-400/30"
                        : "bg-white/5 text-white/40 border border-white/10"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
