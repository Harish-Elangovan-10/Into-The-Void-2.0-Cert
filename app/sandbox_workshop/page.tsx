"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AnimatedBorder from "@/components/AnimatedBorder";

export default function SandboxLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("// SYSTEM_READY: WAITING_FOR_INPUT");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client-side session check
  useEffect(() => {
    const verifiedUser = sessionStorage.getItem("sandbox_participant");
    if (verifiedUser) {
      router.push("/sandbox_workshop/certificate");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Simple debounce/rate-limiting
    setIsSubmitting(true);
    setError("");

    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setStatusMessage("// STATUS: VALIDATION_FAILED");
      setIsSubmitting(false);
      return;
    }

    setLoading(true);
    setStatusMessage("// STATUS: CONNECTING_TO_SANDBOX_DB...");

    try {
      const response = await fetch("/api/verify-sandbox-workshop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setStatusMessage("// STATUS: ACCESS_GRANTED. REDIRECTING...");
      sessionStorage.setItem("sandbox_participant", JSON.stringify(data.attendee));
      
      // Delay redirection slightly for transition aesthetics
      setTimeout(() => {
        router.push("/sandbox_workshop/certificate");
      }, 500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setStatusMessage("// STATUS: ACCESS_DENIED");
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8 text-center animate-fade-in">
          <Image
            src="/logo_exploitx.png"
            alt="ExploitX Logo"
            width={120}
            height={60}
            className="mb-6 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]"
            priority
          />
          <h1 className="font-mono font-black tracking-widest text-2xl uppercase bg-clip-text text-transparent bg-gradient-to-r from-text via-text to-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            SANDBOX <span className="text-blue-400">2026</span>
          </h1>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted mt-2">
            OPEN SANDBOX DEVELOPMENT NODE
          </p>
        </div>

        {/* Console Box */}
        <AnimatedBorder className="w-full">
          <div className="p-8 space-y-6 bg-surface/80 backdrop-blur-md">
            <div className="space-y-2">
              <span className="text-blue-400 font-bold block uppercase tracking-widest text-[11px] font-mono">
                {"// VERIFICATION_NODE"}
              </span>
              <p className="text-xs text-text-muted font-mono leading-relaxed">
                Enter your registered event email address to retrieve and download your official Open Sandbox Development Workshop participation certificate.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  disabled={loading}
                  className="w-full font-mono text-sm px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-text placeholder-text-dim outline-none focus:border-blue-400 transition duration-200"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 font-mono text-xs rounded-lg uppercase tracking-wider">
                  &gt; ERROR: {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:border-white/20 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {loading ? "VERIFYING_CREDENTIALS..." : "INITIALIZE ACCESS"}
              </button>
            </form>
          </div>
        </AnimatedBorder>

        {/* Terminal Status bar */}
        <div className="mt-6 w-full text-center">
          <span className="font-mono text-[10px] text-text-dim/60 uppercase tracking-widest">
            {statusMessage}
          </span>
        </div>
      </div>
    </main>
  );
}
