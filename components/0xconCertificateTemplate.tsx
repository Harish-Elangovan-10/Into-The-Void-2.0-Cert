"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Attendee {
  name: string;
  email: string;
  certificateId: string;
}

interface OxconCertificateTemplateProps {
  attendee: Attendee;
}

export default function OxconCertificateTemplate({ attendee }: OxconCertificateTemplateProps) {
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
    setDisplayCertId(`0xCON-2026-${hashedSuffix}`);

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
      className="relative w-full aspect-[297/210] max-lg:w-[950px] max-lg:h-[671px] max-lg:min-w-[950px] max-lg:min-h-[671px] bg-white text-slate-900 border border-slate-200 flex flex-col justify-between p-12 overflow-hidden select-none"
      style={{
        background: "radial-gradient(circle at 10% 10%, #FCFDFE 0%, #F4F6F9 100%)",
        boxShadow: "0 0 40px rgba(15, 23, 42, 0.08)",
      }}
    >
      {/* Decorative Outer Slate Border */}
      <div className="absolute inset-4 border border-slate-200 pointer-events-none" />
      <div className="absolute inset-5 border border-slate-300/60 pointer-events-none" />

      {/* Professional corner brackets */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-slate-700" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-slate-700" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-slate-700" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-slate-700" />

      {/* Tech Grid Patterns in Background (subtle light grey) */}
      <div className="absolute inset-0 opacity-[0.02] grid-overlay-light pointer-events-none" />

      {/* Top Header Section (CIT Logo Left, 0xCON Title Center, ExploitX Logo Right) */}
      <div className="relative grid grid-cols-12 items-center z-10 w-full">
        {/* Left column - CIT Logo */}
        <div className="col-span-3 flex justify-start">
          <Image
            src="/logo_cit.png"
            alt="CIT Logo"
            width={125}
            height={48}
            className="object-contain"
          />
        </div>
        
        {/* Center column - 0xCON Summit Header Title */}
        <div className="col-span-6 flex justify-center w-full drop-shadow-sm">
          <svg viewBox="0 0 500 55" className="w-full h-auto">
            <defs>
              <linearGradient id="oxconHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="50%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="url(#oxconHeaderGrad)"
              fontFamily="JetBrains Mono, monospace"
              fontSize="34"
              fontWeight="900"
              letterSpacing="1.5"
            >
              0xCON SUMMIT 2026
            </text>
          </svg>
        </div>

        {/* Right column - ExploitX Logo */}
        <div className="col-span-3 flex justify-end">
          <Image
            src="/logo_black_exploitx.png"
            alt="ExploitX Logo"
            width={85}
            height={40}
            className="object-contain"
          />
        </div>
      </div>

      {/* Main Content Section (Centered layout) */}
      <div className="relative flex flex-col items-center text-center my-auto z-10 w-full space-y-6 max-w-3xl mx-auto">
        
        <div className="space-y-1 w-full">
          <svg viewBox="0 0 800 45" className="w-full h-auto">
            <defs>
              <linearGradient id="oxconSubGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="url(#oxconSubGrad)"
              fontFamily="JetBrains Mono, monospace"
              fontSize="20"
              fontWeight="800"
              letterSpacing="3"
            >
              CERTIFICATE OF ATTENDANCE
            </text>
          </svg>
        </div>

        <p className="text-[11px] text-slate-500 font-mono tracking-wider uppercase font-semibold">
          This is to certify that
        </p>

        {/* Attendee Name with elegant styling */}
        <div className="relative py-1 w-full border-b border-slate-200">
          <div className="w-full drop-shadow-sm">
            <svg viewBox="0 0 800 65" className="w-full h-auto">
              <defs>
                <linearGradient id="oxconNameGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1E3A8A" />
                  <stop offset="50%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#1E3A8A" />
                </linearGradient>
              </defs>
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="url(#oxconNameGrad)"
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

        <p className="text-[12px] leading-relaxed text-slate-600 font-mono uppercase tracking-wider max-w-2xl">
          has attended the <span className="text-slate-900 font-bold">0xCON 2026 Cybersecurity Summit</span>, a prestigious gathering of cyber security researchers, developers, and industry experts organized by <span className="text-blue-900 font-bold">ExploitX</span> at Chennai Institute of Technology, held on <span className="text-slate-900 font-bold">August 01, 2026</span>.
        </p>
      </div>

      {/* Bottom Footer Section */}
      <div className="relative flex justify-between items-end z-10 border-t border-slate-200 pt-3">
        {/* Left: Date Node & Cert ID */}
        <div className="space-y-1 text-left min-w-[130px]">
          <span className="text-[9px] text-slate-400 block uppercase tracking-widest font-mono font-bold">Date of Issue</span>
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">{issueDate}</span>
          <span className="text-[9px] text-blue-700 block font-mono font-bold tracking-wider mt-1">ID: {displayCertId}</span>
        </div>

        {/* Center: Combined Sponsor Logos Image for 0xCON */}
        <div className="flex-1 px-4 mx-2 max-w-[440px] flex items-center justify-center">
          <div className="relative w-full h-[55px]">
            <Image
              src="/sponsors_0xcon.png"
              alt="Official Event Sponsors"
              fill
              className="object-contain"
              priority
            />
          </div>
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
                className="object-contain contrast-125"
              />
            </div>
            <div className="w-28 border-t border-slate-300" />
            <span className="text-[8px] text-slate-400 block uppercase tracking-widest font-mono font-bold">Principal / Coordinator</span>
          </div>
        </div>
      </div>
    </div>
  );
}
