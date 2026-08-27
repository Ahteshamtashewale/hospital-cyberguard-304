import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Server,
  Terminal,
  Cpu,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Eye,
  Radio,
  FileSpreadsheet,
} from "lucide-react";
import { ThreatEvent } from "../types";

interface SocDashboardProps {
  threats: ThreatEvent[];
  onContainThreat: (id: string) => void;
  onSimulateNewAttack: () => void;
}

export const SocDashboard: React.FC<SocDashboardProps> = ({
  threats,
  onContainThreat,
  onSimulateNewAttack,
}) => {
  const [selectedThreat, setSelectedThreat] = useState<ThreatEvent | null>(threats[0] || null);
  const [aiInvestigation, setAiInvestigation] = useState<any | null>(null);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const runAiInvestigation = async (threat: ThreatEvent) => {
    setIsInvestigating(true);
    setAiInvestigation(null);
    try {
      const res = await fetch("/api/ai/threat-investigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentType: threat.attackVector,
          affectedAsset: threat.targetAsset,
          rawLogs: threat.rawLog,
          context: `Hospital Clinical Cyber Defense Center. Threat ID: ${threat.id}. MITRE: ${threat.mitreTechnique}`,
        }),
      });
      const data = await res.json();
      setAiInvestigation(data);
    } catch (err) {
      console.error("AI Investigation failed:", err);
    } finally {
      setIsInvestigating(false);
    }
  };

  const filteredThreats = threats.filter((t) => {
    if (activeFilter === "ACTIVE") return t.status === "ACTIVE";
    if (activeFilter === "CRITICAL") return t.severity === "CRITICAL";
    if (activeFilter === "CONTAINED") return t.status === "CONTAINED" || t.status === "BLOCKED";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-white/40 uppercase tracking-widest">
              ACTIVE ALARMS
            </span>
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-serif font-bold text-white tracking-tight">
              {threats.filter((t) => t.status === "ACTIVE" || t.status === "INVESTIGATING").length}
            </span>
            <span className="text-xs text-red-400 font-mono">Critical Triage</span>
          </div>
          <div className="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full w-3/5 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
          </div>
        </div>

        <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-white/40 uppercase tracking-widest">
              IoMT MEDICAL FLEET
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-serif font-bold text-white tracking-tight">428 / 430</span>
            <span className="text-xs text-emerald-400 font-mono">99.5% Online</span>
          </div>
          <div className="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[99%] shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
          </div>
        </div>

        <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-white/40 uppercase tracking-widest">
              TOKEN VERIFICATIONS
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-serif font-bold text-white tracking-tight">24,819</span>
            <span className="text-xs text-blue-400 font-mono">0 Unauthorized</span>
          </div>
          <div className="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-full shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
          </div>
        </div>

        <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-white/40 uppercase tracking-widest">
              PRIVACY COMPLIANCE
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-serif font-bold text-white tracking-tight">DPDP / HIPAA</span>
            <span className="text-xs text-emerald-400 font-mono">Audited & Sealed</span>
          </div>
          <div className="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[98%] shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
          </div>
        </div>
      </div>

      {/* Main SOC Layout: Threat Stream (Left) + Detailed Incident Triage (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SIEM Alarms Stream */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Live Healthcare SIEM Telemetry & Alarms
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  Continuous sensor monitoring across EHR, IoMT networks, and clinical API gateways
                </p>
              </div>
              <button
                id="btn-simulate-attack"
                onClick={onSimulateNewAttack}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate Attack</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex space-x-2 mb-3">
              {["ALL", "ACTIVE", "CRITICAL", "CONTAINED"].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded-md transition-colors cursor-pointer ${
                    activeFilter === f
                      ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                      : "bg-white/5 text-white/40 hover:text-white border border-transparent"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Event List */}
            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {filteredThreats.map((threat) => {
                const isSelected = selectedThreat?.id === threat.id;
                const isCrit = threat.severity === "CRITICAL";
                const isHigh = threat.severity === "HIGH";

                return (
                  <div
                    key={threat.id}
                    id={`threat-card-${threat.id}`}
                    onClick={() => {
                      setSelectedThreat(threat);
                      setAiInvestigation(null);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-br from-[#181822] to-[#0f0f14] border-blue-500/60 shadow-[0_0_20px_rgba(37,99,235,0.25)] ring-1 ring-blue-500/30"
                        : "bg-[#111116]/80 border-white/5 hover:bg-[#15151c] hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wide ${
                              isCrit
                                ? "bg-red-500/10 text-red-400 border border-red-500/30"
                                : isHigh
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                            }`}
                          >
                            {threat.severity}
                          </span>
                          <span className="text-xs font-mono font-semibold text-white/90">
                            {threat.id}
                          </span>
                          <span className="text-[11px] text-white/40 font-mono">• {threat.timestamp}</span>
                        </div>
                        <h4 className="text-sm font-medium text-white line-clamp-1">
                          {threat.attackVector}
                        </h4>
                      </div>

                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                          threat.status === "ACTIVE"
                            ? "bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse"
                            : threat.status === "INVESTIGATING"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        }`}
                      >
                        {threat.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-white/60 line-clamp-2 leading-relaxed">
                      {threat.description}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/5 font-mono">
                      <span className="truncate max-w-[240px]">TARGET: {threat.targetAsset}</span>
                      <span className="text-blue-400 font-semibold">{threat.mitreTechnique.split(" ")[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Incident Drilldown & AI Containment Center */}
        <div className="lg:col-span-6 space-y-4">
          {selectedThreat ? (
            <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-blue-400 font-mono">
                      {selectedThreat.id}
                    </span>
                    <span className="text-xs text-white/40 font-mono">INCIDENT TRIAGE</span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-white mt-1">
                    {selectedThreat.attackVector}
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  {selectedThreat.status === "ACTIVE" && (
                    <button
                      id="btn-contain-threat"
                      onClick={() => onContainThreat(selectedThreat.id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all flex items-center space-x-1 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Contain & Isolate</span>
                    </button>
                  )}
                  <button
                    id="btn-ai-investigate"
                    onClick={() => runAiInvestigation(selectedThreat)}
                    disabled={isInvestigating}
                    className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-all flex items-center space-x-1.5 shadow-[0_0_15px_rgba(37,99,235,0.4)] cursor-pointer"
                  >
                    {isInvestigating ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                    )}
                    <span>AI Forensic Audit</span>
                  </button>
                </div>
              </div>

              {/* Asset & MITRE Information */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#111116] p-3.5 rounded-xl border border-white/5">
                  <span className="text-white/40 block text-[10px] font-mono uppercase tracking-wider">AFFECTED HOSPITAL ASSET</span>
                  <span className="font-medium text-white/90 mt-1 block">
                    {selectedThreat.targetAsset}
                  </span>
                </div>
                <div className="bg-[#111116] p-3.5 rounded-xl border border-white/5">
                  <span className="text-white/40 block text-[10px] font-mono uppercase tracking-wider">ATTACKER ORIGIN</span>
                  <span className="font-mono text-blue-300 mt-1 block">
                    {selectedThreat.sourceIp}
                  </span>
                </div>
                <div className="col-span-2 bg-[#111116] p-3.5 rounded-xl border border-white/5">
                  <span className="text-white/40 block text-[10px] font-mono uppercase tracking-wider">MITRE ATT&CK MATRIX MAPPING</span>
                  <span className="font-mono text-blue-300 mt-1 block">
                    {selectedThreat.mitreTechnique}
                  </span>
                </div>
              </div>

              {/* Raw Security Sensor Log */}
              <div>
                <span className="text-xs font-mono font-semibold text-white/60 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[11px]">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  RAW SENSOR TELEMETRY LOG
                </span>
                <pre className="p-3.5 bg-[#0a0a0c] rounded-xl text-[11px] font-mono text-blue-300/90 overflow-x-auto border border-white/5 leading-relaxed whitespace-pre-wrap">
                  {selectedThreat.rawLog}
                </pre>
              </div>

              {/* AI Forensic Analysis Report */}
              {isInvestigating && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center space-x-3 text-blue-300 text-xs animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Gemini AI is analyzing telemetry for clinical safety impact and DPDP/HIPAA obligations...</span>
                </div>
              )}

              {aiInvestigation && (
                <div className="p-4 bg-[#111116] border border-blue-500/40 rounded-xl space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        AI SOC FORENSIC ASSESSMENT
                      </span>
                    </div>
                    {aiInvestigation.cvssScore && (
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-300 border border-red-500/30 rounded text-xs font-bold font-mono">
                        CVSS v3.1: {aiInvestigation.cvssScore}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-white/80 space-y-2 leading-relaxed">
                    <div>
                      <strong className="text-blue-400 font-mono text-[11px]">ROOT CAUSE: </strong>
                      <span>{aiInvestigation.rootCause}</span>
                    </div>
                    <div>
                      <strong className="text-amber-400 font-mono text-[11px]">PATIENT SAFETY IMPACT: </strong>
                      <span>{aiInvestigation.impactAnalysis}</span>
                    </div>
                  </div>

                  {aiInvestigation.containmentPlan && (
                    <div>
                      <span className="text-[11px] font-mono font-semibold text-white/60 uppercase tracking-wider block mb-1">
                        RECOMMENDED CONTAINMENT PLAYBOOK:
                      </span>
                      <ul className="space-y-1.5 text-xs text-white/80 pl-1">
                        {aiInvestigation.containmentPlan.map((step: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiInvestigation.regulatoryImpact && (
                    <div className="p-3 bg-[#0a0a0c] rounded-lg border border-white/5 text-[11px] text-white/70 font-mono">
                      <strong className="text-blue-400">REGULATORY BREACH NOTICE: </strong>
                      {aiInvestigation.regulatoryImpact}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-8 text-center text-white/40 font-mono text-xs">
              Select an active threat from the telemetry stream on the left to triage.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
