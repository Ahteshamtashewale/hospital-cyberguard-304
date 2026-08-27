# DPDP Act 2023 & HIPAA Compliance Matrix

## 1. Digital Personal Data Protection Act (DPDP Act 2023, India)

| Section | Statutory Mandate | Hospital CyberGuard Implementation |
| :--- | :--- | :--- |
| **Section 4** | Lawful grounds for processing personal data | Role-based contextual access with explicit physician logging. |
| **Section 6** | Notice & Consent Management | Automated patient consent verification for secondary research. |
| **Section 8(5)** | Reasonable security safeguards against breaches | AES-256 encryption at rest, TLS 1.3 in transit, automated vulnerability scanners. |
| **Section 8(6)** | Mandatory intimation of data breaches | Integrated incident escalation workflow and real-time audit logging. |
| **Section 9** | Processing of children's personal data | Parental/guardian verification and heightened data minimization. |

---

## 2. HIPAA Security & Privacy Rule (45 CFR Part 160 and Part 164)

### Technical Safeguards (§164.312)

1. **Access Control (§164.312(a)(1))**:
   - Unique User Identification: All clinical actions tagged with verified practitioner ID.
   - Emergency Access Procedure ("Break-Glass"): Automated override for ICU/ER with mandatory clinical justification and immutable audit logging.
   - Automatic Logoff: Session expiry enforced across all client endpoints.

2. **Audit Controls (§164.312(b))**:
   - Cryptographically linked audit logs for all PHI read, write, export, and delete attempts.

3. **Integrity (§164.312(c)(1))**:
   - SHA-256 Merkle root hashing and ECDSA digital signatures ensure medical records cannot be altered undetectably.

4. **Transmission Security (§164.312(e)(1))**:
   - End-to-end mTLS encryption for FHIR API endpoints and IoMT device telemetry streams.

---

## 3. HIPAA Safe Harbor PHI De-identification (18 Protected Identifiers)

The built-in De-identification Studio automatically strips or masks:
1. Names
2. Geographic subdivisions smaller than a state
3. Dates (birth date, admission date, discharge date, date of death)
4. Telephone numbers
5. Fax numbers
6. Email addresses
7. Social Security numbers / Aadhaar numbers
8. Medical record numbers (MRN)
9. Health plan beneficiary numbers
10. Account numbers
11. Certificate/license numbers
12. Vehicle identifiers and serial numbers
13. Device identifiers and serial numbers
14. Web Universal Resource Locators (URLs)
15. Internet Protocol (IP) addresses
16. Biometric identifiers (fingerprints, voiceprints)
17. Full-face photographic images
18. Any other unique identifying number or code
