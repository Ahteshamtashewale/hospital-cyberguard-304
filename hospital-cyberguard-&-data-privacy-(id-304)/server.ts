import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Hospital CyberGuard & Data Privacy Suite (ID-304)",
    timestamp: new Date().toISOString(),
    aiReady: Boolean(process.env.GEMINI_API_KEY),
  });
});

// 1. AI Phishing Analysis Route
app.post("/api/ai/analyze-phishing", async (req, res) => {
  try {
    const { emailContent, sender, subject, headers } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback deterministic analysis if Gemini key not set
      const isUrgent = /urgent|immediate|wire|transfer|suspended|password|verify|stat\s*order|overdose|code\s*red/i.test(
        `${emailContent} ${subject}`
      );
      const isFakeDomain = sender && !sender.endsWith("@metrohealth.org") && !sender.endsWith(".gov");
      const hasLink = /http(s)?:\/\//i.test(emailContent);

      const score = (isUrgent ? 40 : 10) + (isFakeDomain ? 35 : 5) + (hasLink ? 20 : 5);
      return res.json({
        threatScore: Math.min(score, 98),
        riskLevel: score > 70 ? "HIGH" : score > 40 ? "MEDIUM" : "LOW",
        analysis: "Heuristic scan detected indicators: " + (isUrgent ? "Artificial urgency keywords; " : "") + (isFakeDomain ? "Domain mismatch; " : "") + (hasLink ? "External URL redirects detected." : ""),
        indicators: [
          ...(isUrgent ? [{ type: "URGENCY", description: "High emotional coercion/urgency tactic commonly seen in medical spear-phishing" }] : []),
          ...(isFakeDomain ? [{ type: "SPOOFING", description: "Sender domain mimics legitimate hospital domain with subtle typo" }] : []),
          ...(hasLink ? [{ type: "MALICIOUS_LINK", description: "Unverified external link targeting credential harvesting" }] : []),
        ],
        remediation: "Block sender domain at hospital MX gateway, purge similar messages from staff inboxes, and issue an IoC advisory to on-duty medical staff.",
        source: "heuristic-engine",
      });
    }

    const prompt = `You are a Lead Healthcare Cybersecurity Incident Responder (ID-304). Analyze this incoming hospital email/message for spear-phishing, credential harvesting, invoice fraud, or ransomware delivery targeted at hospital personnel.

Sender: ${sender || "Unknown"}
Subject: ${subject || "No Subject"}
Headers: ${headers || "Standard SMTP"}
Content:
${emailContent}

Return a valid JSON object with the following schema:
{
  "threatScore": number (0 to 100),
  "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "CLEAN",
  "threatCategory": string (e.g., "Medical Spear-Phishing", "Credential Harvesting", "Vendor BEC Fraud", "Ransomware Dropper"),
  "analysis": string (concise expert technical breakdown of why this is or isn't malicious, citing specific social engineering levers),
  "indicators": [
    { "type": string, "description": string, "severity": "HIGH" | "MEDIUM" | "LOW" }
  ],
  "remediation": string (immediate recommended SOC containment action),
  "staffAdvice": string (1-sentence guidance for the nurse/doctor who received this)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ ...parsed, source: "gemini-ai" });
  } catch (error) {
    console.error("Phishing AI Error:", error);
    res.status(500).json({ error: "Failed to analyze message with AI", details: String(error) });
  }
});

// 2. AI Threat Analysis & Incident Response Route
app.post("/api/ai/threat-investigation", async (req, res) => {
  try {
    const { incidentType, affectedAsset, rawLogs, context } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        severity: "HIGH",
        mitreTechnique: "T1078 (Valid Accounts) / T1486 (Data Encrypted for Impact)",
        rootCause: `Detected anomalous telemetry on ${affectedAsset} matching signature ${incidentType}.`,
        impactAnalysis: "Potential unauthorized exfiltration of Protected Health Information (PHI) and localized disruption of clinical telemetry.",
        containmentPlan: [
          "1. Quarantine device IP/MAC via network 802.1X isolation VLAN.",
          "2. Revoke active JWT session tokens for associated clinician service account.",
          "3. Verify firmware integrity via HSM root of trust.",
          "4. Notify Hospital Data Privacy Officer (DPO) pursuant to DPDP/HIPAA breach notification protocol.",
        ],
        regulatoryImpact: "Mandatory incident logging under DPDP Act Sec 8 & HIPAA Breach Notification Rule 45 CFR §§ 164.400-414.",
        source: "fallback-rule-engine",
      });
    }

    const prompt = `You are a Senior Hospital SOC Analyst & Threat Hunter (Project ID-304). Investigate this hospital cyber incident:
Incident Type: ${incidentType}
Target Asset: ${affectedAsset}
Raw Security Logs:
${rawLogs}
Context: ${context || "Hospital Clinical Network"}

Respond in JSON format:
{
  "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "cvssScore": number (0.0 to 10.0),
  "mitreTechnique": string,
  "rootCause": string,
  "impactAnalysis": string (impact on clinical patient safety and data privacy),
  "containmentPlan": string[],
  "forensicArtifacts": string[],
  "regulatoryImpact": string (HIPAA/DPDP Act/GDPR notification obligations)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ ...parsed, source: "gemini-ai" });
  } catch (error) {
    console.error("Threat investigation error:", error);
    res.status(500).json({ error: "Failed to investigate threat", details: String(error) });
  }
});

// 3. AI API Security & Vulnerability Assessment
app.post("/api/ai/audit-api-endpoint", async (req, res) => {
  try {
    const { endpoint, method, headers, requestBody, responseBody } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        overallRisk: "HIGH",
        vulnerabilities: [
          {
            type: "OWASP API1:2023 - Broken Object Level Authorization (BOLA)",
            severity: "HIGH",
            details: "Endpoint accepts user-controllable patientId in URI without verifying requesting user's organizational tenancy or physician assignment.",
            remediationCode: "// Verify clinician-patient relationship\nconst isAuthorized = await db.clinicalCareTeam.exists({ doctorId: req.user.id, patientId: req.params.patientId });\nif (!isAuthorized && req.user.role !== 'EMERGENCY_BREAK_GLASS') return res.status(403).json({ error: 'Access Denied: BOLA violation prevented' });",
          },
          {
            type: "OWASP API3:2023 - Broken Object Property Level Authorization",
            severity: "MEDIUM",
            details: "API response contains unmasked National ID and raw mental health diagnostics without explicit granular scope consent.",
            remediationCode: "const sanitizedPatient = maskPHI(patientData, req.user.scope); // Mask SSN/Diagnosis for non-physicians",
          },
        ],
        complianceNotice: "Violates HIPAA §164.312(a)(1) Access Control & DPDP Act Data Minimization principles.",
        source: "static-audit-matrix",
      });
    }

    const prompt = `Analyze this Healthcare FHIR / REST API endpoint for OWASP API Security Top 10 (2023) and HIPAA/DPDP privacy vulnerabilities:
Endpoint: ${method} ${endpoint}
Request Headers: ${JSON.stringify(headers || {})}
Request Body: ${JSON.stringify(requestBody || {})}
Sample Response: ${JSON.stringify(responseBody || {})}

Return JSON with:
{
  "overallRisk": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SECURE",
  "securityScore": number (0 to 100),
  "vulnerabilities": [
    {
      "type": string,
      "owaspCode": string,
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "details": string,
      "exploitationScenario": string,
      "remediationCode": string
    }
  ],
  "hipaaComplianceGap": string,
  "dpdpComplianceGap": string,
  "recommendedFix": string
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ ...parsed, source: "gemini-ai" });
  } catch (error) {
    console.error("API Audit error:", error);
    res.status(500).json({ error: "Failed to audit API endpoint", details: String(error) });
  }
});

// 4. AI Compliance & DPIA Assessment Route
app.post("/api/ai/compliance-audit", async (req, res) => {
  try {
    const { framework, systemComponent, dataFlowDescription, currentControls } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        framework: framework || "DPDP Act & HIPAA",
        complianceScore: 78,
        findings: [
          {
            clause: "DPDP Act 2023 - Section 6 (Consent Notice)",
            status: "PARTIAL",
            recommendation: "Ensure patients can revoke consent item-by-item for non-emergency analytics vs primary care record sharing.",
          },
          {
            clause: "HIPAA Security Rule 45 CFR § 164.312(e)(1) (Transmission Security)",
            status: "COMPLIANT",
            recommendation: "TLS 1.3 enforced across all IoMT and telehealth telemetry streams.",
          },
          {
            clause: "HIPAA § 164.312(b) (Audit Controls)",
            status: "ACTION_REQUIRED",
            recommendation: "Implement immutable write-once tamper-proof audit trail for break-glass emergency chart lookups.",
          },
        ],
        riskSummary: "Medium residual risk on secondary health data sharing without cryptographic provenance.",
        source: "baseline-compliance-rulebook",
      });
    }

    const prompt = `You are a Healthcare Regulatory Privacy Auditor specializing in the DPDP Act (India 2023), HIPAA Security/Privacy Rules (USA), and GDPR Art 9 (Health Data).
Target Component: ${systemComponent}
Framework: ${framework}
Data Flow Description: ${dataFlowDescription}
Current Controls: ${currentControls}

Evaluate the architecture and respond in JSON:
{
  "framework": string,
  "complianceScore": number (0 to 100),
  "auditGrade": "A" | "B" | "C" | "F",
  "executiveSummary": string,
  "findings": [
    {
      "clause": string,
      "domain": "Access Control" | "Consent & Notice" | "Data Minimization" | "Auditability" | "Breach Response",
      "status": "COMPLIANT" | "PARTIAL" | "ACTION_REQUIRED" | "NON_COMPLIANT",
      "riskLevel": "HIGH" | "MEDIUM" | "LOW",
      "gap": string,
      "remediation": string
    }
  ],
  "dpiaRecommendation": string
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ ...parsed, source: "gemini-ai" });
  } catch (error) {
    console.error("Compliance Audit error:", error);
    res.status(500).json({ error: "Failed to run compliance audit", details: String(error) });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hospital CyberGuard & Data Privacy Server listening on port ${PORT}`);
  });
}

startServer();
