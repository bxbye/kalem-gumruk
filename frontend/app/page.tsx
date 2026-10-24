"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      // 1. Kayıtlı dil tercihi (Cookie)
      const match = document.cookie.match(new RegExp("(^| )kalem_lang=([^;]+)"));
      const saved = match ? match[2] : null;
      if (saved && ["tr", "en", "ar", "es"].includes(saved)) {
        router.replace(`/${saved}`);
        return;
      }

      // 2. Tarayıcı dili kontrolü
      const navLang = navigator.language?.toLowerCase() || "";
      if (navLang.startsWith("en")) {
        router.replace("/en");
        return;
      }
      if (navLang.startsWith("ar")) {
        router.replace("/ar");
        return;
      }
      if (navLang.startsWith("es")) {
        router.replace("/es");
        return;
      }
    } catch {}

    // Varsayılan Türkçe
    router.replace("/tr");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1528] text-white">
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/tr" />
      </noscript>
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-[#44B9CD] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-300 font-medium">Yönlendiriliyorsunuz... / Redirecting...</p>
      </div>
    </div>
  );
}
