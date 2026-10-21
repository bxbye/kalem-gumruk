import { companyInfo } from "@/data/company";

export default function StatsBar() {
  return (
    <div className="bg-[#121B27] border-y border-slate-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {companyInfo.stats.map((stat, idx) => (
            <div key={idx} className="p-3">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#44B9CD] tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
