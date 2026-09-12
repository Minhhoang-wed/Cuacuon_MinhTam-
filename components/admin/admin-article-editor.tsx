"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlignLeft,
  ArrowDown,
  ArrowUp,
  Bold,
  Check,
  Edit3,
  Eye,
  Heading2,
  Heading3,
  HelpCircle,
  Image as ImageIcon,
  ImagePlus,
  Italic,
  LayoutGrid,
  Link2,
  List,
  Loader2,
  Minus,
  PaintBucket,
  Palette,
  Plus,
  Table,
  Trash2,
  Underline,
  Upload,
  X,
  Zap,
} from "lucide-react";
import {
  ArticleContentRenderer,
  normalizeArticleContentToHtml,
} from "@/components/article-content-renderer";
import { ARTICLE_PRESET_IMAGES } from "@/components/admin/article-image-manager";
import { ArticleNearbyTechs } from "@/components/article-nearby-techs";

// Curated text colors for articles
const TEXT_COLORS = [
  { name: "Đen chuẩn", value: "#0f172a" },
  { name: "Đỏ nổi bật", value: "#dc2626" },
  { name: "Xanh Minh Tâm", value: "#0f5fd7" },
  { name: "Xanh lá", value: "#16a34a" },
  { name: "Cam đậm", value: "#ea580c" },
  { name: "Tím", value: "#7c3aed" },
  { name: "Vàng đồng", value: "#b45309" },
  { name: "Xám chữ", value: "#475569" },
  { name: "Hồng ruby", value: "#e11d48" },
  { name: "Xanh biển", value: "#0284c7" },
];

// Vibrant presets for header bars, badges, and highlights
const HEADER_PRESET_COLORS = [
  { name: "Xanh Navy Minh Tâm", value: "#0a2540" },
  { name: "Xanh dương Minh Tâm", value: "#0f5fd7" },
  { name: "Đỏ Ruby", value: "#e11d48" },
  { name: "Đỏ tươi nổi bật", value: "#dc2626" },
  { name: "Xanh lá đậm", value: "#16a34a" },
  { name: "Cam đậm", value: "#ea580c" },
  { name: "Tím sang trọng", value: "#7c3aed" },
  { name: "Xám than đen", value: "#1e293b" },
];

// Pastel / Light presets for table cells and soft highlights
const CELL_PRESET_COLORS = [
  { name: "Mặc định (Trong suốt)", value: "transparent", isTransparent: true },
  { name: "Xanh dương nhạt", value: "#eff6ff" },
  { name: "Hồng/Đỏ nhạt", value: "#fff1f2" },
  { name: "Xanh lá nhạt", value: "#f0fdf4" },
  { name: "Vàng kem nhạt", value: "#fefce8" },
  { name: "Xám nhạt (Dòng xen kẽ)", value: "#f8fafc" },
  { name: "Xanh da trời nhạt", value: "#e0f2fe" },
  { name: "Tím nhạt", value: "#faf5ff" },
  { name: "Cam nhạt", value: "#fff7ed" },
  { name: "Trắng tinh khôi", value: "#ffffff" },
];

// Backward-compatible CELL_COLORS export
const CELL_COLORS = CELL_PRESET_COLORS;

// Automatic luminance formula for text contrast
function isLightColor(hexColor: string): boolean {
  if (!hexColor || hexColor === "transparent") return true;
  if (hexColor.startsWith("#")) {
    let hex = hexColor.slice(1);
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 155;
    }
  }
  return false;
}

// Client-side image compression to lightweight data URL (WebP/JPEG, ~80-120KB)
async function compressImageFile(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = "";
        try {
          dataUrl = canvas.toDataURL("image/webp", quality);
          if (!dataUrl.startsWith("data:image/webp")) {
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }
        } catch {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface AdminArticleEditorProps {
  defaultValue?: string;
  name?: string;
}

export function AdminArticleEditor({
  defaultValue = "",
  name = "content",
}: AdminArticleEditorProps) {
  // Compute initial HTML from defaultValue
  const initialHtml = useMemo(() => normalizeArticleContentToHtml(defaultValue), [defaultValue]);

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [previewHtml, setPreviewHtml] = useState(initialHtml);
  const [showTableHelper, setShowTableHelper] = useState(false);
  const [showTextColorPalette, setShowTextColorPalette] = useState(false);
  const [showCellColorPalette, setShowCellColorPalette] = useState(false);
  const [applyToWholeRow, setApplyToWholeRow] = useState(false);
  const [tableColorSection, setTableColorSection] = useState<"bar" | "badge" | "cell">("bar");
  const [activeBadgePreviewText, setActiveBadgePreviewText] = useState<string>("");

  // Inline image insertion state
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalTab, setImageModalTab] = useState<"upload" | "preset" | "url">("upload");
  const [imageModalFilePreview, setImageModalFilePreview] = useState("");
  const [imageModalPresetUrl, setImageModalPresetUrl] = useState("");
  const [imageModalCustomUrl, setImageModalCustomUrl] = useState("");
  const [imageModalCaption, setImageModalCaption] = useState("");
  const [imageModalSize, setImageModalSize] = useState<"full" | "medium" | "small">("full");
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const savedSelectionRangeRef = useRef<Range | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  // Store last active table targets to remember element even if focus blurs
  const lastActiveTargetRef = useRef<{
    cell: HTMLTableCellElement | null;
    badge: HTMLElement | null;
    headerBar: HTMLElement | null;
    card: HTMLElement | null;
  }>({
    cell: null,
    badge: null,
    headerBar: null,
    card: null,
  });

  // Track active formatting (bold, italic, underline, blockTag: p | h2 | h3, isInTable)
  const [currentFormat, setCurrentFormat] = useState<{
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    blockTag: string;
    isInTable: boolean;
  }>({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    blockTag: "p",
    isInTable: false,
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const isLoadedRef = useRef(false);

  const lastDefaultValueRef = useRef(defaultValue);

  // Detect if cursor is currently inside any table or table card
  const getActiveTableCard = (): HTMLElement | null => {
    if (typeof window === "undefined") return null;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    let node: Node | null = sel.anchorNode;
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (el.classList.contains("article-table-card") || el.tagName === "TABLE") {
          return el.closest(".article-table-card") || el;
        }
      }
      node = node.parentNode;
    }
    return null;
  };

  // Detect if cursor is currently inside a table cell <td> or <th>
  const getActiveTableCell = (): HTMLTableCellElement | null => {
    if (typeof window === "undefined") return null;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const node = sel.anchorNode;
    if (!node) return null;
    const el = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
    return (el?.closest("td, th") as HTMLTableCellElement) || null;
  };

  // Detect if cursor is currently inside a table badge
  const getActiveBadge = (): HTMLElement | null => {
    if (typeof window === "undefined") return null;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const node = sel.anchorNode;
    if (!node) return null;
    const el = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
    return (el?.closest(".table-badge") as HTMLElement) || null;
  };

  // Detect if cursor is currently inside the table header bar
  const getActiveHeaderBar = (): HTMLElement | null => {
    if (typeof window === "undefined") return null;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const node = sel.anchorNode;
    if (!node) return null;
    const el = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
    return (el?.closest(".article-table-header-bar") as HTMLElement) || null;
  };

  // Update active table targets based on current selection
  const updateActiveTarget = () => {
    if (typeof window === "undefined") return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const node = sel.anchorNode;
    if (!node) return;
    const el = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
    if (!el || !editorRef.current?.contains(el)) return;

    const cell = (el.closest("td, th") as HTMLTableCellElement) || null;
    const badge = (el.closest(".table-badge") as HTMLElement) || null;
    const headerBar = (el.closest(".article-table-header-bar") as HTMLElement) || null;
    const card = (el.closest(".article-table-card") as HTMLElement) || null;

    if (cell || badge || headerBar || card) {
      const resolvedCard = card || cell?.closest(".article-table-card") || headerBar?.closest(".article-table-card") || null;
      const resolvedHeaderBar = headerBar || (resolvedCard?.querySelector(".article-table-header-bar") as HTMLElement | null);
      const resolvedBadge = badge || (resolvedHeaderBar?.querySelector(".table-badge") as HTMLElement | null);

      lastActiveTargetRef.current = {
        cell,
        badge: resolvedBadge,
        headerBar: resolvedHeaderBar,
        card: resolvedCard,
      };

      if (badge) {
        setTableColorSection("badge");
        setActiveBadgePreviewText(badge.textContent?.trim() || "Badge");
      } else if (headerBar) {
        setTableColorSection("bar");
        if (resolvedBadge) setActiveBadgePreviewText(resolvedBadge.textContent?.trim() || "Badge");
      } else if (cell) {
        setTableColorSection("cell");
        if (resolvedBadge) setActiveBadgePreviewText(resolvedBadge.textContent?.trim() || "Badge");
      }
    }
  };

  // Ensure every table in the editor has a red [🗑️ Xóa bảng] delete button on its header
  const ensureTableDeleteButtons = () => {
    if (!editorRef.current) return;
    const cards = editorRef.current.querySelectorAll(".article-table-card");
    cards.forEach((card) => {
      const header = card.querySelector(".article-table-header-bar");
      if (header && !header.querySelector(".btn-delete-table-card")) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-delete-table-card";
        btn.setAttribute("contenteditable", "false");
        btn.setAttribute("title", "Xóa toàn bộ khung bảng giá này khỏi bài viết");
        btn.innerHTML = "🗑️ Xóa bảng";
        header.appendChild(btn);
      }
    });
  };

  // Ensure every inline image figure in the editor has a red [🗑️ Xóa ảnh] delete button
  const ensureImageDeleteButtons = () => {
    if (!editorRef.current) return;
    const figures = editorRef.current.querySelectorAll(".article-content-image-box, figure");
    figures.forEach((fig) => {
      const inner = fig.querySelector(".article-image-inner") || fig;
      if (inner && !inner.querySelector(".btn-delete-inline-image")) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-delete-inline-image";
        btn.setAttribute("contenteditable", "false");
        btn.setAttribute("title", "Xóa hình ảnh này khỏi bài viết");
        btn.innerHTML = "🗑️ Xóa ảnh";
        inner.appendChild(btn);
      }
    });
  };

  // Clean up any empty or redundant table footer bars, empty rows, and stray blocks from all tables
  const cleanupAllTableJunk = () => {
    if (!editorRef.current) return;
    let hasChanges = false;

    // 1. Remove all footer bars (they are redundant and should never clutter the editor)
    const footers = editorRef.current.querySelectorAll(".article-table-footer-bar");
    footers.forEach((footer) => {
      footer.remove();
      hasChanges = true;
    });

    // 2. Remove all callout boxes (feature removed per user request, eliminate all callout frames)
    const callouts = editorRef.current.querySelectorAll(".article-callout-box");
    callouts.forEach((co) => {
      const text = co.textContent?.trim() || "";
      if (!text) {
        co.remove();
      } else {
        const p = document.createElement("p");
        p.className = "article-paragraph";
        p.innerHTML = co.innerHTML;
        co.parentNode?.replaceChild(p, co);
      }
      hasChanges = true;
    });

    // 3. Remove stray children in .article-table-card (outside header and scroll)
    const cards = editorRef.current.querySelectorAll(".article-table-card");
    cards.forEach((card) => {
      Array.from(card.children).forEach((child) => {
        if (
          !child.classList.contains("article-table-header-bar") &&
          !child.classList.contains("article-table-scroll")
        ) {
          const text = child.textContent?.trim() || "";
          if (!text) {
            child.remove();
            hasChanges = true;
          }
        }
      });

      // Remove any stray empty block or callout box inside table card
      card.querySelectorAll(".article-callout-box, div, p").forEach((el) => {
        if (
          !el.classList.contains("article-table-header-bar") &&
          !el.classList.contains("article-table-scroll") &&
          !el.closest("table") &&
          !el.textContent?.trim()
        ) {
          el.remove();
          hasChanges = true;
        }
      });

      // 4. Remove trailing empty rows in table if not currently focused
      const tbody = card.querySelector("tbody");
      if (tbody) {
        const rows = tbody.querySelectorAll("tr");
        if (rows.length > 1) {
          const sel = typeof window !== "undefined" ? window.getSelection() : null;
          const anchor = sel?.anchorNode;
          const lastRow = rows[rows.length - 1];
          const lastRowText = lastRow.textContent?.trim() || "";
          const isFocusedInLastRow = anchor ? lastRow.contains(anchor) : false;
          if (!lastRowText && !isFocusedInLastRow) {
            lastRow.remove();
            hasChanges = true;
          }
        }
      }
    });

    if (hasChanges && hiddenInputRef.current && editorRef.current) {
      hiddenInputRef.current.value = editorRef.current.innerHTML;
    }
  };

  // Set initial content ONCE into contentEditable and hidden input
  // DO NOT use dangerouslySetInnerHTML on contentEditable to prevent React from resetting user edits!
  useEffect(() => {
    if (editorRef.current) {
      if (!isLoadedRef.current || lastDefaultValueRef.current !== defaultValue) {
        editorRef.current.innerHTML = initialHtml;
        ensureTableDeleteButtons();
        ensureImageDeleteButtons();
        cleanupAllTableJunk();
        if (hiddenInputRef.current) {
          hiddenInputRef.current.value = initialHtml;
        }
        isLoadedRef.current = true;
        lastDefaultValueRef.current = defaultValue;
      }
    }
  }, [defaultValue, initialHtml]);

  // Periodic cleanup so that any lingering empty footer or empty row disappears without reload
  useEffect(() => {
    const timer = setInterval(() => {
      cleanupAllTableJunk();
      ensureTableDeleteButtons();
      ensureImageDeleteButtons();
    }, 400);
    return () => clearInterval(timer);
  }, []);

  // Update hidden input on every keystroke/edit WITHOUT re-rendering component
  const handleEditorInput = () => {
    if (editorRef.current && hiddenInputRef.current) {
      ensureTableDeleteButtons();
      ensureImageDeleteButtons();
      cleanupAllTableJunk();
      hiddenInputRef.current.value = editorRef.current.innerHTML;
    }
  };

  // Detect current block DOM node (P, H2, H3, etc.)
  const getCurrentBlockNode = (): HTMLElement | null => {
    if (typeof window === "undefined") return null;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    let node: Node | null = sel.anchorNode;
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = (node as HTMLElement).tagName.toUpperCase();
        if (["H1", "H2", "H3", "H4", "H5", "H6", "P", "DIV", "BLOCKQUOTE"].includes(tag)) {
          return node as HTMLElement;
        }
      }
      node = node.parentNode;
    }
    return null;
  };

  // Update active state on toolbar buttons
  const updateActiveFormats = () => {
    if (typeof document === "undefined") return;
    try {
      const isBold = document.queryCommandState("bold");
      const isItalic = document.queryCommandState("italic");
      const isUnderline = document.queryCommandState("underline");
      const block = getCurrentBlockNode();
      const blockTag = block ? block.tagName.toLowerCase() : "p";
      const isInTable = !!getActiveTableCard();
      setCurrentFormat({ isBold, isItalic, isUnderline, blockTag, isInTable });
      updateActiveTarget();
    } catch {}
  };

  // Sync to hidden input right before parent form submits
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const form = editor.closest("form");
    if (!form) return;

    const handleFormSubmit = () => {
      if (editorRef.current && hiddenInputRef.current) {
        hiddenInputRef.current.value = editorRef.current.innerHTML;
      }
    };

    form.addEventListener("submit", handleFormSubmit);
    return () => {
      form.removeEventListener("submit", handleFormSubmit);
    };
  }, []);

  // Switch tabs: update previewHtml only when opening preview
  const handleSwitchTab = (tab: "edit" | "preview") => {
    if (tab === "preview" && editorRef.current) {
      const current = editorRef.current.innerHTML;
      setPreviewHtml(current);
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = current;
      }
    }
    setActiveTab(tab);
  };

  // ── FORMATTING ACTIONS (DIRECT VISUAL WYSIWYG) ──

  // Bold text: turns selected text bold directly on screen
  const handleBold = () => {
    if (activeTab !== "edit") setActiveTab("edit");
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand("bold", false);
    handleEditorInput();
    updateActiveFormats();
  };

  // Italic text
  const handleItalic = () => {
    if (activeTab !== "edit") setActiveTab("edit");
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand("italic", false);
    handleEditorInput();
    updateActiveFormats();
  };

  // Underline text
  const handleUnderline = () => {
    if (activeTab !== "edit") setActiveTab("edit");
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand("underline", false);
    handleEditorInput();
    updateActiveFormats();
  };

  // Apply Text Color to selection
  const handleApplyTextColor = (color: string) => {
    if (activeTab !== "edit") setActiveTab("edit");
    const editor = editorRef.current;
    if (!editor) return;

    const sel = typeof window !== "undefined" ? window.getSelection() : null;
    const isCollapsed = !sel || sel.isCollapsed;

    // If cursor is inside badge and no text is selected, apply to whole badge
    const target = lastActiveTargetRef.current;
    const badge = target.badge || getActiveBadge();
    const headerBar = target.headerBar || getActiveHeaderBar();

    if (isCollapsed && badge && sel?.anchorNode && badge.contains(sel.anchorNode)) {
      if (color === "default" || !color) {
        badge.style.color = "";
      } else {
        badge.style.color = color;
      }
      handleEditorInput();
      setShowTextColorPalette(false);
      return;
    }

    if (isCollapsed && headerBar && sel?.anchorNode && headerBar.contains(sel.anchorNode)) {
      const note = headerBar.querySelector(".table-note") as HTMLElement | null;
      if (note && note.contains(sel.anchorNode)) {
        if (color === "default" || !color) {
          note.style.color = "";
        } else {
          note.style.color = color;
        }
        handleEditorInput();
        setShowTextColorPalette(false);
        return;
      }
    }

    editor.focus();
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch {}

    if (color === "default" || !color) {
      document.execCommand("foreColor", false, "#0f172a");
    } else {
      document.execCommand("foreColor", false, color);
    }

    handleEditorInput();
    updateActiveFormats();
    setShowTextColorPalette(false);
  };

  // Apply Cell Background Color, Table Header Bar Color, Badge Color, or Text Highlight
  const handleApplyCellColor = (
    color: string,
    toRow: boolean = applyToWholeRow,
    closeDropdown: boolean = false
  ) => {
    if (activeTab !== "edit") setActiveTab("edit");
    const editor = editorRef.current;
    if (!editor) return;

    const target = lastActiveTargetRef.current;
    const currentCard = target.card || getActiveTableCard();
    const currentHeaderBar =
      target.headerBar ||
      getActiveHeaderBar() ||
      (currentCard?.querySelector(".article-table-header-bar") as HTMLElement | null);
    const currentBadge =
      target.badge ||
      getActiveBadge() ||
      (currentHeaderBar?.querySelector(".table-badge") as HTMLElement | null);
    const currentCell = target.cell || getActiveTableCell();

    // 1. If targeting Table Badge
    if (tableColorSection === "badge" && currentBadge) {
      if (color === "transparent" || !color) {
        currentBadge.style.background = "";
        currentBadge.style.backgroundColor = "";
        currentBadge.style.color = "";
      } else {
        currentBadge.style.background = color;
        currentBadge.style.backgroundColor = color;
        currentBadge.style.color = isLightColor(color) ? "#0f172a" : "#ffffff";
      }
      handleEditorInput();
      if (closeDropdown) setShowCellColorPalette(false);
      return;
    }

    // 2. If targeting Table Header Bar
    if (tableColorSection === "bar" && currentHeaderBar) {
      const note = currentHeaderBar.querySelector(".table-note") as HTMLElement | null;
      if (color === "transparent" || !color) {
        currentHeaderBar.style.background = "";
        currentHeaderBar.style.backgroundColor = "";
        currentHeaderBar.style.color = "";
        if (note) note.style.color = "";
      } else {
        currentHeaderBar.style.background = color;
        currentHeaderBar.style.backgroundColor = color;
        if (isLightColor(color)) {
          currentHeaderBar.style.color = "#0f172a";
          if (note) note.style.color = "#475569";
        } else {
          currentHeaderBar.style.color = "#ffffff";
          if (note) note.style.color = "#cbd5e1";
        }
      }
      handleEditorInput();
      if (closeDropdown) setShowCellColorPalette(false);
      return;
    }

    // 3. If targeting Table Cell <td> or <th>
    if ((tableColorSection === "cell" || !tableColorSection) && currentCell) {
      if (toRow) {
        const tr = currentCell.closest("tr");
        if (tr) {
          const cells = tr.querySelectorAll("td, th");
          cells.forEach((c) => {
            const htmlCell = c as HTMLElement;
            if (color === "transparent" || !color) {
              htmlCell.style.background = "";
              htmlCell.style.backgroundColor = "";
              htmlCell.style.color = "";
            } else {
              htmlCell.style.background = color;
              htmlCell.style.backgroundColor = color;
              htmlCell.style.color = isLightColor(color) ? "#0f172a" : "#ffffff";
            }
          });
        }
      } else {
        if (color === "transparent" || !color) {
          currentCell.style.background = "";
          currentCell.style.backgroundColor = "";
          currentCell.style.color = "";
        } else {
          currentCell.style.background = color;
          currentCell.style.backgroundColor = color;
          currentCell.style.color = isLightColor(color) ? "#0f172a" : "#ffffff";
        }
      }
      handleEditorInput();
      if (closeDropdown) setShowCellColorPalette(false);
      return;
    }

    // 4. If currentHeaderBar exists (user clicked header bar but section wasn't set)
    if (currentHeaderBar && !currentCell) {
      const note = currentHeaderBar.querySelector(".table-note") as HTMLElement | null;
      if (color === "transparent" || !color) {
        currentHeaderBar.style.background = "";
        currentHeaderBar.style.backgroundColor = "";
        currentHeaderBar.style.color = "";
        if (note) note.style.color = "";
      } else {
        currentHeaderBar.style.background = color;
        currentHeaderBar.style.backgroundColor = color;
        if (isLightColor(color)) {
          currentHeaderBar.style.color = "#0f172a";
          if (note) note.style.color = "#475569";
        } else {
          currentHeaderBar.style.color = "#ffffff";
          if (note) note.style.color = "#cbd5e1";
        }
      }
      handleEditorInput();
      if (closeDropdown) setShowCellColorPalette(false);
      return;
    }

    // 5. Fallback: text highlight outside table
    editor.focus();
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch {}

    if (color === "transparent" || !color) {
      try {
        document.execCommand("removeFormat", false, undefined);
      } catch {}
    } else {
      try {
        document.execCommand("hiliteColor", false, color);
      } catch {
        try {
          document.execCommand("backColor", false, color);
        } catch {}
      }
    }

    handleEditorInput();
    if (closeDropdown) setShowCellColorPalette(false);
  };

  // Format Block with automatic Toggle:
  // If block is already H2, clicking H2 converts back to P (Normal text).
  // If block is already H3, clicking H3 converts back to P (Normal text).
  // Clicking 'p' converts any heading back to normal paragraph text.
  const setBlockFormat = (targetTag: "p" | "h2" | "h3") => {
    if (activeTab !== "edit") setActiveTab("edit");
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    const currentBlock = getCurrentBlockNode();
    const currentTag = currentBlock ? currentBlock.tagName.toLowerCase() : "p";

    // Toggle: if currently on this heading, clicking it reverts back to 'p'!
    const effectiveTag = (currentTag === targetTag && targetTag !== "p") ? "p" : targetTag;

    // Try standard execCommand formatBlock
    try {
      document.execCommand("formatBlock", false, `<${effectiveTag}>`);
    } catch {
      try {
        document.execCommand("formatBlock", false, effectiveTag);
      } catch {}
    }

    // Direct DOM fallback if the browser didn't change the block tag
    const afterBlock = getCurrentBlockNode();
    if (currentBlock && (!afterBlock || afterBlock.tagName.toLowerCase() !== effectiveTag)) {
      const newElem = document.createElement(effectiveTag);
      if (effectiveTag === "p") {
        newElem.className = "article-paragraph";
      }
      while (currentBlock.firstChild) {
        newElem.appendChild(currentBlock.firstChild);
      }
      currentBlock.parentNode?.replaceChild(newElem, currentBlock);

      const sel = window.getSelection();
      if (sel) {
        const range = document.createRange();
        range.selectNodeContents(newElem);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }

    handleEditorInput();
    updateActiveFormats();
  };

  // Heading H2 (Toggle: H2 <-> Normal)
  const handleH2 = () => {
    setBlockFormat("h2");
  };

  // Heading H3 (Toggle: H3 <-> Normal)
  const handleH3 = () => {
    setBlockFormat("h3");
  };

  // Normal Paragraph (Văn bản thường)
  const handleParagraph = () => {
    setBlockFormat("p");
  };

  // Insert Standard Price Table Template
  const handleInsertPriceTable = () => {
    const tableHtml = `
<div class="article-table-card">
  <div class="article-table-header-bar">
    <span class="table-badge">Bảng giá niêm yết</span>
    <span class="table-note">Cập nhật mới 2026 • Giá chuẩn không phát sinh</span>
    <button type="button" class="btn-delete-table-card" contenteditable="false" title="Xóa toàn bộ bảng giá này">🗑️ Xóa bảng</button>
  </div>
  <div class="article-table-scroll">
    <table class="article-pricing-table">
      <thead>
        <tr>
          <th>Hạng mục dịch vụ</th>
          <th style="text-align:center;">Giá tham khảo</th>
          <th style="text-align:center;">Bảo hành</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="cell-item">Kiểm tra &amp; khảo sát lỗi tận nơi</td>
          <td class="cell-price" style="text-align:center;">Miễn phí khi sửa</td>
          <td class="cell-warranty" style="text-align:center;">—</td>
        </tr>
        <tr class="row-alt">
          <td class="cell-item">Sửa lỗi cơ bản, công tắc hoặc dây điện</td>
          <td class="cell-price" style="text-align:center;">200.000 – 500.000đ</td>
          <td class="cell-warranty" style="text-align:center;">3 – 6 tháng</td>
        </tr>
        <tr>
          <td class="cell-item">Cửa bị kẹt nan, xô nan, đứt nan, kêu to</td>
          <td class="cell-price" style="text-align:center;">650.000 – 1.800.000đ</td>
          <td class="cell-warranty" style="text-align:center;">6 – 8 tháng</td>
        </tr>
        <tr class="row-alt">
          <td class="cell-item">Căn chỉnh hành trình, ray và cảm biến đảo chiều</td>
          <td class="cell-price" style="text-align:center;">300.000 – 800.000đ</td>
          <td class="cell-warranty" style="text-align:center;">3 – 6 tháng</td>
        </tr>
        <tr>
          <td class="cell-item">Sửa hoặc thay remote điều khiển, hộp nhận</td>
          <td class="cell-price" style="text-align:center;">200.000 – 650.000đ</td>
          <td class="cell-warranty" style="text-align:center;">6 – 12 tháng</td>
        </tr>
        <tr class="row-alt">
          <td class="cell-item">Sửa chữa hoặc thay mới motor cửa cuốn</td>
          <td class="cell-price" style="text-align:center;">850.000 – 1.800.000đ</td>
          <td class="cell-warranty" style="text-align:center;">6 – 12 tháng</td>
        </tr>
        <tr>
          <td class="cell-item">Thay bình lưu điện (UPS) cửa cuốn chuyên dụng</td>
          <td class="cell-price" style="text-align:center;">900.000 – 2.200.000đ</td>
          <td class="cell-warranty" style="text-align:center;">12 – 24 tháng</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<p><br></p>
`;
    insertHtmlSnippet(tableHtml);
    setShowTableHelper(false);
  };

  // Insert Custom Table (2 or 3 cols)
  const handleInsertCustomTable = (cols: 2 | 3) => {
    const tableHtml = cols === 2 ? `
<div class="article-table-card">
  <div class="article-table-header-bar">
    <span class="table-badge">Bảng giá dịch vụ</span>
    <span class="table-note">Báo giá cạnh tranh</span>
    <button type="button" class="btn-delete-table-card" contenteditable="false" title="Xóa toàn bộ bảng giá này">🗑️ Xóa bảng</button>
  </div>
  <div class="article-table-scroll">
    <table class="article-pricing-table">
      <thead>
        <tr><th>Hạng mục dịch vụ</th><th style="text-align:center;">Giá tham khảo</th></tr>
      </thead>
      <tbody>
        <tr><td class="cell-item">Kiểm tra sửa chữa cơ bản</td><td class="cell-price" style="text-align:center;">200.000đ</td></tr>
        <tr class="row-alt"><td class="cell-item">Thay thế linh kiện chính hãng</td><td class="cell-price" style="text-align:center;">450.000đ</td></tr>
      </tbody>
    </table>
  </div>
</div>
<p><br></p>` : `
<div class="article-table-card">
  <div class="article-table-header-bar">
    <span class="table-badge">Bảng báo giá</span>
    <span class="table-note">Minh bạch rõ ràng</span>
    <button type="button" class="btn-delete-table-card" contenteditable="false" title="Xóa toàn bộ bảng giá này">🗑️ Xóa bảng</button>
  </div>
  <div class="article-table-scroll">
    <table class="article-pricing-table">
      <thead>
        <tr><th>Hạng mục</th><th>Mô tả quy cách</th><th style="text-align:center;">Đơn giá</th></tr>
      </thead>
      <tbody>
        <tr><td class="cell-item">Dịch vụ 1</td><td>Kiểm tra xử lý tại chỗ</td><td class="cell-price" style="text-align:center;">300.000đ</td></tr>
        <tr class="row-alt"><td class="cell-item">Dịch vụ 2</td><td>Thay mới bảo hành 12 tháng</td><td class="cell-price" style="text-align:center;">750.000đ</td></tr>
      </tbody>
    </table>
  </div>
</div>
<p><br></p>`;
    insertHtmlSnippet(tableHtml);
    setShowTableHelper(false);
  };

  // Delete the currently active/selected table card
  const handleDeleteActiveTable = () => {
    const tableCard = getActiveTableCard();
    if (tableCard) {
      if (confirm("Bạn có chắc chắn muốn xóa bảng giá này khỏi bài viết?")) {
        tableCard.remove();
        handleEditorInput();
        updateActiveFormats();
      }
    } else {
      const allTables = editorRef.current?.querySelectorAll(".article-table-card, table");
      if (allTables && allTables.length > 0) {
        const last = allTables[allTables.length - 1];
        const card = last.closest(".article-table-card") || last;
        if (confirm("Bạn có chắc chắn muốn xóa bảng giá này khỏi bài viết?")) {
          card.remove();
          handleEditorInput();
          updateActiveFormats();
        }
      } else {
        alert("Vui lòng đặt con trỏ chuột vào bên trong bảng giá bạn muốn xóa!");
      }
    }
    setShowTableHelper(false);
  };

  // Add 1 new row to current table
  const handleAddTableRow = () => {
    const tableCard = getActiveTableCard() || editorRef.current?.querySelector(".article-table-card");
    const table = tableCard?.querySelector("table") || editorRef.current?.querySelector("table");
    if (!table) {
      alert("Vui lòng đặt con trỏ chuột vào bảng giá để thêm dòng!");
      return;
    }
    const tbody = table.querySelector("tbody") || table;
    const rows = tbody.querySelectorAll("tr");
    const lastRow = rows[rows.length - 1];
    if (lastRow) {
      const newRow = lastRow.cloneNode(true) as HTMLElement;
      newRow.querySelectorAll("td").forEach((td, idx) => {
        if (idx === 0) td.innerHTML = "Hạng mục dịch vụ mới";
        else if (idx === 1) td.innerHTML = "Giá tham khảo";
        else td.innerHTML = "Bảo hành";
      });
      tbody.appendChild(newRow);
      handleEditorInput();
    }
    setShowTableHelper(false);
  };

  // Delete current or last row in active table
  const handleDeleteTableRow = () => {
    const tableCard = getActiveTableCard() || editorRef.current?.querySelector(".article-table-card");
    const table = tableCard?.querySelector("table") || editorRef.current?.querySelector("table");
    if (!table) {
      alert("Vui lòng đặt con trỏ chuột vào bảng giá để xóa dòng!");
      return;
    }
    const tbody = table.querySelector("tbody") || table;
    const rows = tbody.querySelectorAll("tr");
    if (rows.length <= 1) {
      alert("Bảng giá cần giữ lại ít nhất 1 dòng dữ liệu!");
      return;
    }

    const sel = window.getSelection();
    let targetRow: HTMLElement | null = null;
    if (sel && sel.anchorNode) {
      const el = sel.anchorNode.nodeType === Node.ELEMENT_NODE ? (sel.anchorNode as HTMLElement) : sel.anchorNode.parentElement;
      targetRow = el?.closest("tr") || null;
    }

    if (!targetRow || !tbody.contains(targetRow)) {
      targetRow = rows[rows.length - 1] as HTMLElement;
    }

    targetRow.remove();
    handleEditorInput();
    updateActiveFormats();
    setShowTableHelper(false);
  };

  // Handle Backspace / Delete keys inside empty table elements (footer bar, empty rows, stray blocks)
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const anchorNode = sel.anchorNode;
      if (!anchorNode) return;
      const targetEl = anchorNode.nodeType === Node.ELEMENT_NODE 
        ? (anchorNode as HTMLElement) 
        : anchorNode.parentElement;
      if (!targetEl) return;

      // 1. Inside .article-table-footer-bar: immediately remove the footer bar
      const footer = targetEl.closest(".article-table-footer-bar");
      if (footer) {
        e.preventDefault();
        const card = footer.closest(".article-table-card");
        footer.remove();
        if (card) {
          const cells = card.querySelectorAll("td");
          if (cells.length > 0) {
            const lastCell = cells[cells.length - 1];
            const range = document.createRange();
            range.selectNodeContents(lastCell);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
        handleEditorInput();
        updateActiveFormats();
        return;
      }

      // 2. Inside an empty <tr> in a table (e.g. user emptied row 7)
      const td = targetEl.closest("td, th");
      if (td && td.tagName.toLowerCase() === "td") {
        const tr = td.closest("tr");
        const tbody = tr?.parentElement;
        if (tr && tbody) {
          const rowText = tr.textContent?.trim() || "";
          if (!rowText && tbody.querySelectorAll("tr").length > 1) {
            e.preventDefault();
            const prevTr = tr.previousElementSibling as HTMLElement | null;
            const nextTr = tr.nextElementSibling as HTMLElement | null;
            tr.remove();
            const targetTr = prevTr || nextTr;
            if (targetTr) {
              const targetCells = targetTr.querySelectorAll("td");
              const targetCell = targetCells[targetCells.length - 1] || targetTr;
              const range = document.createRange();
              range.selectNodeContents(targetCell);
              range.collapse(false);
              sel.removeAllRanges();
              sel.addRange(range);
            }
            handleEditorInput();
            updateActiveFormats();
            return;
          }
        }
      }

      // 3. Inside any stray empty block inside .article-table-card (outside header and table)
      const card = targetEl.closest(".article-table-card");
      if (card && targetEl !== card) {
        if (!targetEl.closest(".article-table-header-bar") && !targetEl.closest(".article-table-scroll") && !targetEl.closest("table")) {
          const text = targetEl.textContent?.trim() || "";
          if (!text) {
            e.preventDefault();
            targetEl.remove();
            handleEditorInput();
            updateActiveFormats();
            return;
          }
        }
      }

      // 4. Inside any .article-callout-box: immediately remove the frame
      const callout = targetEl.closest(".article-callout-box");
      if (callout) {
        e.preventDefault();
        callout.remove();
        handleEditorInput();
        updateActiveFormats();
        return;
      }
    }
  };

  // Insert a text paragraph before the active table
  const handleInsertParagraphBeforeTable = () => {
    const tableCard = getActiveTableCard() || editorRef.current?.querySelector(".article-table-card");
    if (tableCard && tableCard.parentNode) {
      const p = document.createElement("p");
      p.className = "article-paragraph";
      p.innerHTML = "Nhập văn bản phía trên bảng tại đây...";
      tableCard.parentNode.insertBefore(p, tableCard);
      const sel = window.getSelection();
      if (sel) {
        const range = document.createRange();
        range.selectNodeContents(p);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      handleEditorInput();
      updateActiveFormats();
    }
    setShowTableHelper(false);
  };

  // Insert a text paragraph after the active table
  const handleInsertParagraphAfterTable = () => {
    const tableCard = getActiveTableCard() || editorRef.current?.querySelector(".article-table-card");
    if (tableCard && tableCard.parentNode) {
      const p = document.createElement("p");
      p.className = "article-paragraph";
      p.innerHTML = "Nhập văn bản phía dưới bảng tại đây...";
      if (tableCard.nextSibling) {
        tableCard.parentNode.insertBefore(p, tableCard.nextSibling);
      } else {
        tableCard.parentNode.appendChild(p);
      }
      const sel = window.getSelection();
      if (sel) {
        const range = document.createRange();
        range.selectNodeContents(p);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      handleEditorInput();
      updateActiveFormats();
    }
    setShowTableHelper(false);
  };

  // Handle click on editor (intercept delete button clicks or header bar focus)
  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // 0. Delete button on inline image figure
    const deleteImgBtn = target.closest(".btn-delete-inline-image");
    if (deleteImgBtn) {
      e.preventDefault();
      e.stopPropagation();
      const figure = deleteImgBtn.closest(".article-content-image-box") || deleteImgBtn.closest("figure");
      if (figure && confirm("Bạn có chắc chắn muốn xóa hình ảnh này khỏi bài viết?")) {
        figure.remove();
        handleEditorInput();
        updateActiveFormats();
      }
      return;
    }

    // 1. Delete button on table card
    const deleteBtn = target.closest(".btn-delete-table-card");
    if (deleteBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = deleteBtn.closest(".article-table-card");
      if (card && confirm("Bạn có chắc chắn muốn xóa bảng giá này khỏi bài viết?")) {
        card.remove();
        handleEditorInput();
        updateActiveFormats();
      }
      return;
    }

    // 2. Click on the navy blue header bar background (outside the badge and delete button)
    const headerBar = target.closest(".article-table-header-bar") as HTMLElement | null;
    if (headerBar && !target.closest(".table-badge") && !target.closest(".btn-delete-table-card")) {
      let note = headerBar.querySelector(".table-note") as HTMLElement | null;
      if (!note) {
        note = document.createElement("span");
        note.className = "table-note";
        note.setAttribute("data-placeholder", "Ghi chú bảng giá...");
        note.innerHTML = "Ghi chú bảng giá...";
        const delBtn = headerBar.querySelector(".btn-delete-table-card");
        if (delBtn) {
          headerBar.insertBefore(note, delBtn);
        } else {
          headerBar.appendChild(note);
        }
      }
      const sel = window.getSelection();
      if (sel) {
        const range = document.createRange();
        range.selectNodeContents(note);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      note.focus();
    }

    // 3. Track target element for color palette
    const clickedBadge = target.closest(".table-badge") as HTMLElement | null;
    const clickedCell = target.closest("td, th") as HTMLTableCellElement | null;
    const clickedCard = target.closest(".article-table-card") as HTMLElement | null;

    if (clickedBadge) {
      const hBar = clickedBadge.closest(".article-table-header-bar") as HTMLElement | null;
      lastActiveTargetRef.current = {
        cell: null,
        badge: clickedBadge,
        headerBar: hBar,
        card: clickedCard || hBar?.closest(".article-table-card") || null,
      };
      setTableColorSection("badge");
      setActiveBadgePreviewText(clickedBadge.textContent?.trim() || "Badge");
    } else if (headerBar) {
      const bEl = headerBar.querySelector(".table-badge") as HTMLElement | null;
      lastActiveTargetRef.current = {
        cell: null,
        badge: bEl,
        headerBar,
        card: clickedCard || headerBar.closest(".article-table-card") || null,
      };
      setTableColorSection("bar");
      if (bEl) setActiveBadgePreviewText(bEl.textContent?.trim() || "Badge");
    } else if (clickedCell) {
      const hBar = clickedCard?.querySelector(".article-table-header-bar") as HTMLElement | null;
      const bEl = hBar?.querySelector(".table-badge") as HTMLElement | null;
      lastActiveTargetRef.current = {
        cell: clickedCell,
        badge: bEl,
        headerBar: hBar,
        card: clickedCard,
      };
      setTableColorSection("cell");
      if (bEl) setActiveBadgePreviewText(bEl.textContent?.trim() || "Badge");
    }

    setShowTextColorPalette(false);
    setShowCellColorPalette(false);
    cleanupAllTableJunk();
    updateActiveFormats();
  };

  // Insert Bullet List
  const handleInsertList = () => {
    if (activeTab !== "edit") setActiveTab("edit");
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand("insertUnorderedList", false);
    handleEditorInput();
  };

  // Clear all content
  const handleClearAll = () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ nội dung trong ô soạn thảo để viết mới?")) {
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
        editorRef.current.focus();
        handleEditorInput();
      }
    }
  };

  // Helper to insert HTML into editor at cursor
  const insertHtmlSnippet = (html: string) => {
    if (activeTab !== "edit") setActiveTab("edit");
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const sel = window.getSelection();

    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const el = document.createElement("div");
      el.innerHTML = html;
      const frag = document.createDocumentFragment();
      let node: Node | null;
      let lastNode: Node | null = null;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else {
      editor.innerHTML += html;
    }
    handleEditorInput();
  };

  // Save current selection range so that clicking modal doesn't lose cursor position
  const saveCurrentSelection = () => {
    if (typeof window === "undefined") return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedSelectionRangeRef.current = range.cloneRange();
        return;
      }
    }
    savedSelectionRangeRef.current = null;
  };

  // Insert image snippet at cursor position
  const handleConfirmInsertImage = (
    imgUrl: string,
    caption: string,
    size: "full" | "medium" | "small" = "full"
  ) => {
    if (!imgUrl) return;
    const safeCaption = caption.trim();
    const figureHtml = `
<figure class="article-content-image-box size-${size}" contenteditable="false">
  <div class="article-image-inner">
    <img src="${imgUrl}" alt="${safeCaption || 'Hình ảnh bài viết'}" class="article-content-img" />
    <button type="button" class="btn-delete-inline-image" contenteditable="false" title="Xóa hình ảnh này khỏi bài viết">🗑️ Xóa ảnh</button>
  </div>
  <figcaption contenteditable="true" class="article-image-caption" data-placeholder="Nhập chú thích hình ảnh tại đây...">${safeCaption || "Nhập chú thích hình ảnh tại đây..."}</figcaption>
</figure>
<p class="article-paragraph"><br></p>
`;

    if (activeTab !== "edit") setActiveTab("edit");
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    const sel = window.getSelection();
    if (savedSelectionRangeRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRangeRef.current);
    }

    insertHtmlSnippet(figureHtml);
    ensureImageDeleteButtons();
    setShowImageModal(false);

    // Reset modal state
    setImageModalFilePreview("");
    setImageModalPresetUrl("");
    setImageModalCustomUrl("");
    setImageModalCaption("");
    setImageModalSize("full");
  };

  // Handle image file selection (canvas compressed)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingImage(true);
    try {
      const dataUrl = await compressImageFile(file);
      setImageModalFilePreview(dataUrl);
      if (!imageModalCaption && file.name) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setImageModalCaption(nameWithoutExt);
      }
    } catch (err) {
      console.error("Lỗi nén ảnh:", err);
      alert("Không thể tải ảnh này. Vui lòng thử lại với định dạng JPG, PNG hoặc WebP.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Handle direct image paste from clipboard (Ctrl + V / screenshot Win + Shift + S)
  const handleEditorPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        try {
          const dataUrl = await compressImageFile(file);
          handleConfirmInsertImage(dataUrl, "", "full");
        } catch (err) {
          console.error("Paste image error:", err);
        }
        return;
      }
    }
  };

  return (
    <div className="admin-article-editor-container">
      {/* Hidden input to pass data via standard Form Submission */}
      <input type="hidden" name={name} ref={hiddenInputRef} defaultValue={initialHtml} />

      {/* Mode Selector Tabs: 1 Soạn thảo văn bản + 1 Xem trước trên Web */}
      <div className="editor-top-nav">
        <div className="editor-tabs">
          <button
            type="button"
            className={`editor-tab-btn ${activeTab === "edit" ? "active" : ""}`}
            onClick={() => handleSwitchTab("edit")}
          >
            <Edit3 size={15} />
            <span>Soạn thảo văn bản</span>
          </button>
          <button
            type="button"
            className={`editor-tab-btn preview-tab ${activeTab === "preview" ? "active" : ""}`}
            onClick={() => handleSwitchTab("preview")}
          >
            <Eye size={15} />
            <span>Xem trước trên Web (Preview)</span>
          </button>
        </div>
      </div>

      {/* Formatting Toolbar (Always Visible) */}
      <div className="editor-toolbar">
        {/* Bold, Italic, Underline */}
        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-btn ${currentFormat.isBold ? "active-format" : ""}`}
            title="In đậm chữ (Ctrl + B)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleBold}
          >
            <Bold size={15} />
            <span className="btn-label" style={{ fontWeight: 700 }}>In đậm</span>
          </button>
          <button
            type="button"
            className={`toolbar-btn ${currentFormat.isItalic ? "active-format" : ""}`}
            title="In nghiêng chữ (Ctrl + I)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleItalic}
          >
            <Italic size={15} />
            <span className="btn-label">Nghiêng</span>
          </button>
          <button
            type="button"
            className={`toolbar-btn ${currentFormat.isUnderline ? "active-format" : ""}`}
            title="Gạch chân chữ (Ctrl + U)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleUnderline}
          >
            <Underline size={15} />
            <span className="btn-label">Gạch chân</span>
          </button>
        </div>

        {/* Text Color & Cell Color */}
        <div className="toolbar-group">
          {/* Text Color Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              className={`toolbar-btn ${showTextColorPalette ? "active-format" : ""}`}
              title="Đổi màu chữ đang chọn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setShowTextColorPalette(!showTextColorPalette);
                setShowCellColorPalette(false);
                setShowTableHelper(false);
              }}
            >
              <Palette size={15} color="#dc2626" />
              <span className="btn-label">Màu chữ ▾</span>
            </button>

            {showTextColorPalette && (
              <div className="editor-color-dropdown">
                <div className="color-dropdown-title">
                  <span>Chọn màu chữ:</span>
                </div>

                <div className="editor-color-grid">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      className="editor-color-swatch"
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleApplyTextColor(c.value)}
                    />
                  ))}
                </div>

                <div className="editor-color-custom-row">
                  <span>Màu tùy chọn:</span>
                  <input
                    type="color"
                    className="editor-color-custom-input"
                    defaultValue="#dc2626"
                    title="Bấm để chọn mã màu bất kỳ"
                    onChange={(e) => handleApplyTextColor(e.target.value)}
                  />
                </div>

                <div className="editor-color-actions">
                  <button
                    type="button"
                    className="editor-color-action-btn"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleApplyTextColor("default")}
                  >
                    Mặc định (Đen chuẩn)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cell & Highlight Background Color Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              className={`toolbar-btn ${showCellColorPalette ? "active-format" : ""}`}
              title="Tô màu nền cho ô trong bảng giá, thanh tiêu đề, nhãn hoặc tô nền chữ"
              onMouseDown={(e) => {
                e.preventDefault();
                updateActiveTarget();
              }}
              onClick={() => {
                updateActiveTarget();
                setShowCellColorPalette(!showCellColorPalette);
                setShowTextColorPalette(false);
                setShowTableHelper(false);
              }}
            >
              <PaintBucket size={15} color="#0f5fd7" />
              <span className="btn-label">Màu ô ▾</span>
            </button>

            {showCellColorPalette && (
              <div className="editor-color-dropdown" style={{ width: 310 }}>
                {/* Mode Switcher for Table: Header Bar vs Badge vs Cell */}
                {(currentFormat.isInTable || lastActiveTargetRef.current.card || lastActiveTargetRef.current.headerBar) ? (
                  <>
                    <div className="color-dropdown-title">
                      <span>Vị trí tô màu trong bảng:</span>
                    </div>
                    <div className="editor-color-target-toggle">
                      <button
                        type="button"
                        className={`editor-color-toggle-btn ${tableColorSection === "bar" ? "active" : ""}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setTableColorSection("bar")}
                        title="Đổi màu nền thanh tiêu đề trên cùng"
                      >
                        <span>⬛ Thanh tiêu đề</span>
                      </button>
                      <button
                        type="button"
                        className={`editor-color-toggle-btn ${tableColorSection === "badge" ? "active" : ""}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setTableColorSection("badge")}
                        title="Đổi màu nền nhãn huy hiệu"
                      >
                        <span>🏷️ Nhãn ({activeBadgePreviewText.slice(0, 10) || "Huy hiệu"})</span>
                      </button>
                      <button
                        type="button"
                        className={`editor-color-toggle-btn ${tableColorSection === "cell" ? "active" : ""}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setTableColorSection("cell")}
                        title="Đổi màu ô bảng giá"
                      >
                        <span>📋 Ô bảng</span>
                      </button>
                    </div>

                    {tableColorSection === "cell" && (
                      <label className="editor-color-checkbox-row" style={{ marginTop: 2 }}>
                        <input
                          type="checkbox"
                          checked={applyToWholeRow}
                          onChange={(e) => setApplyToWholeRow(e.target.checked)}
                        />
                        <span>Áp dụng cho cả hàng (nguyên dòng này)</span>
                      </label>
                    )}
                  </>
                ) : (
                  <div className="color-dropdown-title">
                    <span>Tô màu nền chữ (Highlight):</span>
                  </div>
                )}

                {/* Section 1: Vibrant / Header / Badge Colors */}
                <div className="editor-color-section-label">
                  {tableColorSection === "bar" || tableColorSection === "badge"
                    ? "Màu gợi ý cho Thanh tiêu đề & Nhãn:"
                    : "Tone màu đậm & Nổi bật:"}
                </div>
                <div className="editor-color-grid">
                  {HEADER_PRESET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      className="editor-color-swatch"
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleApplyCellColor(c.value, applyToWholeRow, false)}
                    />
                  ))}
                </div>

                {/* Section 2: Light / Pastel Cell Colors */}
                <div className="editor-color-section-label">
                  {tableColorSection === "bar" || tableColorSection === "badge"
                    ? "Tone màu nhẹ:"
                    : "Màu nền ô bảng giá (Pastel dịu nhẹ):"}
                </div>
                <div className="editor-color-grid">
                  {CELL_PRESET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      className={`editor-color-swatch ${c.isTransparent ? "editor-color-swatch-transparent" : ""}`}
                      style={{ backgroundColor: c.isTransparent ? undefined : c.value }}
                      title={c.name}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleApplyCellColor(c.value, applyToWholeRow, false)}
                    />
                  ))}
                </div>

                {/* Custom color input */}
                <div className="editor-color-custom-row">
                  <span>Màu tự chọn bất kỳ:</span>
                  <input
                    type="color"
                    className="editor-color-custom-input"
                    defaultValue={tableColorSection === "bar" ? "#0a2540" : tableColorSection === "badge" ? "#e11d48" : "#eff6ff"}
                    title="Bấm để chọn mã màu bất kỳ"
                    onInput={(e) => handleApplyCellColor((e.target as HTMLInputElement).value, applyToWholeRow, false)}
                    onChange={(e) => handleApplyCellColor((e.target as HTMLInputElement).value, applyToWholeRow, false)}
                  />
                </div>

                {/* Action buttons */}
                <div className="editor-color-actions">
                  <button
                    type="button"
                    className="editor-color-action-btn"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleApplyCellColor("transparent", applyToWholeRow, false)}
                  >
                    <span>🔄</span>
                    <span>Xóa màu (Trở về mặc định ban đầu)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Headings & Normal Text */}
        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-btn ${currentFormat.blockTag === "p" ? "active-format" : ""}`}
            title="Chuyển về văn bản thường (Đoạn văn thông thường)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleParagraph}
          >
            <AlignLeft size={15} />
            <span className="btn-label">Văn bản thường</span>
          </button>
          <button
            type="button"
            className={`toolbar-btn ${currentFormat.blockTag === "h2" ? "active-format" : ""}`}
            title="Tiêu đề mục lớn H2 (Bấm lần nữa để trở lại bình thường)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleH2}
          >
            <Heading2 size={16} />
            <span className="btn-label">Mục H2</span>
          </button>
          <button
            type="button"
            className={`toolbar-btn ${currentFormat.blockTag === "h3" ? "active-format" : ""}`}
            title="Tiêu đề mục nhỏ H3 (Bấm lần nữa để trở lại bình thường)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleH3}
          >
            <Heading3 size={16} />
            <span className="btn-label">Mục H3</span>
          </button>
        </div>

        {/* Tables & Media Insertion */}
        <div className="toolbar-group highlight-group">
          {/* Insert Image Button */}
          <button
            type="button"
            className="toolbar-btn toolbar-btn-image"
            title="Chèn ảnh vào vị trí con trỏ chuột bất kỳ trong bài viết (Tải ảnh từ máy, chọn ảnh mẫu hoặc dán Ctrl+V)"
            onMouseDown={(e) => {
              e.preventDefault();
              saveCurrentSelection();
            }}
            onClick={() => {
              saveCurrentSelection();
              setShowImageModal(true);
            }}
          >
            <ImagePlus size={15} color="#0f5fd7" />
            <span style={{ fontWeight: 700, color: "#0f5fd7" }}>🖼️ Chèn ảnh</span>
          </button>

          <button
            type="button"
            className="toolbar-btn action-price-btn"
            title="Tự động chèn Bảng Giá Cửa Cuốn mẫu đầy đủ"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleInsertPriceTable}
          >
            <Zap size={15} color="#e11d48" />
            <span style={{ fontWeight: 700, color: "#9f1239" }}>⚡ Chèn Bảng Giá Mẫu</span>
          </button>

          <div style={{ position: "relative" }}>
            <button
              type="button"
              className="toolbar-btn"
              title="Tùy chọn tạo khung bảng"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowTableHelper(!showTableHelper)}
            >
              <Table size={15} />
              <span className="btn-label">Tùy chọn bảng ▾</span>
            </button>

            {showTableHelper && (
              <div className="table-helper-dropdown">
                <div className="helper-header">Chọn mẫu khung bảng:</div>
                <button
                  type="button"
                  className="helper-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleInsertPriceTable}
                >
                  <Table size={14} color="#0f5fd7" />
                  <div>
                    <strong>Bảng giá sửa cửa cuốn chuẩn (3 cột)</strong>
                    <small>Hạng mục • Giá tham khảo • Bảo hành</small>
                  </div>
                </button>
                <button
                  type="button"
                  className="helper-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleInsertCustomTable(2)}
                >
                  <LayoutGrid size={14} color="#10b981" />
                  <div>
                    <strong>Khung bảng 2 cột</strong>
                    <small>Hạng mục • Giá tham khảo</small>
                  </div>
                </button>
                <button
                  type="button"
                  className="helper-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleInsertCustomTable(3)}
                >
                  <LayoutGrid size={14} color="#f59e0b" />
                  <div>
                    <strong>Khung bảng 3 cột tùy biến</strong>
                    <small>Hạng mục • Quy cách • Đơn giá</small>
                  </div>
                </button>

                <div className="helper-header" style={{ borderTop: "1px solid #e2e8f0", marginTop: "4px", paddingTop: "6px" }}>
                  Thao tác bảng:
                </div>
                <button
                  type="button"
                  className="helper-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleAddTableRow}
                >
                  <Plus size={14} color="#0f5fd7" />
                  <div>
                    <strong>Thêm 1 dòng mới vào bảng</strong>
                    <small>Tạo thêm một hàng dữ liệu cho bảng giá</small>
                  </div>
                </button>
                <button
                  type="button"
                  className="helper-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleDeleteTableRow}
                  style={{ color: "#e11d48" }}
                >
                  <Minus size={14} color="#e11d48" />
                  <div>
                    <strong style={{ color: "#e11d48" }}>Xóa 1 dòng trong bảng</strong>
                    <small>Xóa dòng đang chọn hoặc dòng cuối cùng</small>
                  </div>
                </button>
                <button
                  type="button"
                  className="helper-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleInsertParagraphBeforeTable}
                >
                  <ArrowUp size={14} color="#0f5fd7" />
                  <div>
                    <strong>Thêm đoạn văn phía TRÊN bảng</strong>
                    <small>Chèn dòng văn bản ngay phía trước bảng giá</small>
                  </div>
                </button>
                <button
                  type="button"
                  className="helper-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleInsertParagraphAfterTable}
                >
                  <ArrowDown size={14} color="#0f5fd7" />
                  <div>
                    <strong>Thêm đoạn văn phía DƯỚI bảng</strong>
                    <small>Chèn dòng văn bản ngay phía sau bảng giá</small>
                  </div>
                </button>
                <button
                  type="button"
                  className="helper-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleDeleteActiveTable}
                  style={{ color: "#dc2626" }}
                >
                  <Trash2 size={14} color="#dc2626" />
                  <div>
                    <strong style={{ color: "#dc2626" }}>Xóa khung bảng giá</strong>
                    <small>Gỡ bỏ hoàn toàn bảng giá này khỏi bài viết</small>
                  </div>
                </button>
              </div>
            )}
          </div>

          {currentFormat.isInTable && (
            <button
              type="button"
              className="toolbar-btn"
              title="Xóa toàn bộ bảng giá đang chọn khỏi bài viết"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleDeleteActiveTable}
              style={{ background: "#fef2f2", borderColor: "#fca5a5", color: "#dc2626" }}
            >
              <Trash2 size={14} color="#dc2626" />
              <span className="btn-label" style={{ fontWeight: 600 }}>Xóa bảng</span>
            </button>
          )}
        </div>

        {/* Lists & Actions */}
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            title="Chèn danh sách gạch đầu dòng"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleInsertList}
          >
            <List size={15} />
            <span className="btn-label">Gạch đầu dòng</span>
          </button>

          <button
            type="button"
            className="toolbar-btn"
            title="Xóa nhanh toàn bộ nội dung để viết bài mới"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClearAll}
            style={{ color: "#dc2626", borderColor: "#fecaca", background: "#fff5f5" }}
          >
            <Trash2 size={14} color="#dc2626" />
            <span className="btn-label" style={{ fontWeight: 600 }}>Xóa hết</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div
        className="editor-visual-wrapper"
        style={{ display: activeTab === "edit" ? "block" : "none" }}
        onClick={handleEditorClick}
      >
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onKeyDown={handleEditorKeyDown}
          onPaste={handleEditorPaste}
          onInput={() => {
            handleEditorInput();
            updateActiveFormats();
          }}
          onKeyUp={() => {
            handleEditorInput();
            updateActiveFormats();
          }}
          onMouseUp={updateActiveFormats}
          onClick={updateActiveFormats}
          onSelect={updateActiveFormats}
          onBlur={handleEditorInput}
          className="editor-contenteditable"
          role="textbox"
          aria-multiline="true"
          data-placeholder="Soạn thảo bài viết tại đây... Bôi đen chữ rồi bấm 'In đậm', chọn Mục H2/H3 hoặc xóa nội dung để viết mới tùy ý!"
        />
      </div>

      {activeTab === "preview" && (
        <div className="editor-preview-wrapper">
          <div className="editor-preview-banner">
            <Eye size={16} color="#0f5fd7" />
            <span>Xem trước bài viết thực tế sẽ xuất hiện trên website:</span>
          </div>
          <div className="editor-preview-canvas">
            <ArticleNearbyTechs />
            {previewHtml ? (
              <ArticleContentRenderer content={previewHtml} />
            ) : (
              <div className="editor-preview-empty">
                <p>Chưa có nội dung để xem trước.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Tips */}
      <div className="editor-helper-footer">
        <div className="helper-tip">
          <HelpCircle size={14} color="#0f5fd7" />
          <span>
            <strong>Mẹo soạn thảo:</strong> Đặt con trỏ chuột bất kỳ chỗ nào trong bài viết rồi bấm nút <b>[ 🖼️ Chèn ảnh ]</b> để thêm ảnh vào giữa văn bản (hoặc chụp ảnh rồi bấm <b>Ctrl + V</b> để dán ngay). Bôi đen chữ bấm <b>In đậm</b> (`Ctrl+B`). Bấm <b>Mục H2 / H3</b> để đặt tiêu đề. Xóa bảng hoặc xóa ảnh bằng nút <b>[ 🗑️ Xóa ]</b> màu đỏ.
          </span>
        </div>
      </div>

      {/* Modal Chèn Ảnh vào Văn bản */}
      {showImageModal && (
        <div
          className="editor-image-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowImageModal(false);
          }}
        >
          <div className="editor-image-modal">
            {/* Header */}
            <div className="editor-image-modal-header">
              <h3>
                <ImagePlus size={18} color="#0f5fd7" />
                <span>Chèn hình ảnh vào văn bản</span>
              </h3>
              <button
                type="button"
                className="editor-image-modal-close"
                onClick={() => setShowImageModal(false)}
                title="Đóng cửa sổ"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="editor-image-modal-body">
              {/* Tabs */}
              <div className="editor-image-tabs">
                <button
                  type="button"
                  className={`editor-image-tab-btn ${imageModalTab === "upload" ? "active" : ""}`}
                  onClick={() => setImageModalTab("upload")}
                >
                  <Upload size={14} />
                  <span>Tải ảnh từ máy</span>
                </button>
                <button
                  type="button"
                  className={`editor-image-tab-btn ${imageModalTab === "preset" ? "active" : ""}`}
                  onClick={() => setImageModalTab("preset")}
                >
                  <ImageIcon size={14} />
                  <span>Ảnh mẫu ({ARTICLE_PRESET_IMAGES.length})</span>
                </button>
                <button
                  type="button"
                  className={`editor-image-tab-btn ${imageModalTab === "url" ? "active" : ""}`}
                  onClick={() => setImageModalTab("url")}
                >
                  <Link2 size={14} />
                  <span>Đường dẫn URL / Media</span>
                </button>
              </div>

              {/* Tab 1: Upload */}
              {imageModalTab === "upload" && (
                <div>
                  <input
                    type="file"
                    ref={imageFileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageFileChange}
                  />

                  {imageModalFilePreview ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div className="editor-image-preview-box">
                        <img src={imageModalFilePreview} alt="Xem trước ảnh tải lên" />
                      </div>
                      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                        <button
                          type="button"
                          className="sim-btn-clear"
                          style={{ padding: "6px 12px", fontSize: 12 }}
                          onClick={() => {
                            setImageModalFilePreview("");
                            if (imageFileInputRef.current) imageFileInputRef.current.value = "";
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Chọn ảnh khác</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="editor-image-upload-zone"
                      onClick={() => imageFileInputRef.current?.click()}
                    >
                      {isProcessingImage ? (
                        <>
                          <Loader2 size={28} className="animate-spin" color="#0f5fd7" />
                          <span style={{ fontSize: 13.5, color: "#0f5fd7", fontWeight: 600 }}>
                            Đang xử lý &amp; tối ưu hóa ảnh...
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload size={28} color="#0f5fd7" />
                          <strong style={{ fontSize: 14, color: "#1e293b" }}>
                            Bấm để chọn ảnh từ máy tính hoặc điện thoại
                          </strong>
                          <span style={{ fontSize: 12, color: "#64748b" }}>
                            Hỗ trợ JPG, PNG, WebP (Tự động nén tối ưu hiển thị nhanh nét)
                          </span>
                          <span
                            style={{
                              fontSize: 11.5,
                              color: "#0f5fd7",
                              marginTop: 4,
                              background: "#eff6ff",
                              padding: "4px 10px",
                              borderRadius: 6,
                              border: "1px solid #bfdbfe",
                            }}
                          >
                            💡 Mẹo: Bạn cũng có thể copy ảnh rồi dán trực tiếp (Ctrl + V) vào văn bản!
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Presets */}
              {imageModalTab === "preset" && (
                <div>
                  <div style={{ fontSize: 12.5, color: "#64748b", marginBottom: 8 }}>
                    Bấm chọn một hình ảnh chất lượng cao bên dưới:
                  </div>
                  <div className="editor-image-preset-grid">
                    {ARTICLE_PRESET_IMAGES.map((preset) => (
                      <div
                        key={preset.id}
                        className={`editor-image-preset-card ${imageModalPresetUrl === preset.url ? "selected" : ""}`}
                        onClick={() => {
                          setImageModalPresetUrl(preset.url);
                          if (!imageModalCaption) setImageModalCaption(preset.title);
                        }}
                        title={preset.title}
                      >
                        <img src={preset.url} alt={preset.title} />
                        {imageModalPresetUrl === preset.url && (
                          <div
                            style={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              background: "#0f5fd7",
                              color: "white",
                              borderRadius: "50%",
                              width: 20,
                              height: 20,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Check size={13} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: URL */}
              {imageModalTab === "url" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                    Dán đường dẫn URL hình ảnh:
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/hinh-anh.jpg hoặc /images/..."
                    value={imageModalCustomUrl}
                    onChange={(e) => setImageModalCustomUrl(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      fontSize: 13.5,
                      outline: "none",
                    }}
                  />
                  {imageModalCustomUrl && (
                    <div className="editor-image-preview-box">
                      <img src={imageModalCustomUrl} alt="Xem trước URL" />
                    </div>
                  )}
                </div>
              )}

              {/* Kích thước hiển thị */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                  Kích thước hiển thị trong bài viết:
                </label>
                <div className="editor-image-size-picker">
                  <button
                    type="button"
                    className={`editor-image-size-option ${imageModalSize === "full" ? "active" : ""}`}
                    onClick={() => setImageModalSize("full")}
                  >
                    Toàn chiều rộng (100%)
                  </button>
                  <button
                    type="button"
                    className={`editor-image-size-option ${imageModalSize === "medium" ? "active" : ""}`}
                    onClick={() => setImageModalSize("medium")}
                  >
                    Vừa phải (85%)
                  </button>
                  <button
                    type="button"
                    className={`editor-image-size-option ${imageModalSize === "small" ? "active" : ""}`}
                    onClick={() => setImageModalSize("small")}
                  >
                    Nhỏ gọn (65%)
                  </button>
                </div>
              </div>

              {/* Chú thích ảnh (Caption) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                  Chú thích hình ảnh (Hiển thị ngay dưới ảnh):
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thợ sửa cửa cuốn Minh Tâm đang xử lý kẹt nan tại công trình"
                  value={imageModalCaption}
                  onChange={(e) => setImageModalCaption(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 13.5,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="editor-image-modal-footer">
              <button
                type="button"
                className="toolbar-btn"
                style={{ padding: "8px 14px" }}
                onClick={() => setShowImageModal(false)}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="btn-inline-image-insert"
                disabled={
                  (imageModalTab === "upload" && !imageModalFilePreview) ||
                  (imageModalTab === "preset" && !imageModalPresetUrl) ||
                  (imageModalTab === "url" && !imageModalCustomUrl.trim())
                }
                onClick={() => {
                  const targetUrl =
                    imageModalTab === "upload"
                      ? imageModalFilePreview
                      : imageModalTab === "preset"
                      ? imageModalPresetUrl
                      : imageModalCustomUrl.trim();
                  handleConfirmInsertImage(targetUrl, imageModalCaption, imageModalSize);
                }}
              >
                <Check size={16} />
                <span>Chèn ảnh vào bài viết</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
