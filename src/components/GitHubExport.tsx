import React, { useState } from "react";
import {
  GitBranch,
  Download,
  Copy,
  Check,
  FileCode,
  FolderTree,
  FileText,
  Layers,
  Terminal,
  Shield,
  CheckCircle,
} from "lucide-react";

export const GitHubExport: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const readmeContent = `# Hospital CyberGuard & Data Privacy Infrastructure Suite (ID-304)

> **Project Topic ID-304:** Cybersecurity & Data Privacy in Healthcare Digital Infrastructure.  
> **Target Domain:** Hospital Information Systems (HIS), Electronic Health Records (EHR), Internet of Medical Things (IoMT), and Regulatory Compliance.

---

## 🎯 Executive Summary & Problem Statement

Modern healthcare institutions face multifaceted cybersecurity threats targeting sensitive **Protected Health Information (PHI)** and life-critical **Internet of Medical Things (IoMT)** devices. 

Project **ID-304** delivers a comprehensive, multi-disciplinary defense architecture designed to safeguard digital hospital infrastructure, enforce zero-trust identity controls, cryptographically seal medical records, prevent API data leakage, neutralize spear-phishing attacks, and comply with the **Digital Personal Data Protection Act (DPDP Act 2023)** and **HIPAA Security & Privacy Rules**.

---

## 🧩 Multi-Disciplinary Scope Architecture

\`\`\`
                                  +---------------------------------------+
                                  |    HOSPITAL CYBER DEFENSE (ID-304)   |
                                  +---------------------------------------+
                                                     |
         +-------------------------------------------+---------------------------------------+
         |                                           |                                       |
+------------------+                       +-------------------+                   +-------------------+
|  1. Software/AI  |                       | 2. Hardware / IoT |                   |   3. Management   |
+------------------+                       +-------------------+                   +-------------------+
| • FHIR API Scanner                       | • HSM Root of Trust                   | • DPDP Act 2023   |
| • SHA-256 / ECDSA Signatures             | • Secure Boot Check                   | • HIPAA §164.312  |
| • Phishing NLP Shield                    | • Infusion Pump Guard                 | • PHI Masking     |
| • SIEM Threat Monitor                    | • VLAN Micro-segment                  | • DPIA Matrix     |
+------------------+                       +-------------------+                   +-------------------+
\`\`\`

---

## 🚀 Key Challenge Areas & Implementations

### 1. API Vulnerability & Penetration Scanner
- **Target Protocols:** HL7 FHIR R4 (\`/Patient\`, \`/Observation\`, \`/MedicationRequest\`), PACS DICOM (\`WADO-RS\`).
- **OWASP API Security Top 10 Protections:**
  - Broken Object Level Authorization (BOLA / IDOR) mitigation via clinical care-team assignment checks.
  - Excessive PHI exposure filters applying real-time data minimization.
  - CORS policy lockdown and Token Bucket rate limiters.

### 2. Cryptographic Medical Document & E-Prescription Verification
- **Tamper-Evident Medical Provenance:** SHA-256 digest computation combined with physician ECDSA/RSA digital signatures.
- **Non-Repudiation & Integrity:** Instant detection of unauthorized dosage alterations (e.g., narcotics overdose tampering) and doctor credential forgery.
- **Certificate Verification:** Integrates with Hospital PKI Root Authority & HSM key management.

### 3. Phishing Detection Algorithms & Healthcare Social Engineering Shield
- **AI & NLP Analysis:** Deep contextual evaluation of inbound clinical emails for urgency traps, malpractice subpoena spoofs, fake IT SSO updates, and ransomware attachments.
- **Staff Training Dashboard:** Interactive simulation tracking reporting rates across ICU, Radiology, Pharmacy, and Administration.

### 4. Zero-Trust Architecture (ZTA) & Emergency Break-Glass IAM
- **Dynamic ABAC & RBAC:** Continuous policy verification across User Identity, Device Posture (TPM 2.0 / EDR), Network Location (VLAN 10 Intranet vs VPN), and FIDO2 MFA.
- **Life-Safety Break-Glass Protocol:** Instant emergency bypass for resuscitation and cardiac arrest resuscitation with mandatory tamper-proof audit trails.

### 5. Hardware & IoMT Device Security (HSM & Secure Boot)
- **Monitored Fleet:** Smart Infusion Pumps, ICU Ventilators, Patient Monitors, MRI Gateways, Automated Narcotic Dispensers.
- **Hardware Security Module (HSM):** FIPS 140-3 Level 4 hardware root of trust, master key epoch rotation, and unauthorized firmware tamper detection.

### 6. Data Governance & Regulatory Compliance
- **DPDP Act (India 2023):** Notice & Consent architecture, Data Principal rights, and Data Fiduciary obligations.
- **HIPAA Security & Privacy Rules (USA):** 45 CFR §164.312 technical safeguards and Minimum Necessary PHI standard.
- **PHI De-Identification Studio:** 18-element Safe Harbor masking and pseudonymization for clinical research.

---

## 📂 GitHub Repository File Tree

\`\`\`
hospital-cyberguard-304/
├── docs/
│   ├── ARCHITECTURE.md            # System architecture & data flow
│   ├── DPDP_HIPAA_COMPLIANCE.md   # Regulatory cross-mapping matrix
│   └── API_SPECIFICATIONS.md      # FHIR / HL7 security endpoints
├── src/
│   ├── components/
│   │   ├── SocDashboard.tsx       # Real-time SIEM & Threat Map
│   │   ├── ApiScanner.tsx         # FHIR & REST API Pen-Tester
│   │   ├── CryptoVerifier.tsx     # SHA-256 & ECDSA Signature Verifier
│   │   ├── PhishingShield.tsx     # AI Phishing & Staff Simulator
│   │   ├── ZeroTrustIam.tsx       # ABAC/RBAC & Break-Glass IAM
│   │   ├── IoMTHardwareSecurity.tsx # IoMT & HSM Key Monitor
│   │   └── PrivacyGovernance.tsx  # DPDP/HIPAA Compliance Auditor
│   ├── utils/
│   │   └── crypto.ts              # WebCrypto SHA-256, RSA, PHI De-ID
│   ├── data/
│   │   └── mockData.ts            # Security fixtures & IoMT fleet
│   ├── types.ts                   # TypeScript interfaces
│   └── App.tsx                    # Main Application
├── server.ts                      # Express API & Gemini AI Service
├── package.json
└── README.md                      # Project Documentation
\`\`\`

---

## 🛠️ Quickstart & Execution Guide

### Prerequisites
- Node.js v18+ or v20+
- Modern Web Browser (supports WebCrypto API)

### 1. Clone & Install
\`\`\`bash
git clone https://github.com/your-username/hospital-cyberguard-304.git
cd hospital-cyberguard-304
npm install
\`\`\`

### 2. Configure Environment Secrets
\`\`\`bash
cp .env.example .env
# Edit .env and supply your GEMINI_API_KEY (optional for AI deep reasoning)
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit \`http://localhost:3000\` to access the live dashboard.

---

## 📜 License & Acknowledgments
- Project ID-304: Cybersecurity & Data Privacy in Healthcare
- Conforms to OWASP API Security Top 10 (2023), DPDP Act 2023, HIPAA Security Rule 45 CFR Part 164, and NIST SP 800-66.
`;

  const copyMarkdown = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReadme = () => {
    const blob = new Blob([readmeContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                GITHUB REPOSITORY EXPORTER
              </span>
              <h2 className="text-lg font-serif font-bold text-white">
                Project Documentation & GitHub Repository Package (ID-304)
              </h2>
            </div>
            <p className="text-xs text-white/50 mt-1 max-w-3xl leading-relaxed">
              Complete, production-ready repository package containing system blueprints, multi-disciplinary mapping, module specifications, and downloadable README.md for academic and industry submission.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="btn-copy-readme"
              onClick={copyMarkdown}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-mono font-semibold bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 shadow-sm transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "COPIED MARKDOWN!" : "COPY README.MD"}</span>
            </button>

            <button
              id="btn-download-readme"
              onClick={downloadReadme}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD README.MD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Repository Structure (Left) + Markdown Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Repository File Hierarchy */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-serif font-bold text-white flex items-center gap-1.5 border-b border-white/10 pb-3">
              <FolderTree className="w-4 h-4 text-blue-400" />
              GitHub Repository Directory Tree
            </h3>

            <div className="p-3 bg-[#0a0a0c] rounded-xl border border-white/5 font-mono text-xs text-white/80 leading-relaxed overflow-x-auto">
              <div>📁 <strong className="text-blue-400">hospital-cyberguard-304/</strong></div>
              <div className="pl-4">├── 📁 <strong className="text-amber-300">docs/</strong></div>
              <div className="pl-8">├── 📄 ARCHITECTURE.md</div>
              <div className="pl-8">├── 📄 DPDP_HIPAA_COMPLIANCE.md</div>
              <div className="pl-8">└── 📄 API_SPECIFICATIONS.md</div>
              <div className="pl-4">├── 📁 <strong className="text-emerald-300">src/</strong></div>
              <div className="pl-8">├── 📁 components/</div>
              <div className="pl-12">├── ⚛️ SocDashboard.tsx</div>
              <div className="pl-12">├── ⚛️ ApiScanner.tsx</div>
              <div className="pl-12">├── ⚛️ CryptoVerifier.tsx</div>
              <div className="pl-12">├── ⚛️ PhishingShield.tsx</div>
              <div className="pl-12">├── ⚛️ ZeroTrustIam.tsx</div>
              <div className="pl-12">├── ⚛️ IoMTHardwareSecurity.tsx</div>
              <div className="pl-12">└── ⚛️ PrivacyGovernance.tsx</div>
              <div className="pl-8">├── 📁 utils/ (crypto.ts)</div>
              <div className="pl-8">├── 📁 data/ (mockData.ts)</div>
              <div className="pl-8">├── 📄 types.ts</div>
              <div className="pl-8">└── ⚛️ App.tsx</div>
              <div className="pl-4">├── 🚀 server.ts (Express + Gemini)</div>
              <div className="pl-4">├── 📦 package.json</div>
              <div className="pl-4">└── 📝 README.md</div>
            </div>

            {/* Git Quickstart & Terminal Setup */}
            <div className="p-4 bg-[#0a0a0c] rounded-xl border border-white/5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/60 font-mono text-[10px] uppercase tracking-wider block">GIT REPO INITIALIZATION COMMANDS:</span>
                <button
                  onClick={() => {
                    const commands = `git init\ngit add .\ngit commit -m "feat: Hospital CyberGuard Suite (ID-304) initial release"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/hospital-cyberguard-304.git\ngit push -u origin main`;
                    navigator.clipboard.writeText(commands);
                    alert("Git commands copied to clipboard!");
                  }}
                  className="text-[10px] font-mono text-blue-400 hover:text-blue-300 underline cursor-pointer"
                >
                  Copy Commands
                </button>
              </div>
              <pre className="p-2.5 bg-[#070709] rounded-lg border border-white/5 text-[11px] font-mono text-blue-300/90 leading-relaxed overflow-x-auto">
{`git init
git add .
git commit -m "feat: initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main`}
              </pre>
            </div>

            {/* Quick Feature Checklist */}
            <div className="p-4 bg-[#0a0a0c] rounded-xl border border-white/5 space-y-2 text-xs">
              <span className="text-white/60 font-mono text-[10px] uppercase tracking-wider block">ID-304 SCOPE CHECKLIST:</span>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>API Vulnerability Scanners (OWASP API Top 10)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Secure Document Verification (SHA-256 + ECDSA)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Phishing Detection Algorithms & Training</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Zero-Trust IAM & Emergency Break-Glass</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Hardware HSM & IoMT Firmware Protection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>DPDP Act 2023 & HIPAA Compliance Governance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: README.md Live Markdown Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-serif font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" />
                README.md Technical Specification Preview
              </h3>
              <span className="text-[11px] font-mono text-white/40">Formatted Markdown</span>
            </div>

            <pre className="p-4 bg-[#0a0a0c] rounded-xl text-xs font-mono text-white/70 border border-white/5 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[520px]">
              {readmeContent}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
