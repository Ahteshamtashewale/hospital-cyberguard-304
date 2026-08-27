/**
 * Cryptographic & Data Privacy Utility Functions for Hospital CyberGuard (ID-304)
 */

export async function computeSHA256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generateDoctorKeyPair(): Promise<{
  publicKeyHex: string;
  keyFingerprint: string;
}> {
  // Generate a mock or real WebCrypto RSA key for visual verification
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    );
    const exportedPub = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const pubHex = Array.from(new Uint8Array(exportedPub))
      .map((b) => b.toString(16).padStart(2, "0"))
      .slice(0, 32)
      .join("");
    const fingerprint = await computeSHA256(pubHex);
    return {
      publicKeyHex: `RSA-2048:0x${pubHex}...`,
      keyFingerprint: `SHA256:${fingerprint.substring(0, 16).toUpperCase()}`,
    };
  } catch {
    return {
      publicKeyHex: "RSA-2048:0x30820122300d06092a864886f70d0101010500...",
      keyFingerprint: "SHA256:7B8F9A32C4D1E680",
    };
  }
}

// Generate digital signature simulation
export async function signMedicalDocument(
  docString: string,
  doctorLicense: string
): Promise<{ signature: string; timestamp: string; hash: string }> {
  const hash = await computeSHA256(docString);
  const timestamp = new Date().toISOString();
  const signatureRaw = await computeSHA256(`${hash}:${doctorLicense}:${timestamp}:HSM_ROOT_KEY_2026`);
  const signature = `SIG_ECDSA_P256_${signatureRaw.toUpperCase()}`;
  return { signature, timestamp, hash };
}

// Verify signature against document string
export async function verifyMedicalDocument(
  currentDocString: string,
  originalHash: string,
  expectedSignature: string,
  doctorLicense: string,
  timestamp: string
): Promise<{
  isValid: boolean;
  computedHash: string;
  tamperDetails?: string;
}> {
  const computedHash = await computeSHA256(currentDocString);
  const isHashMatch = computedHash.toLowerCase() === originalHash.toLowerCase();

  if (!isHashMatch) {
    return {
      isValid: false,
      computedHash,
      tamperDetails: "Hash mismatch detected! The clinical content has been altered after the physician's cryptographic timestamp.",
    };
  }

  const expectedSigRecheck = await computeSHA256(`${computedHash}:${doctorLicense}:${timestamp}:HSM_ROOT_KEY_2026`);
  const constructedSig = `SIG_ECDSA_P256_${expectedSigRecheck.toUpperCase()}`;

  if (constructedSig !== expectedSignature) {
    return {
      isValid: false,
      computedHash,
      tamperDetails: "Digital Signature validation failed! Doctor certificate or HSM signature is forged.",
    };
  }

  return {
    isValid: true,
    computedHash,
  };
}

/**
 * PHI De-identification Engine (HIPAA Safe Harbor & DPDP Act Data Minimization)
 */
export function deIdentifyClinicalText(
  rawText: string,
  options: {
    maskNames: boolean;
    maskDates: boolean;
    maskIdentifiers: boolean;
    maskPhones: boolean;
    pseudonymize: boolean;
  }
): { sanitized: string; redactedCount: number; replacements: { original: string; replaced: string }[] } {
  let text = rawText;
  let count = 0;
  const replacements: { original: string; replaced: string }[] = [];

  if (options.maskNames) {
    const nameRegex = /(Patient:\s*)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g;
    text = text.replace(nameRegex, (_match, prefix, name) => {
      count++;
      const rep = options.pseudonymize ? "PATIENT_REF_#8842" : "[REDACTED_NAME]";
      replacements.push({ original: name, replaced: rep });
      return `${prefix}${rep}`;
    });
  }

  if (options.maskIdentifiers) {
    // SSN / Aadhaar / National ID / MRN
    const idRegex = /\b(\d{3}-\d{2}-\d{4}|\d{4}\s\d{4}\s\d{4}|MRN-\d{6,8})\b/g;
    text = text.replace(idRegex, (match) => {
      count++;
      const rep = "[REDACTED_NATIONAL_ID]";
      replacements.push({ original: match, replaced: rep });
      return rep;
    });
  }

  if (options.maskPhones) {
    // Phone numbers & emails
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    text = text.replace(phoneRegex, (match) => {
      count++;
      const rep = "[REDACTED_PHONE]";
      replacements.push({ original: match, replaced: rep });
      return rep;
    });

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    text = text.replace(emailRegex, (match) => {
      count++;
      const rep = "[REDACTED_EMAIL]";
      replacements.push({ original: match, replaced: rep });
      return rep;
    });
  }

  if (options.maskDates) {
    // Dates (DOB, visit date)
    const dateRegex = /\b(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, \d{4})\b/g;
    text = text.replace(dateRegex, (match) => {
      count++;
      const rep = options.pseudonymize ? "YEAR_SHIFTED_202X" : "[REDACTED_DATE]";
      replacements.push({ original: match, replaced: rep });
      return rep;
    });
  }

  return {
    sanitized: text,
    redactedCount: count,
    replacements,
  };
}
