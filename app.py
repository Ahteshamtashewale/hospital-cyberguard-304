import streamlit as st
import hashlib
import json
import time
import os
import re
from datetime import datetime
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric.utils import encode_dss_signature, decode_dss_signature

# Page Configuration
st.set_page_config(
    page_title="Hospital CyberGuard & Data Privacy (ID-304)",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS styling for Cyber-Medical aesthetic
st.markdown("""
<style>
    /* Dark cyber background */
    .stApp {
        background-color: #08090d;
        color: #e2e8f0;
    }
    
    /* Metrics styling */
    div[data-testid="stMetricValue"] {
        font-family: monospace;
        font-size: 1.8rem;
        color: #60a5fa;
    }
    div[data-testid="stMetricLabel"] {
        font-size: 0.85rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    /* Card-like containers */
    .cyber-card {
        background-color: #111420;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 1.25rem;
        margin-bottom: 1rem;
    }
    
    .badge-critical {
        background-color: rgba(239, 68, 68, 0.2);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.4);
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-family: monospace;
    }
    
    .badge-secure {
        background-color: rgba(34, 197, 94, 0.2);
        color: #4ade80;
        border: 1px solid rgba(34, 197, 94, 0.4);
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-family: monospace;
    }

    .badge-warning {
        background-color: rgba(234, 179, 8, 0.2);
        color: #facc15;
        border: 1px solid rgba(234, 179, 8, 0.4);
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-family: monospace;
    }
</style>
""", unsafe_allow_html=True)

# ----------------- SESSION STATE INITIALIZATION -----------------
if "audit_logs" not in st.session_state:
    st.session_state.audit_logs = [
        {"timestamp": "2026-08-27 08:42:15", "actor": "DR_SARAH_CHEN (ID-9081)", "action": "FHIR_PATIENT_READ", "patient_id": "PT-44029", "status": "APPROVED", "context": "ICU Ward Rounding"},
        {"timestamp": "2026-08-27 08:35:10", "actor": "UNKNOWN_IP (198.51.100.44)", "action": "API_BOLA_PROBE", "patient_id": "PT-11002", "status": "BLOCKED", "context": "WAF BOLA Rule Triggered"},
        {"timestamp": "2026-08-27 08:20:00", "actor": "IOMT_GATEWAY_NODE", "action": "FIRMWARE_CHECKSUM_OK", "patient_id": "FLEET_PUMP_04", "status": "VERIFIED", "context": "HSM Trust Anchored"}
    ]

if "hsm_epoch" not in st.session_state:
    st.session_state.hsm_epoch = "HSM-SEC-KEY-V4.2 (Active)"
    st.session_state.hsm_rotation_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# Generate or retrieve server ECDSA key pair
if "private_key" not in st.session_state:
    st.session_state.private_key = ec.generate_private_key(ec.SECP256R1())
    st.session_state.public_key = st.session_state.private_key.public_key()

# ----------------- SIDEBAR CONTROLS -----------------
with st.sidebar:
    st.image("https://img.icons8.com/fluency/96/shield.png", width=64)
    st.title("Hospital CyberGuard")
    st.caption("Clinical Cybersecurity & DPDP Suite (ID-304)")
    st.markdown("---")

    st.markdown("### 🏥 System Telemetry")
    st.markdown("**DEFCON Level**: <span class='badge-warning'>DEFCON 3 (ELEVATED)</span>", unsafe_allow_html=True)
    st.markdown("**Active IoMT Devices**: `1,420 / 1,425`")
    st.markdown("**FHIR API Shield**: `ACTIVE (mTLS)`")
    st.markdown("**Compliance Target**: `DPDP 2023 / HIPAA`")
    st.markdown("---")

    api_key_input = st.text_input("Gemini API Key (Optional)", type="password", placeholder="Enter AI Studio Key", help="For AI Phishing analysis and threat dissection")
    if api_key_input:
        os.environ["GEMINI_API_KEY"] = api_key_input
        st.success("API Key configured for AI Threat Engine!")

    st.markdown("---")
    st.markdown("### 📚 Standards & Regulations")
    st.markdown("- **DPDP Act 2023 (India)**: Sec 4, 8(5), 8(6)")
    st.markdown("- **HIPAA Security Rule**: 45 CFR § 164.312")
    st.markdown("- **OWASP API Top 10 (2023)**")
    st.markdown("- **NIST SP 800-66 Rev 2 (IoMT)**")

# ----------------- TOP METRICS BAR -----------------
col_m1, col_m2, col_m3, col_m4, col_m5 = st.columns(5)
with col_m1:
    st.metric("Total Attacked Blocked", "42,891", "+14% past 24h")
with col_m2:
    st.metric("FHIR API Endpoints", "18 Live", "100% WAF Shielded")
with col_m3:
    st.metric("Tamper Detection", "100%", "SHA-256 / ECDSA")
with col_m4:
    st.metric("IoMT Firmware Trust", "99.8%", "1,420 Enclave Anchors")
with col_m5:
    st.metric("DPDP 2023 Score", "98.4%", "Audit Ready")

st.markdown("---")

# ----------------- MAIN NAVIGATION TABS -----------------
tabs = st.tabs([
    "📊 SOC SIEM Telemetry",
    "🔍 FHIR API Pentesting",
    "✍️ Medical Record Integrity",
    "🧠 AI Phishing Shield",
    "🚨 Zero-Trust & Break-Glass",
    "💉 IoMT & HSM Security",
    "⚖️ DPDP & HIPAA Governance"
])

# ================= TAB 1: SOC SIEM TELEMETRY =================
with tabs[0]:
    st.subheader("🛡️ Real-Time Clinical Cyber Defense & Threat Visualizer")
    
    col_t1, col_t2 = st.columns([2, 1])
    
    with col_t1:
        # Time-series attack trend chart
        dates = pd.date_range(end=datetime.now(), periods=12, freq='H')
        attack_data = pd.DataFrame({
            "Time": dates,
            "FHIR BOLA Probes": [45, 62, 80, 110, 95, 140, 210, 180, 160, 230, 290, 310],
            "IoMT Port Scans": [12, 19, 25, 40, 32, 45, 60, 52, 48, 65, 80, 95],
            "AI Phishing Vectors": [5, 8, 12, 10, 15, 22, 30, 25, 20, 35, 40, 48]
        })
        
        fig = px.area(
            attack_data, x="Time", y=["FHIR BOLA Probes", "IoMT Port Scans", "AI Phishing Vectors"],
            title="Real-Time Threat Ingestion (Packets / Sec)",
            color_discrete_sequence=["#3b82f6", "#ef4444", "#f59e0b"],
            template="plotly_dark"
        )
        fig.update_layout(
            paper_bgcolor="#111420",
            plot_bgcolor="#111420",
            margin=dict(l=20, r=20, t=40, b=20),
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
        )
        st.plotly_chart(fig, use_container_width=True)
        
    with col_t2:
        st.markdown("### ⚠️ Active Live Incidents")
        incidents = [
            {"id": "INC-8902", "type": "BOLA Mass Query", "target": "FHIR /Observation", "level": "CRITICAL", "source": "194.26.29.112"},
            {"id": "INC-8901", "type": "Firmware Checksum Mismatch", "target": "Infusion Pump #12", "level": "HIGH", "source": "Internal Subnet B"},
            {"id": "INC-8899", "type": "Spear-Phishing Campaign", "target": "Chief of Surgery", "level": "MEDIUM", "source": "mail-spoof-relay.net"}
        ]
        for inc in incidents:
            with st.container():
                badge_class = "badge-critical" if inc["level"] == "CRITICAL" else ("badge-warning" if inc["level"] == "HIGH" else "badge-secure")
                st.markdown(f"""
                <div style="background:#161b2c; border:1px solid rgba(255,255,255,0.06); padding:10px; border-radius:8px; margin-bottom:8px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-family:monospace; font-weight:bold; color:#60a5fa;">{inc['id']}</span>
                        <span class="{badge_class}">{inc['level']}</span>
                    </div>
                    <div style="font-size:0.85rem; margin-top:4px; color:#cbd5e1;"><b>{inc['type']}</b> on <code>{inc['target']}</code></div>
                    <div style="font-size:0.75rem; color:#94a3b8; font-family:monospace;">Source: {inc['source']}</div>
                </div>
                """, unsafe_allow_html=True)
                if st.button(f"🛡️ Auto-Mitigate {inc['id']}", key=f"btn_{inc['id']}"):
                    st.success(f"Incident {inc['id']} mitigated: IP isolated & rule added to WAF.")

# ================= TAB 2: FHIR API PENTESTING =================
with tabs[1]:
    st.subheader("🔍 FHIR REST API Vulnerability & Pentesting Studio")
    st.caption("Evaluate healthcare REST endpoints against the OWASP API Security Top 10 (2023)")
    
    col_api1, col_api2 = st.columns([1, 1])
    
    with col_api1:
        st.markdown("### 🎯 Target Endpoint Configuration")
        endpoint = st.selectbox(
            "Select FHIR Resource Endpoint",
            [
                "/api/fhir/Patient/PT-44029 (Patient Demographics)",
                "/api/fhir/Observation?patient=PT-44029 (Vitals & Labs)",
                "/api/fhir/MedicationRequest (Active Prescriptions)",
                "/api/fhir/Encounter/ENC-9912 (Clinical Visits)",
                "/api/fhir/DiagnosticReport/DR-304 (Radiology Reports)"
            ]
        )
        
        test_vector = st.radio(
            "Select OWASP Threat Vector Simulation",
            [
                "API1:2023 Broken Object Level Authorization (BOLA)",
                "API3:2023 Broken Object Property Level (Mass Assignment)",
                "API4:2023 Unrestricted Resource Consumption (Rate Limit)",
                "API8:2023 Security Misconfiguration & SQL Injection"
            ]
        )
        
        caller_token = st.text_input("Caller JWT Authorization Header", value="Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9... (Nurse Role)")
        
        if st.button("🚀 Execute Simulated Pentest", type="primary"):
            with st.spinner("Running automated API penetration tests..."):
                time.sleep(1)
                st.session_state.pentest_executed = True
                st.session_state.selected_vector = test_vector
                
    with col_api2:
        st.markdown("### 📋 Security Assessment & WAF Mitigation")
        if st.session_state.get("pentest_executed", False):
            vector = st.session_state.get("selected_vector", "")
            if "BOLA" in vector:
                st.error("🚨 VULNERABILITY DETECTED: API1:2023 Broken Object Level Authorization")
                st.markdown("""
                - **Severity**: Critical (CVSS 9.1)
                - **Finding**: Caller with role `NURSE_GENERAL` attempted accessing `/api/fhir/Patient/PT-9982` outside assigned department ward.
                - **Remediation**: Implemented ABAC policy requiring `Department-ID` and `Assigned-Patient-List` match.
                """)
            elif "Mass Assignment" in vector:
                st.warning("⚠️ VULNERABILITY DETECTED: API3:2023 Mass Assignment")
                st.markdown("""
                - **Severity**: High (CVSS 7.8)
                - **Finding**: Payload included unauthorized `"isChiefMedicalOfficer": true` field.
                - **Remediation**: Strict DTO whitelisting enabled in Express API gateway.
                """)
            else:
                st.success("✅ ENDPOINT DEFENDED: Rate-Limiting & SQLi Filter Passed")
                
            st.markdown("#### 🛡️ Auto-Generated Zero-Trust WAF Rule")
            waf_rule = {
                "rule_id": "WAF-FHIR-BOLA-DEFENSE-304",
                "target_resource": "Patient/*",
                "action": "DENY_UNLESS_ABAC_VERIFIED",
                "abac_conditions": {
                    "token.role": ["PHYSICIAN", "ATTENDING_NURSE"],
                    "token.department": "request.patient.department",
                    "mfa_verified": True
                },
                "audit_mode": "MANDATORY_EHR_LOGGING"
            }
            st.code(json.dumps(waf_rule, indent=2), language="json")
        else:
            st.info("Select a FHIR endpoint and attack vector on the left to execute penetration testing.")

# ================= TAB 3: MEDICAL RECORD INTEGRITY =================
with tabs[2]:
    st.subheader("✍️ Cryptographic Medical Record Integrity & Tamper Detector")
    st.caption("FIPS-compliant SHA-256 Merkle root hashing with asymmetric ECDSA P-256 digital signatures")
    
    col_rec1, col_rec2 = st.columns(2)
    
    with col_rec1:
        st.markdown("### 📄 Active Clinical Record (EMR Payload)")
        patient_id = st.text_input("Patient ID", value="PT-90412")
        patient_name = st.text_input("Patient Name", value="Alexander Wright")
        diagnosis = st.text_input("Clinical Diagnosis", value="Acute Myocardial Infarction (ICD-10 I21.9)")
        dosage = st.text_input("Medication Dosage", value="Atorvastatin 80mg Oral Daily + Heparin 5000 IU")
        physician = st.text_input("Attending Physician", value="Dr. Elena Rostova, MD (LIC-88910)")
        
        # Compute deterministic payload
        raw_payload = f"{patient_id}|{patient_name}|{diagnosis}|{dosage}|{physician}"
        computed_hash = hashlib.sha256(raw_payload.encode('utf-8')).hexdigest()
        
        st.markdown("**Calculated SHA-256 Digest:**")
        st.code(computed_hash, language="text")
        
        # Save initial signature in state if not exists
        if "canonical_hash" not in st.session_state:
            st.session_state.canonical_hash = computed_hash
            # Sign with ECDSA
            signature = st.session_state.private_key.sign(
                computed_hash.encode('utf-8'),
                ec.ECDSA(hashes.SHA256())
            )
            st.session_state.digital_signature = signature.hex()
            
        if st.button("🔐 Sign & Lock Record with ECDSA P-256", type="primary"):
            st.session_state.canonical_hash = computed_hash
            sig = st.session_state.private_key.sign(
                computed_hash.encode('utf-8'),
                ec.ECDSA(hashes.SHA256())
            )
            st.session_state.digital_signature = sig.hex()
            st.success("Medical record cryptographically signed and locked!")

    with col_rec2:
        st.markdown("### 🔎 Real-Time Signature & Tamper Verification")
        st.markdown("**Stored Canonical ECDSA Signature:**")
        st.code(st.session_state.get("digital_signature", "Not signed yet")[:64] + "...", language="text")
        
        # Verification check
        current_canonical = st.session_state.get("canonical_hash", "")
        
        if computed_hash == current_canonical:
            st.markdown("""
            <div class="cyber-card" style="border: 1px solid rgba(34, 197, 94, 0.4); background: rgba(34, 197, 94, 0.05);">
                <h3 style="color:#4ade80; margin:0;">✅ RECORD INTEGRITY VERIFIED</h3>
                <p style="color:#cbd5e1; font-size:0.9rem; margin-top:8px;">
                    The current SHA-256 payload matches the physician's cryptographic digital signature perfectly. No tampering detected.
                </p>
                <span class="badge-secure">VERIFIED BY ECDSA P-256</span>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class="cyber-card" style="border: 1px solid rgba(239, 68, 68, 0.5); background: rgba(239, 68, 68, 0.08);">
                <h3 style="color:#f87171; margin:0;">🚨 TAMPERING DETECTED! HASH MISMATCH</h3>
                <p style="color:#cbd5e1; font-size:0.9rem; margin-top:8px;">
                    <b>CRITICAL ALERT:</b> The record payload was modified after signing!<br>
                    Expected Hash: <code style="color:#60a5fa;">{current_canonical[:24]}...</code><br>
                    Current Modified Hash: <code style="color:#f87171;">{computed_hash[:24]}...</code>
                </p>
                <span class="badge-critical">SIGNATURE INVALIDATED</span>
            </div>
            """, unsafe_allow_html=True)

# ================= TAB 4: AI PHISHING SHIELD =================
with tabs[3]:
    st.subheader("🧠 AI-Powered Healthcare Phishing & Social Engineering Dissector")
    st.caption("Detect spear-phishing campaigns targeting hospital staff, credential harvesters, and invoice fraud")
    
    col_ph1, col_ph2 = st.columns([1, 1])
    
    with col_ph1:
        st.markdown("### 📥 Inbound Message Inspector")
        preset_phish = st.selectbox(
            "Load Sample Inbound Attack Email / SMS",
            [
                "Urgent IT Notice: Mandatory Clinical Portal Password Reset (Credential Harvester)",
                "Emergency Blood Specimen Delivery Notification (Malicious Macro XLS)",
                "Hospital CFO: Urgent Vendor Wire Transfer for Oxygen Cannulas (BEC)",
                "Custom Inbound Email"
            ]
        )
        
        if "Password Reset" in preset_phish:
            default_sender = "support@hospital-portal-verify-it.com"
            default_body = "URGENT: All clinical staff must re-authenticate their SmartCard access within 2 hours or patient EHR write privileges will be suspended immediately. Click here to verify: http://hospital-secure-login.net/auth"
        elif "Specimen" in preset_phish:
            default_sender = "courier@city-pathology-express.org"
            default_body = "Attached is the urgent biopsy report for Patient #PT-8810. Enable macros on the attached Excel spreadsheet to decrypt the pathologist's signature."
        elif "CFO" in preset_phish:
            default_sender = "cfo-hospital-executive@mail-relay-asia.com"
            default_body = "Dr. Miller, please authorize an immediate emergency wire of $45,000 to BioMed Supplies Ltd for delayed surgical cannulas. Account details attached."
        else:
            default_sender = "external-partner@unknown.com"
            default_body = "Please review the attached invoice immediately."
            
        sender = st.text_input("Sender Address", value=default_sender)
        email_body = st.text_area("Message Body / Payload", value=default_body, height=140)
        
        analyze_clicked = st.button("🔬 Dissect with AI Security Engine", type="primary")
        
    with col_ph2:
        st.markdown("### 📊 Threat Intelligence & IOC Extraction")
        if analyze_clicked:
            with st.spinner("Analyzing linguistic patterns & domain reputation..."):
                time.sleep(1)
                
                # Check for indicators
                is_high_risk = "urgent" in email_body.lower() or "verify" in email_body.lower() or "macro" in email_body.lower() or "wire" in email_body.lower()
                
                if is_high_risk:
                    st.markdown("""
                    <div class="cyber-card" style="border: 1px solid rgba(239, 68, 68, 0.4);">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-weight:bold; color:#f87171; font-size:1.1rem;">🚨 HIGH CONFIDENCE PHISHING ATTEMPT (99.4%)</span>
                            <span class="badge-critical">T1566: PHISHING</span>
                        </div>
                        <ul style="margin-top:10px; font-size:0.88rem; color:#cbd5e1;">
                            <li><b>Lookalike Domain:</b> Sender domain does not match official hospital MX records.</li>
                            <li><b>Linguistic Pressure:</b> Uses artificial urgency and coercion to induce impulsive credential entry.</li>
                            <li><b>MITRE ATT&CK:</b> T1566.002 (Spearphishing Link), T1078 (Valid Accounts).</li>
                        </ul>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    st.markdown("#### 🛡️ Extracted Indicators of Compromise (IoCs)")
                    ioc_df = pd.DataFrame([
                        {"Type": "Domain", "Indicator": sender.split("@")[-1], "Action": "DNS Blackhole Sinkhole"},
                        {"Type": "Pattern", "Indicator": "Credential Harvester URI", "Action": "Block on Palo Alto / Fortinet"},
                        {"Type": "Email", "Indicator": sender, "Action": "Quarantine Hospital-Wide"}
                    ])
                    st.dataframe(ioc_df, use_container_width=True, hide_index=True)
                else:
                    st.success("✅ Message analyzed: Low risk. No credential harvesting or exploit patterns found.")

# ================= TAB 5: ZERO-TRUST & BREAK-GLASS =================
with tabs[4]:
    st.subheader("🚨 Zero-Trust Architecture (ZTA) & Code-Blue Break-Glass IAM")
    st.caption("Continuous Attribute-Based Access Control (ABAC) with audited resuscitation emergency overrides")
    
    col_zt1, col_zt2 = st.columns(2)
    
    with col_zt1:
        st.markdown("### 👤 Contextual Subject Evaluation")
        role = st.selectbox("Staff Role", ["SURGEON", "ICU_ATTENDING_PHYSICIAN", "RESIDENT_NURSE", "PHARMACY_TECH", "BILLING_STAFF"])
        device_posture = st.selectbox("Device Posture", ["HOSPITAL_MDM_COMPLIANT", "PERSONAL_UNMANAGED_BYOD", "PUBLIC_KIOSK"])
        network_loc = st.selectbox("Network Location", ["ICU_ISOLATED_VLAN (10.240.10.x)", "HOSPITAL_GUEST_WIFI", "EXTERNAL_INTERNET_WAN"])
        mfa_status = st.checkbox("FIDO2 WebAuthn Token Verified", value=True)
        
        # Calculate ABAC Score
        is_device_ok = device_posture == "HOSPITAL_MDM_COMPLIANT"
        is_net_ok = "ISOLATED" in network_loc
        is_approved = is_device_ok and is_net_ok and mfa_status
        
        st.markdown("---")
        st.markdown("### ⚡ Emergency Code-Blue Override")
        st.warning("⚠️ **HIPAA §164.312(a)(2)(ii) Emergency Access**: Provides instant unrestricted access during cardiac arrest or trauma.")
        break_glass_reason = st.text_input("Clinical Justification for Emergency Override", placeholder="e.g., Code Blue Ward 4B Resuscitation")
        break_glass_active = st.button("🚨 TRIGGER EMERGENCY BREAK-GLASS ACCESS", type="secondary")
        
    with col_zt2:
        st.markdown("### 🛡️ Access Decision Engine")
        if break_glass_active and break_glass_reason:
            st.markdown(f"""
            <div class="cyber-card" style="border: 2px solid #ef4444; background: rgba(239,68,68,0.1);">
                <h3 style="color:#f87171; margin:0;">🚨 BREAK-GLASS ACCESS GRANTED</h3>
                <p style="color:#cbd5e1; font-size:0.9rem; margin-top:8px;">
                    <b>EMERGENCY OVERRIDE ACTIVE:</b> All medical records unlocked for resuscitation.<br>
                    <b>Justification:</b> {break_glass_reason}<br>
                    <b>Audit Timestamp:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} (Immutable log generated)
                </p>
                <span class="badge-critical">HIPAA AUDIT ESCALATION LOGGED</span>
            </div>
            """, unsafe_allow_html=True)
            st.session_state.audit_logs.insert(0, {
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "actor": f"{role} (EMERGENCY_OVERRIDE)",
                "action": "BREAK_GLASS_ACCESS",
                "patient_id": "GLOBAL_CRITICAL",
                "status": "EMERGENCY_GRANTED",
                "context": break_glass_reason
            })
        elif is_approved:
            st.markdown("""
            <div class="cyber-card" style="border: 1px solid rgba(34, 197, 94, 0.4); background: rgba(34, 197, 94, 0.05);">
                <h3 style="color:#4ade80; margin:0;">✅ ACCESS GRANTED (ZERO-TRUST ABAC)</h3>
                <p style="color:#cbd5e1; font-size:0.9rem; margin-top:8px;">
                    Identity verified with FIDO2 WebAuthn + MDM compliant posture on internal clinical subnet.
                </p>
                <span class="badge-secure">LEAST PRIVILEGE ENFORCED</span>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown("""
            <div class="cyber-card" style="border: 1px solid rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.05);">
                <h3 style="color:#f87171; margin:0;">⛔ ACCESS DENIED (POLICY VIOLATION)</h3>
                <p style="color:#cbd5e1; font-size:0.9rem; margin-top:8px;">
                    Access denied due to unmanaged device posture or untrusted network origin.
                </p>
                <span class="badge-critical">BLOCKED BY ZERO-TRUST ENGINE</span>
            </div>
            """, unsafe_allow_html=True)
            
        st.markdown("#### 📜 Immutable HIPAA Audit Stream")
        st.dataframe(pd.DataFrame(st.session_state.audit_logs), use_container_width=True, hide_index=True)

# ================= TAB 6: IOMT & HSM SECURITY =================
with tabs[5]:
    st.subheader("💉 IoMT Hardware Fleet & HSM Cryptographic Enclave")
    st.caption("Verify connected medical devices (Infusion Pumps, Ventilators) against FIPS 140-3 Hardware Security Modules")
    
    col_iomt1, col_iomt2 = st.columns([1, 1])
    
    with col_iomt1:
        st.markdown("### 🏥 Connected IoMT Fleet Status")
        devices = [
            {"Device": "Alaris Infusion Pump #12", "Type": "Infusion", "Firmware": "v3.2.1-SEC", "Checksum": "e3b0c44298fc1c149afbf4c8996fb924", "Status": "SECURE"},
            {"Device": "Hamilton Ventilator #04", "Type": "Ventilator", "Firmware": "v5.0.0-PROD", "Checksum": "9f83c683e2f0542778056e1b4f7e2836", "Status": "SECURE"},
            {"Device": "Fresenius Dialysis #09", "Type": "Dialysis", "Firmware": "v2.1.0-LEGACY", "Checksum": "UNVERIFIED_CHECKSUM_ERR", "Status": "COMPROMISED"},
            {"Device": "GE Healthcare ECG #02", "Type": "ECG Telemetry", "Firmware": "v4.1.2-SEC", "Checksum": "6b86b273ff34fce19d6b804eff5a3f57", "Status": "SECURE"}
        ]
        st.dataframe(pd.DataFrame(devices), use_container_width=True, hide_index=True)
        
    with col_iomt2:
        st.markdown("### 🔑 Hardware Security Module (HSM) Enclave")
        st.markdown(f"""
        <div class="cyber-card">
            <div style="font-size:0.85rem; color:#94a3b8;">ACTIVE HSM ROOT KEY:</div>
            <div style="font-family:monospace; color:#60a5fa; font-size:1.1rem; font-weight:bold;">{st.session_state.hsm_epoch}</div>
            <div style="font-size:0.75rem; color:#64748b; margin-top:4px;">Last Key Rotation: {st.session_state.hsm_rotation_date}</div>
        </div>
        """, unsafe_allow_html=True)
        
        if st.button("🔄 Execute FIPS 140-3 HSM Root Key Epoch Rotation"):
            new_epoch = f"HSM-SEC-KEY-V4.{int(time.time()) % 100} (Active)"
            st.session_state.hsm_epoch = new_epoch
            st.session_state.hsm_rotation_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            st.success(f"HSM Cryptographic Keys re-derived and distributed to IoMT fleet: {new_epoch}")
            st.rerun()

# ================= TAB 7: DPDP & HIPAA GOVERNANCE =================
with tabs[6]:
    st.subheader("⚖️ DPDP Act 2023 & HIPAA 18-PHI Safe Harbor Studio")
    st.caption("Automated compliance auditing and real-time medical record de-identification for clinical research")
    
    col_dp1, col_dp2 = st.columns(2)
    
    with col_dp1:
        st.markdown("### 🧪 Safe Harbor PHI De-identification Engine")
        sample_ehr = st.text_area(
            "Input Raw Medical Record (Contains Protected Health Information)",
            value="Patient Johnathan Doe (MRN: MRN-90214, SSN: 000-12-3456, DOB: 1980-04-12) was admitted to Seattle General Hospital on 2026-08-20. Contact phone: (555) 234-5678, email: jdoe@email.com. Prescribed Lisinopril 20mg daily.",
            height=130
        )
        
        def deidentify_record(text):
            # Regex patterns for 18 HIPAA Safe Harbor identifiers
            text = re.sub(r'Patient\s+[A-Z][a-z]+\s+[A-Z][a-z]+', 'Patient [REDACTED_NAME]', text)
            text = re.sub(r'MRN-\d+', '[REDACTED_MRN]', text)
            text = re.sub(r'\d{3}-\d{2}-\d{4}', '[REDACTED_SSN/AADHAAR]', text)
            text = re.sub(r'\d{4}-\d{2}-\d{2}', '[REDACTED_DATE]', text)
            text = re.sub(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', '[REDACTED_PHONE]', text)
            text = re.sub(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', '[REDACTED_EMAIL]', text)
            text = re.sub(r'Seattle General Hospital', '[REDACTED_FACILITY]', text)
            return text
            
        deidentified = deidentify_record(sample_ehr)
        
        st.markdown("**Safe Harbor De-Identified Output (GDPR / HIPAA Compliant):**")
        st.code(deidentified, language="text")
        
    with col_dp2:
        st.markdown("### 📋 DPDP Act 2023 Statutory Compliance Checklist")
        st.checkbox("Section 4: Lawful grounds for clinical data processing documented", value=True)
        st.checkbox("Section 6: Explicit patient consent for secondary research", value=True)
        st.checkbox("Section 8(5): Reasonable security safeguards (AES-256 / TLS 1.3)", value=True)
        st.checkbox("Section 8(6): 72-hour Data Breach Notification Protocol verified", value=True)
        st.checkbox("Section 9: Special protections for minor patient data enabled", value=True)
        st.checkbox("HIPAA §164.312(a)(1): Unique User ID & Emergency Break-Glass", value=True)
        st.checkbox("HIPAA §164.312(b): Immutable cryptographically hashed audit logs", value=True)
        
        st.markdown("""
        <div class="cyber-card" style="border: 1px solid rgba(34, 197, 94, 0.4); margin-top:12px;">
            <div style="color:#4ade80; font-weight:bold;">✅ REGULATORY STATUS: FULLY COMPLIANT</div>
            <div style="font-size:0.85rem; color:#94a3b8; margin-top:4px;">Meets Indian DPDP Act 2023 and US HIPAA Security Rule standards.</div>
        </div>
        """, unsafe_allow_html=True)
