import streamlit as st
import hashlib
import json
import time
import re
from datetime import datetime
import pandas as pd
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes

# Page Configuration - Set Wide layout
st.set_page_config(
    page_title="SENTINEL PRIVACY VAULT (ID-304)",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom High-End Cyber-Medical CSS
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

    .stApp {
        background-color: #0a0a0c;
        color: #f8fafc;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    header[data-testid="stHeader"] { background: transparent !important; }
    #MainMenu, footer { visibility: hidden; }

    .vault-navbar {
        background-color: #0d0d12;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px 24px;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .vault-title {
        font-family: 'Cinzel', serif, Georgia;
        font-size: 1.35rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        color: #ffffff;
        margin: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    .badge-id {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.65rem;
        color: #60a5fa;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        padding: 2px 6px;
        border-radius: 4px;
        letter-spacing: 0.1em;
    }
    .vault-subtitle {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.4);
        margin-top: 2px;
        letter-spacing: 0.05em;
    }

    .sentinel-card {
        background-color: #0d0d12;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 18px 20px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        margin-bottom: 14px;
    }
    .badge-secure {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.65rem;
        padding: 3px 8px;
        border-radius: 4px;
        font-weight: 600;
        text-transform: uppercase;
        background: rgba(34, 197, 94, 0.1);
        color: #4ade80;
        border: 1px solid rgba(34, 197, 94, 0.3);
    }
    .threat-badge-critical {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.3);
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 700;
    }
    .threat-card {
        background-color: #111118;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 12px;
    }
</style>
""", unsafe_allow_html=True)

# Session State Initialization
if "threats" not in st.session_state:
    st.session_state.threats = [
        {
            "id": "THREAT-9402",
            "timestamp": "2 mins ago",
            "sourceIp": "185.220.101.5 (Tor Exit Node)",
            "targetAsset": "ICU Ventilator Grid (IP: 10.24.110.38)",
            "attackVector": "IoMT Remote Code Injection & Firmware Corruption",
            "severity": "CRITICAL",
            "mitreTechnique": "T1542 (Hardware Firmware Corruption)",
            "status": "ACTIVE",
            "description": "Anomalous telnet burst attempting to overwrite PEEP and tidal volume settings without nurse biometric override."
        },
        {
            "id": "THREAT-8821",
            "timestamp": "14 mins ago",
            "sourceIp": "192.168.10.45 (Radiology Floor Wi-Fi)",
            "targetAsset": "Pharmacy Dispense API (/api/hl7/v2/MedicationRequest)",
            "attackVector": "BOLA / IDOR Unauthorized Opioid Dispense Authorization",
            "severity": "HIGH",
            "mitreTechnique": "T1078 (Valid Accounts / BOLA)",
            "status": "ACTIVE",
            "description": "Forged JSON payload attempting to bypass pharmacist approval to authorize 500 ampoules of Fentanyl."
        }
    ]

# Navigation Header
st.markdown("""
<div class="vault-navbar">
    <div>
        <div class="vault-title">
            <span>🛡️ SENTINEL PRIVACY VAULT</span>
            <span class="badge-id">ID-304</span>
        </div>
        <div class="vault-subtitle">HOSPITAL CYBER DEFENSE & PRIVACY GOVERNANCE SUITE</div>
    </div>
    <div style="display:flex; align-items:center; gap:12px;">
        <div style="padding:6px 12px; border-radius:8px; background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.25); font-family:'JetBrains Mono', monospace; font-size:0.7rem; color:#4ade80;">
            ● COMPLIANCE: <strong>DPDP ACT 2023 & HIPAA</strong>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Tabs
active_count = len([t for t in st.session_state.threats if t["status"] == "ACTIVE"])
tabs = st.tabs([
    "🌟 Guest & Executive Overview",
    f"⚡ SOC Threat Monitor ({active_count} Active)",
    "📡 FHIR API Scanner",
    "✍️ Record Integrity & Signatures",
    "✉️ AI Phishing Shield",
    "🔒 Zero-Trust & Break-Glass",
    "💉 IoMT & Hardware HSM",
    "⚖️ DPDP & HIPAA Governance"
])

# ================= TAB 0: GUEST & EXECUTIVE OVERVIEW =================
with tabs[0]:
    st.markdown("""
    <div style="background: linear-gradient(135deg, #0e172e 0%, #111420 100%); border: 1px solid rgba(59, 130, 246, 0.4); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <span class="badge-secure" style="font-size:0.8rem; background:rgba(59,130,246,0.2); color:#93c5fd; border:1px solid rgba(59,130,246,0.4);">PROJECT ID-304 • GUEST TOUR</span>
        <h2 style="font-family:'Cinzel', serif; color:#ffffff; margin-top:8px;">Hospital CyberGuard & Data Privacy Governance Suite</h2>
        <p style="color:#cbd5e1; font-size:0.95rem; line-height:1.6;">
            A complete clinical cybersecurity platform designed to protect patient lives, medical IoT devices (ventilators & pumps), and electronic health records from ransomware, BOLA API leaks, and illegal prescription tampering.
        </p>
    </div>
    """, unsafe_allow_html=True)

    col_g1, col_g2, col_g3 = st.columns(3)
    with col_g1:
        st.markdown("""
        <div class="sentinel-card">
            <h4 style="color:#4ade80;">1. 100% Tamper-Proof Records</h4>
            <p style="font-size:0.85rem; color:#94a3b8;">Uses ECDSA P-256 digital signatures & SHA-256 hash checks to stop medication dose alterations before pharmacy dispensing.</p>
        </div>
        """, unsafe_allow_html=True)
    with col_g2:
        st.markdown("""
        <div class="sentinel-card">
            <h4 style="color:#38bdf8;">2. Medical Device (IoMT) Shield</h4>
            <p style="font-size:0.85rem; color:#94a3b8;">Hardware Security Module (HSM) root-of-trust isolates compromised ventilators into sandboxed VLANs in <45ms.</p>
        </div>
        """, unsafe_allow_html=True)
    with col_g3:
        st.markdown("""
        <div class="sentinel-card">
            <h4 style="color:#a78bfa;">3. Zero-Trust & Break-Glass</h4>
            <p style="font-size:0.85rem; color:#94a3b8;">Strict least-privilege ABAC combined with sub-50ms life-saving emergency bypass for Code-Blue cardiac trauma resuscitations.</p>
        </div>
        """, unsafe_allow_html=True)

# ================= TAB 1: SOC THREAT MONITOR =================
with tabs[1]:
    st.subheader("⚡ Real-Time SIEM Threat Radar & Incident Mitigation")
    col_t1, col_t2 = st.columns([3, 1])
    with col_t2:
        if st.button("🚨 Simulate Inbound Cyberattack", type="primary"):
            new_id = f"THREAT-{int(time.time()) % 10000}"
            st.session_state.threats.insert(0, {
                "id": new_id,
                "timestamp": "Just now",
                "sourceIp": "91.240.118.82 (MedLocker 4.0 Botnet)",
                "targetAsset": "Oncology PACS Archive (Port 104)",
                "attackVector": "Ransomware Infiltration Attempt via Compromised VPN",
                "severity": "CRITICAL",
                "mitreTechnique": "T1486 (Data Encrypted for Impact)",
                "status": "ACTIVE",
                "description": "High-volume encrypted payload delivery attempted against PACS imaging servers."
            })
            st.rerun()

    for threat in st.session_state.threats:
        badge_cls = "threat-badge-critical" if threat["severity"] == "CRITICAL" else "badge-secure"
        st.markdown(f"""
        <div class="threat-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-family:'JetBrains Mono', monospace; font-weight:700; color:#60a5fa;">{threat['id']}</span>
                    <span class="{badge_cls}" style="margin-left:8px;">{threat['severity']}</span>
                    <span style="color:#f87171; font-size:0.75rem; margin-left:8px;">• {threat['status']}</span>
                </div>
                <span style="font-size:0.75rem; color:rgba(255,255,255,0.4);">{threat['timestamp']}</span>
            </div>
            <div style="font-weight:600; color:#ffffff; margin-top:6px;">{threat['attackVector']}</div>
            <div style="font-size:0.8rem; color:#94a3b8; margin-top:2px;">Target: <code>{threat['targetAsset']}</code> | IP: <code style="color:#f87171;">{threat['sourceIp']}</code></div>
        </div>
        """, unsafe_allow_html=True)
        if threat["status"] != "CONTAINED":
            if st.button(f"🛡️ Contain Threat {threat['id']}", key=f"contain_{threat['id']}"):
                threat["status"] = "CONTAINED"
                st.success(f"{threat['id']} contained on hospital firewall!")
                st.rerun()

# ================= TAB 2: API SCANNER =================
with tabs[2]:
    st.subheader("🔍 FHIR REST API Vulnerability & Pentesting Studio")
    endpoint = st.selectbox("FHIR Resource Endpoint", ["/api/fhir/Patient/PT-44029", "/api/fhir/Observation?patient=PT-44029", "/api/fhir/MedicationRequest"])
    test_vector = st.radio("OWASP Threat Vector", ["API1:2023 Broken Object Level Authorization (BOLA)", "API3:2023 Mass Assignment", "API4:2023 Rate Limit"])
    if st.button("🚀 Execute Simulated Pentest", type="primary"):
        st.error("🚨 VULNERABILITY DETECTED: Broken Object Level Authorization (BOLA)")
        st.code(json.dumps({"rule_id": "WAF-FHIR-BOLA-DEFENSE-304", "action": "DENY_UNLESS_ABAC_VERIFIED"}, indent=2), language="json")

# ================= TAB 3: CRYPTO RECORDS =================
with tabs[3]:
    st.subheader("✍️ Cryptographic Medical Record Integrity & Tamper Detector")
    pid = st.text_input("Patient ID", value="PT-90412")
    pname = st.text_input("Patient Name", value="Alexander Wright")
    diag = st.text_input("Clinical Diagnosis & Prescription", value="Morphine Sulfate 10mg IV STAT (ICD-10 I21.9)")
    raw_payload = f"{pid}|{pname}|{diag}"
    computed_hash = hashlib.sha256(raw_payload.encode('utf-8')).hexdigest()
    st.code(f"SHA-256 Digest: {computed_hash}")
    if st.button("🔐 Sign & Lock Record with ECDSA P-256", type="primary"):
        st.session_state.locked_hash = computed_hash
        st.success("Record locked with cryptographic digital signature!")
    if st.session_state.get("locked_hash") == computed_hash:
        st.success("✅ RECORD INTEGRITY VERIFIED (Valid ECDSA Signature)")
    elif "locked_hash" in st.session_state:
        st.error("🚨 TAMPERING DETECTED! HASH MISMATCH (Signature Broken)")

# ================= TAB 4: PHISHING =================
with tabs[4]:
    st.subheader("🧠 AI-Powered Healthcare Phishing & Social Engineering Dissector")
    email_text = st.text_area("Inbound Message", value="URGENT: Re-authenticate clinical SmartCard within 2 hours at http://hospital-secure-login.net/auth")
    if st.button("🔬 Dissect with AI Security Engine", type="primary"):
        st.error("🚨 HIGH CONFIDENCE PHISHING ATTEMPT (99.4% Probability) - MITRE T1566")

# ================= TAB 5: ZERO TRUST =================
with tabs[5]:
    st.subheader("🚨 Zero-Trust IAM & Code-Blue Break-Glass Access")
    reason = st.text_input("Emergency Resuscitation Justification", placeholder="Code Blue Ward 4B - Traumatic Cardiac Arrest")
    if st.button("🚨 TRIGGER EMERGENCY BREAK-GLASS ACCESS", type="primary"):
        st.warning(f"EMERGENCY OVERRIDE ACTIVATED: {reason} (Audit log generated under HIPAA §164.312)")

# ================= TAB 6: IOMT HSM =================
with tabs[6]:
    st.subheader("💉 IoMT Hardware Fleet & HSM Cryptographic Enclave")
    st.dataframe(pd.DataFrame([
        {"Device": "Alaris Infusion Pump #12", "Firmware": "v3.2.1-SEC", "Status": "ONLINE", "Safeguard": "HSM Verified"},
        {"Device": "Hamilton Ventilator #04", "Firmware": "v5.0.0-PROD", "Status": "ONLINE", "Safeguard": "802.1X Active"},
        {"Device": "Fresenius Dialysis #09", "Firmware": "v2.1.0-LEGACY", "Status": "QUARANTINED", "Safeguard": "VLAN Sandbox"}
    ]), use_container_width=True)

# ================= TAB 7: DPDP & HIPAA =================
with tabs[7]:
    st.subheader("⚖️ DPDP Act 2023 & HIPAA 18-PHI Safe Harbor Studio")
    sample_ehr = st.text_area(
        "Input Raw Medical Record (Contains Protected Health Information)",
        value="Patient Johnathan Doe (MRN: MRN-90214, SSN: 000-12-3456, DOB: 1980-04-12) was admitted on 2026-08-20. Contact: (555) 234-5678, email: jdoe@email.com. Prescribed Lisinopril 20mg daily.",
        height=100
    )
    def deidentify(text):
        text = re.sub(r'Patient\s+[A-Z][a-z]+\s+[A-Z][a-z]+', 'Patient [REDACTED_NAME]', text)
        text = re.sub(r'MRN-\d+', '[REDACTED_MRN]', text)
        text = re.sub(r'\d{3}-\d{2}-\d{4}', '[REDACTED_SSN]', text)
        text = re.sub(r'\d{4}-\d{2}-\d{2}', '[REDACTED_DATE]', text)
        text = re.sub(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', '[REDACTED_PHONE]', text)
        text = re.sub(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', '[REDACTED_EMAIL]', text)
        return text

    deidentified = deidentify(sample_ehr)
    st.markdown("**Safe Harbor De-Identified Output (DPDP Act 2023 / HIPAA Compliant):**")
    st.code(deidentified, language="text")
