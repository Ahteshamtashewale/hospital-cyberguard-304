import React, { useState } from "react";
import { TabType, ThreatEvent } from "./types";
import { initialThreats } from "./data/mockData";
import { Navbar } from "./components/Navbar";
import { GuestOverview } from "./components/GuestOverview";
import { GuestTourModal } from "./components/GuestTourModal";
import { EvaluatorGuideModal } from "./components/EvaluatorGuideModal";
import { PresenterTeleprompter } from "./components/PresenterTeleprompter";
import { SocDashboard } from "./components/SocDashboard";
import { ApiScanner } from "./components/ApiScanner";
import { CryptoVerifier } from "./components/CryptoVerifier";
import { PhishingShield } from "./components/PhishingShield";
import { ZeroTrustIam } from "./components/ZeroTrustIam";
import { IoMTHardwareSecurity } from "./components/IoMTHardwareSecurity";
import { PrivacyGovernance } from "./components/PrivacyGovernance";
import { GitHubExport } from "./components/GitHubExport";
import { Shield, X } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("guest_overview");
  const [threats, setThreats] = useState<ThreatEvent[]>(initialThreats);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [isEvaluatorGuideOpen, setIsEvaluatorGuideOpen] = useState<boolean>(false);
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Contain a threat
  const handleContainThreat = (id: string) => {
    setThreats((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "CONTAINED" } : t))
    );
    showToast(`Threat ${id} successfully contained & isolated on hospital firewall.`);
  };

  // Simulate a new attack
  const handleSimulateNewAttack = () => {
    const randomId = `THREAT-${Math.floor(9100 + Math.random() * 800)}`;
    const vectors = [
      {
        vector: "Ransomware Infiltration Attempt (MedLocker 4.0)",
        asset: "Oncology PACS Archive (Port 104)",
        mitre: "T1486 (Data Encrypted for Impact)",
        desc: "High-volume encrypted payload delivery attempted via compromised vendor VPN credential.",
        ip: "91.240.118.82 (Known C2 Botnet)",
      },
      {
        vector: "FHIR BOLA Injection on Narcotic Prescription Service",
        asset: "Pharmacy Dispense API (/api/hl7/v2/MedicationRequest)",
        mitre: "T1078 (Valid Accounts / BOLA)",
        desc: "Forged JSON payload attempting to authorize 500 ampoules of Fentanyl with forged signature.",
        ip: "192.168.10.45 (Radiology Floor Wi-Fi)",
      },
      {
        vector: "IoMT Telemetry Tampering on ICU Smart Ventilator #04",
        asset: "ICU Ventilator Grid (IP: 10.24.110.38)",
        mitre: "T1542 (Hardware Firmware Corruption)",
        desc: "Anomalous telnet burst attempting to modify PEEP and tidal volume settings without nurse biometric override.",
        ip: "185.190.140.22 (External Tor Node)",
      },
    ];

    const pick = vectors[Math.floor(Math.random() * vectors.length)];
    const newThreat: ThreatEvent = {
      id: randomId,
      timestamp: "Just now",
      sourceIp: pick.ip,
      targetAsset: pick.asset,
      attackVector: pick.vector,
      severity: "CRITICAL",
      mitreTechnique: pick.mitre,
      status: "ACTIVE",
      description: pick.desc,
      rawLog: `${new Date().toISOString()} [CRITICAL-SOC-ALARM] Source: ${pick.ip} -> Dest: ${pick.asset}
ATTACK VECTOR: ${pick.vector}
SIGNATURE MATCH: MITRE ${pick.mitre}
STATUS: Intercepted by Hospital Zero-Trust AI Gateway. Awaiting Operator Action.`,
    };

    setThreats([newThreat, ...threats]);
    showToast(`🚨 NEW CRITICAL ALARM: ${pick.vector} detected on ${pick.asset}`);
  };

  const handleOpenTeleprompter = () => {
    setIsEvaluatorGuideOpen(false);
    setIsTourOpen(false);
    setIsTeleprompterOpen(true);
  };

  const handleToggleTeleprompter = () => {
    setIsEvaluatorGuideOpen(false);
    setIsTourOpen(false);
    setIsTeleprompterOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#f8fafc] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        threatCount={threats.filter((t) => t.status === "ACTIVE").length}
        onOpenTour={() => {
          setIsEvaluatorGuideOpen(false);
          setIsTourOpen(true);
        }}
        onOpenEvaluatorGuide={() => {
          setIsTourOpen(false);
          setIsEvaluatorGuideOpen(true);
        }}
        onToggleTeleprompter={handleToggleTeleprompter}
        isTeleprompterActive={isTeleprompterOpen}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "guest_overview" && (
          <GuestOverview
            onNavigateTab={setActiveTab}
            onOpenTour={() => {
              setIsEvaluatorGuideOpen(false);
              setIsTourOpen(true);
            }}
            onOpenEvaluatorGuide={() => {
              setIsTourOpen(false);
              setIsEvaluatorGuideOpen(true);
            }}
            onStartTeleprompter={handleOpenTeleprompter}
            threatCount={threats.filter((t) => t.status === "ACTIVE").length}
          />
        )}

        {activeTab === "soc_dashboard" && (
          <SocDashboard
            threats={threats}
            onContainThreat={handleContainThreat}
            onSimulateNewAttack={handleSimulateNewAttack}
          />
        )}

        {activeTab === "api_scanner" && <ApiScanner />}

        {activeTab === "crypto_verifier" && <CryptoVerifier />}

        {activeTab === "phishing_shield" && <PhishingShield />}

        {activeTab === "zero_trust_iam" && <ZeroTrustIam />}

        {activeTab === "iomt_hardware" && <IoMTHardwareSecurity />}

        {activeTab === "privacy_governance" && <PrivacyGovernance />}

        {activeTab === "github_export" && <GitHubExport />}
      </main>

      {/* Evaluator Guide & Presentation Modal */}
      <EvaluatorGuideModal
        isOpen={isEvaluatorGuideOpen}
        onClose={() => setIsEvaluatorGuideOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsEvaluatorGuideOpen(false);
        }}
        onStartTeleprompter={handleOpenTeleprompter}
      />

      {/* Live Presenter Teleprompter (Bottom-Right Cue Cards) */}
      <PresenterTeleprompter
        isOpen={isTeleprompterOpen}
        onClose={() => setIsTeleprompterOpen(false)}
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
      />

      {/* Interactive Step-by-Step Guest Guided Tour Modal */}
      <GuestTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsTourOpen(false);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#111116] border border-blue-500/40 text-white px-4 py-3 rounded-xl shadow-[0_0_25px_rgba(37,99,235,0.25)] flex items-center space-x-3 text-xs max-w-md animate-slide-up">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <p className="flex-1 font-medium leading-relaxed text-slate-200">{toastMessage}</p>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/40 hover:text-white shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sophisticated Dark Footer */}
      <footer className="mt-auto border-t border-white/5 bg-[#0d0d12] py-4 text-[11px] text-white/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
          <div className="flex items-center space-x-3">
            <span className="text-white/60 font-semibold">PROJECT ID-304</span>
            <span>•</span>
            <span>SHA-256 CHECK: b6d8c...8f1a</span>
            <span>•</span>
            <span className="text-emerald-400/80">SYSTEM UPTIME: 99.998%</span>
          </div>
          <div>
            <span>ST. JUDE METROPOLITAN • DPDP ACT 2023 & HIPAA §164.312 COMPLIANT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
