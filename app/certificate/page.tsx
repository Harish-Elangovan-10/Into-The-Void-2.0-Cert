"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import CertificateTemplate from "@/components/CertificateTemplate";
import AnimatedBorder from "@/components/AnimatedBorder";
import { Download, LogOut, ArrowLeft, ShieldCheck } from "lucide-react";

interface Participant {
  name: string;
  email: string;
  eventRole: string;
  certificateId: string;
  teamName: string;
}

export default function CertificatePage() {
  const router = useRouter();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("void_participant");
    if (!sessionData) {
      router.push("/");
    } else {
      setParticipant(JSON.parse(sessionData));
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("void_participant");
    router.push("/");
  };

  const handleDownload = async () => {
    if (!participant || downloading) return;
    setDownloading(true);

    try {
      const element = document.getElementById("certificate-print-area");
      if (!element) throw new Error("Certificate element not found");

      // Render the DOM element into a high-res canvas (scale 3 for high DPI print quality)
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#05060A",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      // Generate A4 Landscape PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      pdf.save(`Void_2.0_Certificate_${participant.name.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  if (!participant) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 font-mono text-xs text-text-muted">
        <span>// SECURING_ROUTE: REDIRECTING_UNAUTHORIZED...</span>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center max-w-5xl mx-auto w-full p-6 space-y-6 animate-fade-in">
      
      {/* Top Telemetry Header / Action bar */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <Image
            src="/logo_exploitx.png"
            alt="ExploitX Logo"
            width={75}
            height={35}
            className="opacity-80 drop-shadow-[0_0_5px_rgba(123,97,255,0.2)]"
          />
          <div className="text-left font-mono">
            <h1 className="text-sm font-bold text-text uppercase tracking-wider">
              Certificate Node
            </h1>
            <p className="text-[10px] text-text-dim uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
              Verified Participant: {participant.email}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-accent border border-white/10 text-white font-mono text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-2 hover:border-white/20 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            {downloading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                GENERATING_PDF...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-surface border border-white/5 text-text-muted font-mono text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-2 hover:text-text hover:border-white/10 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Disconnect
          </button>
        </div>
      </div>

      {/* Main Certificate Showcase Frame */}
      <div className="w-full">
        <AnimatedBorder className="w-full">
          <div className="p-4 md:p-8 bg-[#0D111B]/80 backdrop-blur-md max-lg:overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
            <div className="w-full flex justify-center">
              <CertificateTemplate participant={participant} />
            </div>
          </div>
        </AnimatedBorder>
      </div>

      {/* Verification Instructions */}
      <div className="w-full font-mono text-[10px] text-text-dim/80 space-y-1 bg-[#0D111B]/30 border border-white/5 rounded-lg p-4">
        <p className="text-highlight font-bold uppercase tracking-wider mb-1">// TRANSMISSION_METADATA</p>
        <p>&gt; VERIFIED_REF: {participant.certificateId}</p>
        <p>&gt; EVENT: INTO_THE_VOID_2.0_CONVERGED_JULY_2026</p>
        <p>&gt; ORG_ROOT: EXPLOITX_CIT_CHENNAI</p>
        <p>&gt; HASH_LOCK: SUCCESSFUL_AUTH_PROTOCOL_COMPLETED</p>
      </div>

    </main>
  );
}
