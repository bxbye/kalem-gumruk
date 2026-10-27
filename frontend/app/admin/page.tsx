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
  Send,
  X,
  FileDown,
  Building2,
  Globe,
  Layers,
  Award,
  Phone,
  Edit3,
  Save,
  Mail,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut,
  LayoutDashboard,
  Database,
  RotateCcw,
  KeyRound,
  UserCheck,
  History,
  HardDrive,
} from "lucide-react";

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    username: string;
    name: string;
    role: "ADMIN" | "EDITOR";
    permissions: Record<string, boolean>;
  } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "submissions"
    | "settings"
    | "baglantilar"
    | "services"
    | "references"
    | "forms"
    | "documents"
    | "sirkuler"
    | "feedbacks"
    | "users"
    | "backups"
  >("dashboard");

  // Veri Stateleri
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [formsList, setFormsList] = useState<any[]>([]);
  const [documentsList, setDocumentsList] = useState<any[]>([]);
  const [sirkulerList, setSirkulerList] = useState<any[]>([]);
  const [feedbacksList, setFeedbacksList] = useState<any[]>([]);
  const [baglantilarList, setBaglantilarList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [referencesList, setReferencesList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [backupsList, setBackupsList] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Kullanıcı ve Yedek Modalleri
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({
    username: "",
    name: "",
    password: "",
    role: "EDITOR" as "ADMIN" | "EDITOR",
    permissions: {
      canEditServices: true,
      canEditSirkuler: true,
      canEditBaglantilar: true,
      canEditReferences: true,
      canEditDocuments: true,
      canEditForms: false,
      canManageSettings: false,
    },
    isActive: true,
  });
  const [userSaving, setUserSaving] = useState(false);
  const [userResult, setUserResult] = useState<{ success: boolean; message: string } | null>(null);

  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [selectedBackupToRestore, setSelectedBackupToRestore] = useState<string | null>(null);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreResult, setRestoreResult] = useState<{ success: boolean; message: string } | null>(null);

  // 1. Site Ayarları Form State
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>({
    name: "Kalem Gümrük Müşavirliği Ltd. Şti.",
    shortName: "Kalem Gümrük",
    slogan: "Yetkili Gümrük Müşavirliği — Güven, Hız ve Mevzuata Tam Uyum",
    description: "25 yılı aşkın tecrübemiz, yetkili gümrük müşavirliği güvencemiz ve güçlü dijital altyapımızla dış ticaret operasyonlarınızı sorunsuz yönetiyoruz.",
    address: "Atatürk Mah. Alemdağ Cad. Gaffar Efendi Sok. Güler Han No:5 Kat:4 Ümraniye / İstanbul",
    phone: "0544 972 29 57",
    phoneRaw: "+905449722957",
    whatsapp: "905449722957",
    whatsappDefaultMessage: "Merhaba Kalem Gümrük, web siteniz üzerinden ulaşıyorum. Gümrükleme ve dış ticaret danışmanlığı hakkında bilgi almak istiyorum.",
    email: "info@kalemgumruk.com",
    evrimPortalUrl: "https://webgumruk.com",
    workingHours: "Hafta İçi: 08:30 - 18:00 | Cumartesi: 09:00 - 13:00",
    foundedYear: "2024",
    complianceRate: "%100",
    experienceYears: "25+",
    intacRate: "%99.8",
    supportHours: "7/24 Destek",
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsResult, setSettingsResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{ success?: boolean; message?: string } | null>(null);

  // 2. Müşavir Masası / Bağlantı Form State
  const [baglantiModalOpen, setBaglantiModalOpen] = useState(false);
  const [editingBaglanti, setEditingBaglanti] = useState<any | null>(null);
  const [baglantiForm, setBaglantiForm] = useState({
    id: "",
    title: "",
    shortTitle: "",
    category: "Resmi Sistemler",
    url: "",
    image: "/images/baglantilar/beyanname-sorgulama.png",
    description: "",
    tag: "Bakanlık Sistemi",
    orderIndex: 0,
    isActive: true,
  });

  // 3. Hizmet Form State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [serviceForm, setServiceForm] = useState({
    id: "",
    slug: "",
    title: "",
    shortDesc: "",
    iconName: "ArrowDownToLine",
    category: "gumruk",
    featuresText: "",
    detailedContent: "",
    orderIndex: 0,
    isActive: true,
  });

  // 4. Referans Form State
  const [refModalOpen, setRefModalOpen] = useState(false);
  const [editingRef, setEditingRef] = useState<any | null>(null);
  const [refForm, setRefForm] = useState({
    id: "",
    name: "",
    sector: "",
    description: "",
    logoUrl: "",
    orderIndex: 0,
    isActive: true,
  });

  // Sol Menü (Sidebar) State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modal ve Seçim Stateleri
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [subFilter, setSubFilter] = useState("ALL");
  const [adminNoteInput, setAdminNoteInput] = useState("");

  // Sirküler Ekleme / Düzenleme Form State
  const [sirkulerModalOpen, setSirkulerModalOpen] = useState(false);
  const [editingSirkulerId, setEditingSirkulerId] = useState<string | null>(null);
  const [sirkulerSearch, setSirkulerSearch] = useState("");
  const [sirkulerCategoryFilter, setSirkulerCategoryFilter] = useState("ALL");
  const [sirkulerForm, setSirkulerForm] = useState({
    id: "",
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
    isPublished: true,
  });
  const [sirkulerSubmitting, setSirkulerSubmitting] = useState(false);
  const [sirkulerPdfUploading, setSirkulerPdfUploading] = useState(false);
  const [copiedSirkulerId, setCopiedSirkulerId] = useState<string | null>(null);
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
  interface FormFieldItem {
    name: string;
    label: string;
    type: string;
    required: boolean;
    placeholder?: string;
    options?: string | string[];
  }

  const [newFormModalOpen, setNewFormModalOpen] = useState(false);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [formSaveError, setFormSaveError] = useState("");
  const [newForm, setNewForm] = useState<{
    title: string;
    slug: string;
    description: string;
    category: string;
    autoEmailSubject: string;
    autoEmailBody: string;
    notificationEmail: string;
    successMessage: string;
    isActive: boolean;
    fields: FormFieldItem[];
  }>({
    title: "",
    slug: "",
    description: "",
    category: "QUOTE",
    autoEmailSubject: "Talebiniz Alındı | Kalem Gümrük",
    autoEmailBody: "Sayın Yetkili,\n\nTalebiniz ve evraklarınız yetkili gümrük müşavirimize iletilmiştir. Başvuru takip kodunuz: {{refNo}}\n\nEn kısa sürede tarafınıza geri dönüş yapılacaktır.\n\nSaygılarımızla,\nKalem Gümrük Müşavirliği",
    notificationEmail: "",
    successMessage: "Talebiniz başarıyla alınmıştır. En kısa sürede uzman gümrük müşavirimiz sizinle iletişime geçecektir.",
    isActive: true,
    fields: [
      { name: "fullName", label: "Adınız Soyadınız", type: "text", required: true, placeholder: "Adınız Soyadınız" },
      { name: "company", label: "Firma / Kurum", type: "text", required: false, placeholder: "Firma Unvanı" },
      { name: "phone", label: "Telefon Numarası", type: "tel", required: true, placeholder: "05XX XXX XX XX" },
      { name: "email", label: "E-Posta Adresi", type: "email", required: true, placeholder: "ornek@sirket.com" },
      { name: "message", label: "Talebiniz / Açıklama", type: "textarea", required: true, placeholder: "Detayları buraya yazınız..." },
    ],
  });

  const getAuthHeaders = (overrideToken?: string) => {
    const token =
      overrideToken ||
      authToken ||
      (typeof window !== "undefined" ? localStorage.getItem("kalem_admin_token") || "" : "");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (password) headers["x-admin-password"] = password;
    return headers;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("kalem_admin_token");
      if (savedToken) {
        fetch("/api/admin/me", {
          headers: { Authorization: `Bearer ${savedToken}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.user) {
              setAuthToken(savedToken);
              setCurrentUser(data.user);
              setIsLoggedIn(true);
              loadAllAdminData(savedToken, data.user);
            }
          })
          .catch(() => {});
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setLoginError("Lütfen giriş şifrenizi yazınız.");
      return;
    }
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data?.error || "Giriş başarısız. Lütfen şifrenizi kontrol ediniz.");
        return;
      }

      setAuthToken(data.token);
      setCurrentUser(data.user);
      setIsLoggedIn(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("kalem_admin_token", data.token);
      }
      loadAllAdminData(data.token, data.user);
    } catch (err: any) {
      setLoginError("Sunucu bağlantı hatası: " + (err?.message || "Bilinmeyen hata"));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAuthToken("");
    setPassword("");
    setUsername("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("kalem_admin_token");
    }
  };

  const loadAllAdminData = async (tokenOverride?: string, userOverride?: any) => {
    setLoadingData(true);
    const headers = getAuthHeaders(tokenOverride);
    const activeUser = userOverride || currentUser;

    try {
      // 1. Form Yanıtlarını Çek
      const subRes = await fetch("/api/submissions", { headers });
      const subData = await subRes.json();
      if (subData.success) setSubmissions(Array.isArray(subData.submissions) ? subData.submissions : []);

      // 2. Form Tanımlarını Çek
      const formRes = await fetch("/api/forms", { headers });
      const formData = await formRes.json();
      if (formData.success) setFormsList(Array.isArray(formData.forms) ? formData.forms : []);

      // 3. Belgeleri Çek
      const docRes = await fetch("/api/documents", { headers });
      const docData = await docRes.json();
      if (docData.success) setDocumentsList(Array.isArray(docData.documents) ? docData.documents : []);

      // 4. Sirkülerleri Çek
      const sirkulerRes = await fetch("/api/admin/sirkuler", { headers });
      const sirkulerData = await sirkulerRes.json();
      if (sirkulerData.success) setSirkulerList(Array.isArray(sirkulerData.sirkuler) ? sirkulerData.sirkuler : []);

      // 5. Müşteri Yorumlarını Çek
      const fbRes = await fetch("/api/feedbacks", { headers });
      const fbData = await fbRes.json();
      if (fbData.success) setFeedbacksList(Array.isArray(fbData.feedbacks) ? fbData.feedbacks : []);

      // 6. Site ve Firma Ayarlarını Çek
      const settingsRes = await fetch("/api/admin/settings", { headers });
      const settingsData = await settingsRes.json();
      if (settingsData.success && settingsData.settings) {
        setSiteSettings((prev) => ({ ...prev, ...settingsData.settings }));
      }

      // 7. Gerekli Bağlantıları Çek
      const baglantilarRes = await fetch("/api/admin/baglantilar", { headers });
      const baglantilarData = await baglantilarRes.json();
      if (baglantilarData.success) {
        const list = baglantilarData.items || baglantilarData.baglantilar || [];
        setBaglantilarList(Array.isArray(list) ? list : []);
      }

      // 8. Hizmetleri Çek
      const servicesRes = await fetch("/api/admin/services", { headers });
      const servicesData = await servicesRes.json();
      if (servicesData.success) {
        const list = servicesData.items || servicesData.services || [];
        setServicesList(Array.isArray(list) ? list : []);
      }

      // 9. Referansları Çek
      const refsRes = await fetch("/api/admin/references", { headers });
      const refsData = await refsRes.json();
      if (refsData.success) {
        const list = refsData.items || refsData.references || [];
        setReferencesList(Array.isArray(list) ? list : []);
      }

      // 10. Admin İse Kullanıcılar ve Yedekleri de Çek
      if (activeUser?.role === "ADMIN") {
        fetchUsersList(headers);
        fetchBackupsList(headers);
      }
    } catch (err) {
      console.error("Veri yükleme hatası:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchUsersList = async (customHeaders?: any) => {
    try {
      const res = await fetch("/api/admin/users", { headers: customHeaders || getAuthHeaders() });
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsersList(data.users);
      }
    } catch (e) {
      console.error("Kullanıcılar alınamadı:", e);
    }
  };

  const fetchBackupsList = async (customHeaders?: any) => {
    try {
      const res = await fetch("/api/admin/backups", { headers: customHeaders || getAuthHeaders() });
      const data = await res.json();
      if (data.success && Array.isArray(data.backups)) {
        setBackupsList(data.backups);
      }
    } catch (e) {
      console.error("Yedekler alınamadı:", e);
    }
  };

  const handleCreateManualBackup = async () => {
    setBackupLoading(true);
    try {
      const res = await fetch("/api/admin/backups/create", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ note: "Yönetici paneli üzerinden anlık alındı" }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Yedek başarıyla oluşturuldu: " + data.backup.filename);
        fetchBackupsList();
      } else {
        alert("❌ Hata: " + (data.error || "Yedek alınamadı."));
      }
    } catch (e: any) {
      alert("Bağlantı hatası: " + e.message);
    } finally {
      setBackupLoading(false);
    }
  };

  const handleConfirmRestore = async () => {
    if (!selectedBackupToRestore) return;
    setRestoreLoading(true);
    setRestoreResult(null);

    try {
      const res = await fetch("/api/admin/backups/restore", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ filename: selectedBackupToRestore }),
      });
      const data = await res.json();

      if (data.success) {
        setRestoreResult({ success: true, message: data.message });
        setTimeout(() => {
          setRestoreModalOpen(false);
          loadAllAdminData();
        }, 1500);
      } else {
        setRestoreResult({ success: false, message: data.error || "Geri yükleme başarısız." });
      }
    } catch (e: any) {
      setRestoreResult({ success: false, message: e.message || "Bağlantı hatası" });
    } finally {
      setRestoreLoading(false);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserSaving(true);
    setUserResult(null);

    try {
      const payload: any = {
        ...userForm,
        id: editingUserId || undefined,
      };

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setUserResult({ success: true, message: data.message });
        fetchUsersList();
        setTimeout(() => {
          setUserModalOpen(false);
          setEditingUserId(null);
        }, 1000);
      } else {
        setUserResult({ success: false, message: data.error || "Kullanıcı kaydedilemedi." });
      }
    } catch (e: any) {
      setUserResult({ success: false, message: e.message || "Bağlantı hatası" });
    } finally {
      setUserSaving(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`'${name}' kullanıcısını silmek istediğinize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsersList();
      } else {
        alert("Hata: " + data.error);
      }
    } catch (e: any) {
      alert("Hata: " + e.message);
    }
  };

  const isRoleAdmin = currentUser?.role === "ADMIN";
  const canDelete = isRoleAdmin;

  // Site Ayarlarını Kaydet
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsResult(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, settings: siteSettings }),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsResult({
          success: true,
          message: "Site ve firma bilgileri başarıyla güncellendi ve tüm siteye uygulandı!",
        });
      } else {
        setSettingsResult({
          success: false,
          message: data.error || "Güncelleme sırasında hata oluştu.",
        });
      }
    } catch {
      setSettingsResult({ success: false, message: "Ağ bağlantı hatası." });
    } finally {
      setSettingsSaving(false);
    }
  };

  // E-Posta / SMTP Testi Gönder
  const handleTestEmail = async () => {
    setTestingSmtp(true);
    setSmtpTestResult(null);
    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      setSmtpTestResult(data);
    } catch (err: any) {
      setSmtpTestResult({ success: false, message: err?.message || "Sunucuya bağlanılamadı." });
    } finally {
      setTestingSmtp(false);
    }
  };

  // Müşavir Masası Bağlantı İşlemleri
  const openNewBaglanti = () => {
    setEditingBaglanti(null);
    setBaglantiForm({
      id: "",
      title: "",
      shortTitle: "",
      category: "Resmi Sistemler",
      url: "",
      image: "/images/baglantilar/beyanname-sorgulama.png",
      description: "",
      tag: "Bakanlık Sistemi",
      orderIndex: (baglantilarList || []).length,
      isActive: true,
    });
    setBaglantiModalOpen(true);
  };

  const openEditBaglanti = (item: any) => {
    setEditingBaglanti(item);
    setBaglantiForm({
      id: item.id,
      title: item.title,
      shortTitle: item.shortTitle || item.title,
      category: item.category,
      url: item.url,
      image: item.image,
      description: item.description,
      tag: item.tag,
      orderIndex: item.orderIndex || 0,
      isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
    });
    setBaglantiModalOpen(true);
  };

  const handleSaveBaglanti = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/baglantilar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ...baglantiForm }),
      });
      const data = await res.json();
      if (data.success) {
        setBaglantiModalOpen(false);
        const bRes = await fetch("/api/admin/baglantilar");
        const bData = await bRes.json();
        if (bData.success) {
          const list = bData.items || bData.baglantilar || [];
          setBaglantilarList(Array.isArray(list) ? list : []);
        }
      } else {
        alert(data.error || "Hata oluştu.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBaglanti = async (id: string) => {
    if (!confirm("Bu bağlantıyı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(
        `/api/admin/baglantilar?id=${encodeURIComponent(id)}&password=${encodeURIComponent(password)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setBaglantilarList((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Hizmet İşlemleri
  const openNewService = () => {
    setEditingService(null);
    setServiceForm({
      id: "",
      slug: "",
      title: "",
      shortDesc: "",
      iconName: "ArrowDownToLine",
      category: "gumruk",
      featuresText: "",
      detailedContent: "",
      orderIndex: (servicesList || []).length,
      isActive: true,
    });
    setServiceModalOpen(true);
  };

  const openEditService = (item: any) => {
    setEditingService(item);
    let featuresStr = "";
    try {
      const parsed = typeof item.features === "string" ? JSON.parse(item.features) : item.features;
      featuresStr = Array.isArray(parsed) ? parsed.join("\n") : "";
    } catch {
      featuresStr = "";
    }
    setServiceForm({
      id: item.id,
      slug: item.slug,
      title: item.title,
      shortDesc: item.shortDesc || "",
      iconName: item.iconName || "ArrowDownToLine",
      category: item.category || "gumruk",
      featuresText: featuresStr,
      detailedContent: item.detailedContent || "",
      orderIndex: item.orderIndex || 0,
      isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
    });
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const featuresArray = serviceForm.featuresText
        ? serviceForm.featuresText.split("\n").map((f) => f.trim()).filter(Boolean)
        : [];
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          ...serviceForm,
          features: featuresArray,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setServiceModalOpen(false);
        const sRes = await fetch("/api/admin/services");
        const sData = await sRes.json();
        if (sData.success) {
          const list = sData.items || sData.services || [];
          setServicesList(Array.isArray(list) ? list : []);
        }
      } else {
        alert(data.error || "Hata oluştu.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(
        `/api/admin/services?id=${encodeURIComponent(id)}&password=${encodeURIComponent(password)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setServicesList((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Referans İşlemleri
  const openNewRef = () => {
    setEditingRef(null);
    setRefForm({
      id: "",
      name: "",
      sector: "",
      description: "",
      logoUrl: "",
      orderIndex: (referencesList || []).length,
      isActive: true,
    });
    setRefModalOpen(true);
  };

  const openEditRef = (item: any) => {
    setEditingRef(item);
    setRefForm({
      id: item.id,
      name: item.name,
      sector: item.sector,
      description: item.description || "",
      logoUrl: item.logoUrl || "",
      orderIndex: item.orderIndex || 0,
      isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
    });
    setRefModalOpen(true);
  };

  const handleSaveReference = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/references", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ...refForm }),
      });
      const data = await res.json();
      if (data.success) {
        setRefModalOpen(false);
        const rRes = await fetch("/api/admin/references");
        const rData = await rRes.json();
        if (rData.success) {
          const list = rData.items || rData.references || [];
          setReferencesList(Array.isArray(list) ? list : []);
        }
      } else {
        alert(data.error || "Hata oluştu.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReference = async (id: string) => {
    if (!confirm("Bu referansı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(
        `/api/admin/references?id=${encodeURIComponent(id)}&password=${encodeURIComponent(password)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setReferencesList((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
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

  // Sirküler / Mevzuat Yönetimi Fonksiyonları
  const openCreateSirkulerModal = () => {
    setEditingSirkulerId(null);
    setSirkulerResult(null);
    setSirkulerForm({
      id: "",
      title: "",
      category: "İthalat & Vergi",
      regulationType: "Tebliğ",
      officialGazetteNumber: "",
      relatedGtip: "",
      summary: "",
      content: "",
      expertNote: "",
      sourceUrl: "",
      pdfUrl: "",
      isPublished: true,
    });
    setSirkulerModalOpen(true);
  };

  const handleSirkulerPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSirkulerPdfUploading(true);
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success && data.file) {
        setSirkulerForm((prev) => ({
          ...prev,
          pdfUrl: data.file.url,
        }));
      } else {
        alert(data.error || "PDF yüklenemedi.");
      }
    } catch (err) {
      alert("PDF yüklenirken bir hata oluştu.");
    } finally {
      setSirkulerPdfUploading(false);
    }
  };

  const applySirkulerTemplate = (type: "gozetim" | "igv" | "pdf_only" | "clear") => {
    if (type === "clear") {
      setSirkulerForm((prev) => ({
        ...prev,
        title: "",
        officialGazetteNumber: "",
        relatedGtip: "",
        summary: "",
        content: "",
        expertNote: "",
        sourceUrl: "",
        pdfUrl: "",
      }));
      return;
    }

    if (type === "gozetim") {
      setSirkulerForm((prev) => ({
        ...prev,
        title: "İTHALATI KAYIT BELGESİNE TABİ TEKSTİL VE KONFEKSİYON ÜRÜNLERİNE İLİŞKİN 2020/9 SAYILI GÖZETİM TEBLİĞİNDE DEĞİŞİKLİK YAPILDI",
        category: "İthalat & Vergi",
        regulationType: "Tebliğ",
        officialGazetteNumber: "32700",
        relatedGtip: "50-63. Fasıllar (Tekstil ve Konfeksiyon)",
        summary: "İthalatı kayda bağlı ürünlerin beyannamesinin tescili sırasında tolerans uygulamasına ilişkin yeni düzenleme yapılmıştır. Miktar toleransı kaldırılarak tolerans yalnızca kıymet unsuruyla sınırlandırılmıştır.",
        content: `İthalatta Gözetim Uygulanmasına İlişkin Tebliğ (Tebliğ No: 2020/9)'in ilgili maddesinin yeni hali;

(3) Gümrük beyannamesinin tescili sırasında gümrüklerce tespit ve kabul edilen kıymetin, Kayıt Belgesinde kayıtlı kıymeti %5'ten (%5 dâhil) daha az bir oranda aşması ithalatın yapılmasını engellemez.

İthalatta Gözetim Uygulanmasına İlişkin Tebliğ (Tebliğ No: 2020/9)'in ilgili maddesinin değiştirilmeden önceki hali;

(3) Gümrük beyannamesinin tescili sırasında gümrüklerce tespit ve kabul edilen kıymet veya miktarın, Kayıt Belgesinde kayıtlı kıymet veya miktarı, toplam %5'ten (%5 dâhil) daha az bir oranda aşması ithalatın yapılmasını engellemez.`,
        expertNote: "",
      }));
    } else if (type === "igv") {
      setSirkulerForm((prev) => ({
        ...prev,
        title: "İTHALATTA İLAVE GÜMRÜK VERGİSİ UYGULANMASINA DAİR KARARDA DEĞİŞİKLİK YAPILMASI HAKKINDA KARAR",
        category: "İthalat & Vergi",
        regulationType: "Cumhurbaşkanı Kararı",
        officialGazetteNumber: "32705",
        relatedGtip: "84. ve 85. Fasıllar",
        summary: "Belirtilen fasıllarda yer alan bazı sanayi ürünlerinin ithalatında uygulanan ilave gümrük vergisi (İGV) oranları güncellenmiş ve yürürlük tarihi belirlenmiştir.",
        content: `İthalatta İlave Gümrük Vergisi Uygulanmasına İlişkin Karar kapsamında Ek-1 ve Ek-2 sayılı listelerde yer alan GTİP ve ürün gruplarının gümrük vergisi oranları yeniden düzenlenmiştir.

Öne çıkan düzenlemeler:
1. İlgili GTİP'lerde AB ve Serbest Ticaret Anlaşması (STA) olan ülkeler için muafiyet şartları korunmuştur.
2. Üçüncü ülkeler menşeli ithalatlarda %5 ila %20 arasında ilave gümrük vergisi uygulanacaktır.
3. Yürürlük tarihinden önce tescil edilmiş beyannameler önceki hükümlere tabidir.`,
        expertNote: "",
      }));
    } else if (type === "pdf_only") {
      setSirkulerForm((prev) => ({
        ...prev,
        title: "GÜMRÜKLER GENEL MÜDÜRLÜĞÜ GENELGESİ / RESMİ TEBLİĞ DUYURUSU",
        category: "İthalat & Vergi",
        regulationType: "Genelge",
        summary: "Ticaret Bakanlığı tarafından yayımlanan güncel resmi genelge / tebliğ metni ekte bilgilerinize sunulmuştur.",
        content: "İlgili konuya ilişkin resmi karar ve uygulama esasları ekteki PDF dosyasında ve resmi kaynak bağlantısında yer almaktadır.",
        expertNote: "",
      }));
    }
  };

  const handleCopyWhatsAppSirkuler = (item: any) => {
    const text = `📢 *GÜMRÜK MEVZUAT DUYURUSU*\n\n*KONU:* ${item.title}\n*Tarih:* ${item.date || "Güncel"}\n*Kategori:* ${item.category || "Gümrük Mevzuatı"}${item.officialGazetteNumber ? `\n*Resmi Gazete Sayı:* ${item.officialGazetteNumber}` : ""}${item.relatedGtip ? `\n*İlgili Kapsam / GTİP:* ${item.relatedGtip}` : ""}\n\n*Haber Özeti:*\n${item.summary}\n\n📄 *Tebliğ & Karar Detayı:*\nhttps://kalemgumruk.com/tr/sirkuler/${item.slug}\n\nℹ️ *Önemli Not:* Bu mevzuat paylaşımı genel duyuru amaçlıdır. Mevzuatın firmanıza ve operasyonlarınıza etkileri ile nasıl hareket edilmesi gerektiği konusunda destek ve profesyonel danışmanlık almak için bizimle iletişime geçebilirsiniz:\n📞 0544 972 29 57 | ✉️ info@kalemgumruk.com`;

    navigator.clipboard.writeText(text);
    setCopiedSirkulerId(item.id);
    setTimeout(() => setCopiedSirkulerId(null), 3000);
  };

  const openEditSirkulerModal = (item: any) => {
    setEditingSirkulerId(item.id);
    setSirkulerResult(null);
    setSirkulerForm({
      id: item.id,
      title: item.title || "",
      category: item.category || "İthalat & Vergi",
      regulationType: item.regulationType || "Cumhurbaşkanı Kararı",
      officialGazetteNumber: item.officialGazetteNumber || "",
      relatedGtip: item.relatedGtip || "",
      summary: item.summary || "",
      content: item.content || "",
      expertNote: item.expertNote || "",
      sourceUrl: item.sourceUrl || "",
      pdfUrl: item.pdfUrl || "",
      isPublished: item.isPublished !== false,
    });
    setSirkulerModalOpen(true);
  };

  const handleDeleteSirkuler = async (item: any) => {
    if (!window.confirm(`"${item.title}" başlıklı sirküleri kalıcı olarak silmek istediğinize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/sirkuler?id=${encodeURIComponent(item.id)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, id: item.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSirkulerList((prev) => prev.filter((s) => s.id !== item.id));
      } else {
        alert(data.error || "Sirküler silinemedi.");
      }
    } catch (err) {
      alert("Silme işlemi sırasında bağlantı hatası oluştu.");
    }
  };

  const handleToggleSirkulerStatus = async (item: any) => {
    const newStatus = !item.isPublished;
    try {
      const res = await fetch("/api/admin/sirkuler/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, id: item.id, isPublished: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSirkulerList((prev) =>
          prev.map((s) => (s.id === item.id ? { ...s, isPublished: newStatus } : s))
        );
      } else {
        alert(data.error || "Durum güncellenemedi.");
      }
    } catch (err) {
      alert("Hata oluştu.");
    }
  };

  // Sirküler Kaydet (Yeni Ekle veya Güncelle)
  const handleSirkulerPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setSirkulerSubmitting(true);
    setSirkulerResult(null);

    try {
      const res = await fetch("/api/admin/sirkuler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          ...sirkulerForm,
          id: editingSirkulerId || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSirkulerResult({ success: true, message: data.message });
        await loadAllAdminData();
        setTimeout(() => {
          setSirkulerModalOpen(false);
          setSirkulerResult(null);
        }, 800);
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

  // Form Builder Yardımcıları
  const slugifyText = (text: string) => {
    const trMap: Record<string, string> = {
      ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i", ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u"
    };
    return text
      .split("")
      .map((c) => trMap[c] || c)
      .join("")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const openCreateFormModal = () => {
    setEditingFormId(null);
    setFormSaveError("");
    setNewForm({
      title: "",
      slug: "",
      description: "",
      category: "QUOTE",
      autoEmailSubject: "Talebiniz Alındı | Kalem Gümrük",
      autoEmailBody: "Sayın Yetkili,\n\nTalebiniz ve evraklarınız yetkili gümrük müşavirimize iletilmiştir. Başvuru takip kodunuz: {{refNo}}\n\nEn kısa sürede tarafınıza geri dönüş yapılacaktır.\n\nSaygılarımızla,\nKalem Gümrük Müşavirliği",
      notificationEmail: "",
      successMessage: "Talebiniz başarıyla alınmıştır. En kısa sürede uzman gümrük müşavirimiz sizinle iletişime geçecektir.",
      isActive: true,
      fields: [
        { name: "fullName", label: "Adınız Soyadınız", type: "text", required: true, placeholder: "Adınız Soyadınız" },
        { name: "company", label: "Firma / Kurum", type: "text", required: false, placeholder: "Firma Unvanı" },
        { name: "phone", label: "Telefon Numarası", type: "tel", required: true, placeholder: "05XX XXX XX XX" },
        { name: "email", label: "E-Posta Adresi", type: "email", required: true, placeholder: "ornek@sirket.com" },
        { name: "message", label: "Talebiniz / Açıklama", type: "textarea", required: true, placeholder: "Detayları buraya yazınız..." },
      ],
    });
    setNewFormModalOpen(true);
  };

  const openEditFormModal = (form: any) => {
    setEditingFormId(form.id);
    setFormSaveError("");
    const parsedFields = Array.isArray(form.fields) ? form.fields : [];
    const settings = form.settings || {};
    setNewForm({
      title: form.title || "",
      slug: form.slug || "",
      description: form.description || "",
      category: form.category || "QUOTE",
      autoEmailSubject: settings.autoEmailSubject || "Talebiniz Alındı | Kalem Gümrük",
      autoEmailBody: settings.autoEmailBody || "Sayın Yetkili,\n\nTalebiniz alınmıştır.",
      notificationEmail: settings.notificationEmail || "",
      successMessage: settings.successMessage || "Talebiniz başarıyla alınmıştır.",
      isActive: form.isActive !== false,
      fields: parsedFields.length > 0 ? parsedFields : [
        { name: "fullName", label: "Adınız Soyadınız", type: "text", required: true, placeholder: "Adınız Soyadınız" }
      ],
    });
    setNewFormModalOpen(true);
  };

  const handleAddFormField = () => {
    const fieldIndex = newForm.fields.length + 1;
    setNewForm((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          name: `alan_${fieldIndex}`,
          label: `Yeni Alan ${fieldIndex}`,
          type: "text",
          required: false,
          placeholder: "",
        },
      ],
    }));
  };

  const handleRemoveFormField = (index: number) => {
    setNewForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, idx) => idx !== index),
    }));
  };

  const handleFormFieldChange = (index: number, key: string, value: any) => {
    setNewForm((prev) => {
      const updatedFields = [...prev.fields];
      const target = { ...updatedFields[index], [key]: value };
      // Etiket değiştikçe adı otomatik uydur (eğer varsayılan alan_ ise)
      if (key === "label" && (!target.name || target.name.startsWith("alan_"))) {
        target.name = slugifyText(value).replace(/-/g, "_") || target.name;
      }
      updatedFields[index] = target;
      return { ...prev, fields: updatedFields };
    });
  };

  // Form Builder: Formu Kaydet (Oluştur veya Güncelle)
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSaving(true);
    setFormSaveError("");

    if (!newForm.title.trim()) {
      setFormSaveError("Lütfen form başlığını giriniz.");
      setFormSaving(false);
      return;
    }

    const finalSlug = slugifyText(newForm.slug || newForm.title);
    if (!finalSlug) {
      setFormSaveError("Geçerli bir slug (URL bağlantısı) oluşturulamadı.");
      setFormSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          id: editingFormId || undefined,
          title: newForm.title.trim(),
          slug: finalSlug,
          description: newForm.description.trim(),
          category: newForm.category,
          fields: newForm.fields,
          isActive: newForm.isActive,
          settings: {
            autoEmailSubject: newForm.autoEmailSubject,
            autoEmailBody: newForm.autoEmailBody,
            notificationEmail: newForm.notificationEmail,
            successMessage: newForm.successMessage,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNewFormModalOpen(false);
        await loadAllAdminData();
      } else {
        setFormSaveError(data.error || "Form kaydedilemedi.");
      }
    } catch (err: any) {
      setFormSaveError(err.message || "Sunucuyla iletişim kurulurken bir hata oluştu.");
    } finally {
      setFormSaving(false);
    }
  };

  // Form Sil
  const handleDeleteForm = async (form: any) => {
    const isDefault = ["fiyat-teklifi", "iletisim", "kariyer-staj", "musteri-memnuniyeti"].includes(form.slug);
    const confirmMsg = isDefault
      ? `"${form.title}" sistemin temel formlarından biridir. Silmek istediğinize emin misiniz?`
      : `"${form.title}" formunu kalıcı olarak silmek istediğinize emin misiniz?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/forms/${form.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await loadAllAdminData();
      } else {
        alert(data.error || "Form silinemedi.");
      }
    } catch (err) {
      alert("Form silinirken bir bağlantı hatası oluştu.");
    }
  };

  // Form Aktif/Pasif Değiştir
  const handleToggleFormStatus = async (form: any) => {
    const newStatus = !form.isActive;
    try {
      const res = await fetch(`/api/forms/${form.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, isActive: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormsList((prev) =>
          prev.map((f) => (f.id === form.id ? { ...f, isActive: newStatus } : f))
        );
      } else {
        alert(data.error || "Durum güncellenemedi.");
      }
    } catch (err) {
      alert("Form durumu değiştirilemedi.");
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
              <label className="text-xs font-semibold text-slate-300">Kullanıcı Adı (Opsiyonel)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin veya editor"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#44B9CD] transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Şifre *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#44B9CD] transition"
              />
            </div>
            <div className="p-3 bg-slate-900/60 border border-slate-700/50 rounded-xl text-[11px] text-slate-400 leading-relaxed">
              💡 <strong>Giriş Rolleri:</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li><strong className="text-emerald-400">Admin:</strong> Tüm yetkilere ve silme hakkına sahiptir.</li>
                <li><strong className="text-amber-400">Editör:</strong> Mevzuat, hizmet ve içerik ekleyip güncelleyebilir; silme yetkisi yoktur.</li>
              </ul>
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

  // Filtrelenmiş Sirkülerler
  const filteredSirkuler = sirkulerList.filter((item) => {
    const matchCat =
      sirkulerCategoryFilter === "ALL" || item.category === sirkulerCategoryFilter;
    const q = sirkulerSearch.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.title?.toLowerCase().includes(q) ||
      item.summary?.toLowerCase().includes(q) ||
      item.relatedGtip?.toLowerCase().includes(q) ||
      item.officialGazetteNumber?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // Sol Kenar Çubuğu Menü Öğeleri
  const menuItems = [
    {
      id: "dashboard" as const,
      label: "Genel Bakış",
      icon: LayoutDashboard,
      badge: null,
      badgeColor: "",
    },
    {
      id: "submissions" as const,
      label: "Gelen Başvurular & CRM",
      icon: Inbox,
      badge: submissions.filter((s) => s.status === "NEW").length || null,
      badgeColor: "bg-red-500 text-white",
    },
    {
      id: "sirkuler" as const,
      label: "Mevzuat & Sirküler CMS",
      icon: BookOpen,
      badge: sirkulerList.length || null,
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      id: "forms" as const,
      label: "Form Yöneticisi (Builder)",
      icon: Layers,
      badge: formsList.length || null,
      badgeColor: "bg-cyan-100 text-[#0e7490]",
    },
    {
      id: "documents" as const,
      label: "Belgeler & Sertifikalar",
      icon: FileText,
      badge: documentsList.length || null,
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "services" as const,
      label: "Hizmet Yönetimi",
      icon: Briefcase,
      badge: servicesList.length || null,
      badgeColor: "bg-slate-200 text-slate-700",
    },
    {
      id: "references" as const,
      label: "Referanslar Portföyü",
      icon: Award,
      badge: referencesList.length || null,
      badgeColor: "bg-purple-100 text-purple-700",
    },
    {
      id: "baglantilar" as const,
      label: "Müşavir Masası (Portallar)",
      icon: Globe,
      badge: baglantilarList.length || null,
      badgeColor: "bg-slate-200 text-slate-700",
    },
    {
      id: "feedbacks" as const,
      label: "Müşteri Yorumları",
      icon: Star,
      badge: feedbacksList.filter((f) => !f.isApproved).length || null,
      badgeColor: "bg-amber-500 text-white",
    },
    {
      id: "settings" as const,
      label: "Site & Firma Ayarları",
      icon: Settings,
      badge: null,
      badgeColor: "",
    },
    ...(isRoleAdmin
      ? [
          {
            id: "users" as const,
            label: "Kullanıcı & Yetki Yönetimi",
            icon: UserCheck,
            badge: usersList.length || null,
            badgeColor: "bg-indigo-100 text-indigo-800",
          },
          {
            id: "backups" as const,
            label: "Veritabanı Yedekleri",
            icon: Database,
            badge: backupsList.length || null,
            badgeColor: "bg-emerald-100 text-emerald-800",
          },
        ]
      : []),
  ];

  const currentTabInfo = menuItems.find((m) => m.id === activeTab) || menuItems[0];

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800">
      {/* MOBIL SIDEBAR BACKDROP */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* SOL AÇILIR / KAPANIR MENÜ (SIDEBAR) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#1E2A3A] text-white flex flex-col transition-all duration-300 shadow-xl ${
          sidebarCollapsed ? "w-20" : "w-64"
        } ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Üst Logo ve Başlık */}
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-[#44B9CD] text-[#1E2A3A] font-black flex items-center justify-center text-base shrink-0 shadow-md">
              KG
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <h2 className="text-sm font-bold text-white leading-tight truncate">
                  Kalem Gümrük
                </h2>
                <span className="text-[10px] text-[#44B9CD] font-medium tracking-wide block truncate">
                  Yönetici Paneli
                </span>
              </div>
            )}
          </div>

          {/* Menü Daraltma / Genişletme Butonu (Masaüstü) */}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-xl transition-colors"
            title={sidebarCollapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobilde Kapat */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menü Öğeleri Listesi */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                  isActive
                    ? "bg-[#44B9CD] text-slate-950 font-bold shadow-md shadow-[#44B9CD]/20"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? "text-slate-950 scale-110" : "text-slate-400 group-hover:text-[#44B9CD]"
                  }`}
                />

                {!sidebarCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {item.badge !== null && !sidebarCollapsed && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold font-mono shrink-0 ${
                      isActive ? "bg-slate-900 text-[#44B9CD]" : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Kompakt modda nokta rozet */}
                {sidebarCollapsed && item.badge !== null && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Alt Kısım: Web Sitesine Git & Çıkış */}
        <div className="p-3 border-t border-slate-700/80 space-y-1 bg-slate-900/40">
          <Link
            href="/tr"
            target="_blank"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all group"
            title="Web Sitesini Görüntüle"
          >
            <ExternalLink className="w-4 h-4 text-[#44B9CD] shrink-0 group-hover:scale-110 transition-transform" />
            {!sidebarCollapsed && <span className="truncate">Web Sitesine Git</span>}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-all group"
            title="Oturumu Kapat"
          >
            <LogOut className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
            {!sidebarCollapsed && <span className="truncate">Güvenli Çıkış</span>}
          </button>
        </div>
      </aside>

      {/* SAĞ ANA İÇERİK ALANI */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* ÜST BAŞLIK ÇUBUĞU (HEADER) */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobil Menü Aç Butonu */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#1E2A3A] truncate flex items-center gap-2">
                <span>{currentTabInfo.label}</span>
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Kalem Gümrük Müşavirliği Dijital Operasyon &amp; CMS Yönetim Paneli
              </p>
            </div>
          </div>

          {/* Sağ Aksiyonlar & Kullanıcı Bilgisi */}
          <div className="flex items-center gap-2 shrink-0">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 mr-1">
                {currentUser.role === "ADMIN" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Yönetici (Admin)</span>
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200"
                    title="Editör Modu: Yeni kayıt ve düzenleme yapabilir. Silme yetkisi kapalıdır."
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Editör (Silme Yetkisi Yok)</span>
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-700">
                  {currentUser.name}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => loadAllAdminData()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              title="Tüm veritabanı kayıtlarını yenile"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? "animate-spin text-[#44B9CD]" : ""}`} />
              <span className="hidden sm:inline">Yenile</span>
            </button>

            <Link
              href="/tr"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-[#0e7490] text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Web Sitesi</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold transition-colors"
              title="Güvenli Çıkış"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* ANA İÇERİK BÖLÜMÜ */}
        <main className="p-4 sm:p-8 flex-1 w-full max-w-7xl mx-auto space-y-6">
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
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {["ALL", ...Array.from(new Set([...formsList.map((f) => f.slug), ...submissions.map((s) => s.formSlug)].filter(Boolean)))].map((cat) => {
                  const matchingForm = formsList.find((f) => f.slug === cat);
                  const label =
                    cat === "ALL"
                      ? "Tüm Talepler"
                      : cat === "chatbot"
                      ? "Chatbot Talepleri"
                      : (matchingForm?.title || cat);
                  const count = cat === "ALL" ? submissions.length : submissions.filter((s) => s.formSlug === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSubFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                        subFilter === cat
                          ? "bg-[#1E2A3A] text-[#44B9CD] shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <span>{label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        subFilter === cat ? "bg-[#44B9CD]/20 text-[#44B9CD]" : "bg-slate-200 text-slate-700"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
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
                            {sub.formSlug === "chatbot" ? (
                              <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-[#1E2A3A] font-bold inline-flex items-center gap-1 border border-cyan-200">
                                Chatbot Danışma
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                                {formsList.find((f) => f.slug === sub.formSlug)?.title || sub.formSlug}
                              </span>
                            )}
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
            {/* Üst Başlık ve Aksiyon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#1E2A3A]">Web Sitesi Formları</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-50 text-[#0e7490] font-bold border border-cyan-100">
                    {formsList.length} Form
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Mevcut formları yönetebilir veya kod yazmadan sıfırdan yeni başvuru/teklif formları tanımlayabilirsiniz.
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateFormModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#44B9CD] hover:bg-[#389eb0] text-slate-900 font-bold rounded-xl text-xs transition-all shadow-md hover:shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Form Oluştur</span>
              </button>
            </div>

            {/* Nasıl Kullanılır Bilgi Kutusu */}
            <div className="bg-gradient-to-r from-blue-50/60 to-cyan-50/60 border border-blue-100 rounded-2xl p-5 text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#1E2A3A]">
                <Sparkles className="w-4 h-4 text-[#44B9CD]" />
                <span>💡 Dinamik Form Sistemi Nasıl Çalışır?</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Tanımladığınız her form anında <code className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[#0e7490]">/tr/form/[slug]</code> adresiyle canlı yayına girer. Form üzerinden yapılan tüm başvurular <strong>&quot;Gelen Başvurular&quot;</strong> sekmesine düşer, başvuru sahibine takip referans kodu verilir ve isteğinize göre otomatik e-posta gönderilir.
              </p>
            </div>

            {/* Form Kartları Listesi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {formsList.map((f) => {
                const subCount = submissions.filter((s) => s.formSlug === f.slug).length;
                const newSubCount = submissions.filter((s) => s.formSlug === f.slug && s.status === "NEW").length;
                const isFormActive = f.isActive !== false;

                return (
                  <div
                    key={f.id}
                    className={`bg-white p-6 rounded-2xl border transition-all duration-200 shadow-xs flex flex-col justify-between space-y-5 ${
                      isFormActive ? "border-slate-200/80 hover:border-slate-300" : "border-slate-200 opacity-70 bg-slate-50/50"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Üst Başlık & Durum */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase tracking-wide border border-blue-100">
                              {f.category || "GENEL"}
                            </span>
                            {newSubCount > 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
                                {newSubCount} Yeni Başvuru
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-bold text-slate-900">{f.title}</h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <code className="text-[11px] text-[#0e7490] font-mono bg-cyan-50 px-1.5 py-0.5 rounded">
                              /tr/form/{f.slug}
                            </code>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleFormStatus(f)}
                          title="Durumu Değiştir"
                          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                            isFormActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {isFormActive ? "● Aktif" : "○ Pasif"}
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {f.description || "Açıklama belirtilmemiş."}
                      </p>

                      {/* Alanlar */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase">
                          <span>İçerdiği Alanlar ({f.fields?.length || 0})</span>
                          <span>Toplam Yanıt: {subCount}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {f.fields?.map((field: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700"
                            >
                              {field.label} {field.required && <span className="text-red-500">*</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Aksiyon Butonları */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link
                        href={`/tr/form/${f.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#44B9CD]" />
                        <span>Formu Gör</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditFormModal(f)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Düzenle</span>
                        </button>

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDeleteForm(f)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors"
                            title="Formu Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Sil</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteDoc(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. MEVZUAT & SİRKÜLER CMS */}
        {activeTab === "sirkuler" && (
          <div className="space-y-6">
            {/* Üst Başlık & Yeni Sirküler Ekle Butonu */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#1E2A3A]">Mevzuat &amp; Sirküler Yönetimi (CMS)</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
                    {sirkulerList.length} Sirküler
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Resmi Gazete kararları, tebliğler ve tarife değişikliklerini veritabanından yönetin, düzenleyin veya yeni sirküler yayınlayın.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateSirkulerModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#44B9CD] hover:bg-[#389eb0] text-slate-900 font-bold rounded-xl text-xs transition-all shadow-md hover:shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Sirküler Yayınla</span>
              </button>
            </div>

            {/* Arama ve Kategori Filtreleri */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={sirkulerSearch}
                    onChange={(e) => setSirkulerSearch(e.target.value)}
                    placeholder="Sirküler başlığı, Resmi Gazete no veya GTİP kodu ile arayın..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                  {sirkulerSearch && (
                    <button
                      type="button"
                      onClick={() => setSirkulerSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
                  {["ALL", "İthalat & Vergi", "İhracat Rejimi", "Tarife & GTİP", "Menşe & Dolaşım", "Antrepo & Transit"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSirkulerCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                        sirkulerCategoryFilter === cat
                          ? "bg-[#1E2A3A] text-[#44B9CD] font-bold shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat === "ALL" ? "Tümü" : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                <span>Toplam {filteredSirkuler.length} mevzuat kaydı listeleniyor</span>
                {sirkulerSearch && <span>&quot;{sirkulerSearch}&quot; araması için sonuçlar</span>}
              </div>
            </div>

            {/* Veritabanındaki Sirkülerlerin Listesi */}
            <div className="space-y-4">
              {filteredSirkuler.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-700 text-sm">Eşleşen Sirküler Bulunamadı</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Arama kriterlerinizi değiştirebilir veya sağ üstteki buton ile sıfırdan yeni bir mevzuat yayınlayabilirsiniz.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredSirkuler.map((item) => {
                    const isPublished = item.isPublished !== false;

                    return (
                      <div
                        key={item.id}
                        className={`bg-white p-5 sm:p-6 rounded-2xl border transition-all duration-200 shadow-xs space-y-4 ${
                          isPublished
                            ? "border-slate-200/90 hover:border-slate-300"
                            : "border-slate-200 opacity-60 bg-slate-50/60"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                {item.category}
                              </span>
                              {item.regulationType && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                  {item.regulationType}
                                </span>
                              )}
                              {item.officialGazetteNumber && (
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                  R.G. Sayı: {item.officialGazetteNumber}
                                </span>
                              )}
                              <span className="text-[11px] text-slate-400">
                                📅 {item.date || "Tarih belirtilmedi"}
                              </span>
                            </div>

                            <h4 className="text-base font-bold text-slate-900 pt-0.5">
                              {item.title}
                            </h4>

                            {item.relatedGtip && (
                              <div className="text-xs text-[#0e7490] font-medium flex items-center gap-1.5">
                                <Tag className="w-3 h-3 text-[#44B9CD]" />
                                <span>İlgili GTİP / Fasıl: {item.relatedGtip}</span>
                              </div>
                            )}
                          </div>

                          {/* Yayın Durumu Rozeti */}
                          <button
                            type="button"
                            onClick={() => handleToggleSirkulerStatus(item)}
                            title="Tıklayarak durumu değiştirin"
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border self-start ${
                              isPublished
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            {isPublished ? "● Yayında (Aktif)" : "○ Taslak (Gizli)"}
                          </button>
                        </div>

                        {/* Özet ve Uzman Yorumu */}
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {item.summary}
                        </p>

                        {item.expertNote && (
                          <div className="p-3 bg-cyan-50/50 border border-cyan-100 rounded-xl text-xs text-slate-700 space-y-1">
                            <span className="text-[10px] font-bold text-[#0e7490] uppercase tracking-wider block">
                              💡 Uzman Müşavir Yorumu:
                            </span>
                            <p className="line-clamp-2 text-slate-600">{item.expertNote}</p>
                          </div>
                        )}

                        {/* Alt Aksiyon Butonları */}
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="font-mono text-[11px]">slug: {item.slug}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              <span>{item.viewsCount || 0} görüntülenme</span>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {item.pdfUrl && (
                              <a
                                href={item.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition-colors"
                                title="Yüklenmiş PDF Dosyasını Aç"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                                <span>PDF Eki</span>
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => handleCopyWhatsAppSirkuler(item)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                copiedSirkulerId === item.id
                                  ? "bg-emerald-600 text-white"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                              }`}
                              title="Müşterilere Göndermek İçin WhatsApp Metnini Kopyala"
                            >
                              {copiedSirkulerId === item.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Kopyalandı!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>WhatsApp Metni</span>
                                </>
                              )}
                            </button>

                            <Link
                              href={`/tr/sirkuler/${item.slug}`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-[#44B9CD]" />
                              <span>Sitede Gör</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => openEditSirkulerModal(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Düzenle</span>
                            </button>

                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => handleDeleteSirkuler(item)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors"
                                title="Sirküleri Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Sil</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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

        {/* 7. SITE & FIRMA GENEL AYARLARI */}
        {activeTab === "settings" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#1E2A3A]">Site & Firma Genel Ayarları</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Buradan güncelleyeceğiniz tüm iletişim, telefon, adres ve kurumsal bilgiler tüm web sitesinde (Navbar, Footer, Hero, İletişim vb.) otomatik yansır.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={settingsSaving}
                className="px-5 py-2.5 bg-[#44B9CD] hover:bg-[#389eb0] text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{settingsSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}</span>
              </button>
            </div>

            {settingsResult && (
              <div
                className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                  settingsResult.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800"
                }`}
              >
                {settingsResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{settingsResult.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Kurumsal Bilgiler */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#44B9CD]" />
                  <span>Kurumsal Tanıtım</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Firma Resmi Adı</label>
                    <input
                      type="text"
                      value={siteSettings.name || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Kısa Ad (Logo Yanı / Başlık)</label>
                    <input
                      type="text"
                      value={siteSettings.shortName || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, shortName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Slogan / Başlık</label>
                  <input
                    type="text"
                    value={siteSettings.slogan || ""}
                    onChange={(e) => setSiteSettings({ ...siteSettings, slogan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Firma Tanıtım Açıklaması</label>
                  <textarea
                    rows={2}
                    value={siteSettings.description || ""}
                    onChange={(e) => setSiteSettings({ ...siteSettings, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* İletişim Bilgileri */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#44B9CD]" />
                  <span>İletişim & Lokasyon</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Telefon (Görünen)</label>
                    <input
                      type="text"
                      value={siteSettings.phone || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      placeholder="0544 972 29 57"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Telefon (Tıklanabilir Tel Bağlantısı)</label>
                    <input
                      type="text"
                      value={siteSettings.phoneRaw || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, phoneRaw: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      placeholder="+905449722957"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">WhatsApp Numarası (Boşluksuz)</label>
                    <input
                      type="text"
                      value={siteSettings.whatsapp || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      placeholder="905449722957"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">E-Posta Adresi</label>
                    <input
                      type="email"
                      value={siteSettings.email || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      placeholder="info@kalemgumruk.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">WhatsApp Karşılama Mesajı</label>
                  <input
                    type="text"
                    value={siteSettings.whatsappDefaultMessage || ""}
                    onChange={(e) => setSiteSettings({ ...siteSettings, whatsappDefaultMessage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Açık Ofis Adresi</label>
                    <textarea
                      rows={2}
                      value={siteSettings.address || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Çalışma Saatleri</label>
                    <textarea
                      rows={2}
                      value={siteSettings.workingHours || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, workingHours: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Evrim Web Gümrük Müşteri Giriş Portalı URL</label>
                  <input
                    type="url"
                    value={siteSettings.evrimPortalUrl || ""}
                    onChange={(e) => setSiteSettings({ ...siteSettings, evrimPortalUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="https://webgumruk.com"
                  />
                </div>
              </div>

              {/* İstatistikler */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#44B9CD]" />
                  <span>Güven Sayaçları & Rakamlar</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Kuruluş Yılı</label>
                    <input
                      type="text"
                      value={siteSettings.foundedYear || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, foundedYear: e.target.value })}
                      placeholder="2024"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Mevzuat Uyumu</label>
                    <input
                      type="text"
                      value={siteSettings.complianceRate || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, complianceRate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Tecrübe (Metin)</label>
                    <input
                      type="text"
                      value={siteSettings.experienceYears || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, experienceYears: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">İntaç Oranı</label>
                    <input
                      type="text"
                      value={siteSettings.intacRate || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, intacRate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Destek / Takip</label>
                    <input
                      type="text"
                      value={siteSettings.supportHours || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, supportHours: e.target.value })}
                      placeholder="7/24 Destek"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={settingsSaving}
                  className="px-6 py-3 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] font-bold rounded-xl text-xs flex items-center gap-2 shadow transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{settingsSaving ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}</span>
                </button>
              </div>
            </form>

            {/* E-Posta & SMTP Servis Doğrulama Kartı */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-[#1E2A3A] flex items-center gap-2">
                    <span>📧 E-Posta Bildirim Servisi (Nodemailer SMTP)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    İletişim formu, fiyat teklifi ve web chatbot üzerinden iletilen tüm talepler anında <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700 font-semibold">kadir.kaya@kayapermit.com</code> adresine iletilir.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={testingSmtp}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{testingSmtp ? "Test E-Postası Gönderiliyor..." : "Canlı Test Maili Gönder"}</span>
                </button>
              </div>

              {smtpTestResult && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    smtpTestResult.success
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  <span>{smtpTestResult.success ? "✅" : "⚠️"}</span>
                  <span>{smtpTestResult.message}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 8. MÜŞAVİR MASASI & GEREKLİ BAĞLANTILAR */}
        {activeTab === "baglantilar" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-[#1E2A3A]">Müşavir Masası & Gerekli Bağlantılar Portalı</h3>
                <p className="text-xs text-slate-500">
                  Bu bağlantılar hem <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700">/araclar</code> sayfasında hem de sitenin altındaki Footer Müşavir Masası ve anasayfa kayan bandında görüntülenir.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewBaglanti}
                className="px-4 py-2 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] font-bold rounded-xl text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Bağlantı Ekle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {baglantilarList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#44B9CD] transition shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                        {item.tag || item.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Sıra: #{item.orderIndex}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-snug">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#44B9CD] hover:underline flex items-center gap-1 font-medium truncate"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.url}</span>
                    </a>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {item.isActive ? "Aktif (Sitede)" : "Pasif"}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditBaglanti(item)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Düzenle</span>
                      </button>

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDeleteBaglanti(item.id)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. HİZMET YÖNETİMİ CMS */}
        {activeTab === "services" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-[#1E2A3A]">Hizmet Yönetimi (Hizmetlerimiz CMS)</h3>
                <p className="text-xs text-slate-500">
                  Gümrükleme rejimleri ve danışmanlık hizmetlerinin detay içeriklerini, özellik maddelerini ve başlıklarını yönetin.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewService}
                className="px-4 py-2 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] font-bold rounded-xl text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Hizmet Ekle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicesList.map((srv) => (
                <div
                  key={srv.id || srv.slug}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#44B9CD] transition shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {srv.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">/{srv.slug}</span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{srv.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {srv.shortDesc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Link
                      href={`/hizmetlerimiz/${srv.slug}`}
                      target="_blank"
                      className="text-[#44B9CD] hover:underline flex items-center gap-1 font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Sayfayı Gör</span>
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditService(srv)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Düzenle</span>
                      </button>

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDeleteService(srv.id)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. REFERANS YÖNETİMİ */}
        {activeTab === "references" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-[#1E2A3A]">Müşteri Referansları & Partner Yönetimi</h3>
                <p className="text-xs text-slate-500">
                  Ana sayfadaki Referanslar bölümünde dönen kurumsal iş ortakları ve çalıştığınız firmalar.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewRef}
                className="px-4 py-2 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] font-bold rounded-xl text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Referans Ekle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {referencesList.map((ref) => (
                <div
                  key={ref.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#44B9CD] transition shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                      {ref.sector}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{ref.name}</h4>
                    {ref.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {ref.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditRef(ref)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Düzenle</span>
                    </button>
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDeleteReference(ref.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. KULLANICI VE YETKİ YÖNETİMİ (ADMIN ONLY) */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-[#1E2A3A] flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#44B9CD]" />
                  <span>Kullanıcı &amp; Yetki Yönetimi</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Yönetici (Admin) ve Editör hesaplarını yönetin. Editörlerin mevzuat, hizmet ve içerik yetkilerini özelleştirin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingUserId(null);
                  setUserResult(null);
                  setUserForm({
                    username: "",
                    name: "",
                    password: "",
                    role: "EDITOR",
                    permissions: {
                      canEditServices: true,
                      canEditSirkuler: true,
                      canEditBaglantilar: true,
                      canEditReferences: true,
                      canEditDocuments: true,
                      canEditForms: false,
                      canManageSettings: false,
                    },
                    isActive: true,
                  });
                  setUserModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#1E2A3A] hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#44B9CD]" />
                <span>Yeni Editör / Kullanıcı Ekle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usersList.map((u) => {
                const isAdmin = u.role === "ADMIN";
                const isSelf = currentUser?.id === u.id || currentUser?.username === u.username;
                const perms = u.permissions || {};

                return (
                  <div
                    key={u.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{u.name}</h4>
                          <span className="text-xs text-slate-400 font-mono">@{u.username}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            isAdmin
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {isAdmin ? "Admin (Tam Yetki)" : "Editör (Sınırlı)"}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-[11px]">
                        <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">
                          Yetki Özeti:
                        </span>
                        <div className="grid grid-cols-2 gap-1 text-slate-700">
                          <span className={isAdmin || perms.canEditSirkuler ? "text-emerald-700 font-medium" : "text-slate-400 line-through"}>
                            {isAdmin || perms.canEditSirkuler ? "✓" : "✗"} Mevzuat
                          </span>
                          <span className={isAdmin || perms.canEditServices ? "text-emerald-700 font-medium" : "text-slate-400 line-through"}>
                            {isAdmin || perms.canEditServices ? "✓" : "✗"} Hizmetler
                          </span>
                          <span className={isAdmin || perms.canEditBaglantilar ? "text-emerald-700 font-medium" : "text-slate-400 line-through"}>
                            {isAdmin || perms.canEditBaglantilar ? "✓" : "✗"} Portallar
                          </span>
                          <span className={isAdmin || perms.canEditReferences ? "text-emerald-700 font-medium" : "text-slate-400 line-through"}>
                            {isAdmin || perms.canEditReferences ? "✓" : "✗"} Referanslar
                          </span>
                          <span className={isAdmin || perms.canEditDocuments ? "text-emerald-700 font-medium" : "text-slate-400 line-through"}>
                            {isAdmin || perms.canEditDocuments ? "✓" : "✗"} Belgeler
                          </span>
                          <span className={isAdmin ? "text-emerald-700 font-medium" : "text-red-600 font-bold"}>
                            {isAdmin ? "✓ Silme" : "✗ Silme Yasak"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUserId(u.id);
                          setUserResult(null);
                          setUserForm({
                            username: u.username,
                            name: u.name,
                            password: "",
                            role: u.role || "EDITOR",
                            permissions: u.permissions || {},
                            isActive: u.isActive !== undefined ? u.isActive : true,
                          });
                          setUserModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Düzenle &amp; Yetkiler</span>
                      </button>

                      {!isSelf && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Kullanıcıyı Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 12. VERİTABANI YEDEKLERİ (BACKUPS - ADMIN ONLY) */}
        {activeTab === "backups" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-[#1E2A3A] flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <span>Veritabanı Yedekleme &amp; Geri Yükleme (Disaster Recovery)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Her gece otomatik yedekler alınır. İstediğiniz zaman anlık manuel yedek alabilir veya seçtiğiniz bir yedeğe tek tıkla geri dönebilirsiniz.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCreateManualBackup}
                disabled={backupLoading}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Database className={`w-4 h-4 ${backupLoading ? "animate-spin" : ""}`} />
                <span>{backupLoading ? "Yedek Alınıyor..." : "Hemen Yeni Yedek Al"}</span>
              </button>
            </div>

            {/* Linux Sunucu CLI Bilgilendirme Kartı */}
            <div className="bg-[#1E2A3A] text-white p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#44B9CD]">
                <HardDrive className="w-4 h-4" />
                <span>Linux Sunucu Terminal / Bash Komutları</span>
              </div>
              <p className="text-xs text-slate-300">
                Web paneline erişemediğiniz acil durumlarda Linux sunucunuzda terminalden doğrudan şu komutları çalıştırabilirsiniz:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block mb-1"># Anlık Yedek Al:</span>
                  <span className="text-emerald-400">./scripts/backup.sh</span>
                </div>
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block mb-1"># İstenen Yedekten Geri Yükle:</span>
                  <span className="text-cyan-400">./scripts/restore.sh</span>
                </div>
              </div>
            </div>

            {/* Yedekler Tablosu */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-500" />
                  <span>Kayıtlı Veritabanı Yedekleri ({backupsList.length})</span>
                </h4>
                <button
                  type="button"
                  onClick={() => fetchBackupsList()}
                  className="text-xs text-[#0e7490] hover:underline font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Yenile
                </button>
              </div>

              {backupsList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Henüz kayıtlı veritabanı yedeği bulunmuyor. Yukarıdaki butona tıklayarak ilk yedeği alabilirsiniz.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Dosya Adı</th>
                        <th className="py-3 px-4">Tür</th>
                        <th className="py-3 px-4">Boyut</th>
                        <th className="py-3 px-4">Oluşturulma Tarihi</th>
                        <th className="py-3 px-4">Açıklama</th>
                        <th className="py-3 px-4 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {backupsList.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.filename}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                b.backupType === "AUTOMATIC"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : b.backupType === "PRE_RESTORE"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              {b.backupType === "AUTOMATIC"
                                ? "Otomatik Gece"
                                : b.backupType === "PRE_RESTORE"
                                ? "Emniyet Yedeği"
                                : "Manuel Alındı"}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono">{b.sizeFormatted}</td>
                          <td className="py-3 px-4 text-slate-500">{b.createdAtFormatted}</td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">{b.note || "-"}</td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <a
                              href={`/api/admin/backups/download/${encodeURIComponent(b.filename)}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                              title="Yedek Dosyasını İndir"
                            >
                              <Download className="w-3 h-3" />
                              <span>İndir</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBackupToRestore(b.filename);
                                setRestoreResult(null);
                                setRestoreModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition cursor-pointer"
                              title="Bu yedeğe geri dön"
                            >
                              <RotateCcw className="w-3 h-3 text-amber-700" />
                              <span>Bu Yedeğe Dön</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      </div>

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
                  {selectedSubmission.formSlug === "chatbot"
                    ? "Chatbot Danışma & Sohbet Kaydı"
                    : `Talep Detayı: ${formsList.find((f) => f.slug === selectedSubmission.formSlug)?.title || selectedSubmission.formSlug}`}
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

            {/* Chatbot Özel Sohbet Geçmişi */}
            {Array.isArray(selectedSubmission.data?.chatHistory) && selectedSubmission.data.chatHistory.length > 0 && (
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-[#44B9CD]/30 space-y-3">
                <h4 className="text-xs font-bold text-[#1E2A3A] uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#44B9CD]" />
                  <span>Chatbot Canlı Sohbet Dökümü ({selectedSubmission.data.chatHistory.length} Mesaj)</span>
                </h4>
                <div className="space-y-2.5 max-h-72 overflow-y-auto p-3 bg-white rounded-xl border border-slate-200/80">
                  {selectedSubmission.data.chatHistory.map((m: any, idx: number) => {
                    const isUser = m.sender === "user";
                    return (
                      <div key={idx} className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                            isUser
                              ? "bg-[#1E2A3A] text-white rounded-tr-xs"
                              : "bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/60"
                          }`}
                        >
                          <div className={`text-[10px] mb-1 font-bold ${isUser ? "text-[#44B9CD]" : "text-slate-500"}`}>
                            {isUser ? "👤 Ziyaretçi" : "🤖 Kalem Asistan"} {m.time ? `(${m.time})` : ""}
                          </div>
                          <div className="whitespace-pre-line">{m.text}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Doldurulan Alanlar */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Müşteri Yanıtları &amp; Başvuru Bilgileri
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {Object.entries(selectedSubmission.data || {})
                  .filter(([key]) => key !== "chatHistory")
                  .map(([key, val]: [string, any]) => {
                  const matchingForm = formsList.find((f) => f.slug === selectedSubmission.formSlug);
                  const matchingField = matchingForm?.fields?.find((f: any) => f.name === key);
                  const displayLabel = matchingField?.label || key;

                  return (
                    <div key={key} className="space-y-1 bg-white p-3 rounded-xl border border-slate-200/70">
                      <span className="text-slate-400 text-[11px] font-bold block">{displayLabel}</span>
                      <p className="font-semibold text-slate-900 break-words whitespace-pre-line">{String(val || "-")}</p>
                    </div>
                  );
                })}
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
              {canDelete ? (
                <button
                  type="button"
                  onClick={() => deleteSubmission(selectedSubmission.id)}
                  className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kaydı Sil</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">Editör Modu (Silme Kapalı)</span>
              )}

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

      {/* 2. Müşavir Masası Bağlantı Modalı */}
      {baglantiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#44B9CD]">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {editingBaglanti ? "Müşavir Portalını Düzenle" : "Yeni Müşavir Portalı / Bağlantı Ekle"}
                  </h3>
                  <p className="text-xs text-slate-500">Müşavir masası, araçlar ve footer linklerini yönetin</p>
                </div>
              </div>
              <button
                onClick={() => setBaglantiModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBaglanti} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tam Başlık</label>
                  <input
                    type="text"
                    required
                    value={baglantiForm.title}
                    onChange={(e) => setBaglantiForm({ ...baglantiForm, title: e.target.value })}
                    placeholder="Örn: UPS Kargo Takip & Gümrük"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Kısa Menü Başlığı</label>
                  <input
                    type="text"
                    required
                    value={baglantiForm.shortTitle}
                    onChange={(e) => setBaglantiForm({ ...baglantiForm, shortTitle: e.target.value })}
                    placeholder="Örn: UPS Kargo Takip"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Kategori</label>
                  <select
                    value={baglantiForm.category}
                    onChange={(e) => setBaglantiForm({ ...baglantiForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  >
                    <option value="Kargo & Hava/Deniz">Kargo & Hava/Deniz</option>
                    <option value="Liman & Konteyner">Liman & Konteyner</option>
                    <option value="Resmi Sistemler">Resmi Sistemler</option>
                    <option value="Maliye & E-Belge">Maliye & E-Belge</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Rozet / Etiket</label>
                  <input
                    type="text"
                    value={baglantiForm.tag}
                    onChange={(e) => setBaglantiForm({ ...baglantiForm, tag: e.target.value })}
                    placeholder="Örn: Kargo Takip, Liman Sistemi..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Hedef URL (Web Bağlantısı)</label>
                <input
                  type="url"
                  required
                  value={baglantiForm.url}
                  onChange={(e) => setBaglantiForm({ ...baglantiForm, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Görsel / Logo Yolu</label>
                <input
                  type="text"
                  value={baglantiForm.image}
                  onChange={(e) => setBaglantiForm({ ...baglantiForm, image: e.target.value })}
                  placeholder="/images/baglantilar/ups.png veya web URL"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Açıklama</label>
                <textarea
                  rows={2}
                  value={baglantiForm.description}
                  onChange={(e) => setBaglantiForm({ ...baglantiForm, description: e.target.value })}
                  placeholder="Portalın ne amaçla kullanıldığı hakkında kısa bilgi..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-center pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Sıralama Önceliği</label>
                  <input
                    type="number"
                    value={baglantiForm.orderIndex}
                    onChange={(e) => setBaglantiForm({ ...baglantiForm, orderIndex: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="baglantiActive"
                    checked={baglantiForm.isActive}
                    onChange={(e) => setBaglantiForm({ ...baglantiForm, isActive: e.target.checked })}
                    className="w-5 h-5 rounded text-[#1E2A3A] focus:ring-[#44B9CD] border-slate-300"
                  />
                  <label htmlFor="baglantiActive" className="text-sm font-semibold text-slate-700 cursor-pointer">
                    Yayında / Aktif
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBaglantiModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1E2A3A] hover:bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-colors"
                >
                  <Save className="w-4 h-4 text-[#44B9CD]" />
                  <span>{editingBaglanti ? "Değişiklikleri Kaydet" : "Bağlantıyı Ekle"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Hizmet Modalı */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#44B9CD]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {editingService ? "Gümrük Hizmetini Düzenle" : "Yeni Gümrük Hizmeti Ekle"}
                  </h3>
                  <p className="text-xs text-slate-500">Hizmetlerimiz sayfası ve anasayfa kartlarını yönetin</p>
                </div>
              </div>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Hizmet Başlığı</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title
                        .toLowerCase()
                        .replace(/ğ/g, "g")
                        .replace(/ü/g, "u")
                        .replace(/ş/g, "s")
                        .replace(/ı/g, "i")
                        .replace(/ö/g, "o")
                        .replace(/ç/g, "c")
                        .replace(/[^a-z0-9]/g, "-")
                        .replace(/-+/g, "-")
                        .replace(/^-|-$/g, "");
                      setServiceForm({
                        ...serviceForm,
                        title,
                        slug: serviceForm.slug ? serviceForm.slug : slug,
                      });
                    }}
                    placeholder="Örn: İthalat Gümrükleme Hizmetleri"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.slug}
                    onChange={(e) => setServiceForm({ ...serviceForm, slug: e.target.value })}
                    placeholder="ithalat-gumrukleme"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Hizmet Kategorisi</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  >
                    <option value="gumruk">Gümrük İşlemleri</option>
                    <option value="rejim">Özel Rejimler</option>
                    <option value="danismanlik">Mevzuat & Danışmanlık</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Lucide İkon Adı</label>
                  <input
                    type="text"
                    value={serviceForm.iconName}
                    onChange={(e) => setServiceForm({ ...serviceForm, iconName: e.target.value })}
                    placeholder="ArrowDownToLine, ArrowUpFromLine, RefreshCw..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kısa Açıklama / Özet</label>
                <textarea
                  rows={2}
                  required
                  value={serviceForm.shortDesc}
                  onChange={(e) => setServiceForm({ ...serviceForm, shortDesc: e.target.value })}
                  placeholder="Hizmetin temel kapsamını anlatan kısa özet cümle..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Öne Çıkan Özellikler / Maddeler <span className="font-normal text-slate-400">(Her satıra bir madde yazın)</span>
                </label>
                <textarea
                  rows={4}
                  value={serviceForm.featuresText}
                  onChange={(e) => setServiceForm({ ...serviceForm, featuresText: e.target.value })}
                  placeholder="GTİP Tespiti ve Tarife Analizi&#10;Mevzuat ve İzin Uygunluk Kontrolü&#10;TAREKS ve DTS Başvuruları&#10;Hızlı ve Güvenli Beyanname Tescili"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Detaylı İçerik / Süreç Açıklaması</label>
                <textarea
                  rows={4}
                  value={serviceForm.detailedContent}
                  onChange={(e) => setServiceForm({ ...serviceForm, detailedContent: e.target.value })}
                  placeholder="Hizmetin operasyonel akışını, yasal dayanaklarını ve müşteriye sağlanan katma değeri anlatan detaylı metin..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-center pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Sıralama Önceliği</label>
                  <input
                    type="number"
                    value={serviceForm.orderIndex}
                    onChange={(e) => setServiceForm({ ...serviceForm, orderIndex: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="serviceActive"
                    checked={serviceForm.isActive}
                    onChange={(e) => setServiceForm({ ...serviceForm, isActive: e.target.checked })}
                    className="w-5 h-5 rounded text-[#1E2A3A] focus:ring-[#44B9CD] border-slate-300"
                  />
                  <label htmlFor="serviceActive" className="text-sm font-semibold text-slate-700 cursor-pointer">
                    Yayında / Aktif
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1E2A3A] hover:bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-colors"
                >
                  <Save className="w-4 h-4 text-[#44B9CD]" />
                  <span>{editingService ? "Değişiklikleri Kaydet" : "Hizmeti Ekle"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Referans Modalı */}
      {refModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#44B9CD]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {editingRef ? "Referansı Düzenle" : "Yeni Referans Ekle"}
                  </h3>
                  <p className="text-xs text-slate-500">Müşteri portföyü ve kurumsal referansları yönetin</p>
                </div>
              </div>
              <button
                onClick={() => setRefModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReference} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Firma / Marka Adı</label>
                <input
                  type="text"
                  required
                  value={refForm.name}
                  onChange={(e) => setRefForm({ ...refForm, name: e.target.value })}
                  placeholder="Örn: NOVA Kimya San. Tic. A.Ş."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Faaliyet Sektörü</label>
                  <input
                    type="text"
                    required
                    value={refForm.sector}
                    onChange={(e) => setRefForm({ ...refForm, sector: e.target.value })}
                    placeholder="Örn: Kimya & Polimer"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Logo URL (İsteğe Bağlı)</label>
                  <input
                    type="text"
                    value={refForm.logoUrl}
                    onChange={(e) => setRefForm({ ...refForm, logoUrl: e.target.value })}
                    placeholder="/images/references/logo.svg"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Açıklama / Sağlanan Hizmet Kapsamı</label>
                <textarea
                  rows={3}
                  value={refForm.description}
                  onChange={(e) => setRefForm({ ...refForm, description: e.target.value })}
                  placeholder="Örn: Hammadde ithalatı ve dahilde işleme rejimi operasyonları..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-center pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Sıralama Önceliği</label>
                  <input
                    type="number"
                    value={refForm.orderIndex}
                    onChange={(e) => setRefForm({ ...refForm, orderIndex: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="refActive"
                    checked={refForm.isActive}
                    onChange={(e) => setRefForm({ ...refForm, isActive: e.target.checked })}
                    className="w-5 h-5 rounded text-[#1E2A3A] focus:ring-[#44B9CD] border-slate-300"
                  />
                  <label htmlFor="refActive" className="text-sm font-semibold text-slate-700 cursor-pointer">
                    Yayında / Aktif
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRefModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1E2A3A] hover:bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-colors"
                >
                  <Save className="w-4 h-4 text-[#44B9CD]" />
                  <span>{editingRef ? "Değişiklikleri Kaydet" : "Referansı Ekle"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DİNAMİK FORM BUILDER MODALI */}
      {newFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Başlığı */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0e7490]">
                  <FileText className="w-5 h-5 text-[#44B9CD]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {editingFormId ? "Formu Düzenle" : "Yeni Web Sitesi Formu Tanımla"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kod yazmadan alanları belirleyin, otomatik e-posta ve bağlantı şablonu oluşturun.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNewFormModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSaveError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formSaveError}</span>
              </div>
            )}

            <form onSubmit={handleSaveForm} className="space-y-6">
              {/* BÖLÜM 1: GENEL BİLGİLER */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>1. Formun Temel Bilgileri</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Form Başlığı *</label>
                    <input
                      type="text"
                      required
                      value={newForm.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewForm((prev) => ({
                          ...prev,
                          title: val,
                          slug: editingFormId ? prev.slug : slugifyText(val),
                        }));
                      }}
                      placeholder="Örn: İthalat Gümrükleme Teklif Formu"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      URL Bağlantısı (Slug) *{" "}
                      <span className="font-normal text-slate-400">/tr/form/[slug]</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newForm.slug}
                      onChange={(e) =>
                        setNewForm((prev) => ({ ...prev, slug: slugifyText(e.target.value) }))
                      }
                      placeholder="ithalat-gumrukleme-teklif"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-[#0e7490] focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Kategori</label>
                    <select
                      value={newForm.category}
                      onChange={(e) => setNewForm((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                    >
                      <option value="QUOTE">Fiyat Teklifi (QUOTE)</option>
                      <option value="CONTACT">İletişim & Danışma (CONTACT)</option>
                      <option value="CAREER">İş & Staj (CAREER)</option>
                      <option value="FEEDBACK">Memnuniyet & Anket (FEEDBACK)</option>
                      <option value="GENERAL">Genel Başvuru (GENERAL)</option>
                      <option value="CUSTOM">Özel Form (CUSTOM)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Form Açıklaması</label>
                    <input
                      type="text"
                      value={newForm.description}
                      onChange={(e) => setNewForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Formun üzerinde ziyaretçilere gösterilecek kısa açıklama..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="formIsActive"
                    checked={newForm.isActive}
                    onChange={(e) => setNewForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#1E2A3A] focus:ring-[#44B9CD] border-slate-300"
                  />
                  <label htmlFor="formIsActive" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Bu form web sitesinde aktif olarak yayında olsun
                  </label>
                </div>
              </div>

              {/* BÖLÜM 2: DİNAMİK FORM ALANLARI */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>2. Form Alanları ({newForm.fields.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddFormField}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-[#0e7490] rounded-xl text-xs font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Alan Ekle</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {newForm.fields.map((field, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 transition-all hover:border-slate-300"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-4 space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">Alan Etiketi (Görünen Başlık) *</label>
                          <input
                            type="text"
                            required
                            value={field.label}
                            onChange={(e) => handleFormFieldChange(idx, "label", e.target.value)}
                            placeholder="Örn: Vergi Numarası"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#44B9CD]"
                          />
                        </div>

                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">Alan Tipi</label>
                          <select
                            value={field.type}
                            onChange={(e) => handleFormFieldChange(idx, "type", e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#44B9CD]"
                          >
                            <option value="text">Kısa Metin (Text)</option>
                            <option value="textarea">Uzun Metin (Textarea)</option>
                            <option value="email">E-Posta (Email)</option>
                            <option value="tel">Telefon (Tel)</option>
                            <option value="number">Sayı (Number)</option>
                            <option value="select">Seçim Listesi (Select)</option>
                            <option value="file">Dosya Yükleme (File / PDF)</option>
                          </select>
                        </div>

                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">İpucu / Placeholder</label>
                          <input
                            type="text"
                            value={field.placeholder || ""}
                            onChange={(e) => handleFormFieldChange(idx, "placeholder", e.target.value)}
                            placeholder="Örn: 10 haneli VKN"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#44B9CD]"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-4">
                          <label className="inline-flex items-center gap-1 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => handleFormFieldChange(idx, "required", e.target.checked)}
                              className="rounded text-[#1E2A3A] focus:ring-[#44B9CD] border-slate-300"
                            />
                            <span className="text-[11px] font-semibold">Zorunlu</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => handleRemoveFormField(idx)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Bu Alanı Kaldır"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {field.type === "select" && (
                        <div className="pt-2 border-t border-slate-200/70 space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">
                            Seçenekler <span className="font-normal text-slate-400">(Virgülle ayırarak yazınız)</span>
                          </label>
                          <input
                            type="text"
                            value={typeof field.options === "string" ? field.options : Array.isArray(field.options) ? field.options.join(", ") : ""}
                            onChange={(e) => handleFormFieldChange(idx, "options", e.target.value)}
                            placeholder="Örn: İthalat, İhracat, Transit, Antrepo"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#44B9CD]"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* BÖLÜM 3: E-POSTA VE YANIT AYARLARI */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>3. Otomatik Bildirim &amp; E-Posta Ayarları</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Yönetici Bildirim E-Postası{" "}
                      <span className="font-normal text-slate-400">(Boş bırakılırsa şirket maili kullanılır)</span>
                    </label>
                    <input
                      type="email"
                      value={newForm.notificationEmail}
                      onChange={(e) =>
                        setNewForm((prev) => ({ ...prev, notificationEmail: e.target.value }))
                      }
                      placeholder="operasyon@kalemgumruk.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Müşteriye Gidecek E-Posta Konusu</label>
                    <input
                      type="text"
                      value={newForm.autoEmailSubject}
                      onChange={(e) =>
                        setNewForm((prev) => ({ ...prev, autoEmailSubject: e.target.value }))
                      }
                      placeholder="Talebiniz Alındı | Kalem Gümrük [{{refNo}}]"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Müşteri Otomatik Onay E-Postası Metni{" "}
                    <span className="font-normal text-slate-400">(Değişkenler: &#123;&#123;fullName&#125;&#125;, &#123;&#123;refNo&#125;&#125;, &#123;&#123;formTitle&#125;&#125;)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={newForm.autoEmailBody}
                    onChange={(e) =>
                      setNewForm((prev) => ({ ...prev, autoEmailBody: e.target.value }))
                    }
                    placeholder="Sayın Yetkili, talebiniz alınmıştır..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Web Sitesindeki Teşekkür Mesajı</label>
                  <input
                    type="text"
                    value={newForm.successMessage}
                    onChange={(e) =>
                      setNewForm((prev) => ({ ...prev, successMessage: e.target.value }))
                    }
                    placeholder="Talebiniz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçilecektir."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>
              </div>

              {/* MODAL AKSİYON BUTONLARI */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNewFormModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="px-6 py-2.5 bg-[#1E2A3A] hover:bg-slate-900 disabled:bg-slate-400 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-colors"
                >
                  <Save className="w-4 h-4 text-[#44B9CD]" />
                  <span>{formSaving ? "Kaydediliyor..." : editingFormId ? "Değişiklikleri Güncelle" : "Formu Oluştur ve Yayınla"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MEVZUAT & SİRKÜLER EKLE / DÜZENLE MODALI */}
      {sirkulerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Başlığı */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {editingSirkulerId ? "Mevzuat / Sirküleri Düzenle" : "Yeni Mevzuat / Sirküler Yayınla"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Resmi Gazete kararları, tebliğler ve tarife güncellemelerini yönetin.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSirkulerModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {sirkulerResult && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                  sirkulerResult.success
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {sirkulerResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{sirkulerResult.message}</span>
              </div>
            )}

            {/* Hızlı Şablon Butonları (Verimlilik & Hız Çubuğu) */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-[#1E2A3A]">
                  <Sparkles className="w-3.5 h-3.5 text-[#44B9CD]" />
                  <span>Hızlı Mevzuat Şablonları (Tek Tıkla Doldur):</span>
                </span>
                <button
                  type="button"
                  onClick={() => applySirkulerTemplate("clear")}
                  className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Formu Temizle
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => applySirkulerTemplate("gozetim")}
                  className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-semibold transition-all shadow-2xs"
                >
                  📋 Gözetim &amp; Tolerans Tebliği Şablonu
                </button>
                <button
                  type="button"
                  onClick={() => applySirkulerTemplate("igv")}
                  className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-800 rounded-xl text-xs font-semibold transition-all shadow-2xs"
                >
                  🏷️ İlave Gümrük Vergisi (İGV) Şablonu
                </button>
                <button
                  type="button"
                  onClick={() => applySirkulerTemplate("pdf_only")}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 rounded-xl text-xs font-semibold transition-all shadow-2xs"
                >
                  📄 Sade PDF / Genelge Duyurusu
                </button>
              </div>
            </div>

            <form onSubmit={handleSirkulerPublish} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Sirküler / Mevzuat Başlığı (Konu) *</label>
                <input
                  type="text"
                  required
                  value={sirkulerForm.title}
                  onChange={(e) => setSirkulerForm({ ...sirkulerForm, title: e.target.value })}
                  placeholder="Örn: İTHALATI KAYIT BELGESİNE TABİ TEKSTİL VE KONFEKSİYON ÜRÜNLERİNE İLİŞKİN 2020/9 SAYILI GÖZETİM TEBLİĞİNDE DEĞİŞİKLİK YAPILDI"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Kategori</label>
                  <select
                    value={sirkulerForm.category}
                    onChange={(e) => setSirkulerForm({ ...sirkulerForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  >
                    <option value="İthalat & Vergi">İthalat & Vergi</option>
                    <option value="İhracat Rejimi">İhracat Rejimi</option>
                    <option value="Tarife & GTİP">Tarife & GTİP</option>
                    <option value="Menşe & Dolaşım">Menşe & Dolaşım</option>
                    <option value="Antrepo & Transit">Antrepo & Transit</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mevzuat Türü</label>
                  <input
                    type="text"
                    value={sirkulerForm.regulationType}
                    onChange={(e) => setSirkulerForm({ ...sirkulerForm, regulationType: e.target.value })}
                    placeholder="Tebliğ / Cumhurbaşkanı Kararı / Genelge"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Resmi Gazete No</label>
                  <input
                    type="text"
                    value={sirkulerForm.officialGazetteNumber}
                    onChange={(e) => setSirkulerForm({ ...sirkulerForm, officialGazetteNumber: e.target.value })}
                    placeholder="Örn: 32700"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">İlgili GTİP veya Fasıllar</label>
                  <input
                    type="text"
                    value={sirkulerForm.relatedGtip}
                    onChange={(e) => setSirkulerForm({ ...sirkulerForm, relatedGtip: e.target.value })}
                    placeholder="Örn: 50-63. Fasıllar veya 8471"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Resmi Kaynak / Gazete URL Bağlantısı</label>
                  <input
                    type="text"
                    value={sirkulerForm.sourceUrl}
                    onChange={(e) => setSirkulerForm({ ...sirkulerForm, sourceUrl: e.target.value })}
                    placeholder="https://www.resmigazete.gov.tr/..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                  />
                </div>
              </div>

              {/* PDF DOSYASI YÜKLEME ALANI (SÜRÜKLE - BIRAK / SEÇ) */}
              <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileDown className="w-4 h-4 text-[#44B9CD]" />
                    <span>Resmi Tebliğ / Karar Metni PDF Dosyası Yükle</span>
                  </label>
                  {sirkulerForm.pdfUrl && (
                    <button
                      type="button"
                      onClick={() => setSirkulerForm({ ...sirkulerForm, pdfUrl: "" })}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      PDF&apos;i Kaldır
                    </button>
                  )}
                </div>

                {sirkulerForm.pdfUrl ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold">PDF Dosyası Yüklendi ve Bağlandı</span>
                      <a
                        href={sirkulerForm.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:underline font-mono text-[11px]"
                      >
                        (Önizle)
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleSirkulerPdfUpload}
                      disabled={sirkulerPdfUploading}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1E2A3A] file:text-[#44B9CD] hover:file:bg-[#2A3B50] cursor-pointer"
                    />
                    {sirkulerPdfUploading && (
                      <span className="text-[11px] text-blue-600 font-semibold block pt-1">
                        PDF yükleniyor, lütfen bekleyin...
                      </span>
                    )}
                    <p className="text-[11px] text-slate-400">
                      Ziyaretçiler sayfada &quot;İlgili Tebliğ için lütfen tıklayınız&quot; butonuna bastığında bu PDF açılır.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Haber Özeti *</label>
                <textarea
                  rows={2}
                  required
                  value={sirkulerForm.summary}
                  onChange={(e) => setSirkulerForm({ ...sirkulerForm, summary: e.target.value })}
                  placeholder="Mevzuatın getirdiği temel değişiklik ve firmaları ilgilendiren özet..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Detaylı Mevzuat Metni &amp; Madde Değişiklikleri *</label>
                  <span className="text-[11px] text-slate-400">Yeni hali / Değiştirilmeden önceki hali maddelerini yazabilirsiniz</span>
                </div>
                <textarea
                  rows={7}
                  required
                  value={sirkulerForm.content}
                  onChange={(e) => setSirkulerForm({ ...sirkulerForm, content: e.target.value })}
                  placeholder="İthalatta Gözetim Uygulanmasına İlişkin Tebliğ'in yeni hali;&#10;&#10;(3) Gümrük beyannamesinin tescili sırasında...&#10;&#10;Değiştirilmeden önceki hali;&#10;(3) Gümrük beyannamesinin..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0e7490] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#44B9CD]" />
                  <span>Özel Müşavir Yorumu / Operasyonel Tavsiye (İsteğe Bağlı)</span>
                </label>
                <textarea
                  rows={3}
                  value={sirkulerForm.expertNote}
                  onChange={(e) => setSirkulerForm({ ...sirkulerForm, expertNote: e.target.value })}
                  placeholder="İthalatçılar veya ihracatçılar için bu mevzuata özel kritik bir tavsiyeniz varsa buraya yazabilirsiniz..."
                  className="w-full px-3.5 py-2.5 bg-cyan-50/40 border border-cyan-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#44B9CD]/20 focus:border-[#44B9CD]"
                />
                <p className="text-[11px] text-slate-400">
                  Genel mevzuat bilgilendirme ve danışmanlık uyarısı sitenin altında ve WhatsApp metninde otomatik olarak tek sefer yer alır.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="sirkulerIsPublished"
                  checked={sirkulerForm.isPublished}
                  onChange={(e) => setSirkulerForm({ ...sirkulerForm, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-[#1E2A3A] focus:ring-[#44B9CD] border-slate-300"
                />
                <label htmlFor="sirkulerIsPublished" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Bu sirküleri web sitesinde hemen yayına al (Aktif)
                </label>
              </div>

              {/* MODAL AKSİYONLARI */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSirkulerModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={sirkulerSubmitting}
                  className="px-6 py-2.5 bg-[#1E2A3A] hover:bg-slate-900 disabled:bg-slate-400 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-colors"
                >
                  <Save className="w-4 h-4 text-[#44B9CD]" />
                  <span>
                    {sirkulerSubmitting
                      ? "Kaydediliyor..."
                      : editingSirkulerId
                      ? "Değişiklikleri Güncelle"
                      : "Sirküleri Yayınla"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. KULLANICI & EDİTÖR HESABI DÜZENLEME MODALI (ADMIN ONLY) */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {editingUserId ? "Kullanıcı / Yetkileri Düzenle" : "Yeni Editör / Kullanıcı Tanımla"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kullanıcı rolünü ve editörlerin erişim izinlerini yapılandırın.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {userResult && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                  userResult.success
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {userResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{userResult.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    placeholder="Örn: Ayşe Kaya"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#44B9CD]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Kullanıcı Adı *</label>
                  <input
                    type="text"
                    required
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    placeholder="Örn: editor"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#44B9CD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Şifre {editingUserId ? "(Değiştirmek istemiyorsanız boş bırakın)" : "*"}
                  </label>
                  <input
                    type="password"
                    required={!editingUserId}
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#44B9CD]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Hesap Rolü *</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#44B9CD]"
                  >
                    <option value="EDITOR">Editör (Mevzuat &amp; İçerik Düzenleme)</option>
                    <option value="ADMIN">Sistem Yöneticisi (Admin - Tam Yetki)</option>
                  </select>
                </div>
              </div>

              {/* Editör İzinleri (Yalnızca Editör seçiliyse gösterilir) */}
              {userForm.role === "EDITOR" && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800 block">Editör Yetki Ayarları:</span>
                  <div className="space-y-2 text-xs text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userForm.permissions.canEditSirkuler}
                        onChange={(e) =>
                          setUserForm({
                            ...userForm,
                            permissions: { ...userForm.permissions, canEditSirkuler: e.target.checked },
                          })
                        }
                        className="rounded text-[#1E2A3A] focus:ring-[#44B9CD]"
                      />
                      <span>Mevzuat ve Sirküler CMS (Ekleme ve Düzenleme)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userForm.permissions.canEditServices}
                        onChange={(e) =>
                          setUserForm({
                            ...userForm,
                            permissions: { ...userForm.permissions, canEditServices: e.target.checked },
                          })
                        }
                        className="rounded text-[#1E2A3A] focus:ring-[#44B9CD]"
                      />
                      <span>Hizmet Yönetimi (Ekleme ve Düzenleme)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userForm.permissions.canEditBaglantilar}
                        onChange={(e) =>
                          setUserForm({
                            ...userForm,
                            permissions: { ...userForm.permissions, canEditBaglantilar: e.target.checked },
                          })
                        }
                        className="rounded text-[#1E2A3A] focus:ring-[#44B9CD]"
                      />
                      <span>Müşavir Masası &amp; Gerekli Bağlantılar</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userForm.permissions.canEditReferences}
                        onChange={(e) =>
                          setUserForm({
                            ...userForm,
                            permissions: { ...userForm.permissions, canEditReferences: e.target.checked },
                          })
                        }
                        className="rounded text-[#1E2A3A] focus:ring-[#44B9CD]"
                      />
                      <span>Müşteri Referansları Portföyü</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userForm.permissions.canEditDocuments}
                        onChange={(e) =>
                          setUserForm({
                            ...userForm,
                            permissions: { ...userForm.permissions, canEditDocuments: e.target.checked },
                          })
                        }
                        className="rounded text-[#1E2A3A] focus:ring-[#44B9CD]"
                      />
                      <span>İndirilebilir Evrak ve Belgeler</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userForm.permissions.canManageSettings}
                        onChange={(e) =>
                          setUserForm({
                            ...userForm,
                            permissions: { ...userForm.permissions, canManageSettings: e.target.checked },
                          })
                        }
                        className="rounded text-[#1E2A3A] focus:ring-[#44B9CD]"
                      />
                      <span>Site &amp; İletişim Ayarları Değiştirme</span>
                    </label>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[11px] text-red-600 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Güvenlik Kuralı: Editör kullanıcılarının silme yetkisi kesin olarak kapalıdır.</span>
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-700 transition"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={userSaving}
                  className="px-6 py-2.5 bg-[#1E2A3A] hover:bg-slate-900 disabled:bg-slate-400 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition"
                >
                  <Save className="w-4 h-4 text-[#44B9CD]" />
                  <span>{userSaving ? "Kaydediliyor..." : "Kullanıcıyı Kaydet"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. VERİTABANI GERİ YÜKLEME ONAY MODALI (ADMIN ONLY) */}
      {restoreModalOpen && selectedBackupToRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-bold text-slate-900 text-lg">
                Veritabanını Bu Yedekten Geri Yükle?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-mono bg-slate-100 p-2 rounded-xl text-slate-900 font-bold break-all">
                {selectedBackupToRestore}
              </p>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 space-y-1.5 leading-relaxed">
              <p className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                <span>Dikkat: Canlı Veritabanı Değişecektir</span>
              </p>
              <p>
                Program veritabanı seçilen yedek dosyasındaki durumuna geri dönecektir. Güvenlik amacıyla, mevcut verilerinizin kaybolmaması için işlem öncesinde otomatik bir <strong>Emniyet Yedeği (PRE_RESTORE)</strong> alınacaktır.
              </p>
            </div>

            {restoreResult && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                  restoreResult.success
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {restoreResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{restoreResult.message}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={restoreLoading}
                onClick={() => setRestoreModalOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={restoreLoading}
                onClick={handleConfirmRestore}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition"
              >
                <RotateCcw className={`w-4 h-4 ${restoreLoading ? "animate-spin" : ""}`} />
                <span>{restoreLoading ? "Geri Yükleniyor..." : "Evet, Bu Yedeği Geri Yükle"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
