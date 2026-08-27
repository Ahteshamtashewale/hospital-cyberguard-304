# Hospital CyberGuard Architecture Specification

## Overview

Hospital CyberGuard (ID-304) is engineered as a defense-in-depth, zero-trust cybersecurity platform for healthcare ecosystems.

```
+-------------------------------------------------------------------------+
|                       CLINICAL CLIENT LAYER                             |
|  - SOC SIEM Real-Time Telemetry Dashboard                                |
|  - FHIR REST API Vulnerability & Pentesting Studio                      |
|  - Cryptographic Medical Record Integrity & Tamper Simulator            |
|  - IoMT Hardware Firmware Validator & HSM Key Controller                |
|  - AI Phishing & Linguistic Threat Dissector                            |
|  - Zero-Trust ABAC/RBAC Access Evaluator & Break-Glass Emergency Logic  |
|  - DPDP Act 2023 & HIPAA Safe Harbor PHI De-identification Engine       |
+-------------------------------------------------------------------------+
                                    |
                                    v [TLS 1.3 / mTLS]
+-------------------------------------------------------------------------+
|                     SECURE SERVER GATEWAY (server.ts)                   |
|  - RESTful Threat Intelligence API Endpoints (/api/*)                   |
|  - Google GenAI SDK (Gemini 2.5 Flash) Threat Dissection Engine         |
|  - Compliance Rule Evaluators & Safe Harbor Masking                     |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                  CRYPTOGRAPHIC ENCLAVE & DATA INTEGRITY                 |
|  - FIPS 140-3 HSM Root Key Simulation & Epoch Rotation                  |
|  - ECDSA P-256 Asymmetric Signing with SHA-256 Merkle Validation       |
|  - AES-256-GCM Ephemeral Envelope Encryption                            |
+-------------------------------------------------------------------------+
```

## Core Subsystems

### 1. FHIR REST API Protection
- Analyzes RESTful endpoints against OWASP API Security Top 10.
- Evaluates BOLA (Broken Object Level Authorization), Injection, Mass Assignment, and Rate-Limiting.
- Generates instant JSON Web Application Firewall (WAF) remediation rules.

### 2. Medical Record Cryptographic Integrity
- Generates deterministic SHA-256 cryptographic digests across clinical records (Doctor ID, Patient ID, Diagnosis, Prescriptions).
- Signs payloads using ECDSA P-256 asymmetric keys.
- Detects micro-tampering (e.g. changing medication dosage from 10mg to 100mg) and highlights mismatched hashes in real-time.

### 3. IoMT Fleet & Hardware Security Module (HSM)
- Monitors connected medical devices (Infusion pumps, ventilators, dialysis machines).
- Validates vendor firmware signatures against HSM roots of trust before execution.
- Provides immediate VLAN isolation upon binary checksum deviation.

### 4. Zero-Trust Access & Break-Glass IAM
- Implements continuous Attribute-Based Access Control (ABAC).
- Requires identity role, managed device posture, intranet subnet, and FIDO2 MFA.
- Implements a dedicated "Code-Blue" emergency break-glass override with immutable audit logging per HIPAA §164.312(b).
