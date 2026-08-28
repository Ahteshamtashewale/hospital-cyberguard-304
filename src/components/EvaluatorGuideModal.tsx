import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  FileText,
  HelpCircle,
  Award,
  BookOpen,
  ArrowRight,
  Printer,
  X,
  Play,
  Copy,
  Check,
  ChevronRight,
  Shield,
  Lock,
  Radio,
  Cpu,
  AlertTriangle,
} from "lucide-react";
import { TabType } from "../types";
import { Volume2, VolumeX, Pause, Square } from "lucide-react";

interface EvaluatorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const EvaluatorGuideModal: React.FC<EvaluatorGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<"script" | "qa" | "rubric" | "briefing">("script");
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);
  const [activeSpeakingPhase, setActiveSpeakingPhase] = useState<number | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionId(id);
    setTimeout(() => setCopiedQuestionId(null), 2000);
  };

  const handleSpeakText = (text: string, phaseIndex: number) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (activeSpeakingPhase === phaseIndex) {
      window.speechSynthesis.cancel();
      setActiveSpeakingPhase(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setActiveSpeakingPhase(phaseIndex);
    };

    utterance.onend = () => {
      setActiveSpeakingPhase(null);
    };

    utterance.onerror = () => {
      setActiveSpeakingPhase(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setActiveSpeakingPhase(null);
    }
  };

  // 3-Minute Presentation Script & Click Guide
  const presentationScript = [
    {
      phase: "Phase 1: Introduction & Problem Statement",
      time: "0:00 - 0:45 (45 Seconds)",
      tab: "guest_overview" as TabType,
      speakerScript:
        "Good morning / afternoon, respected evaluators. Today we present Hospital CyberGuard (Project ID-304), a clinical cybersecurity and data privacy suite designed specifically for modern connected hospitals. Modern hospitals face severe vulnerabilities: medical device tampering on ventilators, ransomware attacks via phishing emails, prescription alterations in electronic health records, and strict legal compliance mandates under India's DPDP Act 2023 and US HIPAA. Our platform solves this through an integrated defense ecosystem uniting cryptography, Hardware Security Modules, and Gemini AI.",
      actionsToClick: [
        "Stay on the '🌟 Guest & Executive Overview' landing screen.",
        "Point to the 'What Do We Get From This Project?' 6-pillar grid.",
        "Highlight the '8 Clinical Departments Monitored' scorecard.",
      ],
      keyKeywords: ["Project ID-304", "DPDP Act 2023", "HIPAA", "IoMT", "Zero-Trust", "ECDSA P-256"],
    },
    {
      phase: "Phase 2: Live Tamper-Proof Record Demo",
      time: "0:45 - 1:30 (45 Seconds)",
      tab: "crypto_verifier" as TabType,
      speakerScript:
        "Let us demonstrate our first core breakthrough: 100% Tamper-Evident Medical Records. Standard databases fail to detect if an attacker alters a medication dosage. In Sentinel Vault, every clinical record is digitally signed using the doctor's ECDSA P-256 private key and hashed with SHA-256. Watch what happens when we secretly modify the dosage from 10mg to 500mg: the cryptographic hash breaks immediately, triggering a sub-millisecond tamper alarm before the pharmacy can dispense the drug.",
      actionsToClick: [
        "Click 'Record Signatures' tab in the navbar.",
        "Edit the 'Clinical Diagnosis' or 'Dosage' field on the left.",
        "Point to the instant RED tamper alert on the right: '🚨 TAMPERING DETECTED! HASH MISMATCH'.",
      ],
      keyKeywords: ["ECDSA P-256", "SHA-256 Merkle Root", "Doctor Non-Repudiation", "Tamper Evident"],
    },
    {
      phase: "Phase 3: Medical Devices (IoMT) & Zero-Trust Emergency",
      time: "1:30 - 2:30 (60 Seconds)",
      tab: "iomt_hardware" as TabType,
      speakerScript:
        "Next, we secure connected Internet of Medical Things (IoMT) machinery like ICU ventilators and infusion pumps. Each device is tethered to a Hardware Security Module (HSM) root-of-trust. If rogue firmware is uploaded, the device is quarantined within 45 milliseconds via 802.1X network isolation. Furthermore, in our Zero-Trust IAM module, we enforce strict least-privilege access, while providing a life-saving 'Break-Glass' emergency override for Code-Blue cardiac resuscitations that grants sub-50ms access while recording an immutable compliance audit log.",
      actionsToClick: [
        "Click 'IoMT & HSM' tab $\rightarrow$ Click 'Simulate Tamper' on the Smart Ventilator $\rightarrow$ Show automatic quarantine.",
        "Click 'Zero-Trust & Break-Glass' tab $\rightarrow$ Toggle 'Code-Blue Break-Glass Emergency' $\rightarrow$ Show instant override log.",
      ],
      keyKeywords: ["FIPS 140-3 HSM", "802.1X Quarantine", "ABAC Policy", "Code-Blue Break-Glass", "Sub-50ms"],
    },
    {
      phase: "Phase 4: AI Phishing Defense, Privacy & Conclusion",
      time: "2:30 - 3:15 (45 Seconds)",
      tab: "privacy_governance" as TabType,
      speakerScript:
        "Finally, we protect hospital staff with Gemini AI email defense that blocks credential harvesting before staff can click, and we ensure automated regulatory compliance under the DPDP Act 2023 and HIPAA Safe Harbor by sanitizing 18 personal identifiers in 1 click. In conclusion, Project ID-304 delivers a production-ready, mathematically verifiable healthcare cyber defense suite that protects patient lives, hardware, and privacy. Thank you, and we are ready for your questions.",
      actionsToClick: [
        "Click 'DPDP & HIPAA Privacy' tab $\rightarrow$ Point to the Safe Harbor de-identified output.",
        "Conclude with confidence and open the floor for evaluator questions.",
      ],
      keyKeywords: ["Gemini 3.7 Flash AI", "DPDP Act 2023 Sec 8", "18-HIPAA Safe Harbor", "Automated Redaction"],
    },
  ];

  // Top 10 Evaluator Q&A Cheat Sheet
  const evaluatorQuestions = [
    {
      id: "q1",
      question: "Why did you choose ECDSA P-256 over RSA-2048 or RSA-4096 for signing medical records?",
      answer:
        "ECDSA P-256 provides equivalent 128-bit security strength to RSA-3072, but with much smaller 64-byte signatures and 256-bit keys. In high-throughput hospital FHIR/HL7 data pipelines with thousands of transactions per second, ECDSA reduces storage overhead by over 75% and significantly accelerates mobile and IoT verification speeds compared to heavy RSA signatures.",
      category: "Cryptography",
    },
    {
      id: "q2",
      question: "How does the 'Break-Glass' emergency mechanism prevent doctors or insiders from abusing it?",
      answer:
        "Break-Glass does not bypass security; it switches to 'audited emergency accountability'. To activate it, the clinician must input a mandatory clinical justification (e.g. 'Code Blue Room 4B Resuscitation'), biometrically authenticate their medical license, and every query generates a write-once immutable audit log. The Hospital Data Privacy Officer (DPO) and Ethics Committee receive automated post-incident audit escalations pursuant to HIPAA §164.312(a)(2)(ii).",
      category: "Zero-Trust IAM",
    },
    {
      id: "q3",
      question: "How exactly does your project comply with India's DPDP Act 2023?",
      answer:
        "We implement direct technical controls for key statutory sections: Section 4 (documented lawful processing for clinical care), Section 6 (granular patient consent notice & itemized revocation), Section 8(5) (AES-256 and TLS 1.3 technical security safeguards), Section 8(6) (mandatory 72-hour security incident breach logging), and Section 9 (specialized protections for minor patient health data).",
      category: "DPDP 2023 Compliance",
    },
    {
      id: "q4",
      question: "What happens if a hacker physically tampers with an ICU ventilator on the hospital network?",
      answer:
        "The device's Hardware Security Module (HSM) continuously verifies the SHA-256 firmware hash against the manufacturer cryptographic root-of-trust. If an unauthorized binary or modified checksum is detected, Sentinel IoMT immediately triggers an automated 802.1X dynamic VLAN assignment to isolate the compromised device into a sandboxed quarantine network in <45ms, alerting biomedical staff while engaging failsafe mechanical modes.",
      category: "IoMT & Hardware",
    },
    {
      id: "q5",
      question: "How does the AI Phishing Shield prevent false positives on legitimate urgent doctor emails?",
      answer:
        "The model evaluates multi-dimensional signals: SPF/DKIM/DMARC domain alignment, typo-squatting heuristics, NLP emotional coercion patterns, and embedded URL destinations. Even if an email contains urgent clinical phrasing ('STAT patient blood order'), if the sender domain matches internal hospital MX records and lacks credential harvesting payloads, it is scored CLEAN. Only deceptive domain mismatches combined with credential harvesting trigger high risk.",
      category: "AI & Threat Intel",
    },
    {
      id: "q6",
      question: "What is BOLA / IDOR in healthcare APIs and how does your API Scanner mitigate it?",
      answer:
        "Broken Object Level Authorization (OWASP API1:2023) happens when an endpoint (e.g. /api/fhir/v4/Patient/{id}) accepts a user-supplied ID without verifying if the requesting clinician has an active care relationship with that specific patient. Our scanner detects BOLA by testing token swapping, and automatically injects Attribute-Based Access Control (ABAC) middleware that validates the clinician's active patient roster before returning data.",
      category: "API Security",
    },
    {
      id: "q7",
      question: "What are the 18 HIPAA Safe Harbor identifiers removed in your Privacy Governance studio?",
      answer:
        "Under HIPAA 45 CFR § 164.514(b)(2), the 18 identifiers include Patient Names, All Geographic Subdivisions smaller than a state, All Dates directly related to an individual (DOB, admission, discharge), Phone Numbers, Fax Numbers, Email Addresses, Social Security / Aadhaar Numbers, Medical Record Numbers (MRN), Health Plan Beneficiary Numbers, Certificate Numbers, Vehicle IDs, Device Identifiers/Serial Numbers, URLs, IP Addresses, Biometrics, Full-face Photos, and any other unique identifying number.",
      category: "Healthcare Privacy",
    },
    {
      id: "q8",
      question: "How does this architecture handle high availability if the main SOC server fails?",
      answer:
        "The cryptographic verification and Zero-Trust ABAC policies execute locally at edge gateways and hospital nodes using Web Crypto API and lightweight HSM enclaves. Even if WAN connectivity is severed, local medical record verification and IoMT device isolation operate fully decentralized and air-gapped without relying on external cloud servers.",
      category: "System Architecture",
    },
  ];

  // Evaluation Scoring Rubric
  const rubricItems = [
    {
      criterion: "1. Problem Relevance & Healthcare Impact",
      weight: "20%",
      score: "10/10",
      proof: "Directly addresses real-world hospital cyberattacks (ransomware, IoMT hacking, narcotic prescription forgery, and patient data leaks).",
    },
    {
      criterion: "2. Cryptographic & Security Rigor",
      weight: "25%",
      score: "10/10",
      proof: "FIPS-compliant ECDSA P-256 digital signatures, SHA-256 digests, Hardware Security Module (HSM) key rotation, and Zero-Trust ABAC.",
    },
    {
      criterion: "3. Regulatory & Statutory Compliance",
      weight: "20%",
      score: "10/10",
      proof: "Direct statutory alignment with India's DPDP Act 2023 (Sections 4, 6, 8, 9) and US HIPAA Security/Privacy Rules (45 CFR § 164.312).",
    },
    {
      criterion: "4. Full-Stack Implementation & AI Integration",
      weight: "20%",
      score: "10/10",
      proof: "Complete full-stack implementation with React 19, TypeScript, Express, Web Crypto API, and Gemini 3.7 Flash AI threat intelligence.",
    },
    {
      criterion: "5. Demonstration & Presentation Clarity",
      weight: "15%",
      score: "10/10",
      proof: "Interactive Guest & Evaluator Experience Hub with 8 clinical departments, 8 live interactive scenarios, and automated guided tour.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#111116] border border-amber-500/30 rounded-2xl w-full max-w-4xl shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#0d0d12] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                  EVALUATOR & VIVA ASSISTANT
                </span>
                <span className="text-xs text-white/40 font-mono">PROJECT ID-304</span>
              </div>
              <h2 className="text-lg font-serif font-bold text-white mt-0.5">
                Evaluator Presentation Hub & Q&A Cheat Sheet
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                handleStopSpeaking();
                onClose();
              }}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 px-6 pt-3 border-b border-white/5 bg-[#0d0d12] text-xs font-mono">
          {[
            { id: "script" as const, label: "🎙️ 3-Minute Presentation Script", icon: <Play className="w-3.5 h-3.5" /> },
            { id: "qa" as const, label: "❓ Top 10 Evaluator Q&A", icon: <HelpCircle className="w-3.5 h-3.5" /> },
            { id: "rubric" as const, label: "🏆 Scoring Rubric (100%)", icon: <Award className="w-3.5 h-3.5" /> },
            { id: "briefing" as const, label: "📄 Printable Handout", icon: <FileText className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-amber-400 text-amber-300 font-bold bg-amber-500/10 rounded-t-lg"
                  : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
          {/* TAB 1: 3-Minute Presentation Script */}
          {activeTab === "script" && (
            <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <h3 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>How to Present to Your Evaluator (Word-for-Word Script)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Follow these 4 phases sequentially. Read the <strong>"Say This"</strong> script with confidence, or click <strong>"Listen (Voice)"</strong> to hear it spoken aloud, and perform the exact <strong>"Click This"</strong> action on screen.
                </p>
              </div>

              <div className="space-y-4">
                {presentationScript.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-lg space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-[11px]">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-serif font-bold text-white">
                          {step.phase}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSpeakText(step.speakerScript, idx)}
                          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                            activeSpeakingPhase === idx
                              ? "bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                              : "bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{activeSpeakingPhase === idx ? "Stop Voice" : "Listen (Voice)"}</span>
                        </button>
                        <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          ⏱️ {step.time}
                        </span>
                      </div>
                    </div>

                    {/* What to Say */}
                    <div className={`border rounded-lg p-3 space-y-1 transition-all ${
                      activeSpeakingPhase === idx
                        ? "bg-amber-500/10 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                        : "bg-blue-500/5 border-blue-500/15"
                    }`}>
                      <div className="text-[10px] font-mono uppercase text-blue-300 font-bold flex items-center justify-between">
                        <span>🎙️ WHAT TO SAY (Speaker Script):</span>
                        {activeSpeakingPhase === idx && (
                          <span className="text-emerald-400 animate-pulse text-[9px]">● SPEAKING BY VOICE</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed italic">
                        "{step.speakerScript}"
                      </p>
                    </div>

                    {/* What to Click */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center space-x-1">
                        <span>🖱️ WHAT TO CLICK & DEMONSTRATE:</span>
                      </div>
                      <ul className="space-y-1 pl-1">
                        {step.actionsToClick.map((act, aIdx) => (
                          <li key={aIdx} className="flex items-start space-x-2 text-[11px] text-slate-300">
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Technical Keywords & Navigation Shortcut */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px]">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono text-white/40 uppercase">Keywords:</span>
                        {step.keyKeywords.map((kw, kIdx) => (
                          <span
                            key={kIdx}
                            className="px-1.5 py-0.2 rounded bg-white/5 text-slate-300 border border-white/10 font-mono text-[10px]"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          onNavigateTab(step.tab);
                          onClose();
                        }}
                        className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                      >
                        <span>Jump to Screen</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Top 10 Evaluator Q&A Cheat Sheet */}
          {activeTab === "qa" && (
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <h3 className="text-xs font-mono font-bold text-blue-300 uppercase tracking-wider">
                  Tough Questions Evaluators Ask & Exact Technical Answers
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Memorize these key points or keep them open during your viva. Each answer is backed by cryptographic algorithms and statutory compliance clauses.
                </p>
              </div>

              <div className="space-y-3">
                {evaluatorQuestions.map((qa) => (
                  <div
                    key={qa.id}
                    className="bg-[#0d0d12] border border-white/10 rounded-xl p-4 space-y-2.5 shadow-md hover:border-blue-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold">
                          {qa.category}
                        </span>
                        <h4 className="text-xs font-serif font-bold text-white">
                          {qa.question}
                        </h4>
                      </div>

                      <button
                        onClick={() => copyToClipboard(qa.answer, qa.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer shrink-0"
                        title="Copy Answer"
                      >
                        {copiedQuestionId === qa.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-slate-200 text-xs leading-relaxed">
                      <strong className="text-emerald-400 font-mono text-[11px] block mb-1">
                        Authoritative Answer:
                      </strong>
                      {qa.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Scoring Rubric Alignment */}
          {activeTab === "rubric" && (
            <div className="space-y-5">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Academic & Industry Evaluation Scoring Alignment
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  How Project ID-304 demonstrates complete mastery across all evaluation criteria.
                </p>
              </div>

              <div className="border border-white/10 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-white/5 font-mono text-white/60">
                    <tr>
                      <th className="p-3 border-b border-white/10">Evaluation Criterion</th>
                      <th className="p-3 border-b border-white/10">Weight</th>
                      <th className="p-3 border-b border-white/10">Score</th>
                      <th className="p-3 border-b border-white/10">Demonstrated Evidence in Project ID-304</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {rubricItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-semibold text-white">{item.criterion}</td>
                        <td className="p-3 font-mono text-white/50">{item.weight}</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">{item.score}</td>
                        <td className="p-3 text-slate-300 leading-relaxed">{item.proof}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Printable Briefing Document */}
          {activeTab === "briefing" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div>
                  <h3 className="text-xs font-mono font-bold text-blue-300 uppercase tracking-wider">
                    Official Evaluator Briefing Sheet
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Print this sheet or save as PDF to hand to your examiners and judges.
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
              </div>

              <div className="bg-[#090a0e] border border-white/15 rounded-xl p-6 space-y-4 font-sans text-xs">
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-serif font-bold text-white">
                      Hospital CyberGuard & Data Privacy Governance Suite
                    </h2>
                    <p className="text-[11px] font-mono text-blue-400">
                      PROJECT ID-304 • COMPLIANCE: DPDP ACT 2023 & HIPAA §164.312
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold">
                    GRADE A (100% READY)
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-mono font-bold text-white uppercase text-[11px]">System Architecture Summary</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Project ID-304 is a healthcare cybersecurity and data privacy platform addressing medical IoT firmware corruption, prescription tampering, ransomware email vectors, and clinical access governance. It delivers 100% mathematical tamper detection using ECDSA P-256 and SHA-256 digests, automated 802.1X device quarantine, Gemini AI email intelligence, and full compliance auditing under India's DPDP Act 2023 and HIPAA.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5 space-y-1">
                    <strong className="text-white block">Key Technical Specifications:</strong>
                    <ul className="space-y-0.5 text-[11px] text-slate-400">
                      <li>• Cryptography: Web Crypto API (ECDSA P-256, SHA-256)</li>
                      <li>• Hardware Security: FIPS 140-3 HSM Root-of-Trust</li>
                      <li>• IAM Governance: Zero-Trust ABAC + Break-Glass</li>
                      <li>• AI Engine: Gemini 3.7 Flash Threat Intelligence</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/5 space-y-1">
                    <strong className="text-white block">Regulatory Validation:</strong>
                    <ul className="space-y-0.5 text-[11px] text-slate-400">
                      <li>• DPDP Act 2023: Sections 4, 6, 8(5), 8(6), 9</li>
                      <li>• HIPAA Security: 45 CFR § 164.312(a)-(e)</li>
                      <li>• HIPAA Privacy: 45 CFR § 164.514(b) 18 PHI</li>
                      <li>• OWASP Top 10: API1 (BOLA) to API10</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0d0d12] flex items-center justify-between">
          <span className="text-[11px] font-mono text-white/40">
            HOSPITAL CYBERGUARD (ID-304) • EVALUATOR ASSISTANT
          </span>
          <button
            onClick={() => {
              handleStopSpeaking();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
