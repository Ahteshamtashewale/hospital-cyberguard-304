import React, { useState } from "react";
import {
  Sliders,
  Cpu,
  Key,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Zap,
  Activity,
  HardDrive,
  Lock,
  Unlock,
  Radio,
  CheckCircle,
} from "lucide-react";
import { sampleIoMTFleet } from "../data/mockData";
import { IoMTDevice } from "../types";

export const IoMTHardwareSecurity: React.FC = () => {
  const [fleet, setFleet] = useState<IoMTDevice[]>(sampleIoMTFleet);
  const [selectedDevice, setSelectedDevice] = useState<IoMTDevice>(sampleIoMTFleet[0]);
  const [hsmKeyEpoch, setHsmKeyEpoch] = useState<number>(42);
  const [isRotatingKeys, setIsRotatingKeys] = useState(false);
  const [activeTab, setActiveTab] = useState<"fleet" | "hsm_status" | "firmware">("fleet");

  // Toggle firmware tampering on selected device
  const handleTamperFirmware = (deviceId: string) => {
    setFleet((prev) =>
      prev.map((dev) => {
        if (dev.id === deviceId) {
          const isNowTampered = !dev.isTampered;
          const updated: IoMTDevice = {
            ...dev,
            isTampered: isNowTampered,
            status: isNowTampered ? "ANOMALOUS" : "NORMAL",
            hsmStatus: isNowTampered ? "ALERT" : "SECURE_LOCKED",
            firmwareHash: isNowTampered
              ? "7c98b1a039481029384756192837465910293847561029384756102938475610 (UNAUTHORIZED MOD)"
              : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            telemetry: {
              ...dev.telemetry,
              networkPps: isNowTampered ? 1850 : 14,
              cpuLoad: isNowTampered ? 95 : 18,
            },
          };
          if (selectedDevice.id === deviceId) {
            setSelectedDevice(updated);
          }
          return updated;
        }
        return dev;
      })
    );
  };

  // Isolate device from hospital network
  const handleIsolateDevice = (deviceId: string) => {
    setFleet((prev) =>
      prev.map((dev) => {
        if (dev.id === deviceId) {
          const updated: IoMTDevice = {
            ...dev,
            status: "ISOLATED",
            telemetry: { ...dev.telemetry, networkPps: 0 },
          };
          if (selectedDevice.id === deviceId) {
            setSelectedDevice(updated);
          }
          return updated;
        }
        return dev;
      })
    );
  };

  // Re-verify & Flash Secure Signed Firmware
  const handleRestoreFirmware = (deviceId: string) => {
    setFleet((prev) =>
      prev.map((dev) => {
        if (dev.id === deviceId) {
          const updated: IoMTDevice = {
            ...dev,
            isTampered: false,
            status: "NORMAL",
            hsmStatus: "SECURE_LOCKED",
            firmwareHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            telemetry: {
              ...dev.telemetry,
              networkPps: 14,
              cpuLoad: 16,
            },
          };
          if (selectedDevice.id === deviceId) {
            setSelectedDevice(updated);
          }
          return updated;
        }
        return dev;
      })
    );
  };

  // HSM Master Root Key Rotation
  const handleRotateHsmKeys = () => {
    setIsRotatingKeys(true);
    setTimeout(() => {
      setHsmKeyEpoch((prev) => prev + 1);
      setIsRotatingKeys(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                HARDWARE & IOT SCOPE
              </span>
              <h2 className="text-lg font-serif font-bold text-white">
                Hospital IoMT Device Security & Hardware Security Modules (HSM)
              </h2>
            </div>
            <p className="text-xs text-white/50 mt-1 max-w-3xl leading-relaxed">
              Real-time monitoring of connected Internet of Medical Things (IoMT) hardware, secure boot verification, tamper-evident cryptographic firmware validation, and Hardware Security Module (HSM) key lifecycle management.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="btn-rotate-hsm-keys"
              onClick={handleRotateHsmKeys}
              disabled={isRotatingKeys}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
            >
              {isRotatingKeys ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Key className="w-3.5 h-3.5" />
              )}
              <span>{isRotatingKeys ? "ROTATING MASTER KEYS..." : "ROTATE HSM ROOT KEYS"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* HSM Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#0d0d12] border border-white/10 rounded-xl space-y-1 shadow-lg">
          <span className="text-xs font-mono text-white/40 uppercase tracking-wider">HARDWARE SECURITY MODULE (HSM)</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-serif font-bold text-white">Thales Luna PCIe HSM 7.0</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              FIPS 140-3 L4
            </span>
          </div>
          <p className="text-[11px] text-white/40 font-mono">Enclave: SECURE | Zero Tamper Tripped</p>
        </div>

        <div className="p-4 bg-[#0d0d12] border border-white/10 rounded-xl space-y-1 shadow-lg">
          <span className="text-xs font-mono text-white/40 uppercase tracking-wider">MASTER KEY EPOCH</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-bold font-mono text-blue-400">EPOCH-AES256-#{hsmKeyEpoch}</span>
            <span className="text-[10px] font-mono text-white/40">Auto-rotates in 14d</span>
          </div>
          <p className="text-[11px] text-white/40 font-mono">Master Root: 0x98AF...2B80 (Sealed)</p>
        </div>

        <div className="p-4 bg-[#0d0d12] border border-white/10 rounded-xl space-y-1 shadow-lg">
          <span className="text-xs font-mono text-white/40 uppercase tracking-wider">IOMT FLEET HEALTH</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-serif font-bold text-white">
              {fleet.filter((d) => d.status === "NORMAL").length} / {fleet.length} Devices Clean
            </span>
            {fleet.some((d) => d.isTampered) && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                Tamper Alert
              </span>
            )}
          </div>
          <p className="text-[11px] text-white/40">Continuous 802.1X Network Health Monitoring</p>
        </div>
      </div>

      {/* Main Grid: Device Fleet List & Device Drilldown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Device Fleet Cards */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400" />
              Connected Hospital IoMT Fleet
            </h3>
            <span className="text-xs font-mono text-white/40">{fleet.length} Monitored Endpoints</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {fleet.map((dev) => {
              const isSelected = selectedDevice.id === dev.id;
              return (
                <div
                  key={dev.id}
                  onClick={() => setSelectedDevice(dev)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#111116] border-blue-500/60 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                      : "bg-[#0d0d12] border-white/10 hover:bg-[#111116] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{dev.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/60 border border-white/5">
                          {dev.department}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-white/40">
                        IP: {dev.ipAddress} • MAC: {dev.macAddress}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        dev.status === "NORMAL"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : dev.status === "ISOLATED"
                          ? "bg-white/5 text-white/60 border border-white/10"
                          : "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                      }`}
                    >
                      {dev.status}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40 font-mono">
                    <span>FW: <strong className="text-white/80">{dev.firmwareVersion}</strong></span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-blue-400" />
                      {dev.telemetry.networkPps} pkts/s
                    </span>
                    <span>CPU: {dev.telemetry.cpuLoad}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Device Hardware & Firmware Validator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400">{selectedDevice.id}</span>
                <h3 className="text-base font-serif font-bold text-white">{selectedDevice.name}</h3>
              </div>

              <div className="flex items-center space-x-2">
                {selectedDevice.isTampered ? (
                  <button
                    onClick={() => handleRestoreFirmware(selectedDevice.id)}
                    className="px-3 py-1.5 text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all flex items-center space-x-1 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Flash Certified FW</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleTamperFirmware(selectedDevice.id)}
                    className="px-3 py-1.5 text-xs font-mono font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Inject Rogue Firmware</span>
                  </button>
                )}

                {selectedDevice.status !== "ISOLATED" && (
                  <button
                    onClick={() => handleIsolateDevice(selectedDevice.id)}
                    className="px-3 py-1.5 text-xs font-mono font-semibold bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 rounded-lg transition-all cursor-pointer"
                  >
                    VLAN Quarantine
                  </button>
                )}
              </div>
            </div>

            {/* Tamper Alert Warning */}
            {selectedDevice.isTampered && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-xs space-y-1 animate-pulse">
                <div className="flex items-center space-x-2 font-bold text-red-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-mono">CRYPTOGRAPHIC FIRMWARE SIGNATURE MISMATCH DETECTED!</span>
                </div>
                <p className="leading-relaxed">
                  Secure Boot chain broken! Binary checksum deviates from vendor signed root certificate in Hospital HSM. High risk of bolus medication rate override.
                </p>
              </div>
            )}

            {/* Device Hardware Specs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0a0a0c] p-3 rounded-xl border border-white/5 space-y-0.5">
                <span className="text-white/40 font-mono text-[10px] uppercase">Hardware Classification</span>
                <span className="font-medium text-white block">{selectedDevice.type}</span>
              </div>
              <div className="bg-[#0a0a0c] p-3 rounded-xl border border-white/5 space-y-0.5">
                <span className="text-white/40 font-mono text-[10px] uppercase">Physical Department</span>
                <span className="font-medium text-white block">{selectedDevice.department}</span>
              </div>
              <div className="bg-[#0a0a0c] p-3 rounded-xl border border-white/5 space-y-0.5">
                <span className="text-white/40 font-mono text-[10px] uppercase">Hardware MAC Address</span>
                <span className="font-mono text-blue-300 block">{selectedDevice.macAddress}</span>
              </div>
              <div className="bg-[#0a0a0c] p-3 rounded-xl border border-white/5 space-y-0.5">
                <span className="text-white/40 font-mono text-[10px] uppercase">HSM Trust Status</span>
                <span
                  className={`font-semibold font-mono block ${
                    selectedDevice.hsmStatus === "SECURE_LOCKED" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {selectedDevice.hsmStatus}
                </span>
              </div>
            </div>

            {/* Firmware Cryptographic Checksum */}
            <div>
              <span className="text-xs font-mono font-semibold text-white/60 block mb-1">
                Firmware SHA-256 Checksum (Root of Trust)
              </span>
              <pre
                className={`p-3 bg-[#0a0a0c] rounded-xl text-[11px] font-mono border break-all ${
                  selectedDevice.isTampered
                    ? "text-red-400 border-red-500/30 bg-red-500/5 font-bold"
                    : "text-emerald-400 border-white/5"
                }`}
              >
                {selectedDevice.firmwareHash}
              </pre>
            </div>

            {/* Live Telemetry Sensors */}
            <div className="p-3 bg-[#0a0a0c] rounded-xl border border-white/5 space-y-2">
              <span className="text-xs font-mono font-semibold text-white/70 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                LIVE SENSOR TELEMETRY
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-[#0d0d12] rounded-lg border border-white/5">
                  <span className="text-white/40 font-mono text-[10px] block">NETWORK PPS</span>
                  <span
                    className={`font-bold font-mono ${
                      selectedDevice.telemetry.networkPps > 500 ? "text-red-400 animate-pulse" : "text-white"
                    }`}
                  >
                    {selectedDevice.telemetry.networkPps}
                  </span>
                </div>
                <div className="p-2 bg-[#0d0d12] rounded-lg border border-white/5">
                  <span className="text-white/40 font-mono text-[10px] block">CPU LOAD</span>
                  <span
                    className={`font-bold font-mono ${
                      selectedDevice.telemetry.cpuLoad > 80 ? "text-red-400" : "text-white"
                    }`}
                  >
                    {selectedDevice.telemetry.cpuLoad}%
                  </span>
                </div>
                <div className="p-2 bg-[#0d0d12] rounded-lg border border-white/5">
                  <span className="text-white/40 font-mono text-[10px] block">BACKUP BATTERY</span>
                  <span className="font-bold font-mono text-emerald-400">
                    {selectedDevice.telemetry.battery}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
