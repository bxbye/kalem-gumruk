"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, RefreshCw, CheckCircle2 } from "lucide-react";

interface HumanVerificationProps {
  label?: string;
  placeholder?: string;
  refreshText?: string;
  value: string;
  onChange: (token: string, answer: string) => void;
  isRTL?: boolean;
}

export default function HumanVerification({
  label = "Güvenlik Doğrulaması (İnsan Doğrulaması)",
  placeholder = "Sonuç",
  refreshText = "Yenile",
  value,
  onChange,
  isRTL = false,
}: HumanVerificationProps) {
  const [token, setToken] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/public/challenge");
      const data = await res.json();
      if (data.success && data.challenge) {
        setToken(data.challenge.token);
        setQuestion(data.challenge.question);
        onChange(data.challenge.token, "");
      }
    } catch (err) {
      console.error("[Human Verification Fetch Error]:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, []);

  return (
    <div className="space-y-1.5 p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl">
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold text-slate-700 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#1E2A3A]" />
          <span>{label}</span>
          <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={fetchChallenge}
          disabled={loading}
          className="text-[11px] text-[#44B9CD] hover:text-[#1E2A3A] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          title={refreshText}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{refreshText}</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-mono text-sm font-bold text-[#1E2A3A] tracking-wider select-none shadow-xs">
          {question || "..."}
        </div>
        <input
          type="number"
          required
          dir={isRTL ? "rtl" : "ltr"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(token, e.target.value)}
          className="flex-1 max-w-[140px] px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#44B9CD] focus:ring-2 focus:ring-[#44B9CD]/20 text-slate-900 bg-white transition-all font-mono font-bold"
        />
        {value && (
          <span className="text-emerald-600 text-xs flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        )}
      </div>
    </div>
  );
}
