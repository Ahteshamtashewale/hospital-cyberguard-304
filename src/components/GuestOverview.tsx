import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  FileCheck2,
  Sliders,
  Activity,
  MailWarning,
  Lock,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileText,
  HeartPulse,
  Cpu,
  Layers,
  Printer,
  X,
  ExternalLink,
  ChevronRight,
  Zap,
  Radio,
  Building2,
  Stethoscope,
  Syringe,
  Scan,
  Baby,
  Dna,
  Bot,
  AlertOctagon,
  Key,
  GraduationCap,
} from "lucide-react";
import { TabType } from "../types";

interface GuestOverviewProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenTour: () => void;
  onOpenEvaluatorGuide: () => void;
  threatCount: number;
}

export const GuestOverview: React.FC<GuestOverviewProps> = ({
  onNavigateTab,
  onOpenTour,
  onOpenEvaluatorGuide,
  threatCount,
}) => {
  const [activeStory, setActiveStory] = useState<number>(0);
  const [storyStep, setStoryStep] = useState<number>(0);
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [selectedDeptDetail, setSelectedDeptDetail] = useState<any | null>(null);
  const [showExecutiveModal, setShowExecutiveModal] = useState<boolean>(false);

  // 8 Hospital Clinical Departments Matrix
  const hospitalDepartments = [
    {
      id: "icu",
      name: "ICU & Critical Care",
      icon: <Stethoscope className="w-5 h-5 text-cyan-400" />,
      deviceCount: 120,
      activeThreats: 1,
      protectionStatus: "HSM SECURED",
      riskLevel: "CRITICAL",
      description: "Continuous life-support monitoring for smart ventilators, arterial lines, and multi-parameter telemetry.",
      keyDevices: ["Hamilton Ventilator #04", "Alaris Infusion Pump #12", "Philips IntelliVue MX800"],
      safeguard: "FIPS 140-3 Hardware Root-of-Trust with sub-second 802.1X quarantine isolation.",
    },
    {
      id: "cardiology",
      name: "Cardiology & Cath Lab",
      icon: <HeartPulse className="w-5 h-5 text-red-400" />,
      deviceCount: 85,
      activeThreats: 0,
      protectionStatus: "RF ENCRYPTED",
      riskLevel: "HIGH",
      description: "Wireless cardiac telemetry, pacemakers, implantable defibrillators, and catheterization lab consoles.",
      keyDevices: ["Medtronic CareLink RF Gateway", "GE Mac 5500 ECG", "Siemens Artis Q Cath Station"],
      safeguard: "Mutual TLS + Cryptographic timestamp verification preventing replay & telemetry spoofing.",
    },
    {
      id: "radiology",
      name: "Radiology & Nuclear Medicine",
      icon: <Scan className="w-5 h-5 text-amber-400" />,
      deviceCount: 45,
      activeThreats: 0,
      protectionStatus: "DLP ACTIVE",
      riskLevel: "MEDIUM",
      description: "High-volume diagnostic imaging archives (PACS/DICOM), 3T MRI scanners, and CT multi-slice hubs.",
      keyDevices: ["Siemens Magnetom 3T MRI", "GE Revolution CT Gateway", "Synapse PACS Archive"],
      safeguard: "Data Loss Prevention (DLP) agent preventing bulk unencrypted DICOM exfiltration over USB/LAN.",
    },
    {
      id: "oncology",
      name: "Oncology & Chemotherapy",
      icon: <Syringe className="w-5 h-5 text-emerald-400" />,
      deviceCount: 60,
      activeThreats: 0,
      protectionStatus: "ECDSA SIGNED",
      riskLevel: "HIGH",
      description: "High-risk cytotoxic medication compounding and precision radiotherapy linear accelerators.",
      keyDevices: ["RIVA Automated Chemo Compounding Robot", "Varian TrueBeam Linac", "Baxter Spectrum Pump"],
      safeguard: "Doctor ECDSA P-256 digital signature cross-verification before cytotoxic infusion dispensing.",
    },
    {
      id: "pharmacy",
      name: "Central Pharmacy & Narcotics",
      icon: <Key className="w-5 h-5 text-blue-400" />,
      deviceCount: 30,
      activeThreats: 1,
      protectionStatus: "BIOMETRIC VAULT",
      riskLevel: "CRITICAL",
      description: "Controlled substance storage, automated medication carousels, and pharmacy dispensing REST APIs.",
      keyDevices: ["Pyxis MedStation Narcotic Vault", "Omnicell Carousel #03", "HL7 Narcotic Order Gateway"],
      safeguard: "WAF BOLA / IDOR inspection blocking unauthorized remote opioid dispense payloads.",
    },
    {
      id: "surgery",
      name: "Robotic Surgery & OT Suite",
      icon: <Bot className="w-5 h-5 text-violet-400" />,
      deviceCount: 24,
      activeThreats: 0,
      protectionStatus: "ZERO-TRUST ISOLATION",
      riskLevel: "CRITICAL",
      description: "Minimally invasive laparoscopic robot consoles, anesthetic workstations, and surgical endoscopy feeds.",
      keyDevices: ["Intuitive DaVinci Xi Surgical Console", "Dräger Perseus A500 Anesthesia", "Storz 4K Endoscopy"],
      safeguard: "Zero-Trust ABAC enclave with dedicated air-gapped VLAN ensuring sub-millisecond surgical latency.",
    },
    {
      id: "emergency",
      name: "Emergency & Trauma Triage",
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      deviceCount: 150,
      activeThreats: 0,
      protectionStatus: "BREAK-GLASS READY",
      riskLevel: "HIGH",
      description: "Fast-track trauma resuscitation bays, ambulance telemetry ingestion, and triage chart terminals.",
      keyDevices: ["Zoll X Series Defibrillator", "Mindray BeneVision Triage Station", "Mobile CarePAD ER Terminals"],
      safeguard: "Sub-50ms Break-Glass emergency override allowing life-saving doctor access with permanent audit trails.",
    },
    {
      id: "nicu",
      name: "Neonatal ICU (NICU)",
      icon: <Baby className="w-5 h-5 text-pink-400" />,
      deviceCount: 40,
      activeThreats: 0,
      protectionStatus: "HSM ENCLAVE",
      riskLevel: "CRITICAL",
      description: "Infant micro-environment incubators, neonatal phototherapy, and specialized pediatric monitors.",
      keyDevices: ["Draeger Isolette Infant Incubator #02", "GE Giraffe OmniBed", "Masimo Infant Pulse Oximeter"],
      safeguard: "Continuous thermal & oxygen telemetry anomaly checks with tamper-proof firmware lock.",
    },
  ];

  // 8 Interactive Hospital Stories for Guests
  const hospitalStories = [
    {
      id: "prescription",
      dept: "Pharmacy",
      title: "1. The Altered Narcotic Prescription",
      icon: <FileCheck2 className="w-5 h-5 text-emerald-400" />,
      departmentName: "Central Pharmacy & Narcotics",
      problem: "A rogue insider attempts to secretly alter a patient's narcotic prescription in the hospital database from 10mg to 500mg.",
      steps: [
        {
          label: "1. Doctor Signs Prescription",
          desc: "Dr. Sarah Chen orders 10mg Morphine. The system automatically signs the record using ECDSA P-256 digital signature and hashes it with SHA-256.",
          status: "ORIGINAL_SIGNED",
          state: "Record Hash: 7e9b2...8f1a | Doctor Signature: VALID",
        },
        {
          label: "2. Insider Alters Database",
          desc: "An attacker modifies the database field directly to 500mg Morphine without the doctor's cryptographic private key.",
          status: "TAMPER_ATTEMPT",
          state: "Database Content: 500mg Morphine (UNAUTHORIZED)",
        },
        {
          label: "3. Sentinel Vault Intercepts",
          desc: "Before the hospital pharmacy dispenses the drug, Sentinel verifies the signature. The cryptographic hash doesn't match! The dispense order is instantly halted and the security team is alerted.",
          status: "BLOCKED_SAVED",
          state: "🚨 SIGNATURE MISMATCH DETECTED (Tamper caught in 12ms. Patient protected from lethal overdose!)",
        },
      ],
      deliverable: "100% mathematical tamper-detection preventing fatal medication errors.",
      targetTab: "crypto_verifier" as TabType,
    },
    {
      id: "ventilator",
      dept: "ICU",
      title: "2. Malicious ICU Ventilator Firmware",
      icon: <Sliders className="w-5 h-5 text-cyan-400" />,
      departmentName: "ICU & Critical Care",
      problem: "An external attacker targets ICU Smart Ventilator #04 via hospital Wi-Fi, trying to flash corrupted firmware to disable oxygen alarms.",
      steps: [
        {
          label: "1. Ventilator in Clinical Operation",
          desc: "ICU Smart Ventilator #04 is ventilating a critical patient. Its Hardware Security Module (HSM) maintains a cryptographic root of trust.",
          status: "ORIGINAL_SIGNED",
          state: "Firmware Hash: 4e82b...99c2 (HSM Locked)",
        },
        {
          label: "2. Corrupted Payload Injected",
          desc: "Attacker attempts to push unsigned firmware 'v4.1.0-mod' over Port 23.",
          status: "TAMPER_ATTEMPT",
          state: "Firmware Checksum Mismatch: Received hash does not match vendor authority!",
        },
        {
          label: "3. Automated 802.1X Quarantine",
          desc: "Sentinel IoMT shield immediately triggers network quarantine, isolates the device to a sandboxed VLAN, alerts the biomedical team, and switches to safe mechanical failsafe.",
          status: "BLOCKED_SAVED",
          state: "🛡️ DEVICE QUARANTINED (Patient safety maintained; Zero clinical downtime!)",
        },
      ],
      deliverable: "Automated hardware root-of-trust & instant network quarantine for ICU life support.",
      targetTab: "iomt_hardware" as TabType,
    },
    {
      id: "phishing",
      dept: "Staff",
      title: "3. Urgent Shift Schedule Phishing Email",
      icon: <MailWarning className="w-5 h-5 text-violet-400" />,
      departmentName: "All Clinical Staff Inboxes",
      problem: "A nurse receives an urgent email: 'ACTION REQUIRED: Confirm your ICU shift schedule immediately or your credentials will be revoked'.",
      steps: [
        {
          label: "1. Deceptive Email Arrives",
          desc: "Email appears to come from 'admin@metrohealth-portal.org' (a spoofed domain) with a link to a fake login portal.",
          status: "ORIGINAL_SIGNED",
          state: "Subject: URGENT: Mandatory Shift Re-verification",
        },
        {
          label: "2. Gemini AI Deep Linguistic Scan",
          desc: "Sentinel AI examines urgency patterns, domain registration, and URL redirections, scoring it 94/100 (CRITICAL THREAT).",
          status: "TAMPER_ATTEMPT",
          state: "AI Scan: Spoofed Domain + Artificial Urgency + Fake SSO Harvesting Link",
        },
        {
          label: "3. Threat Neutralized & Staff Protected",
          desc: "The email is quarantined across all 1,200 staff inboxes, preventing ransomware payload delivery.",
          status: "BLOCKED_SAVED",
          state: "✅ MALICIOUS EMAIL QUARANTINED (0 credentials leaked across hospital staff!)",
        },
      ],
      deliverable: "AI-driven email intelligence that blocks hospital credential theft before staff can click.",
      targetTab: "phishing_shield" as TabType,
    },
    {
      id: "breakglass",
      dept: "Emergency",
      title: "4. Code-Blue Emergency Chart Access",
      icon: <Lock className="w-5 h-5 text-amber-400" />,
      departmentName: "Emergency & Trauma Bay",
      problem: "A trauma patient arrives in cardiac arrest. An on-call doctor is not normally assigned to this patient, but needs instant chart access to check for fatal penicillin allergies.",
      steps: [
        {
          label: "1. Zero-Trust Access Check",
          desc: "Normal Zero-Trust RBAC denies access because the doctor is from a different ward.",
          status: "ORIGINAL_SIGNED",
          state: "Status: ACCESS_RESTRICTED (Out-of-Department Physician)",
        },
        {
          label: "2. Doctor Triggers 'Code Blue' Override",
          desc: "Doctor clicks 'Emergency Break-Glass', enters emergency reason 'Cardiac Resuscitation Room 3', and provides biometric license verification.",
          status: "TAMPER_ATTEMPT",
          state: "Emergency Reason Logged: 'Cardiac Resuscitation Room 3' | License: MD-9042",
        },
        {
          label: "3. Instant Chart Unlock with Audit Trail",
          desc: "System unlocks allergy chart in under 50 milliseconds while generating an immutable audit log for the Hospital Compliance Committee.",
          status: "BLOCKED_SAVED",
          state: "⚡ INSTANT ACCESS GRANTED (Life saved + 100% Audited Security Compliance!)",
        },
      ],
      deliverable: "Zero delay during emergency patient resuscitation + 100% auditable Zero-Trust security.",
      targetTab: "zero_trust_iam" as TabType,
    },
    {
      id: "cardio_jamming",
      dept: "Cardiology",
      title: "5. Pacemaker RF Jamming & Telemetry Tamper",
      icon: <HeartPulse className="w-5 h-5 text-red-400" />,
      departmentName: "Cardiology & Cath Lab",
      problem: "An attacker with an RF transceiver attempts to forge false tachyarrhythmia alerts on an implanted pacemaker to trigger an unnecessary high-voltage defibrillation shock.",
      steps: [
        {
          label: "1. Pacemaker Telemetry Broadcast",
          desc: "Implanted pacemaker transmits normal sinus rhythm telemetry (72 BPM) to bedside RF receiver.",
          status: "ORIGINAL_SIGNED",
          state: "Heart Rate: 72 BPM Normal | Telemetry Auth: HMAC-SHA256 Valid",
        },
        {
          label: "2. Attacker Injects Forged Burst",
          desc: "Rogue RF transmitter broadcasts spoofed ventricular fibrillation packet (220 BPM) lacking valid session nonce.",
          status: "TAMPER_ATTEMPT",
          state: "Malformed RF Signal: Nonce replay detected! Missing mutual TLS handshake token.",
        },
        {
          label: "3. Cryptographic Shield Drops Packet",
          desc: "The CareLink Gateway verifies cryptographic session timestamp, drops the rogue packet immediately, and alerts the electrophysiologist.",
          status: "BLOCKED_SAVED",
          state: "🛡️ FORGED RF PACKET DROPPED (Inappropriate cardiac shock prevented!)",
        },
      ],
      deliverable: "Cryptographic RF mutual authentication preventing unauthorized cardiac implant manipulation.",
      targetTab: "iomt_hardware" as TabType,
    },
    {
      id: "dicom_exfil",
      dept: "Radiology",
      title: "6. Mass Exfiltration of 450 MRI/CT Scans",
      icon: <Scan className="w-5 h-5 text-amber-400" />,
      departmentName: "Radiology & Nuclear Medicine",
      problem: "A compromised radiology workstation attempts to copy 450 high-resolution MRI brain scans with unencrypted patient identities to an unauthorized external USB drive.",
      steps: [
        {
          label: "1. Scan Archives in DICOM PACS",
          desc: "450 oncology MRI studies stored in PACS with 18 HIPAA Safe Harbor metadata tags.",
          status: "ORIGINAL_SIGNED",
          state: "PACS Status: AES-256 Encrypted at Rest | Port 104 Protected",
        },
        {
          label: "2. Bulk USB Copy Triggered",
          desc: "Automated script attempts mass unencrypted export to external USB drive (Drive E:).",
          status: "TAMPER_ATTEMPT",
          state: "DLP Trigger: 450 unencrypted DICOM headers detected for external export!",
        },
        {
          label: "3. DLP Intercept & Auto-Redaction",
          desc: "Sentinel DLP agent blocks the mass file copy, isolates the USB port, and alerts the Data Privacy Officer.",
          status: "BLOCKED_SAVED",
          state: "🔒 EXFILTRATION BLOCKED (Zero Protected Health Information leaked; DPDP compliant!)",
        },
      ],
      deliverable: "Automated Data Loss Prevention (DLP) preventing massive patient imaging leaks.",
      targetTab: "privacy_governance" as TabType,
    },
    {
      id: "robotic_ot",
      dept: "Surgery",
      title: "7. Ransomware Attack on Robotic Surgical Console",
      icon: <Bot className="w-5 h-5 text-violet-400" />,
      departmentName: "Robotic Surgery & OT Suite",
      problem: "Ransomware botnet scans the hospital operating theater network during an active laparoscopic kidney resection, trying to freeze the robotic arm console.",
      steps: [
        {
          label: "1. DaVinci Console in Active Surgery",
          desc: "Surgical robot arm operating with sub-millisecond haptic feedback on isolated OT VLAN.",
          status: "ORIGINAL_SIGNED",
          state: "OT Status: Air-Gapped Subnet | Console Latency: 0.8ms",
        },
        {
          label: "2. Lateral Ransomware Probe",
          desc: "Infected maintenance laptop attempts SMB/Telnet exploit on the surgical console IP.",
          status: "TAMPER_ATTEMPT",
          state: "Intrusion Attempt: Lateral exploit packet targeted at Port 445 on Surgical Hub!",
        },
        {
          label: "3. Micro-Segmentation Enclave Blocks Intrusion",
          desc: "Zero-Trust micro-segmentation blocks the infected laptop instantly while maintaining uninterrupted surgical control for the lead surgeon.",
          status: "BLOCKED_SAVED",
          state: "⚡ INTRUSION REPELLED (Zero surgical latency; Surgery completed safely!)",
        },
      ],
      deliverable: "Zero-Trust OT micro-segmentation ensuring life-saving surgical machinery is completely immune to hospital-wide ransomware.",
      targetTab: "zero_trust_iam" as TabType,
    },
    {
      id: "chemo_overdose",
      dept: "Oncology",
      title: "8. Chemotherapy Cytotoxic Dose Injection",
      icon: <Syringe className="w-5 h-5 text-emerald-400" />,
      departmentName: "Oncology & Chemotherapy",
      problem: "An external payload attempts to alter the infusion pump rate of Cisplatin chemotherapy from 20mg/m² to 200mg/m² (a fatal 10x toxic overdose).",
      steps: [
        {
          label: "1. Oncologist Digital Prescription",
          desc: "Dr. Rostova signs the chemo protocol: 20mg/m² Cisplatin via automated infusion schedule.",
          status: "ORIGINAL_SIGNED",
          state: "Chemo Protocol: 20mg/m² | Digital Signature: ECDSA P-256 Validated",
        },
        {
          label: "2. Malicious Bolus Packet Injected",
          desc: "Corrupted network packet injects high-rate bolus command into smart infusion pump controller.",
          status: "TAMPER_ATTEMPT",
          state: "Rate Limit Exceeded: Commanded rate (200mg/m²) exceeds Failsafe Clinical Hard Limit!",
        },
        {
          label: "3. Dual-Key Cross-Verification Halts Infusion",
          desc: "The smart pump cross-checks the signed EHR treatment plan, rejects the rate increase, and triggers nurse bedside alarm.",
          status: "BLOCKED_SAVED",
          state: "🛑 OVERDOSE BLOCKED (Patient protected from fatal cytotoxic toxicity!)",
        },
      ],
      deliverable: "Dual-key cryptographic validation ensuring high-risk oncology medications cannot be modified remotely.",
      targetTab: "crypto_verifier" as TabType,
    },
  ];

  // 6 Core Deliverables Pillars
  const valuePillars = [
    {
      title: "1. Tamper-Proof Medical Records",
      tagline: "Cryptographic Signatures & Hash Verification",
      icon: <FileCheck2 className="w-6 h-6 text-emerald-400" />,
      badge: "ECDSA P-256 + SHA-256",
      plainEnglish:
        "Mathematically prevents anyone from secretly modifying a patient's prescriptions, doctor notes, or lab results in the database.",
      deliverables: [
        "Cryptographic ECDSA P-256 digital signature per physician",
        "SHA-256 hash validation on every chart access",
        "Instant tamper alert before pharmacy medication dispensing",
      ],
      targetTab: "crypto_verifier" as TabType,
      buttonText: "Try Record Tampering Demo",
    },
    {
      title: "2. Smart Medical Device (IoMT) Shield",
      tagline: "ICU Ventilator, Monitor & Pump Firmware Defense",
      icon: <Sliders className="w-6 h-6 text-cyan-400" />,
      badge: "HSM ROOT-OF-TRUST",
      plainEnglish:
        "Guarantees life-support medical hardware (ventilators, infusion pumps) only runs authentic, cryptographically verified software.",
      deliverables: [
        "Hardware Security Module (HSM) key lifecycle management",
        "Continuous firmware checksum & telemetry monitoring",
        "Automated 802.1X network quarantine to isolate compromised hardware",
      ],
      targetTab: "iomt_hardware" as TabType,
      buttonText: "Test Device Shield Demo",
    },
    {
      title: "3. 24/7 Live SOC Attack Defense",
      tagline: "Real-Time Threat Telemetry & 1-Click Isolation",
      icon: <Activity className="w-6 h-6 text-blue-400" />,
      badge: `${threatCount} ACTIVE ALARMS`,
      plainEnglish:
        "Live clinical radar that spots ransomware, port intrusions, and brute-force attacks across hospital servers and isolates attackers in 1 click.",
      deliverables: [
        "Real-time SIEM event correlation across all clinical departments",
        "1-Click firewall containment & host isolation",
        "Gemini AI root-cause analysis & CVSS scoring",
      ],
      targetTab: "soc_dashboard" as TabType,
      buttonText: "Open Live SOC Monitor",
    },
    {
      title: "4. AI Smart Anti-Phishing Guard",
      tagline: "GenAI Protection for Busy Doctors & Nurses",
      icon: <MailWarning className="w-6 h-6 text-violet-400" />,
      badge: "GEMINI 3.7 FLASH",
      plainEnglish:
        "Protects healthcare workers from falling for deceptive emergency emails, fake payroll updates, and malicious links.",
      deliverables: [
        "Linguistic urgency & emotional coercion analysis",
        "Domain typo-squatting & header spoofing detection",
        "Plain-English 1-sentence advice for clinical staff",
      ],
      targetTab: "phishing_shield" as TabType,
      buttonText: "Test AI Phishing Scanner",
    },
    {
      title: "5. Zero-Trust IAM & Code-Blue Emergency",
      tagline: "Strict Policy + Life-Saving 'Break-Glass' Access",
      icon: <Lock className="w-6 h-6 text-amber-400" />,
      badge: "ABAC / RBAC + BREAK-GLASS",
      plainEnglish:
        "Restricts access strictly by role, while providing an instant, fully audited bypass during cardiac arrest emergencies so doctors can save lives.",
      deliverables: [
        "Dynamic Attribute-Based Access Control (ABAC)",
        "Sub-50ms Break-Glass emergency bypass for resuscitation",
        "Write-once immutable audit logs for compliance review",
      ],
      targetTab: "zero_trust_iam" as TabType,
      buttonText: "Try Break-Glass Emergency",
    },
    {
      title: "6. Automated DPDP 2023 & HIPAA Compliance",
      tagline: "1-Click Patient Data De-Identification",
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      badge: "DPDP 2023 / HIPAA",
      plainEnglish:
        "Automatically sanitizes patient names, IDs, and personal information before clinical research, keeping the hospital compliant with data privacy laws.",
      deliverables: [
        "Automated 18-element HIPAA Safe Harbor redaction",
        "DPDP Act 2023 Section 6 consent validation matrix",
        "AI Data Protection Impact Assessment (DPIA) generation",
      ],
      targetTab: "privacy_governance" as TabType,
      buttonText: "Explore Privacy Studio",
    },
  ];

  // Filter stories based on selected department filter
  const filteredStories = hospitalStories.filter((s) => {
    if (departmentFilter === "ALL") return true;
    if (departmentFilter === "ICU_SURGERY") return s.dept === "ICU" || s.dept === "Surgery";
    if (departmentFilter === "CARDIO_RAD") return s.dept === "Cardiology" || s.dept === "Radiology";
    if (departmentFilter === "PHARM_ONCO") return s.dept === "Pharmacy" || s.dept === "Oncology";
    if (departmentFilter === "EMERGENCY_STAFF") return s.dept === "Emergency" || s.dept === "Staff";
    return true;
  });

  const selectedStory = hospitalStories[activeStory] || hospitalStories[0];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0e1322] via-[#0d0d14] to-[#0a0a0f] border border-blue-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(37,99,235,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>EXECUTIVE & GUEST OVERVIEW</span>
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                PROJECT ID-304
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono uppercase bg-white/5 text-white/60 border border-white/10">
                8 CLINICAL DEPARTMENTS PROTECTED
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
              Hospital CyberGuard & Data Privacy Suite
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              An enterprise cybersecurity and data privacy governance suite designed specifically for hospitals. 
              It protects <strong className="text-white font-semibold">patient lives</strong>, prevents <strong className="text-emerald-400 font-semibold">medical record tampering</strong>, secures <strong className="text-cyan-400 font-semibold">ICU ventilators & infusion pumps</strong>, and guarantees full compliance with India's <strong className="text-blue-400 font-semibold">DPDP Act 2023</strong> and <strong className="text-blue-400 font-semibold">HIPAA</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenEvaluatorGuide}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>🎓 Evaluator Presentation Guide & Script</span>
              </button>

              <button
                onClick={onOpenTour}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>2-Minute Guided Tour</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowExecutiveModal(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Executive 1-Page Summary</span>
              </button>
            </div>
          </div>

          {/* Quick Impact Scorecard */}
          <div className="w-full lg:w-72 bg-[#090a0e]/90 border border-white/10 rounded-xl p-4 shadow-xl shrink-0 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
                HOSPITAL SYSTEM STATUS
              </span>
              <span className="flex items-center space-x-1 text-[11px] font-mono text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SECURED</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                <div className="text-[10px] text-white/40 font-mono">TAMPER DETECT</div>
                <div className="text-lg font-bold font-mono text-emerald-400">100%</div>
                <div className="text-[9px] text-white/40">ECDSA P-256</div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                <div className="text-[10px] text-white/40 font-mono">ISOLATION SPEED</div>
                <div className="text-lg font-bold font-mono text-blue-400">&lt; 1.2s</div>
                <div className="text-[9px] text-white/40">Sub-second WAF</div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                <div className="text-[10px] text-white/40 font-mono">IoMT HARDWARE</div>
                <div className="text-lg font-bold font-mono text-cyan-400">1,420</div>
                <div className="text-[9px] text-white/40">HSM Enclaves</div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                <div className="text-[10px] text-white/40 font-mono">DPDP 2023</div>
                <div className="text-lg font-bold font-mono text-amber-400">GRADE A</div>
                <div className="text-[9px] text-white/40">100% Redacted</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Hospital Department Cyber Safety Explorer */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              <span>Hospital Department Cyber Safety Matrix</span>
            </h2>
            <p className="text-xs text-white/50 font-sans">
              Click any department below to view its active medical IoT devices, live threat containment status, and cryptographic root of trust.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 self-start sm:self-auto">
            8 Departments Monitored Live
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {hospitalDepartments.map((dept) => (
            <div
              key={dept.id}
              onClick={() => setSelectedDeptDetail(dept)}
              className="bg-[#0d0d12] border border-white/10 hover:border-blue-500/40 rounded-xl p-4 shadow-lg cursor-pointer transition-all hover:bg-[#11131c] group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-colors">
                  {dept.icon}
                </div>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {dept.protectionStatus}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-xs font-serif font-bold text-white group-hover:text-blue-300 transition-colors">
                  {dept.name}
                </h3>
                <p className="text-[11px] text-white/50 line-clamp-2 mt-1 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                <span>Devices: <strong className="text-white">{dept.deviceCount}</strong></span>
                <span className="text-blue-400 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Details</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: What You Get From This Project (6 Pillars) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>What Do We Get From This Project?</span>
            </h2>
            <p className="text-xs text-white/50 font-sans">
              The 6 primary security & privacy capabilities delivered by Hospital CyberGuard (ID-304).
            </p>
          </div>
          <span className="text-[11px] font-mono text-blue-400/80 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 self-start sm:self-auto">
            6 Enterprise Deliverables
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {valuePillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-[#0d0d12] border border-white/10 hover:border-blue-500/40 rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all group hover:shadow-[0_0_25px_rgba(37,99,235,0.15)]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-blue-500/30 group-hover:bg-blue-600/10 transition-colors">
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {pillar.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-serif font-bold text-white group-hover:text-blue-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] text-white/40 font-mono mt-0.5">
                    {pillar.tagline}
                  </p>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-2.5">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pillar.plainEnglish}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 font-semibold block">
                    Deliverable Specifications:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-400">
                    {pillar.deliverables.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start space-x-2 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-white/5">
                <button
                  onClick={() => onNavigateTab(pillar.targetTab)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-blue-600/20 text-white hover:text-blue-300 border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer"
                >
                  <span>{pillar.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Interactive Hospital Story Mode (Guest Experience Center) */}
      <div className="bg-[#0b0c10] border border-blue-500/20 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Play className="w-3.5 h-3.5 fill-current" />
              </span>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
                Guest Experience Center: Interactive Hospital Scenarios
              </h2>
            </div>
            <p className="text-xs text-white/50 font-sans mt-0.5">
              Select any department cyber threat below to see how Sentinel Vault catches and mitigates it step-by-step.
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px] font-mono">
            {[
              { id: "ALL", label: "All Scenarios (8)" },
              { id: "ICU_SURGERY", label: "ICU & Surgery" },
              { id: "CARDIO_RAD", label: "Cardiology & Radiology" },
              { id: "PHARM_ONCO", label: "Pharmacy & Oncology" },
              { id: "EMERGENCY_STAFF", label: "Emergency & Staff" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDepartmentFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all cursor-pointer ${
                  departmentFilter === tab.id
                    ? "bg-blue-600/30 text-blue-200 border-blue-400/40 font-bold shadow-sm"
                    : "bg-white/5 text-white/40 hover:text-white border-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Story Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredStories.map((story) => {
            const actualIndex = hospitalStories.findIndex((s) => s.id === story.id);
            const isSelected = activeStory === actualIndex;

            return (
              <button
                key={story.id}
                onClick={() => {
                  setActiveStory(actualIndex);
                  setStoryStep(0);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600/15 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                    : "bg-[#0d0d12] border-white/5 hover:border-white/15 opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-white/5">{story.icon}</div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] font-mono uppercase text-white/40 truncate">
                      {story.departmentName}
                    </div>
                    <div className="text-xs font-semibold text-white truncate">
                      {story.title}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Scenario Interactive Stage */}
        <div className="bg-[#111118] border border-white/10 rounded-xl p-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                  SCENARIO #{activeStory + 1} OF {hospitalStories.length}
                </span>
                <span className="text-[10px] font-mono uppercase text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {selectedStory.departmentName}
                </span>
              </div>
              <h3 className="text-base font-serif font-bold text-white mt-1.5">
                {selectedStory.title}
              </h3>
              <p className="text-xs text-red-300 font-sans mt-0.5">
                <strong className="text-red-400">Threat:</strong> {selectedStory.problem}
              </p>
            </div>

            <button
              onClick={() => onNavigateTab(selectedStory.targetTab)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors self-start md:self-auto cursor-pointer"
            >
              <span>Explore Dedicated Module</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            </button>
          </div>

          {/* Stepper Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedStory.steps.map((step, sIdx) => {
              const isSelected = storyStep === sIdx;
              const isPassed = storyStep > sIdx;

              return (
                <div
                  key={sIdx}
                  onClick={() => setStoryStep(sIdx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? sIdx === 2
                        ? "bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                        : sIdx === 1
                        ? "bg-red-950/30 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                        : "bg-blue-950/30 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                      : isPassed
                      ? "bg-[#0d0d12] border-white/10 opacity-70 hover:opacity-100"
                      : "bg-[#0d0d12] border-white/5 opacity-50 hover:opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/50">
                      Step {sIdx + 1}
                    </span>
                    {sIdx === 2 ? (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        PROTECTED
                      </span>
                    ) : sIdx === 1 ? (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                        ATTACK
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        BASELINE
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-serif font-bold text-white">
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Current Step State Console */}
          <div className="bg-[#090a0d] border border-white/10 rounded-xl p-4 space-y-2 font-mono">
            <div className="flex items-center justify-between text-[11px] text-white/40 border-b border-white/5 pb-1.5">
              <span className="flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>SENTINEL TELEMETRY VERIFICATION LOG</span>
              </span>
              <span className="text-emerald-400">STATE: ACTIVE</span>
            </div>
            <p className="text-xs text-emerald-300 font-semibold leading-relaxed">
              {selectedStory.steps[storyStep].state}
            </p>
          </div>

          {/* Step Controls */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-white/60 font-sans">
              <strong className="text-blue-300">Deliverable Outcome:</strong> {selectedStory.deliverable}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setStoryStep((prev) => Math.max(0, prev - 1))}
                disabled={storyStep === 0}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 transition-colors ${
                  storyStep === 0
                    ? "opacity-30 cursor-not-allowed text-white/40"
                    : "bg-white/5 hover:bg-white/10 text-white cursor-pointer"
                }`}
              >
                Previous Step
              </button>

              <button
                onClick={() =>
                  setStoryStep((prev) => (prev < 2 ? prev + 1 : 0))
                }
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all cursor-pointer"
              >
                {storyStep === 2 ? "Replay Scenario" : "Next Step →"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DEPARTMENT DETAIL MODAL */}
      {selectedDeptDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#111116] border border-blue-500/30 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(37,99,235,0.3)] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-white/10 bg-[#0d0d12] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
                  {selectedDeptDetail.icon}
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-white">
                    {selectedDeptDetail.name}
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400">
                    PROTECTION: {selectedDeptDetail.protectionStatus}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDeptDetail(null)}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-white/40 font-bold block mb-1">
                  Department Scope:
                </span>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {selectedDeptDetail.description}
                </p>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block">
                  Active Cryptographic & Network Safeguard:
                </span>
                <p className="text-slate-200 text-xs">
                  {selectedDeptDetail.safeguard}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-white/40 font-bold block mb-1.5">
                  Connected Medical Hardware Fleet ({selectedDeptDetail.deviceCount} Total Devices):
                </span>
                <ul className="space-y-1.5">
                  {selectedDeptDetail.keyDevices.map((dev: string, dIdx: number) => (
                    <li key={dIdx} className="flex items-center space-x-2 text-slate-300 font-mono text-[11px] bg-white/5 p-2 rounded-lg border border-white/5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{dev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-[#0d0d12] flex items-center justify-between">
              <span className="text-[11px] font-mono text-white/40">
                ID-304 ZERO-TRUST CLINICAL ENCLAVE
              </span>
              <button
                onClick={() => setSelectedDeptDetail(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Executive Summary Brochure Modal */}
      {showExecutiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#111116] border border-blue-500/30 rounded-2xl w-full max-w-3xl shadow-[0_0_50px_rgba(37,99,235,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-white/10 bg-[#0d0d12] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-serif font-bold text-white">
                    Project Executive Briefing Document
                  </h2>
                  <p className="text-[11px] text-white/40 font-mono">
                    HOSPITAL CYBERGUARD & DATA PRIVACY SUITE (ID-304)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExecutiveModal(false)}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
              {/* Executive Summary Section */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                  1. Executive Summary & Problem Scope
                </h3>
                <p>
                  Modern connected hospitals face an unprecedented threat landscape. Attackers target medical IoT devices (ventilators, infusion pumps), steal Electronic Health Records (EHR) via vulnerable FHIR APIs, alter prescription dosages, and deploy ransomware via deceptive phishing emails.
                </p>
                <p>
                  <strong className="text-white">Hospital CyberGuard (ID-304)</strong> solves this through a unified defense ecosystem merging cryptographic data integrity (ECDSA P-256), Hardware Security Module (HSM) enclaves, Gemini 3.7 Flash AI threat intelligence, and automated compliance with India's <strong>DPDP Act 2023</strong> and US <strong>HIPAA</strong>.
                </p>
              </div>

              {/* 6 Core Deliverables Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  2. Core System Deliverables
                </h3>
                <div className="border border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="bg-white/5 font-mono text-white/60">
                      <tr>
                        <th className="p-2.5 border-b border-white/10">Module</th>
                        <th className="p-2.5 border-b border-white/10">Technical Engine</th>
                        <th className="p-2.5 border-b border-white/10">Patient & Business Benefit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-2.5 font-semibold text-white">Record Integrity</td>
                        <td className="p-2.5 font-mono text-blue-400">ECDSA P-256 + SHA-256</td>
                        <td className="p-2.5">100% tamper-evident prescription & lab verification.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-white">IoMT Device Security</td>
                        <td className="p-2.5 font-mono text-cyan-400">HSM Enclave + 802.1X</td>
                        <td className="p-2.5">Zero rogue firmware execution on ICU life support.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-white">Clinical SOC Defense</td>
                        <td className="p-2.5 font-mono text-blue-400">Live SIEM + WAF Rules</td>
                        <td className="p-2.5">Sub-second threat isolation & ransomware interception.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-white">AI Phishing Shield</td>
                        <td className="p-2.5 font-mono text-violet-400">Gemini 3.7 Flash</td>
                        <td className="p-2.5">Stops healthcare credential theft & deceptive emails.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-white">Zero-Trust IAM</td>
                        <td className="p-2.5 font-mono text-amber-400">ABAC + Break-Glass</td>
                        <td className="p-2.5">Sub-50ms life-saving emergency resuscitation access.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-white">Privacy Governance</td>
                        <td className="p-2.5 font-mono text-emerald-400">HIPAA 18-PHI Redactor</td>
                        <td className="p-2.5">Automated compliance with DPDP Act 2023 & HIPAA.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Regulatory Alignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-3.5 space-y-1">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                    DPDP ACT 2023 (INDIA)
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Complies with Section 4 (Lawful processing), Section 6 (Granular consent & notice), Section 8(5) (Personal data protection safeguards), and Section 8(6) (Mandatory data breach notification).
                  </p>
                </div>
                <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-3.5 space-y-1">
                  <div className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                    HIPAA SECURITY & PRIVACY RULES
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Complies with 45 CFR § 164.312(a) Access Controls, § 164.312(b) Audit Controls, § 164.312(c) Data Integrity, and § 164.514(b) 18 Safe Harbor PHI De-Identification.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-[#0d0d12] flex items-center justify-between">
              <span className="text-[11px] font-mono text-white/40">
                ST. JUDE METROPOLITAN HEALTHCARE • PROJECT ID-304
              </span>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
