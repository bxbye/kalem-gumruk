"use client";

import { useState } from "react";
import { customsTools } from "@/data/tools";
import {
  LayoutDashboard,
  ShieldCheck,
  FileCheck2,
  Search,
  Coins,
  Globe,
  Ship,
  Anchor,
  PhoneCall,
  ExternalLink,
} from "lucide-react";

const toolIconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  FileCheck2: <FileCheck2 className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  Coins: <Coins className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Ship: <Ship className="w-5 h-5" />,
  Anchor: <Anchor className="w-5 h-5" />,
  PhoneCall: <PhoneCall className="w-5 h-5" />,
};

export default function ToolsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");

  const categories = [
    "Tümü",
    "Gümrük & Bakanlık",
    "Kurlar & Finans",
    "Birlikler & Denetim",
    "Liman & Lojistik",
  ];

  const filteredTools =
    selectedCategory === "Tümü"
      ? customsTools
      : customsTools.filter((tool) => tool.category === selectedCategory);

  return (
    <section className="py-20 bg-white" id="araclar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#44B9CD]/10 text-[#44B9CD] text-xs font-bold uppercase tracking-wider">
            Sektörel Pratik Masası
          </div>
          <h2 className="text-3xl font-extrabold text-[#1E2A3A] sm:text-4xl">
            Gümrükçü Masası & Faydalı Bağlantılar
          </h2>
          <p className="text-sm text-slate-600">
            Dış ticaret uzmanlarının, müşavirlerimizin ve operasyon ekiplerinin mesaide en sık
            kullandığı resmi sistem ve sorgulama platformlarına hızlı erişim.
          </p>

          {/* Kategori Filtresi */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#1E2A3A] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Araç Kartları Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-[#44B9CD]/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-[#1E2A3A] text-[#1E2A3A] group-hover:text-[#44B9CD] flex items-center justify-center shadow-xs transition-colors border border-slate-200 group-hover:border-transparent">
                    {toolIconMap[tool.iconName] || <Search className="w-5 h-5" />}
                  </div>
                  {tool.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#44B9CD]/15 text-[#1E2A3A]">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#44B9CD] transition-colors flex items-center gap-1.5">
                    <span>{tool.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#44B9CD]" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>{tool.category}</span>
                <span className="text-[#44B9CD] font-medium group-hover:underline">Sisteme Git →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
