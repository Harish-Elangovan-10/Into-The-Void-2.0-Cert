"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Participant {
  name: string;
  email: string;
  eventRole: string;
  certificateId: string;
  teamName: string;
}



interface CertificateTemplateProps {
  participant: Participant;
}

export default function CertificateTemplate({ participant }: CertificateTemplateProps) {
  const [displayCertId, setDisplayCertId] = useState(participant.certificateId);
  const [issueDate, setIssueDate] = useState("July 31, 2026");

  // Deterministic hashing of the email to create a stable, unique 5-digit number
  const hashEmailToNumber = (emailStr: string): number => {
    let hash = 5381;
    const lowerEmail = emailStr.toLowerCase().trim();
    for (let i = 0; i < lowerEmail.length; i++) {
      hash = (hash * 33) ^ lowerEmail.charCodeAt(i);
    }
    return (Math.abs(hash) % 90000) + 10000; // Returns a number between 10000 and 99999
  };

  useEffect(() => {
    const now = new Date();
    const pad = (num: number) => String(num).padStart(2, "0");
    
    // Extract base part (e.g. VOID-2.0)
    const parts = participant.certificateId.split("-");
    const base = parts.slice(0, 2).join("-"); // VOID-2.0
    
    // Hash email to generate a deterministic 5-digit ID suffix
    const hashedSuffix = hashEmailToNumber(participant.email);
    setDisplayCertId(`${base}-${hashedSuffix}`);

    // Generate dynamic issue date
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const formattedDate = `${months[now.getMonth()]} ${pad(now.getDate())}, ${now.getFullYear()}`;
    setIssueDate(formattedDate);
  }, [participant.certificateId, participant.email]);

  return (
    <div
      id="certificate-print-area"
      className="relative w-full aspect-[297/210] max-lg:w-[950px] max-lg:h-[671px] max-lg:min-w-[950px] max-lg:min-h-[671px] bg-[#05060A] text-text border border-white/10 flex flex-col justify-between p-12 overflow-hidden select-none"
      style={{
        background: "radial-gradient(circle at 5% 5%, rgba(123, 97, 255, 0.18) 0%, transparent 45%), radial-gradient(circle at 95% 95%, rgba(77, 168, 255, 0.18) 0%, transparent 45%), linear-gradient(to bottom, #0A0D1A 0%, #05060A 100%)",
        boxShadow: "0 0 50px rgba(123, 97, 255, 0.15)",
      }}
    >
      {/* Decorative Outer Cyber Border */}
      <div className="absolute inset-4 border border-white/5 pointer-events-none" />
      <div className="absolute inset-5 border border-primary/20 pointer-events-none" />

      {/* Cyberpunk corner brackets */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-highlight" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-highlight" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-highlight" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-highlight" />

      {/* Tech Grid Patterns in Background */}
      <div className="absolute inset-0 opacity-[0.03] grid-overlay pointer-events-none" />

      {/* Top Header Section (CIT Logo Left, Void Title Center, ExploitX Logo Right) */}
      <div className="relative grid grid-cols-12 items-center z-10 w-full">
        {/* Left column - CIT Logo */}
        <div className="col-span-3 flex justify-start">
          <Image
            src="/logo_cit.png"
            alt="CIT Logo"
            width={125}
            height={48}
            className="opacity-95 rounded-sm"
          />
        </div>
        
        {/* Center column - INTO THE VOID 2.0 Header Title */}
        <div className="col-span-6 flex justify-center w-full">
          <svg viewBox="0 0 500 55" className="w-full h-auto">
            <defs>
              <linearGradient id="voidHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4DA8FF" />
                <stop offset="50%" stopColor="#7DF9FF" />
                <stop offset="100%" stopColor="#7B61FF" />
              </linearGradient>
            </defs>
            {/* Vector Drop Shadow under heading text */}
            <text
              x="50%"
              y="54%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="#7B61FF"
              opacity="0.3"
              fontFamily="JetBrains Mono, monospace"
              fontSize="40"
              fontWeight="950"
              letterSpacing="2"
            >
              INTO THE VOID 2.0
            </text>
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="url(#voidHeaderGrad)"
              fontFamily="JetBrains Mono, monospace"
              fontSize="40"
              fontWeight="950"
              letterSpacing="2"
            >
              INTO THE VOID 2.0
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
            className="opacity-95"
          />
        </div>
      </div>

      {/* Main Content Section (Dual-Column layout) */}
      <div className="relative grid grid-cols-12 gap-8 items-center my-auto z-10 w-full">
        
        {/* Left Column - Mascot */}
        <div className="col-span-4 flex justify-center items-center relative h-full">
          <div className="w-full max-w-[175px] relative z-10">
            <Image
              src="/mascot.png"
              alt="Void Mascot"
              width={175}
              height={300}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right Column - Certificate Details */}
        <div className="col-span-8 text-left space-y-4">
          <div className="space-y-1">
            <div className="w-full">
              <svg viewBox="0 0 600 55" className="w-full h-auto">
                <defs>
                  <linearGradient id="certTitleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E8E8ED" />
                    <stop offset="65%" stopColor="#E8E8ED" />
                    <stop offset="100%" stopColor="#7B61FF" />
                  </linearGradient>
                </defs>
                {/* Vector Drop Shadow under title text */}
                <text
                  x="0"
                  y="53%"
                  dominantBaseline="middle"
                  textAnchor="start"
                  fill="#7B61FF"
                  opacity="0.25"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="26"
                  fontWeight="900"
                  letterSpacing="3"
                >
                  CERTIFICATE OF PARTICIPATION
                </text>
                <text
                  x="0"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="start"
                  fill="url(#certTitleGrad)"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="26"
                  fontWeight="900"
                  letterSpacing="3"
                >
                  CERTIFICATE OF PARTICIPATION
                </text>
              </svg>
            </div>
          </div>

          <p className="text-[10px] text-text-muted font-mono tracking-wide uppercase">
            This is to certify that
          </p>

          {/* Participant Name with elegant styling */}
          <div className="relative py-2 w-full">
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-transparent" />
            <div className="w-full">
              <svg viewBox="0 0 800 65" className="w-full h-auto">
                <defs>
                  <linearGradient id="nameGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7DF9FF" />
                    <stop offset="50%" stopColor="#E8E8ED" />
                    <stop offset="100%" stopColor="#7B61FF" />
                  </linearGradient>
                </defs>
                {/* Vector Drop Shadow under name text */}
                <text
                  x="0"
                  y="53%"
                  dominantBaseline="middle"
                  textAnchor="start"
                  fill="#120F17"
                  opacity="0.8"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="36"
                  fontWeight="900"
                  letterSpacing="1"
                >
                  {participant.name.toUpperCase()}
                </text>
                <text
                  x="0"
                  y="52%"
                  dominantBaseline="middle"
                  textAnchor="start"
                  fill="#7B61FF"
                  opacity="0.3"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="36"
                  fontWeight="900"
                  letterSpacing="1"
                >
                  {participant.name.toUpperCase()}
                </text>
                <text
                  x="0"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="start"
                  fill="url(#nameGrad)"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="36"
                  fontWeight="900"
                  letterSpacing="1"
                >
                  {participant.name.toUpperCase()}
                </text>
              </svg>
            </div>
          </div>

          {/* Team Name Info block */}
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-secondary font-bold">
            Team: <span className="text-highlight">{participant.teamName}</span>
          </div>

          <p className="text-[11px] leading-relaxed text-text-muted font-mono uppercase tracking-wider">
            has participated in <span className="text-text font-bold">Into the Void 2.0</span>, an international-level Capture The Flag event organized by <span className="text-primary font-bold">ExploitX</span> at Chennai Institute of Technology, held on <span className="text-text font-bold">July 18, 2026</span>.
          </p>
          
          <div className="text-left flex items-center justify-between mt-5">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider font-mono">Date of Issue: {issueDate}</span>
          <span className="text-[11px] text-[#7DF9FF]/80 block font-mono font-bold tracking-wider">ID: {displayCertId}</span>
      </div>
        </div>

      </div>
      

      {/* Bottom Footer Section */}
      <div className="relative flex justify-between items-end z-10">
        {/* Center: Combined Sponsor Logos Image in full original colors */}
        <div className="flex-1 mx-2 w-auto flex items-center justify-center">
          <div className="relative w-full h-[120px]">
            <Image
              src="/sponsors_combined.png"
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
                width={100}
                height={45}
                className="object-contain brightness-125 saturate-150 contrast-125"
              />
            </div>
            <div className="w-28 border-t border-white/10" />
            <span className="text-[10px] text-highlight block uppercase tracking-widest font-mono font-bold">Principal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
