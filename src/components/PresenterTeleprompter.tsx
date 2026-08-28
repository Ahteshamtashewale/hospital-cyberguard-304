import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  X,
  Play,
  Pause,
  Square,
  ArrowRight,
  GraduationCap,
  Volume2,
  VolumeX,
  MousePointer,
  CheckCircle2,
  Radio,
  Sliders,
  Settings,
} from "lucide-react";
import { TabType } from "../types";

interface PresenterTeleprompterProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  onNavigateTab: (tab: TabType) => void;
}

export const PresenterTeleprompter: React.FC<PresenterTeleprompterProps> = ({
  isOpen,
  onClose,
  activeTab,
  onNavigateTab,
}) => {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);

  const stepIndexRef = useRef(stepIndex);
  stepIndexRef.current = stepIndex;

  const autoAdvanceRef = useRef(autoAdvance);
  autoAdvanceRef.current = autoAdvance;

  const teleprompterSteps = [
    {
      title: "Step 1: Introduction & Mission Pitch",
      time: "0:00 - 0:45",
      tab: "guest_overview" as TabType,
      sayText:
        "Welcome evaluators. Hospital CyberGuard (ID-304) is a clinical cyber defense and data privacy suite built to protect patient lives, medical IoT devices such as ICU ventilators and infusion pumps, and electronic health records from ransomware, BOLA API leaks, and illegal prescription alterations.",
      clickAction: "Stay on 'Guest Overview' screen -> Point to the 6-pillar deliverables grid and 8 monitored departments.",
    },
    {
      title: "Step 2: Tamper-Proof Medical Records Demo",
      time: "0:45 - 1:30",
      tab: "crypto_verifier" as TabType,
      sayText:
        "Here we prove 100% tamper-detection. Every clinical chart is signed with the doctor's ECDSA P-256 cryptographic key and SHA-256 digest. When an attacker alters the dosage from 10mg to 500mg, the signature breaks immediately, stopping the pharmacy from dispensing the drug.",
      clickAction: "Click 'Record Signatures' -> Edit the diagnosis or dosage field -> Point to the red tamper alarm.",
    },
    {
      title: "Step 3: Medical Devices (IoMT) & Break-Glass IAM",
      time: "1:30 - 2:30",
      tab: "iomt_hardware" as TabType,
      sayText:
        "Next, life-critical ventilators are anchored to an HSM root-of-trust. Corrupted firmware triggers automated 802.1X quarantine in 45 milliseconds. In Zero-Trust IAM, we enforce strict attribute-based access control with a life-saving sub-50ms Break-Glass emergency bypass for Code-Blue resuscitations.",
      clickAction: "Click 'IoMT & HSM' -> Click 'Simulate Tamper' on the Ventilator -> Show automatic quarantine.",
    },
    {
      title: "Step 4: AI Phishing, DPDP 2023 & Conclusion",
      time: "2:30 - 3:15",
      tab: "privacy_governance" as TabType,
      sayText:
        "Finally, Gemini AI blocks staff phishing attacks, and our Privacy Studio sanitizes 18 HIPAA Safe Harbor identifiers in 1 click, achieving full statutory compliance with India's DPDP Act 2023. Project ID-304 delivers an enterprise-ready defense shield for modern healthcare. Thank you, we are ready for your questions.",
      clickAction: "Click 'DPDP & HIPAA Privacy' -> Show de-identified patient output -> Invite evaluator questions!",
    },
  ];

  const currentStep = teleprompterSteps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === teleprompterSteps.length - 1;

  // Load available speech synthesis voices
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const englishVoices = voices.filter((v) => v.lang.startsWith("en"));
        const listToUse = englishVoices.length > 0 ? englishVoices : voices;
        setAvailableVoices(listToUse);

        // Prefer natural / google / microsoft English voices
        const naturalIndex = listToUse.findIndex(
          (v) =>
            v.name.includes("Natural") ||
            v.name.includes("Google") ||
            v.name.includes("Samantha") ||
            v.name.includes("David") ||
            v.name.includes("Zira")
        );
        setSelectedVoiceIndex(naturalIndex >= 0 ? naturalIndex : 0);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speech when teleprompter closes
  useEffect(() => {
    if (!isOpen && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [isOpen]);

  // Speak the given step text
  const speakStep = (targetIndex: number) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const targetStep = teleprompterSteps[targetIndex];
    if (!targetStep) return;

    // Navigate to step's tab if not already there
    onNavigateTab(targetStep.tab);

    const utterance = new SpeechSynthesisUtterance(targetStep.sayText);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    if (availableVoices[selectedVoiceIndex]) {
      utterance.voice = availableVoices[selectedVoiceIndex];
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);

      // If auto-advance is enabled and not at the last step, proceed to next step automatically
      const currentIdx = stepIndexRef.current;
      if (autoAdvanceRef.current) {
        if (currentIdx < teleprompterSteps.length - 1) {
          const nextIdx = currentIdx + 1;
          setStepIndex(nextIdx);
          // Small 800ms natural pause between slides
          setTimeout(() => {
            speakStep(nextIdx);
          }, 800);
        } else {
          // Finished the last step -> Jump automatically to the main screen!
          setTimeout(() => {
            onNavigateTab("guest_overview");
            setStepIndex(0);
          }, 1200);
        }
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayVoice = () => {
    if (isPaused && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    } else {
      speakStep(stepIndex);
    }
  };

  const handlePauseVoice = () => {
    if ("speechSynthesis" in window && isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleStopVoice = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const handleFinishAndReturnHome = () => {
    handleStopVoice();
    setStepIndex(0);
    onNavigateTab("guest_overview");
    onClose();
  };

  const handleStepJump = (index: number) => {
    handleStopVoice();
    setStepIndex(index);
    onNavigateTab(teleprompterSteps[index].tab);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md pointer-events-none animate-slide-up">
      <div className="bg-[#111116] border border-amber-500/40 rounded-2xl shadow-[0_0_35px_rgba(245,158,11,0.3)] overflow-hidden flex flex-col backdrop-blur-lg pointer-events-auto">
        {/* Teleprompter Header */}
        <div className="p-3.5 bg-gradient-to-r from-[#181824] to-[#12121a] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-400 flex items-center space-x-1">
                  <span>VOICE TELEPROMPTER</span>
                  {isSpeaking && (
                    <span className="flex items-center space-x-0.5 ml-1">
                      <span className="w-1 h-2.5 bg-amber-400 animate-pulse rounded-full"></span>
                      <span className="w-1 h-3.5 bg-amber-300 animate-pulse rounded-full delay-75"></span>
                      <span className="w-1 h-2 bg-amber-400 animate-pulse rounded-full delay-150"></span>
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  {stepIndex + 1}/{teleprompterSteps.length}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white truncate max-w-[210px]">
                {currentStep.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                showVoiceSettings
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-white/50 hover:text-white hover:bg-white/10"
              }`}
              title="Voice Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={handleFinishAndReturnHome}
              className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close and Return to Main Screen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Voice Settings Panel */}
        {showVoiceSettings && !isMinimized && (
          <div className="p-3 bg-[#0a0a0f] border-b border-white/10 space-y-2 text-[11px] font-mono">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Voice Model:</span>
              <select
                value={selectedVoiceIndex}
                onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                className="bg-[#161822] text-amber-300 border border-white/10 rounded px-2 py-0.5 text-[11px] max-w-[180px] truncate"
              >
                {availableVoices.map((voice, idx) => (
                  <option key={idx} value={idx}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/60">Voice Speed:</span>
              <div className="flex items-center space-x-1">
                {[0.9, 1.0, 1.15, 1.3].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setSpeechRate(rate)}
                    className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                      speechRate === rate
                        ? "bg-amber-500 text-black font-bold"
                        : "bg-white/5 text-white/50 hover:text-white"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <span className="text-white/60">Auto-Advance to Next Step:</span>
              <button
                onClick={() => setAutoAdvance(!autoAdvance)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                  autoAdvance
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/5 text-white/40"
                }`}
              >
                {autoAdvance ? "ON (Full Auto Demo)" : "OFF"}
              </button>
            </div>
          </div>
        )}

        {/* Teleprompter Expanded Content */}
        {!isMinimized && (
          <div className="p-4 space-y-3 text-xs">
            {/* Step Progress Dots */}
            <div className="flex gap-1.5">
              {teleprompterSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStepJump(idx)}
                  className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
                    idx === stepIndex
                      ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                      : idx < stepIndex
                      ? "bg-emerald-500/60"
                      : "bg-white/10"
                  }`}
                  title={step.title}
                />
              ))}
            </div>

            {/* Voice Control Bar */}
            <div className="flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-[#181a24] to-blue-500/10 border border-amber-500/20 rounded-xl p-2.5">
              <div className="flex items-center space-x-2">
                {isSpeaking ? (
                  <button
                    onClick={handlePauseVoice}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause Voice</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePlayVoice}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isPaused ? "Resume Voice" : "🔊 Speak by Voice"}</span>
                  </button>
                )}

                {(isSpeaking || isPaused) && (
                  <button
                    onClick={handleStopVoice}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors cursor-pointer"
                    title="Stop Voice"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-1 text-[11px] font-mono text-white/50">
                <span className="text-amber-400 font-bold">{speechRate}x</span>
                {autoAdvance && <span className="text-emerald-400">| Auto ⏩</span>}
              </div>
            </div>

            {/* What to Say */}
            <div className={`border rounded-xl p-3 space-y-1 transition-all ${
              isSpeaking
                ? "bg-amber-500/10 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                : "bg-amber-500/5 border-amber-500/20"
            }`}>
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-amber-300 font-bold">
                <span className="flex items-center space-x-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>🎙️ SPEAKER SCRIPT (VOICE NARRATION):</span>
                </span>
                {isSpeaking && (
                  <span className="text-emerald-400 animate-pulse text-[9px]">● SPEAKING NOW</span>
                )}
              </div>
              <p className="text-slate-100 text-xs leading-relaxed italic font-sans">
                "{currentStep.sayText}"
              </p>
            </div>

            {/* What to Click */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-2.5 space-y-0.5">
              <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase text-blue-300 font-bold">
                <MousePointer className="w-3.5 h-3.5 text-blue-400" />
                <span>🖱️ CLICK & DEMONSTRATE:</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {currentStep.clickAction}
              </p>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <button
                onClick={() => onNavigateTab(currentStep.tab)}
                className="flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300 font-mono font-medium cursor-pointer"
              >
                <span>Jump to Screen</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => handleStepJump(stepIndex - 1)}
                  disabled={isFirst}
                  className={`p-1.5 rounded-lg border border-white/10 transition-colors ${
                    isFirst ? "opacity-30 cursor-not-allowed text-white/30" : "bg-white/5 hover:bg-white/10 text-white cursor-pointer"
                  }`}
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {isLast ? (
                  <button
                    onClick={handleFinishAndReturnHome}
                    className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-black shadow-md transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Finish & Return Home</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStepJump(stepIndex + 1)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black shadow-md transition-all cursor-pointer"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
