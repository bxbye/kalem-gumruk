"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Sparkles,
  Tag,
  ShieldCheck,
  Inbox,
  Briefcase,
  Users,
  Star,
  MessageSquare,
  Plus,
  Trash2,
  Eye,
  Download,
  Settings,
  Clock,
  Search,
  Filter,
  RefreshCw,
  X,
  FileDown,
} from "lucide-react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "submissions" | "forms" | "documents" | "sirkuler" | "feedbacks" | "chat"
  >("dashboard");

  // Veri Stateleri
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [formsList, setFormsList] = useState<any[]>([]);
  const [documentsList, setDocumentsList] = useState<any[]>([]);
  const [sirkulerList, setSirkulerList] = useState<any[]>([]);
  const [feedbacksList, setFeedbacksList] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Modal ve Seçim Stateleri
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [subFilter, setSubFilter] = useState("ALL");
  const [adminNoteInput, setAdminNoteInput] = useState("");

  // Sirküler Ekleme Form State
  const [sirkulerForm, setSirkulerForm] = useState({
    title: "",
    category: "İthalat & Vergi",
    regulationType: "Cumhurbaşkanı Kararı",
    officialGazetteNumber: "",
    relatedGtip: "",
    summary: "",
    content: "",
    expertNote: "",
    sourceUrl: "",
    pdfUrl: "",
  });
  const [sirkulerSubmitting, setSirkulerSubmitting] = useState(false);
  const [sirkulerResult, setSirkulerResult] = useState<{ success: boolean; message: string } | null>(null);

  // Belge Yükleme Form State
  const [docForm, setDocForm] = useState({
    title: "",
    description: "",
    category: "SERTIFIKA",
    fileUrl: "",
    fileSize: "1.2 MB",
    fileType: "pdf",
  });
  const [docFileUploading, setDocFileUploading] = useState(false);
  const [docResult, setDocResult] = useState<{ success: boolean; message: string } | null>(null);

  // Yeni Form Oluşturma State (Form Builder)
  const [newFormModalOpen, setNewFormModalOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    title: "",
    slug: "",
    description: "",
    category: "custom",
    autoEmailSubject: "Talebiniz Alındı | Kalem Gümrük",
    autoEmailBody: "Sayın Yetkili,\n\nTalebiniz alınmıştır.",
    fields: [
      { name: "fullName", label: "Ad Soyad", type: "text", required: true, placeholder: "Ad Soyad" },
      { name: "phone", label: "Telefon", type: "tel", required: true, placeholder: "05XX XXX XX XX" },
      { name: "message", label: "Detaylar", type: "textarea", required: true, placeholder: "Mesajınız..." },
    ],
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setLoginError("Lütfen yönetici şifresini giriniz.");
      return;
    }
    setIsLoggedIn(true);
    setLoginError("");
    loadAllAdminData();
  };

  const loadAllAdminData = async () => {
    setLoadingData(true);
    try {
      // 1. Form Yanıtlarını Çek
      const subRes = await fetch("/api/submissions");
      const subData = await subRes.json();
      if (subData.success) setSubmissions(subData.submissions);

      // 2. Form Tanımlarını Çek
      const formRes = await fetch("/api/forms");
      const formData = await formRes.json();
      if (formData.success) setFormsList(formData.forms);

      // 3. Belgeleri Çek
      const docRes = await fetch("/api/documents");
      const docData = await docRes.json();
      if (docData.success) setDocumentsList(docData.documents);

      // 4. Sirkülerleri Çek
      const sirkulerRes = await fetch("/api/forms/fiyat-teklifi"); // ping
      // sirkuler listesi için lib veya API
      // Doğrudan sayfadan çekebilir veya API
      // 5. Müşteri Yorumlarını Çek
      const fbRes = await fetch("/api/feedbacks");
      const fbData = await fbRes.json();
      if (fbData.success) setFeedbacksList(fbData.feedbacks);
    } catch (err) {
      console.error("Veri yükleme hatası:", err);
    } finally {
      setLoadingData(false);
    }
  };

  // Başvuru Durumunu Güncelle
  const updateSubmissionStatus = async (id: string, status: string, notes?: string) => {
    try {
      const res = await fetch("/api/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, id, status, adminNotes: notes }),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status, adminNotes: notes || s.adminNotes } : s))
        );
        if (selectedSubmission && selectedSubmission.id === id) {
          setSelectedSubmission((prev: any) => ({ ...prev, status, adminNotes: notes || prev.adminNotes }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Başvuru Sil
  const deleteSubmission = async (id: string) => {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/submissions?id=${id}&password=${encodeURIComponent(password)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        setSelectedSubmission(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Sirküler Kaydet
  const handleSirkulerPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setSirkulerSubmitting(true);
    setSirkulerResult(null);

    try {
      const res = await fetch("/api/admin/sirkuler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ...sirkulerForm }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSirkulerResult({ success: true, message: data.message });
        setSirkulerForm({
          title: "",
          category: "İthalat & Vergi",
          regulationType: "Cumhurbaşkanı Kararı",
          officialGazetteNumber: "",
          relatedGtip: "",
          summary: "",
          content: "",
          expertNote: "",
          sourceUrl: "",
          pdfUrl: "",
        });
      } else {
        setSirkulerResult({ success: false, message: data.error || "Hata oluştu." });
      }
    } catch (err) {
      setSirkulerResult({ success: false, message: "Bağlantı hatası." });
    } finally {
      setSirkulerSubmitting(false);
    }
  };

  // Belge Dosyası Yükleme (R2 / Upload)
  const handleDocFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setDocFileUploading(true);
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success && data.file) {
        setDocForm((prev) => ({
          ...prev,
          fileUrl: data.file.url,
          fileSize: data.file.size,
          fileType: data.file.type,
          title: prev.title || data.file.name.replace(/\.[^/.]+$/, ""),
        }));
      }
    } catch (err) {
      alert("Dosya yüklenemedi.");
    } finally {
      setDocFileUploading(false);
    }
  };

  // Belge Kaydet
  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ...docForm }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDocResult({ success: true, message: "Belge başarıyla eklendi." });
        setDocForm({
          title: "",
          description: "",
          category: "SERTIFIKA",
          fileUrl: "",
          fileSize: "1.2 MB",
          fileType: "pdf",
        });
        loadAllAdminData();
      } else {
        setDocResult({ success: false, message: data.error || "Eklenemedi." });
      }
    } catch (err) {
      setDocResult({ success: false, message: "Hata." });
    }
  };

  // Belge Sil
  const handleDeleteDoc = async (id: string) => {
    if (!confirm("Bu belgeyi silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/documents?id=${id}&password=${encodeURIComponent(password)}`, {
        method: "DELETE",
      });
      setDocumentsList((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Yorum Onayla / Gizle
  const handleToggleFeedback = async (id: string, currentApproved: boolean) => {
    try {
      await fetch("/api/feedbacks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, id, isApproved: !currentApproved }),
      });
      setFeedbacksList((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isApproved: !currentApproved } : f))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Form Builder: Yeni Formu Kaydet
  const handleCreateNewForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          title: newForm.title,
          slug: newForm.slug,
          description: newForm.description,
          category: newForm.category,
          fields: newForm.fields,
          settings: {
            autoEmailSubject: newForm.autoEmailSubject,
            autoEmailBody: newForm.autoEmailBody,
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Yeni form başarıyla oluşturuldu!");
        setNewFormModalOpen(false);
        loadAllAdminData();
      } else {
        alert(data.error || "Form oluşturulamadı.");
      }
    } catch (err) {
      alert("Hata oluştu.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700/80 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#44B9CD]/10 text-[#44B9CD] border border-[#44B9CD]/20 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Kalem Gümrük Operasyon Paneli
            </h1>
            <p className="text-xs text-slate-400">
              Veritabanı, gelen teklifler, CV başvuruları ve mevzuat CMS yönetimi.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Yönetici Şifresi</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#44B9CD] transition"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#44B9CD] hover:bg-[#389eb0] text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md"
            >
              Yönetim Paneline Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtrelenmiş Talepler
  const filteredSubmissions = submissions.filter((sub) => {
    if (subFilter === "ALL") return true;
    return sub.formSlug === subFilter;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Üst Bar */}
      <header className="bg-[#1E2A3A] text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#44B9CD] text-[#1E2A3A] font-extrabold flex items-center justify-center text-sm shadow">
            KG
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">
              Kalem Gümrük Müşavirliği
            </h1>
            <span className="text-[11px] text-[#44B9CD] font-medium">
              Operasyon & Veritabanı Yönetim Merkezi
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllAdminData}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? "animate-spin" : ""}`} />
            <span>Yenile</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Siteyi Aç</span>
          </Link>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/50 text-red-300 text-xs font-semibold transition"
          >
            Çıkış Yap
          </button>
        </div>
      </header>

      {/* Ana Navigasyon Sekmeleri */}
      <div className="bg-white border-b border-slate-200 px-6 py-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "dashboard"
                ? "bg-[#1E2A3A] text-[#44B9CD]"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Genel Bakış</span>
          </button>

          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "submissions"
                ? "bg-[#1E2A3A] text-[#44B9CD]"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Gelen Talepler & CRM</span>
            {submissions.filter((s) => s.status === "NEW").length > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {submissions.filter((s) => s.status === "NEW").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("forms")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "forms"
                ? "bg-[#1E2A3A] text-[#44B9CD]"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Form Yöneticisi (Builder)</span>
          </button>

          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "documents"
                ? "bg-[#1E2A3A] text-[#44B9CD]"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Belgeler & Sertifikalar</span>
          </button>

          <button
            onClick={() => setActiveTab("sirkuler")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "sirkuler"
                ? "bg-[#1E2A3A] text-[#44B9CD]"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Mevzuat & Sirküler CMS</span>
          </button>

          <button
            onClick={() => setActiveTab("feedbacks")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "feedbacks"
                ? "bg-[#1E2A3A] text-[#44B9CD]"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Müşteri Memnuniyeti ({feedbacksList.length})</span>
          </button>
        </div>
      </div>

      {/* Sekme İçerikleri */}
      <main className="p-6 max-w-7xl mx-auto w-full flex-1">
        {/* 1. DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Sayaçlar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => {
                  setActiveTab("submissions");
                  setSubFilter("fiyat-teklifi");
                }}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-[#44B9CD] transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Teklif Talepleri</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Inbox className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-[#1E2A3A] mt-2">
                  {submissions.filter((s) => s.formSlug === "fiyat-teklifi").length}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">
                  {submissions.filter((s) => s.formSlug === "fiyat-teklifi" && s.status === "NEW").length} yeni bekliyor
                </span>
              </div>

              <div
                onClick={() => {
                  setActiveTab("submissions");
                  setSubFilter("kariyer-staj");
                }}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-[#44B9CD] transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">İş & Staj (CV)</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-[#1E2A3A] mt-2">
                  {submissions.filter((s) => s.formSlug === "kariyer-staj").length}
                </div>
                <span className="text-[11px] text-slate-400">Özgeçmiş havuzu</span>
              </div>

              <div
                onClick={() => setActiveTab("documents")}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-[#44B9CD] transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Yüklü Belgeler</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-[#1E2A3A] mt-2">
                  {documentsList.length}
                </div>
                <span className="text-[11px] text-slate-400">İndirilebilir evrak</span>
              </div>

              <div
                onClick={() => setActiveTab("feedbacks")}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-[#44B9CD] transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Müşteri Yorumları</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-[#1E2A3A] mt-2">
                  {feedbacksList.length}
                </div>
                <span className="text-[11px] text-slate-400">
                  {feedbacksList.filter((f) => f.isApproved).length} sitede yayında
                </span>
              </div>
            </div>

            {/* Son Gelen Talepler Özeti */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#1E2A3A]">Son Gelen Talepler</h3>
                  <p className="text-xs text-slate-500">Siteden iletilen en güncel formlar ve başvurular</p>
                </div>
                <button
                  onClick={() => setActiveTab("submissions")}
                  className="text-xs font-bold text-[#44B9CD] hover:underline"
                >
                  Tümünü Gör ({submissions.length}) →
                </button>
              </div>

              {submissions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">Henüz gelen talep bulunmuyor.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {submissions.slice(0, 5).map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubmission(sub);
                        setAdminNoteInput(sub.adminNotes || "");
                      }}
                      className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">{sub.id}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {sub.formSlug}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600">
                          {sub.data.fullName || "İsimsiz"} - {sub.data.company || sub.data.phone || "-"}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            sub.status === "NEW"
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {sub.status === "NEW" ? "YENİ TALEP" : sub.status}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {new Date(sub.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. GELEN TALEPLER & CRM */}
        {activeTab === "submissions" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {["ALL", "fiyat-teklifi", "kariyer-staj", "iletisim"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSubFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      subFilter === cat
                        ? "bg-[#1E2A3A] text-[#44B9CD]"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat === "ALL" ? "Tüm Talepler" : cat}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Toplam {filteredSubmissions.length} kayıt listeleniyor
              </span>
            </div>

            {/* Tablo */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Referans / ID</th>
                      <th className="py-3 px-4">Form Türü</th>
                      <th className="py-3 px-4">Kişi / Firma</th>
                      <th className="py-3 px-4">İletişim</th>
                      <th className="py-3 px-4">Ekli Dosya</th>
                      <th className="py-3 px-4">Durum</th>
                      <th className="py-3 px-4">Tarih</th>
                      <th className="py-3 px-4 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          Bu filtreye ait talep kaydı bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">{sub.id}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                              {sub.formSlug}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{sub.data.fullName || "İsimsiz"}</div>
                            <div className="text-[11px] text-slate-500">{sub.data.company || "-"}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div>{sub.data.phone || "-"}</div>
                            <div className="text-[11px] text-slate-400">{sub.data.email || "-"}</div>
                          </td>
                          <td className="py-3 px-4">
                            {sub.files && sub.files.length > 0 ? (
                              <span className="inline-flex items-center gap-1 text-[#44B9CD] font-bold">
                                <FileDown className="w-3.5 h-3.5" />
                                {sub.files.length} Dosya
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                sub.status === "NEW"
                                  ? "bg-red-50 text-red-600 border border-red-200"
                                  : sub.status === "REVIEWED"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {new Date(sub.createdAt).toLocaleDateString("tr-TR")}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedSubmission(sub);
                                setAdminNoteInput(sub.adminNotes || "");
                              }}
                              className="px-2.5 py-1 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] rounded-lg text-xs font-bold transition"
                            >
                              İncele
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. DİNAMİK FORM YÖNETİCİSİ (FORM BUILDER) */}
        {activeTab === "forms" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1E2A3A]">Web Sitesi Formları</h3>
                <p className="text-xs text-slate-500">
                  Mevcut formları yönetebilir veya kod yazmadan sıfırdan yeni formlar tanımlayabilirsiniz.
                </p>
              </div>
              <button
                onClick={() => setNewFormModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#44B9CD] hover:bg-[#389eb0] text-slate-900 font-bold rounded-xl text-xs transition shadow"
              >
                <Plus className="w-4 h-4" />
                <span>+ Yeni Form Oluştur</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formsList.map((f) => (
                <div key={f.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">
                        {f.category}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{f.title}</h4>
                      <code className="text-[11px] text-[#44B9CD] font-mono">slug: {f.slug}</code>
                    </div>
                    <span className="text-xs text-emerald-600 font-bold">Aktif</span>
                  </div>

                  <p className="text-xs text-slate-600">{f.description || "Açıklama girilmedi."}</p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">İçerdiği Alanlar:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {f.fields?.map((field: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-700"
                        >
                          {field.label} {field.required && "*"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. BELGELER & SERTİFİKALAR YÖNETİMİ */}
        {activeTab === "documents" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Yeni Belge Yükleme Formu */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-[#1E2A3A]">Yeni Belge / Sertifika Ekle</h3>
              <p className="text-xs text-slate-500">Müşterilerin siteden indirebileceği PDF veya form yükleyin.</p>

              {docResult && (
                <div
                  className={`p-3 rounded-xl text-xs ${
                    docResult.success ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  {docResult.message}
                </div>
              )}

              <form onSubmit={handleSaveDoc} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Belge Başlığı *</label>
                  <input
                    type="text"
                    required
                    value={docForm.title}
                    onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                    placeholder="Örn: 2026 Noter Vekaletname Örneği"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#44B9CD]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategori *</label>
                  <select
                    value={docForm.category}
                    onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#44B9CD]"
                  >
                    <option value="SERTIFIKA">Sertifika & Yetki Belgesi</option>
                    <option value="VEKALETNAME">Vekaletname Şablonu</option>
                    <option value="GUMRUK_FORMU">Gümrük Talimat Formu</option>
                    <option value="KILAVUZ">Mevzuat Rehberi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Açıklama</label>
                  <textarea
                    rows={2}
                    value={docForm.description}
                    onChange={(e) => setDocForm({ ...docForm, description: e.target.value })}
                    placeholder="Belge hakkında kısa bilgi..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#44B9CD] resize-none"
                  />
                </div>

                {/* Dosya Yükle */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Dosya Seç (PDF / Word) *</label>
                  <input
                    type="file"
                    onChange={handleDocFileUpload}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1E2A3A] file:text-[#44B9CD] hover:file:bg-[#2A3B50] cursor-pointer"
                  />
                  {docFileUploading && <span className="text-[11px] text-slate-400">Yükleniyor...</span>}
                  {docForm.fileUrl && (
                    <span className="text-[11px] text-emerald-600 block mt-1">Dosya yüklendi: {docForm.fileSize}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={docFileUploading || !docForm.fileUrl}
                  className="w-full py-2.5 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] font-bold rounded-xl text-xs transition disabled:opacity-50"
                >
                  Belgeyi Sisteme Ekle
                </button>
              </form>
            </div>

            {/* Mevcut Belgeler Listesi */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-[#1E2A3A]">Mevcut Belgeler & İndirme Sayıları</h3>
              <div className="divide-y divide-slate-100">
                {documentsList.map((doc) => (
                  <div key={doc.id} className="py-3 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {doc.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {doc.fileSize} • {doc.downloadCount} kez indirildi
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-[#44B9CD] transition"
                        title="İndir"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. MEVZUAT & SİRKÜLER CMS */}
        {activeTab === "sirkuler" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#1E2A3A]">Yeni Mevzuat / Sirküler Yayınla</h3>
              <p className="text-xs text-slate-500 mt-1">
                Resmi Gazete kararları ve gümrük tebliğlerini anında sirküler portalına ekleyin.
              </p>
            </div>

            {sirkulerResult && (
              <div
                className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                  sirkulerResult.success ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                }`}
              >
                {sirkulerResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{sirkulerResult.message}</span>
              </div>
            )}

            <form onSubmit={handleSirkulerPublish} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Sirküler Başlığı *</label>
                <input
                  type="text"
                  required
                  value={sirkulerForm.title}
                  onChange={(e) => setSirkulerForm({ ...sirkulerForm, title: e.target.value })}
                  placeholder="Örn: İthalatta İlave Gümrük Vergisi Uygulanmasına Dair Karar Değişikliği"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#44B9CD]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategori</label>
                  <select
                    value={sirkulerForm.category}
                    onChange={(e) => setSirkulerForm({ ...sirkulerForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  >
                    <option value="İthalat & Vergi">İthalat & Vergi</option>
                    <option value="İhracat Rejimi">İhracat Rejimi</option>
                    <option value="Tarife & GTİP">Tarife & GTİP</option>
                    <option value="Menşe & Dolaşım">Menşe & Dolaşım</option>
                    <option value="Antrepo & Transit">Antrepo & Transit</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mevzuat Türü</label>
                  <input
                    type="text"
                    value={sirkulerForm.regulationType}
                    onChange={(e) => setSirkulerForm({ ...sirkulerForm, regulationType: e.target.value })}
                    placeholder="Cumhurbaşkanı Kararı / Tebliğ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Resmi Gazete No</label>
                  <input
                    type="text"
                    value={sirkulerForm.officialGazetteNumber}
                    onChange={(e) => setSirkulerForm({ ...sirkulerForm, officialGazetteNumber: e.target.value })}
                    placeholder="Örn: 32700"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">İlgili GTİP veya Fasıllar</label>
                <input
                  type="text"
                  value={sirkulerForm.relatedGtip}
                  onChange={(e) => setSirkulerForm({ ...sirkulerForm, relatedGtip: e.target.value })}
                  placeholder="Örn: 84. ve 85. Fasıllar (Elektronik ve Makineler)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kısa Özet *</label>
                <textarea
                  rows={2}
                  required
                  value={sirkulerForm.summary}
                  onChange={(e) => setSirkulerForm({ ...sirkulerForm, summary: e.target.value })}
                  placeholder="Sirkülerin ana fikrini özetleyen 1-2 cümle..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mevzuat Metni / Detaylı Açıklama *</label>
                <textarea
                  rows={6}
                  required
                  value={sirkulerForm.content}
                  onChange={(e) => setSirkulerForm({ ...sirkulerForm, content: e.target.value })}
                  placeholder="Resmi tebliğ veya kararın detayları..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 resize-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#44B9CD]">
                  💡 Kalem Gümrük Müşavirlik Uzman Tavsiyesi / Yorumu
                </label>
                <textarea
                  rows={3}
                  value={sirkulerForm.expertNote}
                  onChange={(e) => setSirkulerForm({ ...sirkulerForm, expertNote: e.target.value })}
                  placeholder="Firmaların dikkat etmesi gereken kritik hususlar ve gümrük müşavirimizin tavsiyeleri..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sirkulerSubmitting}
                  className="w-full py-3 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white font-bold rounded-xl text-sm transition shadow"
                >
                  {sirkulerSubmitting ? "Yayınlanıyor..." : "Sirküleri Sitede Yayınla"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 6. MÜŞTERİ MEMNUNİYETİ VE YORUMLAR */}
        {activeTab === "feedbacks" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-base font-bold text-[#1E2A3A]">Müşteri Değerlendirmeleri</h3>
                <p className="text-xs text-slate-500">
                  Onaylanan yorumlar web sitesinde referanslar ve değerlendirmeler sayfasında yayınlanır.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600">Toplam {feedbacksList.length} Yorum</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbacksList.map((fb) => (
                <div
                  key={fb.id}
                  className={`bg-white p-5 rounded-2xl border shadow-xs space-y-3 ${
                    fb.isApproved ? "border-emerald-200" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= fb.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        fb.isApproved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {fb.isApproved ? "Sitede Yayında" : "Onay Bekliyor"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 italic">"{fb.comment}"</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{fb.fullName}</span>
                      <span className="text-slate-400 ml-1">({fb.company || "Bireysel"})</span>
                    </div>

                    <button
                      onClick={() => handleToggleFeedback(fb.id, fb.isApproved)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        fb.isApproved
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {fb.isApproved ? "Yayından Kaldır" : "Onayla & Yayınla"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* BAŞVURU DETAY MODALI */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-[#44B9CD] font-bold">
                  {selectedSubmission.id}
                </span>
                <h3 className="text-xl font-bold text-[#1E2A3A]">
                  Talep Detayı: {selectedSubmission.formSlug}
                </h3>
                <span className="text-xs text-slate-400">
                  {new Date(selectedSubmission.createdAt).toLocaleString("tr-TR")}
                </span>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Doldurulan Alanlar */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Müşteri Yanıtları
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(selectedSubmission.data || {}).map(([key, val]: [string, any]) => (
                  <div key={key} className="space-y-0.5">
                    <span className="text-slate-400 text-[11px] font-semibold">{key}:</span>
                    <p className="font-medium text-slate-900">{String(val)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ekli Dosyalar (CV, Fatura vb.) */}
            {selectedSubmission.files && selectedSubmission.files.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700">Ekli Dosyalar (CV / Evrak)</h4>
                <div className="space-y-2">
                  {selectedSubmission.files.map((f: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#44B9CD]" />
                        <span className="font-bold text-slate-900">{f.name}</span>
                        <span className="text-slate-400 text-[10px]">({f.size})</span>
                      </div>
                      <a
                        href={f.url}
                        target="_blank"
                        className="px-3 py-1 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Görüntüle / İndir</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Durum Değiştir ve Not Ekle */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Operasyon Durumu:</span>
                <div className="flex items-center gap-2">
                  {["NEW", "REVIEWED", "COMPLETED"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateSubmissionStatus(selectedSubmission.id, st, adminNoteInput)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        selectedSubmission.status === st
                          ? "bg-[#1E2A3A] text-[#44B9CD]"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Yönetici Notu</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="Örn: Telefonla arandı, teklif maili atıldı..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateSubmissionStatus(
                        selectedSubmission.id,
                        selectedSubmission.status,
                        adminNoteInput
                      )
                    }
                    className="px-4 py-2 bg-[#1E2A3A] text-white rounded-xl text-xs font-bold"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => deleteSubmission(selectedSubmission.id)}
                className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Kaydı Sil</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
