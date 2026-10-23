"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Send, CheckCircle2, AlertCircle, Building2, User, Loader2 } from "lucide-react";

interface FeedbackItem {
  id: string;
  fullName: string;
  company?: string;
  rating: number;
  serviceType?: string;
  comment: string;
  createdAt: string;
}

export default function DegerlendirmePage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Form State
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState(5);
  const [serviceType, setServiceType] = useState("İthalat Gümrükleme");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    async function loadFeedbacks() {
      try {
        setLoadingList(true);
        const res = await fetch("/api/feedbacks?approvedOnly=true");
        const data = await res.json();
        if (data.success) {
          setFeedbacks(data.feedbacks);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingList(false);
      }
    }
    loadFeedbacks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          company,
          rating,
          serviceType,
          comment,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ success: true, message: data.message });
        setFullName("");
        setCompany("");
        setComment("");
        setRating(5);
      } else {
        setResult({ success: false, message: data.error || "Geri bildirim iletilemedi." });
      }
    } catch (err) {
      setResult({ success: false, message: "Bağlantı hatası oluştu." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Başlık */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>Müşteri Memnuniyeti</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2A3A]">
            Hizmet Kalitemizi Değerlendirin
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Gümrük operasyonlarımız, mevzuat danışmanlığımız ve müşteri deneyiminiz hakkındaki
            düşünceleriniz hizmet standartlarımızı daima bir adım ileri taşımamızı sağlar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Değerlendirme Formu */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#1E2A3A]">Görüşlerinizi Paylaşın</h2>
              <p className="text-xs text-slate-500 mt-1">
                Görüşleriniz incelendikten sonra referanslarımız arasında yer alabilir.
              </p>
            </div>

            {result && (
              <div
                className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                  result.success
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {result.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{result.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Yıldız Puanlama */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Genel Memnuniyet Puanınız <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">
                    {rating === 5 && "Mükemmel (5/5)"}
                    {rating === 4 && "Çok İyi (4/5)"}
                    {rating === 3 && "Orta (3/5)"}
                    {rating === 2 && "Geliştirilmeli (2/5)"}
                    {rating === 1 && "Yetersiz (1/5)"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Adınız Soyadınız <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Adınız Soyadınız"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD] transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Firma Unvanınız
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Örn: ABC Dış Ticaret Ltd."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD] transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Değerlendirdiğiniz Hizmet Alanı
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD] transition"
                >
                  <option value="İthalat Gümrükleme">İthalat Gümrükleme</option>
                  <option value="İhracat Gümrükleme">İhracat Gümrükleme</option>
                  <option value="Antrepo & Depolama">Antrepo & Depolama</option>
                  <option value="Mevzuat & Tarife Danışmanlığı">Mevzuat & Tarife Danışmanlığı</option>
                  <option value="Yetkilendirilmiş Yükümlü (YYS)">Yetkilendirilmiş Yükümlü (YYS)</option>
                  <option value="Genel Hizmet Kalitesi">Genel Hizmet Kalitesi</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Görüş ve Değerlendirmeniz <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Gümrükleme süreçlerimiz, ekibimizin iletişimi ve deneyiminiz hakkında neler düşünüyorsunuz?"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD] transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white font-bold rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Değerlendirmeyi Gönder</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Müşteri Yorumları & Referanslar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1E2A3A]">Müşteri Deneyimleri</h3>
              <span className="text-xs text-slate-500">Doğrulanmış Yorumlar</span>
            </div>

            {loadingList ? (
              <div className="p-8 text-center text-slate-400 text-xs">Yorumlar yükleniyor...</div>
            ) : feedbacks.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-500">
                  Henüz onaylanmış müşteri yorumu bulunmuyor. İlk değerlendirmeyi siz bırakabilirsiniz!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= fb.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      {fb.serviceType && (
                        <span className="text-[10px] font-semibold text-[#44B9CD] bg-[#44B9CD]/10 px-2 py-0.5 rounded">
                          {fb.serviceType}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      "{fb.comment}"
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-slate-900">{fb.fullName}</span>
                      <span>{fb.company || "Kurumsal Müşteri"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
