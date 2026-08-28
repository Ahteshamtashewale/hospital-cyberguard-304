import React, { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  FileCheck2,
  Sliders,
  Activity,
  MailWarning,
  Lock,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { TabType } from "../types";

interface TourStep {
  title: string;
  tab: TabType;
  tagline: string;
  icon: React.ReactNode;
  badge: string;
  problem: string;
  solution: string;
  whatYouGet: string;
  quickActionPrompt: string;
}

interface GuestTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const GuestTourModal: React.FC<GuestTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const tourSteps: TourStep[] = [
    {
      title: "1. Welcome & Executive Overview",
      tab: "guest_overview",
      tagline: "The 30-Second Summary of Hospital CyberGuard (ID-304)",
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      badge: "START HERE",
      problem:
        "Modern hospitals are heavily targeted by ransomware, medical device tampering, and patient data theft. Non-technical guests often find cybersecurity too complex to follow.",
      solution:
        "This suite provides a comprehensive, automated defense system that protects patient lives, clinical hardware, digital prescriptions, and privacy compliance.",
      whatYouGet:
        "A clear, self-explanatory control center where anyone can explore the 6 key capabilities with interactive 1-click hospital scenarios.",
      quickActionPrompt: "Explore the 6 core pillars below or proceed to the next tour step.",
    },
    {
      title: "2. Tamper-Proof Medical Records",
      tab: "crypto_verifier",
      tagline: "Preventing Illegal Drug & Prescription Modifications",
      icon: <FileCheck2 className="w-5 h-5 text-emerald-400" />,
      badge: "CRYPTO INTEGRITY",
      problem:
        "If a rogue actor secretly modifies a patient's dosage from 10mg to 500mg in the hospital database, standard systems fail to notice, risking fatal overdoses.",
      solution:
        "Every clinical chart is digitally signed with the doctor's ECDSA P-256 cryptographic key and SHA-256 hash. If even a single comma changes, the system instantly flags it.",
      whatYouGet:
        "100% mathematical guarantee that medical records, doctor orders, and lab reports have never been altered.",
      quickActionPrompt: "Try modifying the prescription text to watch the instant red tamper alert.",
    },
    {
      title: "3. Smart Medical Device (IoMT) Shield",
      tab: "iomt_hardware",
      tagline: "Protecting ICU Ventilators, Infusion Pumps & Heart Monitors",
      icon: <Sliders className="w-5 h-5 text-cyan-400" />,
      badge: "DEVICE SAFETY",
      problem:
        "Hackers can upload malicious firmware into hospital ventilators or infusion pumps over Wi-Fi, endangering patients in critical care.",
      solution:
        "Hardware Security Modules (HSM) continuously verify firmware checksums. If unauthorized firmware is detected, the device is quarantined within milliseconds.",
      whatYouGet:
        "Zero rogue firmware execution on life-critical hospital machinery with automated 802.1X network isolation.",
      quickActionPrompt: "Click 'Simulate Tamper' on an ICU ventilator to see automatic quarantine.",
    },
    {
      title: "4. 24/7 Real-Time SOC Attack Defense",
      tab: "soc_dashboard",
      tagline: "Live Hospital Firewall & Ransomware Containment",
      icon: <Activity className="w-5 h-5 text-blue-400" />,
      badge: "ATTACK DEFENSE",
      problem:
        "Hospitals face hundreds of cyber intrusion attempts daily from ransomware gangs and automated botnets trying to disrupt hospital servers.",
      solution:
        "Live Security Operations Center (SOC) monitors hospital network traffic, correlates threat signatures, and provides 1-click firewall blocking and AI root-cause investigation.",
      whatYouGet:
        "Instant visibility into hospital cyber alarms with sub-second automated threat containment.",
      quickActionPrompt: "Click 'Simulate Live Attack' and then click 'Contain Threat' to isolate the hacker.",
    },
    {
      title: "5. AI Anti-Phishing Shield for Hospital Staff",
      tab: "phishing_shield",
      tagline: "Protecting Busy Doctors & Nurses from Fake Emails",
      icon: <MailWarning className="w-5 h-5 text-violet-400" />,
      badge: "AI EMAIL SHIELD",
      problem:
        "Over 85% of hospital breaches start with a nurse or doctor clicking a fake urgent email (e.g. 'URGENT: Change shift password or lose access').",
      solution:
        "Gemini AI inspects emails for psychological coercion, spoofed domains, and credential harvesting links, providing a 0-100 risk score and plain-English safety advice.",
      whatYouGet:
        "Automated protection against staff credential theft and email-borne ransomware.",
      quickActionPrompt: "Select a sample phishing email and click 'Analyze with AI Shield'.",
    },
    {
      title: "6. Zero-Trust IAM & Code-Blue Emergency",
      tab: "zero_trust_iam",
      tagline: "Strict Access Security + Life-Saving Emergency Bypass",
      icon: <Lock className="w-5 h-5 text-amber-400" />,
      badge: "EMERGENCY ACCESS",
      problem:
        "Strict security can slow down doctors during a cardiac arrest (Code Blue) when every second counts, while loose access invites unauthorized snooping.",
      solution:
        "Enforces strict Zero-Trust ABAC (Attribute-Based Access Control) with an audited emergency 'Break-Glass' override that grants instant access while logging the doctor's license.",
      whatYouGet:
        "Zero delay during life-or-death patient resuscitation emergencies paired with 100% auditable accountability.",
      quickActionPrompt: "Test an unauthorized access attempt vs a Code-Blue emergency override.",
    },
    {
      title: "7. Healthcare Privacy & DPDP Compliance",
      tab: "privacy_governance",
      tagline: "Automated Data Protection & Patient Redaction",
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      badge: "LEGAL & COMPLIANCE",
      problem:
        "Sharing medical research data can accidentally expose sensitive patient names, addresses, and disease history, causing heavy legal penalties under the DPDP Act 2023 & HIPAA.",
      solution:
        "1-click automated de-identification engine removes all 18 HIPAA Safe Harbor identifiers and validates hospital compliance against DPDP Act Section 6 consent rules.",
      whatYouGet:
        "Complete regulatory compliance peace of mind with verifiable privacy redaction.",
      quickActionPrompt: "Click 'De-Identify PHI Record' to watch personal data get sanitized in real-time.",
    },
  ];

  const currentStep = tourSteps[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === tourSteps.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleJumpToTab = () => {
    onNavigateTab(currentStep.tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#111116] border border-blue-500/30 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(37,99,235,0.25)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#0d0d12] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              {currentStep.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                  {currentStep.badge}
                </span>
                <span className="text-xs text-white/40 font-mono">
                  Step {currentStepIndex + 1} of {tourSteps.length}
                </span>
              </div>
              <h2 className="text-lg font-serif font-bold text-white mt-0.5">
                {currentStep.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex px-6 pt-4 gap-1.5">
          {tourSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-1.5 flex-1 rounded-full transition-all duration-200 cursor-pointer ${
                idx === currentStepIndex
                  ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                  : idx < currentStepIndex
                  ? "bg-emerald-500/60"
                  : "bg-white/10 hover:bg-white/20"
              }`}
              title={step.title}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3.5 flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-200 font-medium leading-relaxed">
              {currentStep.tagline}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* The Hospital Problem */}
            <div className="bg-[#0a0a0e] border border-red-500/20 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center space-x-2 text-red-400 text-xs font-semibold uppercase tracking-wider font-mono">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span>The Hospital Risk</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentStep.problem}
              </p>
            </div>

            {/* The Solution */}
            <div className="bg-[#0a0a0e] border border-emerald-500/20 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Our Solution</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentStep.solution}
              </p>
            </div>
          </div>

          {/* Tangible Deliverable */}
          <div className="bg-[#0a0a0e] border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-blue-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>What You Get From This:</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed pl-6">
              {currentStep.whatYouGet}
            </p>
          </div>

          {/* Quick Action Prompt */}
          <div className="text-[11px] text-white/50 font-mono flex items-center space-x-2">
            <span className="text-amber-400 font-bold">💡 Try it:</span>
            <span>{currentStep.quickActionPrompt}</span>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-5 border-t border-white/10 bg-[#0d0d12] flex items-center justify-between">
          <button
            onClick={handleJumpToTab}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer"
          >
            <span>Open This Module</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={isFirst}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isFirst
                  ? "opacity-30 cursor-not-allowed text-white/40"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10 cursor-pointer"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {isLast ? (
              <button
                onClick={onClose}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Tour</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all cursor-pointer"
              >
                <span>Next Feature</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
