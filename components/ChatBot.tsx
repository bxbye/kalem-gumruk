"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  CheckCircle2,
  ExternalLink,
  Phone,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { companyInfo } from "@/data/company";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  action?: "ask_contact" | "lead_success";
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Ziyaretçi iletişim bilgileri durumu
  const [hasProvidedContact, setHasProvidedContact] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Merhaba! Kalem Gümrük Müşavirliği dijital asistanına hoş geldiniz. 🚢\n\nİthalat, ihracat, GTİP tespiti, gümrük vergileri veya antrepo işlemleriniz hakkında sormak istediğiniz her şeyi yazabilirsiniz.",
      time: "Şimdi",
    },
  ]);

  const quickPrompts = [
    "İthalat gümrükleme maliyeti nedir?",
    "İhracat için hangi evraklar gerekir?",
    "GTİP tespiti nasıl yapılır?",
    "Müşavir ile doğrudan görüşmek istiyorum",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  // Akıllı Yanıt Üretimi
  const generateBotReply = (text: string) => {
    const lower = text.toLowerCase();
    let reply = "";

    if (lower.includes("ithalat") || lower.includes("getir") || lower.includes("vergi")) {
      reply =
        "İthalat işlemlerinde ürününüzün GTİP (Gümrük Tarife İstatistik Pozisyonu) koduna göre Gümrük Vergisi, İlave Gümrük Vergisi (İGV), KDV, ÖTV ve varsa TAREKS/TSE izinleri belirlenir. Liman ardiye ve navlun masraflarını önceden planlayarak dosyanızı sıfır gecikmeyle sonuçlandırıyoruz.";
    } else if (lower.includes("ihracat") || lower.includes("gönder") || lower.includes("yurtdışı")) {
      reply =
        "İhracat operasyonlarında fatura, çeki listesi ve ATR / EUR.1 / Menşe şahadetnamesi düzenlenerek ilgili ihracatçı birliği onayı ve gümrük beyannamesi tescili ivedilikle kapatılır. KDV iadesi süreçleriniz için intaç takibini Evrim portalımızdan anlık sunuyoruz.";
    } else if (lower.includes("gtip") || lower.includes("tarife") || lower.includes("kod")) {
      reply =
        "Eşyanın GTİP tespiti, ödenecek tüm vergileri ve gerekli bakanlık izinlerini belirleyen en kritik adımdır. Ürününüzün ticari tanımı, teknik özellikleri veya katalog bilgisiyle uzman müşavirlerimiz doğru GTİP tespitini yapmaktadır.";
    } else {
      reply =
        "Sorunuzu aldım. 1997'den bugüne A Karne yetkili gümrük müşavirlerimiz ve liman operasyon kadromuzla tüm dış ticaret rejimlerinde tam yetkiyle hizmet veriyoruz.";
    }

    return (
      reply +
      "\n\n📋 **Gümrük müşavirimizin dosyanızı inceleyip size özel maliyet çalışmasıyla dönüş yapabilmesi için:** Lütfen adınızı, firmanızı ve telefon numaranızı paylaşabilir misiniz?"
    );
  };

  // Kullanıcı Mesaj Gönderdiğinde
  const handleSendMessage = (textToSend?: string) => {
    const message = textToSend || inputText;
    if (!message.trim()) return;

    const userMsg: Message = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: message.trim(),
      time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    if (!userQuestion) {
      setUserQuestion(message.trim());
    }

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse = generateBotReply(message);
      const botMsg: Message = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: botResponse,
        time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        action: hasProvidedContact ? undefined : "ask_contact",
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 900);
  };

  // İletişim Bilgilerini Gönder ve Şirkete Haber Ver (Lead Submit)
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPhone || !contactName) return;

    setIsSubmittingLead(true);

    const contactSummary = `${contactName} (${contactCompany || "Şahıs/Bireysel"}) - Tel: ${contactPhone}`;

    try {
      await fetch("/api/chat-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactInfo: contactSummary,
          question: userQuestion || "Genel Danışmanlık Talebi",
          conversationHistory: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      setHasProvidedContact(true);

      setMessages((prev) => [
        ...prev,
        {
          id: "bot-lead-ok-" + Date.now(),
          sender: "bot",
          text: `✅ **Teşekkürler Sayın ${contactName}!**\n\nTalebiniz ve sorunuz gümrük müşavirlerimize anında iletildi. **${contactPhone}** numaranızdan en kısa sürede sizinle irtibata geçilecektir.\n\nDilerseniz hemen aşağıdaki butonla WhatsApp üzerinden de evrak/dosya gönderebilirsiniz.`,
          time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
          action: "lead_success",
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
    userQuestion
      ? `Merhaba Kalem Gümrük, web sitenizdeki asistan üzerinden yazmıştım. Sorun şuydu: "${userQuestion}". Detaylı bilgi alabilir miyim?`
      : companyInfo.whatsappDefaultMessage
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tetikleyici Buton */}
      {!isOpen && (
        <div className="relative group">
          {hasUnread && (
            <div className="hidden sm:flex absolute bottom-full right-0 mb-3 items-center gap-2 bg-[#1E2A3A] text-white text-xs py-2 px-3.5 rounded-2xl shadow-2xl border border-[#44B9CD]/40 animate-bounce">
              <span className="w-2 h-2 rounded-full bg-[#44B9CD] animate-ping"></span>
              <span className="font-semibold">Müşavir Asistanına Sorun</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Kalem Gümrük Asistanı"
            className="flex items-center justify-center w-14 h-14 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white rounded-full shadow-2xl transition-all duration-300 border-2 border-[#44B9CD] hover:scale-105 active:scale-95"
          >
            <Bot className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
          </button>
        </div>
      )}

      {/* Açık Sohbet Penceresi */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#1E2A3A] text-white p-4 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-[#44B9CD]/20 border border-[#44B9CD]/50 flex items-center justify-center text-[#44B9CD]">
                <Bot className="w-6 h-6" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#1E2A3A]"></span>
              </div>
              <div>
                <div className="font-bold text-sm flex items-center gap-1.5 text-white">
                  <span>Kalem Gümrük Asistanı</span>
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Çevrimiçi | Gümrük Müşavirliği</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp'a Geç"
                className="p-2 text-slate-300 hover:text-emerald-400 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mesaj Akışı */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-[#1E2A3A] text-white rounded-br-xs"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>

                {/* Eğer İletişim Bilgisi İsteniyorsa Dahili Mini Form Göster */}
                {msg.action === "ask_contact" && !hasProvidedContact && (
                  <div className="w-full mt-2 bg-white rounded-2xl p-3.5 border border-[#44B9CD]/40 shadow-sm space-y-2.5">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1 text-[#1E2A3A]">
                      <Sparkles className="w-3.5 h-3.5 text-[#44B9CD]" />
                      <span>Müşavirimizin Dönüş Yapması İçin İletişim Formu:</span>
                    </div>

                    <form onSubmit={handleLeadSubmit} className="space-y-2">
                      <input
                        type="text"
                        required
                        placeholder="Adınız Soyadınız *"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#44B9CD]"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Telefon Numaranız (Örn: 05xx) *"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#44B9CD]"
                      />
                      <input
                        type="text"
                        placeholder="Firma Adı (İsteğe bağlı)"
                        value={contactCompany}
                        onChange={(e) => setContactCompany(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#44B9CD]"
                      />

                      <button
                        type="submit"
                        disabled={isSubmittingLead}
                        className="w-full bg-[#1E2A3A] hover:bg-slate-800 text-[#44B9CD] font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isSubmittingLead ? "İletiliyor..." : "Müşavir Beni Arasın"}</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* Başarı Durumunda Doğrudan WhatsApp Butonu */}
                {msg.action === "lead_success" && (
                  <div className="w-full mt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Üzerinden Evrak / Dosya Gönder</span>
                    </a>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1 text-slate-400 text-xs p-2">
                <Bot className="w-4 h-4 text-[#44B9CD]" />
                <span className="animate-pulse">Müşavirlik asistanı yazıyor...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Hızlı Soru Çipleri */}
          {messages.length <= 2 && (
            <div className="p-2.5 bg-slate-100 border-t border-slate-200/70 overflow-x-auto flex gap-2 shrink-0">
              {quickPrompts.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white text-slate-700 hover:bg-[#1E2A3A] hover:text-[#44B9CD] border border-slate-200 text-[11px] font-medium transition-colors shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Mesaj Giriş Alanı */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Gümrükleme veya mevzuat hakkında soru yazın..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#44B9CD] focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-[#1E2A3A] hover:bg-[#2A3B50] text-[#44B9CD] hover:text-white rounded-xl transition-colors disabled:opacity-40"
                aria-label="Gönder"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 px-1">
              <span>Hızlı İletişim: {companyInfo.phone}</span>
              <a
                href={companyInfo.evrimPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#44B9CD] hover:underline"
              >
                Evrim Girişi →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
