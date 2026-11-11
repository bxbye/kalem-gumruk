"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImagePlus,
  Undo2,
  Redo2,
  RemoveFormatting,
  Loader2,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { plainTextToHtml, sanitizeRichHtml, stripHtml } from "@/lib/htmlUtils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onUploadImage: (file: File) => Promise<string>;
  placeholder?: string;
  minHeight?: number;
}

interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  unorderedList: boolean;
  orderedList: boolean;
  heading: boolean;
  blockquote: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  onUploadImage,
  placeholder = "Mevzuat hakkındaki yorumunuzu yazın, kelimeleri kalın/italik yapın veya fotoğraf ekleyin...",
  minHeight = 240,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const lastEmittedHtmlRef = useRef<string>("");

  const [isEmpty, setIsEmpty] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState("https://");

  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({
    bold: false,
    italic: false,
    underline: false,
    unorderedList: false,
    orderedList: false,
    heading: false,
    blockquote: false,
  });

  const checkEmptyState = useCallback((html: string) => {
    const hasImage = /<img\b/i.test(html);
    const hasText = stripHtml(html).length > 0;
    setIsEmpty(!hasImage && !hasText);
  }, []);

  // Dışarıdan gelen value değişimlerini editöre senkronize et (ör. modal açılışı / şablon)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    const normalizedIncoming = plainTextToHtml(value || "");
    if (value === lastEmittedHtmlRef.current || normalizedIncoming === lastEmittedHtmlRef.current) {
      checkEmptyState(el.innerHTML);
      return;
    }

    el.innerHTML = normalizedIncoming;
    lastEmittedHtmlRef.current = normalizedIncoming;
    checkEmptyState(normalizedIncoming);
  }, [value, checkEmptyState]);

  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const rawHtml = el.innerHTML;
    const hasImage = /<img\b/i.test(rawHtml);
    const hasText = stripHtml(rawHtml).length > 0;
    const cleanOut = hasImage || hasText ? rawHtml : "";

    lastEmittedHtmlRef.current = cleanOut;
    checkEmptyState(cleanOut);
    onChange(cleanOut);
  }, [onChange, checkEmptyState]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (savedRangeRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  }, []);

  const updateToolbarState = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !el.contains(sel.anchorNode)) return;

    try {
      const blockValue = String(document.queryCommandValue("formatBlock") || "").toLowerCase();
      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        unorderedList: document.queryCommandState("insertUnorderedList"),
        orderedList: document.queryCommandState("insertOrderedList"),
        heading: blockValue === "h3" || blockValue === "h2",
        blockquote: blockValue === "blockquote",
      });
    } catch {
      // Tarayıcı desteği yoksa sessizce devam et
    }
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      saveSelection();
      updateToolbarState();
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [saveSelection, updateToolbarState]);

  const runCommand = (command: string, commandValue?: string) => {
    restoreSelection();
    try {
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch {}
    document.execCommand(command, false, commandValue);
    saveSelection();
    updateToolbarState();
    emitChange();
  };

  const toggleBlock = (tag: "h3" | "blockquote") => {
    restoreSelection();
    const currentBlock = String(document.queryCommandValue("formatBlock") || "").toLowerCase();
    const nextTag = currentBlock === tag ? "p" : tag;
    document.execCommand("formatBlock", false, `<${nextTag}>`);
    saveSelection();
    updateToolbarState();
    emitChange();
  };

  const handleOpenLinkPopover = () => {
    saveSelection();
    setLinkUrlInput("https://");
    setLinkPopoverOpen((prev) => !prev);
  };

  const handleInsertLink = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = linkUrlInput.trim();
    if (!trimmed || trimmed === "https://") {
      setLinkPopoverOpen(false);
      return;
    }

    const safeHref = /^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.isCollapsed) {
      const anchor = document.createElement("a");
      anchor.href = safeHref;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = safeHref;
      const range = sel.getRangeAt(0);
      range.insertNode(anchor);
      range.setStartAfter(anchor);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      document.execCommand("createLink", false, safeHref);
      // Eklenen bağlantıya target="_blank" ekle
      if (editorRef.current) {
        const anchors = editorRef.current.querySelectorAll(`a[href="${safeHref}"]`);
        anchors.forEach((a) => {
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        });
      }
    }

    setLinkPopoverOpen(false);
    emitChange();
  };

  const insertImageAtCursor = useCallback(
    (url: string, altText: string) => {
      const el = editorRef.current;
      if (!el) return;

      restoreSelection();

      const img = document.createElement("img");
      img.src = url;
      img.alt = altText || "Mevzuat görseli";

      const pAfter = document.createElement("p");
      pAfter.innerHTML = "<br>";

      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && el.contains(sel.getRangeAt(0).commonAncestorContainer)) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(pAfter);
        range.insertNode(img);

        const newRange = document.createRange();
        newRange.setStart(pAfter, 0);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      } else {
        el.appendChild(img);
        el.appendChild(pAfter);
      }

      saveSelection();
      emitChange();
    },
    [restoreSelection, saveSelection, emitChange]
  );

  const handleImageFiles = useCallback(
    async (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (imageFiles.length === 0) return;

      setUploadError(null);
      setIsUploadingImage(true);
      try {
        for (const file of imageFiles) {
          const uploadedUrl = await onUploadImage(file);
          if (uploadedUrl) {
            insertImageAtCursor(uploadedUrl, file.name.replace(/\.[^/.]+$/, ""));
          }
        }
      } catch (err: any) {
        setUploadError(err?.message || "Fotoğraf yüklenirken bir hata oluştu.");
      } finally {
        setIsUploadingImage(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [onUploadImage, insertImageAtCursor]
  );

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = Array.from(e.clipboardData?.items || []);
    const pastedImageFiles: File[] = [];

    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) pastedImageFiles.push(file);
      }
    }

    if (pastedImageFiles.length > 0) {
      e.preventDefault();
      await handleImageFiles(pastedImageFiles);
      return;
    }

    // Zengin HTML yapıştırıldığında gereksiz/zararlı stilleri temizleyerek yapıştır
    const htmlData = e.clipboardData?.getData("text/html");
    if (htmlData) {
      e.preventDefault();
      const cleaned = sanitizeRichHtml(htmlData);
      document.execCommand("insertHTML", false, cleaned);
      emitChange();
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    setIsDraggingOver(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const hasImage = Array.from(files).some((f) => f.type.startsWith("image/"));
      if (hasImage) {
        e.preventDefault();
        await handleImageFiles(files);
      }
    }
  };

  const toolbarBtnClass = (active?: boolean) =>
    `p-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
      active
        ? "bg-[#1E2A3A] text-[#44B9CD] shadow-2xs"
        : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
    }`;

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs focus-within:ring-2 focus-within:ring-[#44B9CD]/25 focus-within:border-[#44B9CD] transition-all">
      {/* ÜST ARAÇ ÇUBUĞU (TOOLBAR) */}
      <div className="bg-slate-50/90 border-b border-slate-200 px-2.5 py-2 flex flex-wrap items-center gap-1">
        {/* Metin Biçimlendirme */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              runCommand("bold");
            }}
            className={toolbarBtnClass(activeFormats.bold)}
            title="Kalın (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              runCommand("italic");
            }}
            className={toolbarBtnClass(activeFormats.italic)}
            title="İtalik (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              runCommand("underline");
            }}
            className={toolbarBtnClass(activeFormats.underline)}
            title="Altı Çizili (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        {/* Başlık ve Alıntı */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlock("h3");
            }}
            className={toolbarBtnClass(activeFormats.heading)}
            title="Alt Başlık"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlock("blockquote");
            }}
            className={toolbarBtnClass(activeFormats.blockquote)}
            title="Alıntı / Önemli Not Bloğu"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Listeler */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              runCommand("insertUnorderedList");
            }}
            className={toolbarBtnClass(activeFormats.unorderedList)}
            title="Madde İşaretli Liste"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              runCommand("insertOrderedList");
            }}
            className={toolbarBtnClass(activeFormats.orderedList)}
            title="Numaralı Liste"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Link ve Fotoğraf Ekleme */}
        <div className="flex items-center gap-1 px-1.5 border-r border-slate-200">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleOpenLinkPopover();
            }}
            className={toolbarBtnClass(linkPopoverOpen)}
            title="Bağlantı (Link) Ekle"
          >
            <Link2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={isUploadingImage}
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#44B9CD]/15 hover:bg-[#44B9CD]/25 text-[#0e7490] text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            title="Yazının içine fotoğraf ekle (JPG, PNG, WebP)"
          >
            {isUploadingImage ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ImagePlus className="w-3.5 h-3.5" />
            )}
            <span>{isUploadingImage ? "Yükleniyor..." : "Fotoğraf Ekle"}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleImageFiles(e.target.files);
              }
            }}
          />
        </div>

        {/* Geri Al / İleri Al / Temizle */}
        <div className="flex items-center gap-0.5 pl-1">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              runCommand("undo");
            }}
            className={toolbarBtnClass(false)}
            title="Geri Al"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              runCommand("redo");
            }}
            className={toolbarBtnClass(false)}
            title="İleri Al"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              runCommand("removeFormat");
            }}
            className={toolbarBtnClass(false)}
            title="Seçili Metin Biçimini Temizle"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BAĞLANTI EKLEME AÇILIR SATIRI */}
      {linkPopoverOpen && (
        <div className="bg-cyan-50/70 border-b border-cyan-200/80 px-3 py-2 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-[#0e7490]">Bağlantı URL:</span>
          <input
            type="text"
            value={linkUrlInput}
            onChange={(e) => setLinkUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleInsertLink();
              } else if (e.key === "Escape") {
                setLinkPopoverOpen(false);
              }
            }}
            placeholder="https://www.resmigazete.gov.tr/..."
            className="flex-1 min-w-[200px] px-2.5 py-1 bg-white border border-cyan-200 rounded-lg text-xs focus:outline-none focus:border-[#44B9CD]"
            autoFocus
          />
          <button
            type="button"
            onClick={() => handleInsertLink()}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1E2A3A] text-white rounded-lg text-xs font-bold hover:bg-slate-800 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-[#44B9CD]" />
            <span>Ekle</span>
          </button>
          <button
            type="button"
            onClick={() => setLinkPopoverOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* GÖRSEL YÜKLEME HATASI */}
      {uploadError && (
        <div className="bg-red-50 border-b border-red-200 px-3 py-2 flex items-center justify-between text-xs text-red-700">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{uploadError}</span>
          </span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* YAZI ALANI (CONTENTEDITABLE) */}
      <div
        className={`relative transition-colors ${
          isDraggingOver ? "bg-cyan-50/40 ring-2 ring-inset ring-[#44B9CD]" : "bg-white"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
      >
        {isEmpty && (
          <div className="pointer-events-none absolute top-3.5 left-4 right-4 text-sm text-slate-400 leading-relaxed select-none">
            {placeholder}
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={emitChange}
          onKeyUp={() => {
            saveSelection();
            updateToolbarState();
          }}
          onMouseUp={() => {
            saveSelection();
            updateToolbarState();
          }}
          onPaste={handlePaste}
          style={{ minHeight: `${minHeight}px` }}
          className="rich-editor-content px-4 py-3.5 text-sm outline-none max-h-[420px] overflow-y-auto"
        />
      </div>

      {/* ALT BİLGİ ÇUBUĞU */}
      <div className="bg-slate-50/70 border-t border-slate-100 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
        <span>
          Metni seçerek kalın/italik yapabilir, fotoğraf sürükleyip bırakabilir veya panodan yapıştırabilirsiniz.
        </span>
      </div>
    </div>
  );
}
