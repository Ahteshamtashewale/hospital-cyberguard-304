import React, { useState } from "react";
import {
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  UserCheck,
  Smartphone,
  Wifi,
  KeyRound,
  CheckCircle2,
  Clock,
  History,
} from "lucide-react";
import { AccessRequest } from "../types";

export const ZeroTrustIam: React.FC = () => {
  const [role, setRole] = useState<AccessRequest["role"]>("ATTENDING_PHYSICIAN");
  const [resource, setResource] = useState<string>("EHR_PATIENT_FULL_CHART");
  const [action, setAction] = useState<AccessRequest["action"]>("READ");
  const [deviceTrust, setDeviceTrust] = useState<AccessRequest["deviceTrust"]>("MANAGED_HOSPITAL_DEVICE");
  const [networkLocation, setNetworkLocation] = useState<AccessRequest["networkLocation"]>("HOSPITAL_INTRANET");
  const [mfaVerified, setMfaVerified] = useState<boolean>(true);

  // Break-Glass State
  const [isBreakGlassActive, setIsBreakGlassActive] = useState(false);
  const [breakGlassReason, setBreakGlassReason] = useState("Code Blue Cardiac Arrest in ICU Bed 4 - Immediate EMR Lookup");
  const [breakGlassDoctor, setBreakGlassDoctor] = useState("Dr. Ananya Iyer (License: NMC-IND-CARD-88492-MH)");

  // Audit Trail Logs
  const [auditLogs, setAuditLogs] = useState<
    {
      id: string;
      timestamp: string;
      user: string;
      role: string;
      resource: string;
      decision: "GRANTED" | "DENIED" | "BREAK_GLASS_OVERRIDE";
      trustScore: number;
      reason: string;
    }[]
  >([
    {
      id: "ZTA-LOG-881",
      timestamp: "10:14:02 AM",
      user: "Dr. Ananya Iyer",
      role: "ATTENDING_PHYSICIAN",
      resource: "EHR_PATIENT_FULL_CHART (PAT-90821)",
      decision: "GRANTED",
      trustScore: 96,
      reason: "Managed device + Intranet + Active Care Team assignment",
    },
    {
      id: "ZTA-LOG-879",
      timestamp: "09:42:15 AM",
      user: "Billing Specialist S. Rao",
      role: "BILLING_AUDITOR",
      resource: "EHR_CLINICAL_PSYCHIATRY_NOTES",
      decision: "DENIED",
      trustScore: 32,
      reason: "Least-Privilege Policy Violation: Billing scope lacks psychiatric clinical clearance",
    },
  ]);

  // Evaluate Zero-Trust Decision
  const evaluateAccess = () => {
    if (isBreakGlassActive) {
      return {
        decision: "BREAK_GLASS_OVERRIDE" as const,
        trustScore: 100,
        policy: "Emergency Break-Glass Protocol Active (Life Safety Override §164.312)",
        explanation: "Emergency override granted with cryptographic audit log. Clinical care team alerted.",
      };
    }

    let score = 100;
    const reasons: string[] = [];

    // Role-Resource checks
    if (role === "BILLING_AUDITOR" && resource.includes("EHR_PATIENT")) {
      score -= 50;
      reasons.push("Role lacks clinical scope for raw EHR");
    }
    if (role === "EXTERNAL_CONSULTANT" && action === "EXPORT") {
      score -= 60;
      reasons.push("External roles forbidden from bulk export");
    }
    if (resource === "NARCOTIC_VAULT_DISPENSE" && role !== "ATTENDING_PHYSICIAN" && role !== "PHARMACIST") {
      score -= 70;
      reasons.push("Narcotics access requires Physician or Pharmacist role");
    }

    // Device posture checks
    if (deviceTrust === "BYOD_ENROLLED") score -= 15;
    if (deviceTrust === "UNKNOWN_UNTRUSTED") {
      score -= 45;
      reasons.push("Untrusted / unmanaged hardware");
    }

    // Network posture
    if (networkLocation === "GUEST_WIFI_RESTRICTED") {
      score -= 40;
      reasons.push("Guest Wi-Fi subnet forbidden for clinical PHI");
    }
    if (networkLocation === "EXTERNAL_PUBLIC_IP") {
      score -= 30;
      reasons.push("Direct external public IP without VPN");
    }

    // MFA Check
    if (!mfaVerified) {
      score -= 35;
      reasons.push("Missing Hardware MFA / FIDO2 token");
    }

    const isGranted = score >= 70;
    return {
      decision: isGranted ? ("GRANTED" as const) : ("DENIED" as const),
      trustScore: Math.max(score, 0),
      policy: isGranted ? "Zero-Trust Context Verified" : "Access Denied by Attribute-Based Access Control (ABAC)",
      explanation: isGranted
        ? "Access granted under least-privilege RBAC/ABAC context."
        : `Access Denied: ${reasons.join("; ") || "Insufficient context trust score."}`,
    };
  };

  const currentResult = evaluateAccess();

  const handleTestAccess = () => {
    const newLog = {
      id: `ZTA-LOG-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString(),
      user: role === "ATTENDING_PHYSICIAN" ? "Dr. Ananya Iyer" : role === "ICU_NURSE" ? "Nurse P. Nair" : role,
      role,
      resource,
      decision: currentResult.decision,
      trustScore: currentResult.trustScore,
      reason: currentResult.explanation,
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                CHALLENGE AREA 4
              </span>
              <h2 className="text-lg font-serif font-bold text-white">
                Zero-Trust Security Tools (ZTA) & Emergency Break-Glass IAM
              </h2>
            </div>
            <p className="text-xs text-white/50 mt-1 max-w-3xl leading-relaxed">
              Dynamic Attribute-Based & Role-Based Access Control (ABAC/RBAC) continuously validating Identity, Device Posture, Network Subnet, and MFA before granting access to Protected Health Information (PHI). Includes emergency break-glass override with immutable audit logging.
            </p>
          </div>

          <button
            id="btn-trigger-access-check"
            onClick={handleTestAccess}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Evaluate & Log Access</span>
          </button>
        </div>
      </div>

      {/* Emergency Break-Glass Banner */}
      <div
        className={`p-4 rounded-xl border transition-all ${
          isBreakGlassActive
            ? "bg-red-500/10 border-red-500/40 ring-1 ring-red-500/30 text-red-100 shadow-[0_0_25px_rgba(239,68,68,0.2)]"
            : "bg-[#0d0d12] border-white/10 text-white/70"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2.5 rounded-lg border ${
                isBreakGlassActive
                  ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
                  : "bg-white/5 text-white/40 border-white/10"
              }`}
            >
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-serif font-bold text-white">
                  Hospital Emergency "Break-Glass" Resuscitation Protocol
                </h4>
                {isBreakGlassActive && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                    ACTIVE OVERRIDE
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
                Bypasses standard RBAC barriers for critical code-blue life support with mandatory cryptographic logging and instant DPO notification.
              </p>
            </div>
          </div>

          <button
            id="btn-toggle-break-glass"
            onClick={() => setIsBreakGlassActive(!isBreakGlassActive)}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-lg shadow-sm transition-all cursor-pointer ${
              isBreakGlassActive
                ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            }`}
          >
            {isBreakGlassActive ? "Deactivate Break-Glass" : "Activate Emergency Break-Glass"}
          </button>
        </div>

        {isBreakGlassActive && (
          <div className="mt-3 pt-3 border-t border-red-500/20 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-red-300 font-mono text-[10px] uppercase tracking-wider block mb-1">Authorizing Resuscitation Physician</label>
              <input
                type="text"
                value={breakGlassDoctor}
                onChange={(e) => setBreakGlassDoctor(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-red-500/30 rounded-lg px-3 py-2 text-white font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="text-red-300 font-mono text-[10px] uppercase tracking-wider block mb-1">Clinical Emergency Justification</label>
              <input
                type="text"
                value={breakGlassReason}
                onChange={(e) => setBreakGlassReason(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-red-500/30 rounded-lg px-3 py-2 text-white font-medium focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout: Contextual IAM Simulator & Live Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Contextual Attribute Configuration */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Lock className="w-4 h-4 text-blue-400" />
              Zero-Trust Contextual Access Request Simulator
            </h3>

            <div className="space-y-3 text-xs">
              {/* Role Selection */}
              <div>
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  Requesting Hospital Identity / Role:
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-3 py-2 text-white font-medium focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="ATTENDING_PHYSICIAN">Attending Physician (Full Clinical Scope)</option>
                  <option value="ICU_NURSE">ICU Nurse (Ward Vitals & Medication Admin)</option>
                  <option value="RADIOLOGIST">Radiologist (PACS / DICOM Imaging Scope)</option>
                  <option value="PHARMACIST">Hospital Pharmacist (Dispensing & Narcotic Vault)</option>
                  <option value="BILLING_AUDITOR">Billing Auditor (Financial Claims Only)</option>
                  <option value="EXTERNAL_CONSULTANT">External Consultant (Restricted Telehealth)</option>
                </select>
              </div>

              {/* Target Resource */}
              <div>
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider block mb-1">
                  Target Healthcare Protected Resource:
                </label>
                <select
                  value={resource}
                  onChange={(e) => setResource(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-3 py-2 text-white font-medium focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="EHR_PATIENT_FULL_CHART">EHR Full Patient Clinical Chart & Genetic History</option>
                  <option value="NARCOTIC_VAULT_DISPENSE">Automated Narcotic Dispenser Vault (Morphine/Oxy)</option>
                  <option value="PACS_DICOM_CT_SCANS">PACS DICOM High-Res CT & Angiography Images</option>
                  <option value="ICU_VENTILATOR_TELEMETRY">ICU Smart Ventilator Control & Telemetry</option>
                  <option value="BILLING_INVOICES_CLAIMS">Insurance Invoices & Financial Claim Codes</option>
                </select>
              </div>

              {/* Action */}
              <div>
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider block mb-1">Requested Action Scope:</label>
                <div className="flex space-x-2">
                  {(["READ", "WRITE", "EXPORT", "DELETE"] as const).map((act) => (
                    <button
                      key={act}
                      onClick={() => setAction(act)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                        action === act
                          ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                          : "bg-[#0a0a0c] text-white/40 hover:text-white border border-white/10"
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              {/* Device Posture */}
              <div>
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  Endpoint Device Posture:
                </label>
                <select
                  value={deviceTrust}
                  onChange={(e) => setDeviceTrust(e.target.value as any)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-3 py-2 text-white font-medium focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="MANAGED_HOSPITAL_DEVICE">Managed Hospital Workstation (EDR + TPM 2.0 Healthy)</option>
                  <option value="BYOD_ENROLLED">Doctor BYOD Tablet (MDM Enrolled / Encrypted)</option>
                  <option value="UNKNOWN_UNTRUSTED">Unknown / Unmanaged Device (Zero Compliance)</option>
                </select>
              </div>

              {/* Network Subnet */}
              <div>
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Wifi className="w-3.5 h-3.5 text-blue-400" />
                  Network Origin Subnet:
                </label>
                <select
                  value={networkLocation}
                  onChange={(e) => setNetworkLocation(e.target.value as any)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-3 py-2 text-white font-medium focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="HOSPITAL_INTRANET">Hospital Secure Clinical Intranet (VLAN 10)</option>
                  <option value="SECURE_VPN">Encrypted Staff WireGuard VPN (IPSec 256)</option>
                  <option value="GUEST_WIFI_RESTRICTED">Hospital Public Guest Wi-Fi (Untrusted)</option>
                  <option value="EXTERNAL_PUBLIC_IP">Direct Internet Public IP (Unrestricted WAN)</option>
                </select>
              </div>

              {/* MFA Toggle */}
              <div className="flex items-center justify-between p-3 bg-[#0a0a0c] rounded-xl border border-white/5">
                <div className="flex items-center space-x-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-semibold text-white/80">
                    FIDO2 Hardware Key / Biometric MFA Verified
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={mfaVerified}
                  onChange={(e) => setMfaVerified(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time ZTA Decision & Audit Trail */}
        <div className="lg:col-span-6 space-y-4">
          {/* Decision Verdict Card */}
          <div
            className={`p-5 rounded-xl border transition-all ${
              currentResult.decision === "GRANTED"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                : currentResult.decision === "BREAK_GLASS_OVERRIDE"
                ? "bg-red-500/10 border-red-500/40 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-80">
                  ZERO-TRUST DECISION ENGINE
                </span>
                <h4 className="text-base font-serif font-bold mt-1">
                  VERDICT: {currentResult.decision}
                </h4>
              </div>
              <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-black/40 border border-current">
                TRUST SCORE: {currentResult.trustScore}/100
              </span>
            </div>
            <p className="text-xs mt-2.5 opacity-90 leading-relaxed">{currentResult.explanation}</p>
          </div>

          {/* Real-Time Audit Trail */}
          <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-4 h-4 text-blue-400" />
                IMMUTABLE ACCESS AUDIT TRAIL
              </h3>
              <span className="text-[11px] text-white/40 font-mono">HIPAA §164.312(b)</span>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-[#0a0a0c] rounded-xl border border-white/5 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-blue-400">{log.id}</span>
                    <span className="text-[11px] font-mono text-white/40">{log.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{log.user} ({log.role})</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        log.decision === "GRANTED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : log.decision === "BREAK_GLASS_OVERRIDE"
                          ? "bg-red-500/20 text-red-300 border border-red-500/30 font-bold"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {log.decision}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/40 truncate">
                    Target: <span className="text-white/80 font-mono">{log.resource}</span>
                  </div>
                  <div className="text-[11px] text-white/50">{log.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
