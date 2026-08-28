import React, { useState } from "react";
import {
  MailWarning,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Send,
  Users,
  CheckCircle,
  FileSearch,
  ExternalLink,
  Shield,
  Layers,
} from "lucide-react";
import { phishingScenarios } from "../data/mockData";
import { GuestExplainerBanner } from "./GuestExplainerBanner";

export const PhishingShield: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState(phishingScenarios[0]);
  const [sender, setSender] = useState(phishingScenarios[0].sender);
  const [subject, setSubject] = useState(phishingScenarios[0].subject);
  const [content, setContent] = useState(phishingScenarios[0].content);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulated Department Training Stats
  const [campaignStats, setCampaignStats] = useState([
    { dept: "Emergency & ICU", emailsSent: 140, clicked: 8, reported: 124, risk: "LOW" },
    { dept: "Radiology & Imaging", emailsSent: 85, clicked: 12, reported: 68, risk: "MEDIUM" },
    { dept: "Pharmacy & Dispensing", emailsSent: 60, clicked: 3, reported: 55, risk: "LOW" },
    { dept: "Hospital Administration & Billing", emailsSent: 95, clicked: 24, reported: 58, risk: "HIGH" },
  ]);

  const runPhishingAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch("/api/ai/analyze-phishing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender,
          subject,
          emailContent: content,
          headers: "Received: from mail-spoof.relay.net by mx.metrohealth.org with ESMTP",
        }),
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error("Phishing analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectScenario = (sc: typeof phishingScenarios[0]) => {
    setSelectedScenario(sc);
    setSender(sc.sender);
    setSubject(sc.subject);
    setContent(sc.content);
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Guest Explainer Banner */}
      <GuestExplainerBanner
        title="AI Anti-Phishing Shield for Hospital Staff"
        whatItDoes="Scans incoming messages using Gemini AI to protect doctors, nurses, and hospital accountants from fake emergency emails and ransomware links."
        whyItMatters="85% of hospital ransomware attacks start with a busy nurse or doctor clicking a fake urgent email."
        quickTryAction="Pick any scenario below (e.g. 'Urgent Shift Verification') and click 'AI Phishing Scan' at the top right to see AI dissect the threat in seconds."
      />

      {/* Intro Header */}
      <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                CHALLENGE AREA 3
              </span>
              <h2 className="text-lg font-serif font-bold text-white">
                Healthcare Phishing Detection Algorithms & Social Engineering Shield
              </h2>
            </div>
            <p className="text-xs text-white/50 mt-1 max-w-3xl leading-relaxed">
              AI-driven linguistic & domain verification engine inspecting healthcare-targeted spear-phishing, fake regulatory subpoenas, credential harvesters, and ransomware drop vectors with automated containment workflows.
            </p>
          </div>

          <button
            id="btn-analyze-phishing"
            onClick={runPhishingAnalysis}
            disabled={isAnalyzing}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isAnalyzing ? "Analyzing Message..." : "AI Phishing Scan"}</span>
          </button>
        </div>
      </div>

      {/* Preset Scenarios Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {phishingScenarios.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => handleSelectScenario(sc)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-br from-[#181822] to-[#0f0f14] border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/30"
                  : "bg-[#0d0d12] border-white/10 hover:bg-[#111116] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  THREAT VECTOR
                </span>
              </div>
              <h4 className="text-xs font-serif font-bold text-white mt-2 line-clamp-1">{sc.title}</h4>
              <p className="text-[11px] font-mono text-white/50 mt-1 truncate">From: {sc.sender}</p>
            </div>
          );
        })}
      </div>

      {/* Main Analysis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Email Message Inspector / Editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <MailWarning className="w-4 h-4 text-amber-400" />
                INBOUND SUSPICIOUS HOSPITAL MESSAGE
              </h3>
              <span className="text-[11px] font-mono text-white/40">SMTP Gateway Quarantine</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider block mb-1">Sender Address (From:)</label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider block mb-1">Subject Header</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider block mb-1">Body Text & Embedded Links / Attachments</label>
                <textarea
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg p-3 text-xs text-white/80 font-mono leading-relaxed focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Department Training & Phishing Simulation Campaign Table */}
          <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" />
                STAFF PHISHING DEFENSE & READINESS CAMPAIGN
              </h3>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">Q3 READINESS ACTIVE</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-[10px] font-mono uppercase tracking-wider">
                    <th className="pb-2 font-semibold">Hospital Department</th>
                    <th className="pb-2 font-semibold">Simulated Phish</th>
                    <th className="pb-2 font-semibold">Clicked (Failed)</th>
                    <th className="pb-2 font-semibold">Reported to SOC</th>
                    <th className="pb-2 font-semibold">Risk Posture</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {campaignStats.map((st, idx) => (
                    <tr key={idx} className="text-white/80">
                      <td className="py-2.5 font-medium">{st.dept}</td>
                      <td className="py-2.5 font-mono">{st.emailsSent}</td>
                      <td className="py-2.5 text-red-400 font-mono font-bold">{st.clicked}</td>
                      <td className="py-2.5 text-emerald-400 font-mono font-bold">{st.reported}</td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            st.risk === "LOW"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : st.risk === "MEDIUM"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {st.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: AI Phishing Forensic Report & Remediation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                Phishing Threat Analysis Result
              </h3>
              {analysisResult && (
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded font-mono ${
                    analysisResult.riskLevel === "CRITICAL" || analysisResult.riskLevel === "HIGH"
                      ? "bg-red-500/10 text-red-400 border border-red-500/30"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  RISK: {analysisResult.riskLevel || "HIGH"} ({analysisResult.threatScore}/100)
                </span>
              )}
            </div>

            {!analysisResult && !isAnalyzing && (
              <div className="py-12 text-center text-white/40 text-xs font-mono">
                Click <strong>"AI Phishing Scan"</strong> above to run deep NLP and social engineering analysis on this message.
              </div>
            )}

            {isAnalyzing && (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
                <p className="text-xs text-white/60 font-mono">
                  Scanning for deceptive domain spoofing, urgency triggers & malicious attachments...
                </p>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-3.5 text-xs text-white/80">
                {analysisResult.threatCategory && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 font-mono text-[11px]">
                    <strong className="text-amber-400">THREAT CLASSIFICATION: </strong>
                    <span className="font-semibold">{analysisResult.threatCategory}</span>
                  </div>
                )}

                <div>
                  <strong className="text-white/60 font-mono text-[10px] uppercase tracking-wider block mb-1">FORENSIC ANALYSIS:</strong>
                  <p className="p-3.5 bg-[#0a0a0c] rounded-xl border border-white/5 leading-relaxed text-white/80">
                    {analysisResult.analysis}
                  </p>
                </div>

                {analysisResult.indicators && analysisResult.indicators.length > 0 && (
                  <div>
                    <strong className="text-white/60 font-mono text-[10px] uppercase tracking-wider block mb-1.5">
                      EXTRACTED INDICATORS OF COMPROMISE (IoC):
                    </strong>
                    <div className="space-y-2">
                      {analysisResult.indicators.map((ind: any, i: number) => (
                        <div
                          key={i}
                          className="p-2.5 bg-[#0a0a0c] rounded-xl border border-red-500/30 flex items-start space-x-2 text-[11px]"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-mono font-bold text-red-300">[{ind.type}] </span>
                            <span className="text-white/80">{ind.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResult.remediation && (
                  <div className="p-3 bg-[#0a0a0c] rounded-xl border border-white/5">
                    <strong className="text-blue-400 font-mono text-[11px] block mb-1">SOC AUTOMATED CONTAINMENT:</strong>
                    <span className="text-white/80">{analysisResult.remediation}</span>
                  </div>
                )}

                {analysisResult.staffAdvice && (
                  <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-emerald-200">
                    <strong className="block mb-0.5 font-mono text-[11px]">CLINICIAN GUIDANCE:</strong>
                    <span className="text-white/90">{analysisResult.staffAdvice}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
