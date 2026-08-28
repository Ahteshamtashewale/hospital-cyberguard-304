import React, { useState } from "react";
import {
  Shield,
  FileText,
  Lock,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Sliders,
  Scale,
  Activity,
  FileCheck,
} from "lucide-react";
import { deIdentifyClinicalText } from "../utils/crypto";
import { GuestExplainerBanner } from "./GuestExplainerBanner";

export const PrivacyGovernance: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState<"DPDP" | "HIPAA" | "GDPR">("DPDP");
  const [subsystem, setSubsystem] = useState("Hospital Central EMR & Telehealth Cloud Gateway");
  const [dataFlow, setDataFlow] = useState(
    "Patient clinical vitals, lab reports, and doctor e-prescriptions stored with AES-256 at rest, transmitted over TLS 1.3 to mobile apps and secondary diagnostic imaging partners."
  );
  const [controls, setControls] = useState(
    "Zero-Trust ABAC, FIDO2 MFA, HSM Root Key Rotation, Real-time SIEM alerts, SHA-256 document tamper proofing."
  );

  const [aiAuditResult, setAiAuditResult] = useState<any | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // PHI De-identification Studio State
  const [rawClinicalText, setRawClinicalText] = useState(
    `Patient: Rohan Verma (DOB: 1984-11-23, Aadhaar: 8841 9920 3310, Phone: +91-98765-43210, Email: rohan.verma@example.com)
MRN: MRN-55209 | Attending: Dr. Ananya Iyer
Clinical Impression: Patient presented to Metro Health Mumbai on Aug 27, 2026 with acute coronary syndrome and troponin I elevation. Prescribed Atorvastatin 40mg and scheduled for coronary angiography.`
  );

  const [maskOptions, setMaskOptions] = useState({
    maskNames: true,
    maskDates: true,
    maskIdentifiers: true,
    maskPhones: true,
    pseudonymize: true,
  });

  const deIdResult = deIdentifyClinicalText(rawClinicalText, maskOptions);

  const runAiComplianceAudit = async () => {
    setIsAuditing(true);
    setAiAuditResult(null);
    try {
      const res = await fetch("/api/ai/compliance-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          framework: selectedFramework === "DPDP" ? "DPDP Act 2023 (India)" : selectedFramework === "HIPAA" ? "HIPAA Security & Privacy Rules (USA)" : "GDPR Art 9 (EU Health Data)",
          systemComponent: subsystem,
          dataFlowDescription: dataFlow,
          currentControls: controls,
        }),
      });
      const data = await res.json();
      setAiAuditResult(data);
    } catch (err) {
      console.error("Compliance audit error:", err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Guest Explainer Banner */}
      <GuestExplainerBanner
        title="Patient Data Privacy & DPDP / HIPAA Compliance"
        whatItDoes="Automatically strips patient names, national IDs, and phone numbers from medical charts so researchers can study data without compromising privacy."
        whyItMatters="Protects patient dignity and prevents multi-million dollar penalties under India's DPDP Act 2023 and US HIPAA."
        quickTryAction="Scroll down to 'PHI De-Identification Studio' to see how sensitive patient names (Rohan Verma, Aadhaar, Phone) are automatically masked in real-time."
      />

      {/* Header */}
      <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                MANAGEMENT & GOVERNANCE
              </span>
              <h2 className="text-lg font-serif font-bold text-white">
                Healthcare Data Privacy Governance & DPDP / HIPAA Compliance
              </h2>
            </div>
            <p className="text-xs text-white/50 mt-1 max-w-3xl leading-relaxed">
              Automated legal policy compliance auditor for the Digital Personal Data Protection Act (DPDP Act 2023), HIPAA Security & Privacy Rules, and GDPR Article 9. Includes live PHI de-identification and Data Protection Impact Assessment (DPIA).
            </p>
          </div>

          <button
            id="btn-run-compliance-audit"
            onClick={runAiComplianceAudit}
            disabled={isAuditing}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
          >
            {isAuditing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isAuditing ? "AUDITING CONTROLS..." : "EXECUTE COMPLIANCE AUDIT"}</span>
          </button>
        </div>
      </div>

      {/* Framework Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            id: "DPDP" as const,
            name: "DPDP Act 2023 (India)",
            desc: "Consent Notices, Data Principal Rights, Data Fiduciary Duties, Sec 8 Safeguards",
            score: "98.2%",
          },
          {
            id: "HIPAA" as const,
            name: "HIPAA Security & Privacy Rules",
            desc: "45 CFR §164.312 Technical Safeguards, Minimum Necessary PHI, Audit Trails",
            score: "99.1%",
          },
          {
            id: "GDPR" as const,
            name: "GDPR Article 9 & DPIA",
            desc: "Special Category Health Data, Explicit Consent, Cross-Border Transfer Controls",
            score: "97.5%",
          },
        ].map((fw) => {
          const isSelected = selectedFramework === fw.id;
          return (
            <div
              key={fw.id}
              onClick={() => {
                setSelectedFramework(fw.id);
                setAiAuditResult(null);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#111116] border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  : "bg-[#0d0d12] border-white/10 hover:bg-[#111116] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-white">{fw.name}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {fw.score} Compliant
                </span>
              </div>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">{fw.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Compliance Audit & DPIA (Top/Left) + PHI De-identification Studio (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Regulatory Assessment */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-serif font-bold text-white flex items-center gap-1.5 border-b border-white/10 pb-3">
              <Scale className="w-4 h-4 text-emerald-400" />
              Target Hospital Architecture for Compliance Evaluation
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider block mb-1">Hospital Subsystem</label>
                <input
                  type="text"
                  value={subsystem}
                  onChange={(e) => setSubsystem(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-3 py-2 text-white font-medium focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider block mb-1">Data Flow & Processing Lifecycle</label>
                <textarea
                  rows={2}
                  value={dataFlow}
                  onChange={(e) => setDataFlow(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg p-2.5 text-xs text-white/80 focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider block mb-1">Active Technical Security Controls</label>
                <input
                  type="text"
                  value={controls}
                  onChange={(e) => setControls(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-3 py-2 text-white/80 focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* AI Audit Findings Card */}
          {aiAuditResult && (
            <div className="bg-[#0d0d12] border border-emerald-500/30 rounded-xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    {aiAuditResult.framework} Audit Verdict
                  </span>
                </div>
                <span className="text-xs font-bold font-mono px-2.5 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg">
                  Compliance: {aiAuditResult.complianceScore || 92}% (Grade: {aiAuditResult.auditGrade || "A"})
                </span>
              </div>

              {aiAuditResult.executiveSummary && (
                <p className="text-xs text-white/70 leading-relaxed bg-[#0a0a0c] p-3 rounded-xl border border-white/5">
                  {aiAuditResult.executiveSummary}
                </p>
              )}

              {aiAuditResult.findings && (
                <div className="space-y-2">
                  <span className="text-xs font-mono font-semibold text-white/60 block">CLAUSE FINDINGS:</span>
                  {aiAuditResult.findings.map((f: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#0a0a0c] rounded-xl border border-white/5 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{f.clause}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            f.status === "COMPLIANT"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {f.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed">{f.remediation || f.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Real-Time PHI De-identification & Safe Harbor Studio */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <EyeOff className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-serif font-bold text-white">
                  HIPAA Safe Harbor & DPDP PHI De-identification Studio
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                {deIdResult.redactedCount} Identifiers Masked
              </span>
            </div>

            {/* Masking Controls */}
            <div className="p-3 bg-[#0a0a0c] rounded-xl border border-white/5 space-y-2 text-xs">
              <span className="text-white/40 font-mono text-[10px] uppercase tracking-wider block mb-1">
                Active De-identification Rules (Safe Harbor 18-PHI Identifiers):
              </span>
              <div className="grid grid-cols-2 gap-2 text-white/80">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maskOptions.maskNames}
                    onChange={(e) => setMaskOptions({ ...maskOptions, maskNames: e.target.checked })}
                    className="w-3.5 h-3.5 accent-emerald-500"
                  />
                  <span>Mask Patient & Doctor Names</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maskOptions.maskIdentifiers}
                    onChange={(e) =>
                      setMaskOptions({ ...maskOptions, maskIdentifiers: e.target.checked })
                    }
                    className="w-3.5 h-3.5 accent-emerald-500"
                  />
                  <span>Mask Aadhaar / SSN / MRN</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maskOptions.maskDates}
                    onChange={(e) => setMaskOptions({ ...maskOptions, maskDates: e.target.checked })}
                    className="w-3.5 h-3.5 accent-emerald-500"
                  />
                  <span>Shift / Mask Birth Dates</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maskOptions.maskPhones}
                    onChange={(e) => setMaskOptions({ ...maskOptions, maskPhones: e.target.checked })}
                    className="w-3.5 h-3.5 accent-emerald-500"
                  />
                  <span>Redact Phone & Contacts</span>
                </label>
              </div>
            </div>

            {/* Raw vs Sanitized Text Comparison */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider block mb-1">
                  Raw Clinical EHR Text (Contains Sensitive Direct Identifiers)
                </label>
                <textarea
                  rows={4}
                  value={rawClinicalText}
                  onChange={(e) => setRawClinicalText(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-red-500/30 rounded-xl p-3 text-xs text-red-300 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-emerald-400 font-mono text-[10px] uppercase tracking-wider block mb-1">
                  Sanitized Clinical Text (Safe for Secondary AI Research & Analytics)
                </label>
                <pre className="p-3 bg-[#0a0a0c] rounded-xl text-xs font-mono text-emerald-300 border border-emerald-500/30 whitespace-pre-wrap leading-relaxed">
                  {deIdResult.sanitized}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
