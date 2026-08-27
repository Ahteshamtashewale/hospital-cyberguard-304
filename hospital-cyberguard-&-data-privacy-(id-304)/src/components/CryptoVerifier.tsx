import React, { useState, useEffect } from "react";
import {
  FileCheck2,
  Lock,
  Key,
  ShieldCheck,
  AlertOctagon,
  RefreshCw,
  Download,
  FileSignature,
  Edit3,
  CheckCircle,
  FileText,
  ShieldAlert,
} from "lucide-react";
import { sampleMedicalDocument } from "../data/mockData";
import { MedicalRecordDoc } from "../types";
import {
  computeSHA256,
  generateDoctorKeyPair,
  signMedicalDocument,
  verifyMedicalDocument,
} from "../utils/crypto";

export const CryptoVerifier: React.FC = () => {
  const [doc, setDoc] = useState<MedicalRecordDoc>(sampleMedicalDocument);
  const [isTampered, setIsTampered] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const [originalHash, setOriginalHash] = useState("");
  const [signature, setSignature] = useState("");
  const [signatureTimestamp, setSignatureTimestamp] = useState("");
  const [doctorKeys, setDoctorKeys] = useState<{ publicKeyHex: string; keyFingerprint: string } | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    computedHash: string;
    tamperDetails?: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize digital signature on mount
  useEffect(() => {
    async function initCrypto() {
      const keys = await generateDoctorKeyPair();
      setDoctorKeys(keys);

      const serialized = JSON.stringify(sampleMedicalDocument);
      const { signature: sig, timestamp, hash } = await signMedicalDocument(
        serialized,
        sampleMedicalDocument.doctorLicense
      );
      setOriginalHash(hash);
      setCurrentHash(hash);
      setSignature(sig);
      setSignatureTimestamp(timestamp);

      const verification = await verifyMedicalDocument(
        serialized,
        hash,
        sig,
        sampleMedicalDocument.doctorLicense,
        timestamp
      );
      setVerificationResult(verification);
    }
    initCrypto();
  }, []);

  // Update hash when document changes
  const handleDocFieldChange = async (field: keyof MedicalRecordDoc, value: any) => {
    const updated = { ...doc, [field]: value };
    setDoc(updated);
    setIsTampered(true);

    const serialized = JSON.stringify(updated);
    const newHash = await computeSHA256(serialized);
    setCurrentHash(newHash);

    const verification = await verifyMedicalDocument(
      serialized,
      originalHash,
      signature,
      doc.doctorLicense,
      signatureTimestamp
    );
    setVerificationResult(verification);
  };

  const handlePrescriptionDoseChange = async (index: number, newDosage: string) => {
    const updatedPrescriptions = [...doc.prescriptions];
    updatedPrescriptions[index] = { ...updatedPrescriptions[index], dosage: newDosage };
    const updated = { ...doc, prescriptions: updatedPrescriptions };
    setDoc(updated);
    setIsTampered(true);

    const serialized = JSON.stringify(updated);
    const newHash = await computeSHA256(serialized);
    setCurrentHash(newHash);

    const verification = await verifyMedicalDocument(
      serialized,
      originalHash,
      signature,
      doc.doctorLicense,
      signatureTimestamp
    );
    setVerificationResult(verification);
  };

  // Re-sign document with authorized doctor private key
  const handleReSignDocument = async () => {
    setIsProcessing(true);
    const serialized = JSON.stringify(doc);
    const { signature: newSig, timestamp: newTime, hash: newHash } = await signMedicalDocument(
      serialized,
      doc.doctorLicense
    );

    setOriginalHash(newHash);
    setCurrentHash(newHash);
    setSignature(newSig);
    setSignatureTimestamp(newTime);
    setIsTampered(false);

    const verification = await verifyMedicalDocument(
      serialized,
      newHash,
      newSig,
      doc.doctorLicense,
      newTime
    );
    setVerificationResult(verification);
    setIsProcessing(false);
  };

  const handleResetDocument = async () => {
    setDoc(sampleMedicalDocument);
    setIsTampered(false);
    const serialized = JSON.stringify(sampleMedicalDocument);
    const hash = await computeSHA256(serialized);
    setCurrentHash(hash);
    setOriginalHash(hash);
    const verification = await verifyMedicalDocument(
      serialized,
      hash,
      signature,
      sampleMedicalDocument.doctorLicense,
      signatureTimestamp
    );
    setVerificationResult(verification);
  };

  const exportProofBundle = () => {
    const bundle = {
      hospital: "St. Jude Metropolitan Healthcare System",
      systemId: "ID-304 Cryptographic EHR Verification",
      documentId: doc.id,
      patientMRN: doc.recordNumber,
      attendingPhysician: doc.doctorName,
      doctorLicense: doc.doctorLicense,
      keyFingerprint: doctorKeys?.keyFingerprint,
      sha256Hash: currentHash,
      digitalSignature: signature,
      timestamp: signatureTimestamp,
      verificationStatus: verificationResult?.isValid ? "GENUINE_SEALED" : "TAMPERED_INVALID",
      clinicalPayload: doc,
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CRYPTOGRAPHIC_PROOF_${doc.recordNumber}.json`;
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
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CHALLENGE AREA 2
              </span>
              <h2 className="text-lg font-serif font-bold text-white">
                Cryptographic Medical Document & E-Prescription Verification System
              </h2>
            </div>
            <p className="text-xs text-white/50 mt-1 max-w-3xl leading-relaxed">
              End-to-end cryptographic provenance engine using SHA-256 digests and ECDSA/RSA digital signatures. Proves clinical document integrity, doctor non-repudiation, and provides instant tamper detection for narcotic prescriptions and lab reports.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="btn-re-sign-doc"
              onClick={handleReSignDocument}
              disabled={isProcessing}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
            >
              {isProcessing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileSignature className="w-3.5 h-3.5" />
              )}
              <span>Re-Sign (Physician HSM)</span>
            </button>

            <button
              id="btn-export-proof-bundle"
              onClick={exportProofBundle}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Proof JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verification Status Banner */}
      <div
        className={`p-4 rounded-xl border transition-all ${
          verificationResult?.isValid
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
            : "bg-red-500/10 border-red-500/40 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-pulse"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {verificationResult?.isValid ? (
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="w-6 h-6" />
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-serif font-bold tracking-tight">
                {verificationResult?.isValid
                  ? "CRYPTOGRAPHIC INTEGRITY VERIFIED: DOCUMENT IS AUTHENTIC & SEALED"
                  : "TAMPER DETECTED! CRYPTOGRAPHIC HASH MISMATCH DETECTED"}
              </h3>
              <p className="text-xs opacity-80 mt-0.5 font-mono">
                {verificationResult?.isValid
                  ? `Signed by ${doc.doctorName} (${doc.doctorLicense}) at ${signatureTimestamp}`
                  : verificationResult?.tamperDetails || "Clinical contents altered post-signature."}
              </p>
            </div>
          </div>

          {isTampered && (
            <button
              onClick={handleResetDocument}
              className="px-3 py-1.5 text-xs font-mono font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors cursor-pointer"
            >
              Revert to Original
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Document Editor & Tamper Simulator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-serif font-bold text-white">
                  Electronic Health Record & Prescription Sheet
                </h3>
              </div>
              <span className="text-xs font-mono text-white/40">{doc.recordNumber}</span>
            </div>

            {/* Quick Tamper Trigger Shortcuts */}
            <div className="p-3.5 bg-[#111116] rounded-xl border border-white/5 space-y-2">
              <span className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Edit3 className="w-3.5 h-3.5" />
                TAMPER SIMULATION TEST TRIGGERS:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handlePrescriptionDoseChange(0, "400mg (10x LETHAL OVERDOSE)")}
                  className="px-2.5 py-1 text-[11px] font-mono bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors cursor-pointer"
                >
                  Tamper: Atorvastatin 40mg → 400mg
                </button>
                <button
                  onClick={() => handleDocFieldChange("patientName", "Vikram Malhotra (ID Theft)")}
                  className="px-2.5 py-1 text-[11px] font-mono bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors cursor-pointer"
                >
                  Tamper: Change Patient Identity
                </button>
                <button
                  onClick={() => handleDocFieldChange("diagnosis", "Mild headache (Falsified Insurance Claim)")}
                  className="px-2.5 py-1 text-[11px] font-mono bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors cursor-pointer"
                >
                  Tamper: Alter Clinical Diagnosis
                </button>
              </div>
            </div>

            {/* Document Form Fields */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider block mb-1">Patient Name</label>
                <input
                  type="text"
                  value={doc.patientName}
                  onChange={(e) => handleDocFieldChange("patientName", e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-3 py-2 text-white font-medium focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider block mb-1">Date of Birth</label>
                <input
                  type="text"
                  value={doc.dob}
                  onChange={(e) => handleDocFieldChange("dob", e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-3 py-2 text-white font-medium focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="col-span-2">
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider block mb-1">Attending Physician & License</label>
                <input
                  type="text"
                  value={`${doc.doctorName} (${doc.doctorLicense})`}
                  disabled
                  className="w-full bg-[#111116] border border-white/5 rounded-lg px-3 py-2 text-white/70 font-mono"
                />
              </div>
              <div className="col-span-2">
                <label className="text-white/50 font-mono text-[10px] uppercase tracking-wider block mb-1">Diagnosis</label>
                <input
                  type="text"
                  value={doc.diagnosis}
                  onChange={(e) => handleDocFieldChange("diagnosis", e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-3 py-2 text-white font-medium focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Prescriptions List */}
            <div>
              <label className="text-[11px] font-mono font-semibold text-white/60 uppercase tracking-wider block mb-1.5">
                Prescribed Medications & Dosages
              </label>
              <div className="space-y-2">
                {doc.prescriptions.map((rx, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#0a0a0c] rounded-xl border border-white/5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-white">{rx.drug}</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={rx.dosage}
                        onChange={(e) => handlePrescriptionDoseChange(idx, e.target.value)}
                        className="w-48 bg-[#111116] border border-white/10 rounded-lg px-2.5 py-1 text-blue-300 font-mono text-right focus:border-blue-500 focus:outline-none transition-colors"
                      />
                      <span className="text-white/40 text-[11px] font-mono">{rx.frequency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Notes */}
            <div>
              <label className="text-[11px] font-mono font-semibold text-white/60 uppercase tracking-wider block mb-1">
                Physician Clinical Notes
              </label>
              <textarea
                rows={3}
                value={doc.clinicalNotes}
                onChange={(e) => handleDocFieldChange("clinicalNotes", e.target.value)}
                className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg p-3 text-xs text-white/80 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Cryptographic Proof & PKI Certificate Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-serif font-bold text-white">Cryptographic Provenance Engine</h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                SHA-256 + ECDSA
              </span>
            </div>

            {/* Hashes Comparison */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-white/40 block mb-1 font-mono text-[10px] uppercase tracking-wider">
                  ORIGINAL SEALED DOCUMENT SHA-256:
                </span>
                <pre className="p-3 bg-[#0a0a0c] rounded-xl text-[11px] font-mono text-emerald-400 border border-white/5 break-all">
                  {originalHash}
                </pre>
              </div>

              <div>
                <span className="text-white/40 block mb-1 font-mono text-[10px] uppercase tracking-wider">
                  CURRENT LIVE COMPUTED SHA-256:
                </span>
                <pre
                  className={`p-3 bg-[#0a0a0c] rounded-xl text-[11px] font-mono border break-all ${
                    currentHash === originalHash
                      ? "text-emerald-400 border-emerald-500/30"
                      : "text-red-400 border-red-500/40 bg-red-500/10 font-bold"
                  }`}
                >
                  {currentHash}
                </pre>
              </div>

              <div>
                <span className="text-white/40 block mb-1 font-mono text-[10px] uppercase tracking-wider">
                  DOCTOR HSM DIGITAL SIGNATURE:
                </span>
                <pre className="p-3 bg-[#0a0a0c] rounded-xl text-[11px] font-mono text-blue-300 border border-white/5 break-all">
                  {signature}
                </pre>
              </div>
            </div>

            {/* Doctor Public Key & Trust Chain */}
            <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
              <span className="text-white/70 font-mono font-semibold block flex items-center gap-1.5 uppercase text-[11px]">
                <Key className="w-3.5 h-3.5 text-blue-400" />
                PHYSICIAN PKI CERTIFICATE & HSM ROOT
              </span>
              <div className="p-3.5 bg-[#0a0a0c] rounded-xl border border-white/5 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-white/40">Doctor License:</span>
                  <span className="text-white">{doc.doctorLicense}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Key Fingerprint:</span>
                  <span className="text-blue-300">{doctorKeys?.keyFingerprint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Root Authority:</span>
                  <span className="text-white/80">St. Jude Medical Trust HSM CA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
