# FHIR API Security & Threat Modeling Specification

## Scope: Fast Healthcare Interoperability Resources (FHIR R4 / R5)

FHIR APIs expose structured JSON representations of healthcare records (`Patient`, `Observation`, `Encounter`, `MedicationRequest`, `DiagnosticReport`). Because these endpoints frequently interact with third-party patient portals and partner healthcare providers, they are vulnerable to OWASP API Security Top 10 exploits.

---

## Threat Matrix & Mitigation

### 1. API1:2023 Broken Object Level Authorization (BOLA)
- **Vulnerability**: An attacker requests `/api/fhir/Patient/PT-90812` by changing the ID in the URI while authenticated as `PT-11200`.
- **Mitigation**: Attribute-Based Access Control (ABAC) validating the token subject matches the requested patient ID or holds a verified active physician relationship.

### 2. API2:2023 Broken Authentication
- **Vulnerability**: Missing MFA or weakly signed JWT tokens allowing attacker impersonation.
- **Mitigation**: Strict FIDO2 WebAuthn requirement, asymmetric ECDSA token verification, and short token lifespans.

### 3. API3:2023 Broken Object Property Level Authorization (Mass Assignment)
- **Vulnerability**: Submitting payload with modified administrative flags (e.g. `"isChiefMedicalOfficer": true`).
- **Mitigation**: Strict schema validation with DTO whitelist filtering.

### 4. API4:2023 Unrestricted Resource Consumption (Rate Limiting / DoS)
- **Vulnerability**: Flooding the `/api/fhir/Observation` endpoint to exhaust hospital database connections.
- **Mitigation**: Adaptive token-bucket rate limiting (max 100 req/min per IP, 20 req/min for unauthenticated clients).

### 5. API8:2023 Security Misconfiguration & Injection
- **Vulnerability**: SQL / NoSQL injection in FHIR query search parameters (`?patient.name=' OR '1'='1`).
- **Mitigation**: Parameterized queries, WAF pattern matching, and input sanitization.
