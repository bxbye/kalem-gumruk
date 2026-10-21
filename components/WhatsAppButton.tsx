"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { companyInfo } from "@/data/company";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
    companyInfo.whatsappDefaultMessage
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      {/* Mini Karşılama Balonu */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-slate-800 text-xs py-2 px-3.5 rounded-2xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
          <div>
            <div className="font-bold text-slate-900">Gümrük Müşavirine Yazın</div>
            <div className="text-[11px] text-slate-500">İthalat / İhracat için hızlı destek</div>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 ml-1 p-0.5"
            aria-label="Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Ana Buton */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile iletişime geçin"
        className="group relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping group-hover:opacity-0"></span>
        <MessageCircle className="w-7 h-7 relative z-10 fill-current" />
      </a>
    </div>
  );
}
