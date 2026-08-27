# Hospital CyberGuard & Data Privacy Suite (Project ID-304)

[![CI Build](https://github.com/your-org/hospital-cyberguard-304/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/hospital-cyberguard-304/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Compliance](https://img.shields.io/badge/Compliance-DPDP%202023%20%7C%20HIPAA-emerald.svg)](https://www.meity.gov.in/)

A full-stack, enterprise-grade Hospital Cybersecurity, Medical Record Integrity, and Healthcare Data Privacy Governance system designed to address the critical vulnerabilities of modern connected healthcare infrastructures.

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Key Problem Statements & Scope (ID-304)](#key-problem-statements--scope-id-304)
- [Core Modules & Architecture](#core-modules--architecture)
- [Multi-Disciplinary Scope Mapping](#multi-disciplinary-scope-mapping)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Development Server](#development-server)
  - [Deploy to Streamlit Cloud](#deploy-to-streamlit-cloud)
  - [Production Build](#production-build)
- [GitHub Workflow & CI/CD](#github-workflow--cicd)
- [Compliance & Regulatory Alignment](#compliance--regulatory-alignment)
- [License](#license)

---

## Executive Summary

Modern hospitals rely on interconnected medical ecosystems spanning **Fast Healthcare Interoperability Resources (FHIR) APIs**, **Internet of Medical Things (IoMT) hardware**, **Electronic Health Records (EHR)**, and multi-tenant clinical staff access. These systems are prime targets for ransomware, data exfiltration, device firmware tampering, and API logic flaws.

**Hospital CyberGuard (ID-304)** is an integrated cyber-defense platform built specifically for healthcare environments, unifying:
1. **FHIR / HL7 REST API Security Testing & OWASP Top 10 Scanners**
2. **IoMT Hardware & Firmware Tamper Detection with HSM Key Lifecycle**
3. **ECDSA Digital Signatures & SHA-256 Tamper-Evident Medical Record Verification**
4. **Zero-Trust Architecture (ZTA) & Code-Blue Emergency Break-Glass IAM**
5. **AI-Powered Phishing Defense & Attack Campaign Reconstruction**
6. **Data Privacy Governance (DPDP Act 2023, HIPAA, GDPR Safe Harbor)**

---

## Key Problem Statements & Scope (ID-304)

| Challenge ID | Focus Area | Solution Implemented |
| :--- | :--- | :--- |
| **Area 1** | FHIR / API Vulnerabilities | Automated BOLA, SQLi, Mass Assignment, Rate-Limiting scanners & WAF auto-remediation |
| **Area 2** | Medical Record Tampering | FIPS-compliant SHA-256 merkle roots & ECDSA digital signatures with audit verification |
| **Area 3** | AI Phishing & Social Engineering | LLM-based linguistic spoofing analyzer with spear-phishing IOC extraction |
| **Area 4** | Zero-Trust & Break-Glass IAM | Dynamic ABAC/RBAC validation + audited Code-Blue resuscitation emergency overrides |
| **Area 5** | IoMT Hardware & HSM Security | Cryptographic firmware checksum verification, 802.1X quarantine, HSM key rotation |
| **Area 6** | DPDP / HIPAA Data Privacy | Automated compliance engine + 18-HIPAA Safe Harbor PHI de-identification studio |

---

## Core Modules & Architecture

```
hospital-cyberguard-304/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated build, linting, and security checks
├── docs/
│   ├── ARCHITECTURE.md            # In-depth architectural specifications
│   ├── DPDP_HIPAA_COMPLIANCE.md   # Regulatory audit matrices
│   └── API_SECURITY_SPECIFICATION.md # FHIR REST API threat models
├── src/
│   ├── components/
│   │   ├── ApiVulnerabilityScanner.tsx # FHIR & OWASP API Scanner
│   │   ├── MedicalRecordIntegrity.tsx  # ECDSA & SHA-256 Verification
│   │   ├── PhishingDefense.tsx         # AI Social Engineering Defense
│   │   ├── ZeroTrustIam.tsx            # Zero-Trust & Break-Glass IAM
│   │   ├── IoMTHardwareSecurity.tsx    # IoMT Firmware & HSM Enclaves
│   │   ├── PrivacyGovernance.tsx       # DPDP 2023 & HIPAA Compliance
│   │   ├── ThreatIntelligenceMap.tsx   # Live SOC SIEM Telemetry Map
│   │   └── GitHubExport.tsx            # In-app repo generator & exporter
│   ├── services/
│   │   └── gemini.ts                   # Server-side GenAI threat analysis
│   ├── types.ts                        # Unified TypeScript data interfaces
│   ├── App.tsx                         # Main clinical SOC dashboard
│   ├── main.tsx                        # Application entrypoint
│   └── index.css                       # Tailwind CSS stylesheet
├── server.ts                           # Express backend API & Vite middleware
├── package.json                        # NPM dependencies and scripts
└── vite.config.ts                      # Vite build configuration
```

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons
- **Backend**: Node.js, Express, TSX, esbuild
- **AI & Threat Intelligence**: Google GenAI SDK (`@google/genai`) with Gemini 2.5 Flash
- **Cryptography**: Web Crypto API (SubtleCrypto: SHA-256, ECDSA P-256, AES-GCM)
- **Container / Deployment**: Cloud Run & Docker ready

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **bun** or **yarn**
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/hospital-cyberguard-304.git
   cd hospital-cyberguard-304
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Environment Variables

Copy the sample environment file:
```bash
cp .env.example .env
```

Configure your secrets in `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### Development Server

Run the development server with live reload:
```bash
npm run dev
```

The application will be accessible at: `http://localhost:3000`

### Deploy to Streamlit Cloud

You can deploy this application directly to **Streamlit Community Cloud** in 3 steps:

1. Push this repository to your GitHub account (`ahteshamtashewale/your-repo-name`).
2. Go to [share.streamlit.io](https://share.streamlit.io/) and log in with GitHub.
3. Click **"New app"**, select your repository, set Main file path to `app.py`, and click **Deploy**!

To run Streamlit locally on your machine:
```bash
pip install -r requirements.txt
streamlit run app.py
```

### Production Build

Compile both frontend static bundle and backend server bundle:
```bash
npm run build
npm start
```

---

## GitHub Workflow & CI/CD

This repository includes a continuous integration workflow in `.github/workflows/ci.yml` that validates:
1. **TypeScript Type Safety**: Runs `tsc --noEmit`
2. **Production Bundle Verification**: Validates `npm run build`
3. **Security Audit**: Audits dependencies for known CVEs

---

## Compliance & Regulatory Alignment

- **Digital Personal Data Protection Act (DPDP Act 2023, India)**:
  - Section 4: Lawful grounds for processing health data
  - Section 8: Reasonable security safeguards against breaches
  - Section 9: Processing of sensitive personal data with parental/guardian consent
- **HIPAA Security & Privacy Rules (45 CFR § 164.308 / § 164.312)**:
  - Technical Safeguards: Unique user ID, emergency access procedure, audit controls, encryption in transit & at rest
  - Safe Harbor De-identification: Automatic masking of all 18 direct personal identifiers
- **GDPR (Article 9 & 32)**:
  - Processing of special categories of data with DPIA evaluation

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
