"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Attendee {
  name: string;
  email: string;
  certificateId: string;
}

interface SandboxCertificateTemplateProps {
  attendee: Attendee;
}

export default function SandboxCertificateTemplate({ attendee }: SandboxCertificateTemplateProps) {
  const [displayCertId, setDisplayCertId] = useState(attendee.certificateId);
  const [issueDate, setIssueDate] = useState("August 01, 2026");

  // Deterministic hashing of the email to create a stable, unique 5-digit number
  const hashEmailToNumber = (emailStr: string): number => {
    let hash = 5381;
    const lowerEmail = emailStr.toLowerCase().trim();
    for (let i = 0; i < lowerEmail.length; i++) {
      hash = (hash * 33) ^ lowerEmail.charCodeAt(i);
    }
    return (Math.abs(hash) % 90000) + 10000;
  };

  useEffect(() => {
    const now = new Date();
    const pad = (num: number) => String(num).padStart(2, "0");
    
    // Hash email to generate a deterministic 5-digit ID suffix
    const hashedSuffix = hashEmailToNumber(attendee.email);
    setDisplayCertId(`SANDBOX-2026-${hashedSuffix}`);

    // Generate dynamic issue date
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const formattedDate = `${months[now.getMonth()]} ${pad(now.getDate())}, ${now.getFullYear()}`;
    setIssueDate(formattedDate);
  }, [attendee.email]);

  return (
    <div
      id="certificate-print-area"
      className="relative w-full aspect-[297/210] max-lg:w-[950px] max-lg:h-[671px] max-lg:min-w-[950px] max-lg:min-h-[671px] bg-[#020617] text-white border border-blue-500/20 flex flex-col justify-between p-12 overflow-hidden select-none"
      style={{
        background: "radial-gradient(circle at 50% 50%, rgba(29, 78, 216, 0.15) 0%, transparent 65%), linear-gradient(to bottom, #0B0F19 0%, #030712 100%)",
        boxShadow: "0 0 50px rgba(59, 130, 246, 0.12)",
      }}
    >
      {/* Decorative Outer Cyber Border */}
      <div className="absolute inset-4 border border-white/5 pointer-events-none" />
      <div className="absolute inset-5 border border-blue-500/10 pointer-events-none" />

      {/* Sandbox theme corner brackets */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-blue-400/60" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-blue-400/60" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-blue-400/60" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-blue-400/60" />

      {/* Tech Grid Patterns in Background (subtle) */}
      <div className="absolute inset-0 opacity-[0.03] grid-overlay pointer-events-none" />

      {/* Top Header Section (CIT Logo Left, Title Center, ExploitX Logo Right) */}
      <div className="relative grid grid-cols-12 items-center z-10 w-full">
        {/* Left column - CIT Logo */}
        <div className="col-span-3 flex justify-start">
          <Image
            src="/logo_cit.png"
            alt="CIT Logo"
            width={125}
            height={48}
            className="object-contain brightness-125 saturate-150 contrast-125"
          />
        </div>
        
        {/* Center column - Workshop Header Title */}
        <div className="col-span-6 flex justify-center w-full drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <svg viewBox="0 0 600 55" className="w-full h-auto">
            <defs>
              <linearGradient id="sandboxHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="url(#sandboxHeaderGrad)"
              fontFamily="JetBrains Mono, monospace"
              fontSize="34"
              fontWeight="900"
              letterSpacing="2"
            >
              OPEN SANDBOX DEVELOPMENT
            </text>
          </svg>
        </div>

        {/* Right column - ExploitX Logo */}
        <div className="col-span-3 flex justify-end">
          <Image
            src="/logo_exploitx.png"
            alt="ExploitX Logo"
            width={85}
            height={40}
            className="object-contain"
          />
        </div>
      </div>

      {/* Main Content Section (Centered Layout) */}
      <div className="relative flex flex-col items-center text-center my-auto z-10 w-full space-y-6 max-w-3xl mx-auto">
        
        <div className="space-y-1 w-full">
          <svg viewBox="0 0 800 45" className="w-full h-auto">
            <defs>
              <linearGradient id="sandboxSubGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="url(#sandboxSubGrad)"
              fontFamily="JetBrains Mono, monospace"
              fontSize="20"
              fontWeight="800"
              letterSpacing="3"
            >
              CERTIFICATE OF PARTICIPATION
            </text>
          </svg>
        </div>

        <p className="text-[11px] text-text-muted font-mono tracking-wider uppercase">
          This is to certify that
        </p>

        {/* Attendee Name with elegant styling */}
        <div className="relative py-1 w-full border-b border-blue-500/10">
          <div className="w-full drop-shadow-[0_0_12px_rgba(56,189,248,0.25)]">
            <svg viewBox="0 0 800 65" className="w-full h-auto">
              <defs>
                <linearGradient id="sandboxNameGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="50%" stopColor="#E2E8F0" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
              </defs>
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="url(#sandboxNameGrad)"
                fontFamily="JetBrains Mono, monospace"
                fontSize="38"
                fontWeight="900"
                letterSpacing="1"
              >
                {attendee.name.toUpperCase()}
              </text>
            </svg>
          </div>
        </div>

        <p className="text-[12px] leading-relaxed text-text-muted font-mono uppercase tracking-wider max-w-2xl">
          has successfully participated in the workshop <span className="text-white font-bold">Open Sandbox Development</span>, an immersive hands-on training on sandbox environments conducted by <span className="text-blue-400 font-bold">ExploitX</span> at Chennai Institute of Technology, held on <span className="text-white font-bold">August 01, 2026</span>.
        </p>
      </div>

      {/* Bottom Footer Section */}
      <div className="relative flex justify-between items-end z-10 border-t border-white/5 pt-3">
        {/* Left: Date Node & Cert ID */}
        <div className="space-y-1 text-left min-w-[130px]">
          <span className="text-[9px] text-text-dim block uppercase tracking-widest font-mono">Date of Issue</span>
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider font-mono">{issueDate}</span>
          <span className="text-[9px] text-blue-400 block font-mono font-bold tracking-wider mt-1">ID: {displayCertId}</span>
        </div>

        {/* Right: Signature Area */}
        <div className="flex gap-8 min-w-[130px] justify-end">
          <div className="space-y-1 text-center">
            {/* Real Principal Signature Image */}
            <div className="h-8 flex items-center justify-center relative">
              <Image
                src="/principal_sig.png"
                alt="Principal Signature"
                width={85}
                height={35}
                className="object-contain brightness-125 saturate-150 contrast-125"
              />
            </div>
            <div className="w-28 border-t border-white/10" />
            <span className="text-[8px] text-text-dim block uppercase tracking-widest font-mono">Principal / Coordinator</span>
          </div>
        </div>
      </div>
    </div>
  );
}
