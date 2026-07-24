"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AnimatedBorder from "@/components/AnimatedBorder";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("// SYSTEM_READY: WAITING_FOR_INPUT");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client-side session check
  useEffect(() => {
    const verifiedUser = sessionStorage.getItem("void_participant");
    if (verifiedUser) {
      router.push("/certificate");
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
    setStatusMessage("// STATUS: CONNECTING_TO_VOID_DB...");

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setStatusMessage("// STATUS: ACCESS_GRANTED. REDIRECTING...");
      sessionStorage.setItem("void_participant", JSON.stringify(data.participant));
      
      // Delay redirection slightly for transition aesthetics
      setTimeout(() => {
        router.push("/certificate");
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
            className="mb-6 drop-shadow-[0_0_8px_rgba(123,97,255,0.4)]"
            priority
          />
          <h1 className="font-mono font-black tracking-widest text-2xl uppercase bg-clip-text text-transparent bg-gradient-to-r from-text via-text to-primary drop-shadow-[0_0_15px_rgba(123,97,255,0.3)]">
            INTO THE VOID <span className="text-secondary">2.0</span>
          </h1>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-text-muted mt-2">
            Reality Was Never Singular.
          </p>
        </div>

        {/* Console Box */}
        <AnimatedBorder className="w-full">
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <span className="text-highlight font-bold block uppercase tracking-widest text-[11px] font-mono">
                {"// VERIFICATION_NODE"}
              </span>
              <p className="text-xs text-text-muted font-mono leading-relaxed">
                Enter the email address registered for the event to fetch and generate your certificate.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[11px] font-mono uppercase tracking-wider text-text-muted font-bold">
                  Participant Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="name@domain.com"
                  className="w-full bg-[#05060A] border border-white/5 focus:border-primary/50 text-text font-mono text-sm px-4 py-3 rounded-md outline-none transition-all duration-200"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs rounded-lg animate-pulse-soft">
                  Error: {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group active:scale-[0.98] transition-all duration-200"
              >
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-full py-3.5 bg-gradient-to-r from-primary via-accent to-secondary text-white font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-md flex items-center justify-center border border-white/10 hover:border-white/20 transition-all duration-200">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      VERIFYING...
                    </span>
                  ) : (
                    "INITIALIZE ACCESS"
                  )}
                </div>
              </button>
            </form>
          </div>
        </AnimatedBorder>

        {/* Telemetry Output */}
        <div className="mt-8 w-full font-mono text-[10px] text-text-dim/80 space-y-1.5 px-2">
          <div>{statusMessage}</div>
          <div className="flex justify-between border-t border-white/5 pt-2">
            <span>SECURE_CONNECTION: AES_256</span>
            <span className="text-rose-500/80 font-bold">V2.0_CONVERGED</span>
          </div>
        </div>

      </div>
    </main>
  );
}
