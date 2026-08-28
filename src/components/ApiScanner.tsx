import React, { useState } from "react";
import {
  Radio,
  Play,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  Server,
  Lock,
  Layers,
} from "lucide-react";
import { sampleApiEndpoints } from "../data/mockData";
import { ApiEndpoint } from "../types";

export const ApiScanner: React.FC = () => {
  const [endpoints] = useState<ApiEndpoint[]>(sampleApiEndpoints);
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(sampleApiEndpoints[0]);
  const [scanResults, setScanResults] = useState<{
    isRunning: boolean;
    tested: boolean;
    findings: { title: string; owaspCode: string; severity: string; status: "VULNERABLE" | "PATCHED"; description: string }[];
  }>({
    isRunning: false,
    tested: false,
    findings: [],
  });
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [isAiAuditing, setIsAiAuditing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<"request" | "response" | "remediation">("request");

  const runVulnerabilityScan = () => {
    setScanResults({ isRunning: true, tested: false, findings: [] });
    setAiAnalysis(null);

    setTimeout(() => {
      const findings = selectedEndpoint.knownVulnerabilities.map((v) => ({
        title: v.title,
        owaspCode: v.owaspCode,
        severity: v.severity,
        status: "VULNERABLE" as const,
        description: v.description,
      }));

      setScanResults({
        isRunning: false,
        tested: true,
        findings,
      });
    }, 1000);
  };

  const runAiSecurityAudit = async () => {
    setIsAiAuditing(true);
    try {
      const res = await fetch("/api/ai/audit-api-endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: selectedEndpoint.path,
          method: selectedEndpoint.method,
          headers: selectedEndpoint.sampleRequest.headers,
          requestBody: selectedEndpoint.sampleRequest,
          responseBody: selectedEndpoint.sampleResponse,
        }),
      });
      const data = await res.json();
      setAiAnalysis(data);
    } catch (err) {
      console.error("AI API audit failed:", err);
    } finally {
      setIsAiAuditing(false);
    }
  };

  const copyRemediation = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                CHALLENGE AREA 1
              </span>
              <h2 className="text-lg font-serif font-bold text-white">
                Hospital FHIR / HL7 & REST API Vulnerability Scanner
              </h2>
            </div>
            <p className="text-xs text-white/50 mt-1 max-w-3xl leading-relaxed">
              Automated penetration testing suite scanning for OWASP API Security Top 10 vulnerabilities (BOLA/IDOR, Excessive PHI Exposure, Rate Limiting, Missing Digital Signatures, and CORS Misconfigurations) in healthcare data pipelines.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="btn-run-api-scan"
              onClick={runVulnerabilityScan}
              disabled={scanResults.isRunning}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
            >
              {scanResults.isRunning ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>{scanResults.isRunning ? "Scanning Endpoints..." : "Execute Pen-Test"}</span>
            </button>

            <button
              id="btn-ai-audit-api"
              onClick={runAiSecurityAudit}
              disabled={isAiAuditing}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 text-white rounded-lg transition-all cursor-pointer"
            >
              {isAiAuditing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span>AI Deep Security Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target Endpoints Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {endpoints.map((ep) => {
          const isSelected = selectedEndpoint.id === ep.id;
          return (
            <div
              key={ep.id}
              id={`endpoint-card-${ep.id}`}
              onClick={() => {
                setSelectedEndpoint(ep);
                setScanResults({ isRunning: false, tested: false, findings: [] });
                setAiAnalysis(null);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-br from-[#181822] to-[#0f0f14] border-blue-500/60 shadow-[0_0_20px_rgba(37,99,235,0.25)] ring-1 ring-blue-500/30"
                  : "bg-[#0d0d12] border-white/10 hover:bg-[#111116] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-white/5 text-white/60 border border-white/10">
                  {ep.category}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    ep.method === "GET"
                      ? "text-blue-400 bg-blue-500/10 border border-blue-500/20"
                      : "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                  }`}
                >
                  {ep.method}
                </span>
              </div>
              <h4 className="text-sm font-serif font-bold text-white mt-2">{ep.name}</h4>
              <p className="text-xs font-mono text-blue-400/90 mt-1 truncate">{ep.path}</p>
            </div>
          );
        })}
      </div>

      {/* Interactive Testing Sandbox & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint Payload & Live Test Harness */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">TARGET:</span>
                <span className="text-xs font-mono text-blue-300 bg-[#0a0a0c] px-2.5 py-1 rounded-md border border-white/10">
                  {selectedEndpoint.method} {selectedEndpoint.path}
                </span>
              </div>
              <div className="flex space-x-1">
                {(["request", "response", "remediation"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer ${
                      activeTab === tab
                        ? "bg-blue-600/30 text-blue-300 border border-blue-500/40 font-semibold"
                        : "text-white/40 hover:text-white border border-transparent"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Contents */}
            {activeTab === "request" && (
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-mono font-semibold text-white/60 block mb-1 uppercase tracking-wider">
                    HTTP REQUEST HEADERS & BEARER TOKEN
                  </span>
                  <pre className="p-3.5 bg-[#0a0a0c] rounded-xl text-xs font-mono text-white/80 border border-white/5 overflow-x-auto">
                    {JSON.stringify(selectedEndpoint.sampleRequest.headers, null, 2)}
                  </pre>
                </div>
                {(selectedEndpoint.sampleRequest.body || selectedEndpoint.sampleRequest.params) && (
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-white/60 block mb-1 uppercase tracking-wider">
                      REQUEST PAYLOAD / PARAMETERS
                    </span>
                    <pre className="p-3.5 bg-[#0a0a0c] rounded-xl text-xs font-mono text-white/80 border border-white/5 overflow-x-auto">
                      {JSON.stringify(
                        selectedEndpoint.sampleRequest.body || selectedEndpoint.sampleRequest.params,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {activeTab === "response" && (
              <div>
                <span className="text-[11px] font-mono font-semibold text-white/60 block mb-1 uppercase tracking-wider">
                  API RESPONSE BODY (STATUS: 200 OK)
                </span>
                <pre className="p-3.5 bg-[#0a0a0c] rounded-xl text-xs font-mono text-emerald-400 border border-white/5 overflow-x-auto">
                  {JSON.stringify(selectedEndpoint.sampleResponse, null, 2)}
                </pre>
              </div>
            )}

            {activeTab === "remediation" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-white/70 uppercase tracking-wider">
                    CARE-TEAM AUTHORIZATION MIDDLEWARE (TYPESCRIPT)
                  </span>
                  <button
                    onClick={() =>
                      copyRemediation(
                        selectedEndpoint.knownVulnerabilities[0]?.remediation || ""
                      )
                    }
                    className="flex items-center space-x-1 px-2.5 py-1 text-[11px] font-mono bg-white/5 hover:bg-white/10 text-white/80 rounded border border-white/10 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? "Copied" : "Copy Code"}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-[#0a0a0c] rounded-xl text-xs font-mono text-blue-200 border border-white/5 overflow-x-auto leading-relaxed">
                  {`// Zero-Trust Care-Team Middleware to prevent BOLA (OWASP API1:2023)
import { Request, Response, NextFunction } from "express";

export async function verifyDoctorPatientRelationship(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const clinicianId = req.user?.id;
  const requestedPatientId = req.params.patientId;

  // 1. Check if user is on emergency break-glass status
  if (req.user?.isEmergencyBreakGlass) {
    await auditLogBreakGlassAccess(clinicianId, requestedPatientId, req.user.breakGlassReason);
    return next();
  }

  // 2. Validate clinical relationship in hospital EMR care-team database
  const hasAccess = await db.careTeamAssignments.findOne({
    doctorId: clinicianId,
    patientId: requestedPatientId,
    status: "ACTIVE"
  });

  if (!hasAccess) {
    return res.status(403).json({
      error: "Access Denied: BOLA violation intercepted.",
      complianceViolation: "HIPAA §164.312(a)(1) Minimum Necessary Rule"
    });
  }

  next();
}`}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right: Pen-Test Results & AI Deep Assessment */}
        <div className="lg:col-span-5 space-y-4">
          {/* Scan Findings Card */}
          <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-400" />
                Vulnerability Assessment Matrix
              </h3>
              {scanResults.tested && (
                <span className="text-[11px] font-mono font-bold text-red-400 px-2 py-0.5 bg-red-500/10 border border-red-500/30 rounded">
                  {scanResults.findings.length} Vulnerabilities Found
                </span>
              )}
            </div>

            {!scanResults.tested && !scanResults.isRunning && (
              <div className="py-8 text-center text-white/40 text-xs font-mono">
                Click <strong>"Execute Pen-Test"</strong> or <strong>"AI Deep Security Audit"</strong> above to run live automated penetration checks against this endpoint.
              </div>
            )}

            {scanResults.isRunning && (
              <div className="py-10 text-center space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-400 mx-auto" />
                <p className="text-xs text-white/60 font-mono">
                  Injecting fuzzing payloads, testing BOLA permissions & header scopes...
                </p>
              </div>
            )}

            {scanResults.tested && (
              <div className="space-y-3">
                {scanResults.findings.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#111116] rounded-xl border border-red-500/30 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded">
                          {item.owaspCode}
                        </span>
                        <h5 className="text-xs font-serif font-bold text-white mt-1.5">{item.title}</h5>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-red-400 px-2 py-0.5 bg-red-500/10 rounded">
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Security Assessment Result */}
          {aiAnalysis && (
            <div className="bg-[#111116] border border-blue-500/40 rounded-xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    AI PEN-TEST EXECUTIVE SUMMARY
                  </span>
                </div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded">
                  SCORE: {aiAnalysis.securityScore || 45}/100
                </span>
              </div>

              <div className="text-xs text-white/80 space-y-2 leading-relaxed">
                {aiAnalysis.recommendedFix && (
                  <div>
                    <strong className="text-blue-400 font-mono text-[11px]">ARCHITECTURAL FIX: </strong>
                    <span>{aiAnalysis.recommendedFix}</span>
                  </div>
                )}
                {aiAnalysis.hipaaComplianceGap && (
                  <div className="p-3 bg-[#0a0a0c] rounded-lg border border-white/5 font-mono text-[11px] text-white/70">
                    <strong className="text-blue-400">HIPAA & DPDP GAP: </strong>
                    <span>{aiAnalysis.hipaaComplianceGap}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
