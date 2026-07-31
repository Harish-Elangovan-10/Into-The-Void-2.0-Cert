"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import OxconCertificateTemplate from "@/components/0xconCertificateTemplate";
import AnimatedBorder from "@/components/AnimatedBorder";
import { Download, LogOut, ShieldCheck } from "lucide-react";

interface Attendee {
  name: string;
  email: string;
  certificateId: string;
}

export default function OxconCertificatePage() {
  const router = useRouter();
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("0xcon_participant");
    if (!sessionData) {
      router.push("/0xcon");
    } else {
      setAttendee(JSON.parse(sessionData));
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("0xcon_participant");
    router.push("/0xcon");
  };

  const handleDownload = async () => {
    if (!attendee || downloading) return;
    setDownloading(true);

    try {
      const element = document.getElementById("certificate-print-area");
      if (!element) throw new Error("Certificate element not found");

      // Render the DOM element into a high-res canvas (scale 3 for high DPI print quality)
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
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
      pdf.save(`0xCON_2026_Certificate_${attendee.name.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  if (!attendee) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 font-mono text-xs text-text-muted">
        <span>// SECURING_ROUTE: REDIRECTING_UNAUTHORIZED...</span>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center max-w-5xl mx-auto w-full p-6 space-y-6 animate-fade-in">
      
      {/* Top Action Bar */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <Image
            src="/logo_exploitx.png"
            alt="ExploitX Logo"
            width={100}
            height={48}
            className="object-contain"
          />
          <div className="text-left font-mono">
            <h1 className="text-sm font-bold text-text uppercase tracking-wider">
              0xCON Summit Verification Node
            </h1>
            <p className="text-[10px] text-text-dim uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Attendee: {attendee.email}
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
            {downloading ? "GENERATING_PDF..." : (
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

      {/* Main Certificate Showcase Frame (scrollable on mobile) */}
      <div className="w-full">
        <AnimatedBorder className="w-full">
          <div className="p-4 md:p-8 bg-[#0D111B]/80 backdrop-blur-md max-lg:overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
            <div className="w-full flex justify-center">
              <OxconCertificateTemplate attendee={attendee} />
            </div>
          </div>
        </AnimatedBorder>
      </div>

      {/* Footer Info */}
      <div className="w-full font-mono text-[10px] text-text-dim/80 space-y-1 bg-[#0D111B]/30 border border-white/5 rounded-lg p-4">
        <p className="text-highlight font-bold uppercase tracking-wider mb-1">// TRANSMISSION_METADATA</p>
        <p>&gt; VERIFIED_REF: {attendee.certificateId}</p>
        <p>&gt; EVENT: 0XCON_CYBERSECURITY_SUMMIT_JULY_2026</p>
        <p>&gt; ORG_ROOT: EXPLOITX_CIT_CHENNAI</p>
        <p>&gt; AUTH: SUCCESSFUL_VERIFICATION</p>
      </div>

    </main>
  );
}
