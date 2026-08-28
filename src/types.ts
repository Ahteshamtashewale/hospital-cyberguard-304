export type TabType =
  | "guest_overview"
  | "soc_dashboard"
  | "api_scanner"
  | "crypto_verifier"
  | "phishing_shield"
  | "zero_trust_iam"
  | "iomt_hardware"
  | "privacy_governance"
  | "github_export";

export interface ThreatEvent {
  id: string;
  timestamp: string;
  sourceIp: string;
  targetAsset: string;
  attackVector: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  mitreTechnique: string;
  status: "ACTIVE" | "CONTAINED" | "INVESTIGATING" | "BLOCKED";
  description: string;
  rawLog: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  category: "FHIR Patient" | "PACS DICOM" | "Prescription HL7" | "Billing API" | "Emergency Triage";
  sampleRequest: Record<string, unknown>;
  sampleResponse: Record<string, unknown>;
  knownVulnerabilities: {
    title: string;
    owaspCode: string;
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    description: string;
    exploitPayload: string;
    remediation: string;
  }[];
}

export interface MedicalRecordDoc {
  id: string;
  recordNumber: string;
  patientName: string;
  dob: string;
  doctorName: string;
  doctorLicense: string;
  diagnosis: string;
  prescriptions: { drug: string; dosage: string; frequency: string }[];
  clinicalNotes: string;
  createdDate: string;
  signatureTimestamp: string;
}

export interface IoMTDevice {
  id: string;
  name: string;
  type:
    | "Infusion Pump"
    | "ICU Patient Monitor"
    | "Smart Ventilator"
    | "MRI/CT Gateway"
    | "Medication Dispenser"
    | "Surgical Robot Hub"
    | "Cardiac Pacemaker Gateway"
    | "Neonatal Incubator"
    | "Dialysis Machine";
  department:
    | "ICU Ward 4"
    | "Oncology"
    | "Emergency Dept"
    | "Radiology"
    | "Pharmacy"
    | "Cardiology & Cath Lab"
    | "Robotic Surgery OT"
    | "Neonatal ICU (NICU)"
    | "Pathology & Blood Bank";
  ipAddress: string;
  macAddress: string;
  firmwareVersion: string;
  hsmStatus: "SECURE_LOCKED" | "KEY_ROTATING" | "UNVERIFIED" | "ALERT";
  firmwareHash: string;
  isTampered: boolean;
  status: "NORMAL" | "ANOMALOUS" | "ISOLATED" | "UPDATING";
  telemetry: {
    battery: number;
    networkPps: number;
    cpuLoad: number;
    lastHeartbeat: string;
  };
}

export interface AccessRequest {
  id: string;
  user: string;
  role: "ATTENDING_PHYSICIAN" | "ICU_NURSE" | "RADIOLOGIST" | "PHARMACIST" | "BILLING_AUDITOR" | "EXTERNAL_CONSULTANT";
  resource: string;
  action: "READ" | "WRITE" | "EXPORT" | "DELETE" | "BREAK_GLASS_OVERRIDE";
  deviceTrust: "MANAGED_HOSPITAL_DEVICE" | "BYOD_ENROLLED" | "UNKNOWN_UNTRUSTED";
  networkLocation: "HOSPITAL_INTRANET" | "SECURE_VPN" | "GUEST_WIFI_RESTRICTED" | "EXTERNAL_PUBLIC_IP";
  mfaVerified: boolean;
  isEmergencyBreakGlass?: boolean;
  reason?: string;
}
