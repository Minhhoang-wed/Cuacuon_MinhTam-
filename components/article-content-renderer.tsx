"use client";

import React from "react";

interface ArticleContentRendererProps {
  content?: string[] | string | null;
  className?: string;
}

// Check if a line is a markdown table row (contains '|' and at least 2 pipes)
function isTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|") && (trimmed.match(/\|/g)?.length || 0) >= 2;
}

// Check if a line is the delimiter row: | --- | :---: | ---: |
function isTableDelimiter(line: string): boolean {
  const trimmed = line.trim();
  if (!isTableRow(trimmed)) return false;
  const cols = trimmed.slice(1, -1).split("|");
  return cols.every((c) => /^\s*:?-+:?\s*$/.test(c));
}

// Convert inline markdown formatting to HTML
export function inlineMarkdownToHtml(text: string): string {
  if (!text) return "";

  let result = text;

  // 1. Bold: **text** or __text__
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong class="article-bold-text">$1</strong>');
  result = result.replace(/__([^_]+)__/g, '<strong class="article-bold-text">$1</strong>');

  // 2. Italic: *text* or _text_
  result = result.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  result = result.replace(/_([^_]+)_/g, "<em>$1</em>");

  // 3. Links: [label](url)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="article-inline-link">$1</a>');

  // 4. Code: `code`
  result = result.replace(/`([^`]+)`/g, '<code class="article-inline-code">$1</code>');

  // 5. Phone numbers: 0327.359.368, 0909.930.910, etc.
  result = result.replace(/\b(0[35789]\d[\s.]?\d{3}[\s.]?\d{3,4})\b/g, (match) => {
    const cleanTel = match.replace(/[\s.]/g, "");
    return `<a href="tel:${cleanTel}" class="article-phone-link" title="Gọi ngay ${match}">📞 ${match}</a>`;
  });

  return result;
}

// Safely unwrap JSON strings, arrays, and clean orphaned bracket/quote artifacts
export function extractArticleContentString(rawContent: unknown): string {
  if (!rawContent) return "";

  let c = rawContent;

  if (typeof c === "string") {
    let trimmed = c.trim();
    while (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith('"[') && trimmed.endsWith(']"')) ||
      (trimmed.startsWith('"{') && trimmed.endsWith('}"'))
    ) {
      try {
        const parsed = JSON.parse(trimmed);
        c = parsed;
        if (typeof c === "string") {
          trimmed = c.trim();
        } else {
          break;
        }
      } catch {
        break;
      }
    }
  }

  let result = "";
  if (Array.isArray(c)) {
    result = c
      .map((item) => {
        if (typeof item === "string") {
          const itemTrimmed = item.trim();
          if (itemTrimmed.startsWith('"') && itemTrimmed.endsWith('"')) {
            try {
              return JSON.parse(itemTrimmed);
            } catch {
              return item;
            }
          }
          return item;
        }
        return JSON.stringify(item);
      })
      .join("\n\n");
  } else if (typeof c === "string") {
    result = c;
  }

  // Filter out any orphaned bracket/quote artifact lines like \"]\"] or [" or "]
  result = result
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      return !/^[\s\\"'\[\],]+$/.test(t);
    })
    .map((line) => {
      let l = line.trim();
      // Clean leading json bracket/quote junk like [" or [\"
      l = l.replace(/^\[\s*\\?"/, "");
      l = l.replace(/^\\?"/, "");
      // Clean trailing json junk like \"] or ]
      l = l.replace(/\\?"\s*\]$/, "");
      l = l.replace(/\\?"$/, "");
      return l;
    })
    .filter(Boolean)
    .join("\n")
    .trim();

  return result;
}

// Normalize any article content (plain text, markdown, or HTML) into standardized HTML
export function normalizeArticleContentToHtml(rawContent: string[] | string | null | undefined): string {
  if (!rawContent) return "";

  const rawString = extractArticleContentString(rawContent);

  // Check if content is already rich HTML (contains <p>, <div, <table, <h2, <h3, <ul>, <figure>, <img>)
  const isAlreadyHtml = /<\/(p|div|table|h2|h3|ul|ol|strong|b|figure)>/i.test(rawString) ||
                        /<(table|div class="article-table-card"|figure|img)[^>]*>/i.test(rawString);

  if (isAlreadyHtml) {
    // Already HTML: strip any admin editor delete buttons, ensure inline markdown bold **text** is converted, and return
    const cleanHtml = rawString.replace(/<button[^>]*class="btn-delete-[^"]*"[^>]*>[\s\S]*?<\/button>/gi, "");
    return inlineMarkdownToHtml(cleanHtml);
  }

  // Otherwise, parse markdown and plain text into structured HTML
  const lines = rawString.split("\n");
  const htmlParts: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      i++;
      continue;
    }

    // 1. Markdown Table detection
    if (isTableRow(line)) {
      const tableLines: string[] = [line];
      i++;
      while (i < lines.length && isTableRow(lines[i])) {
        tableLines.push(lines[i]);
        i++;
      }

      let headers: string[] = [];
      let rows: string[][] = [];

      if (tableLines.length >= 2 && isTableDelimiter(tableLines[1])) {
        headers = tableLines[0].trim().slice(1, -1).split("|").map((c) => c.trim());
        rows = tableLines.slice(2).map((r) => r.trim().slice(1, -1).split("|").map((c) => c.trim()));
      } else {
        headers = tableLines[0].trim().slice(1, -1).split("|").map((c) => c.trim());
        rows = tableLines.slice(1).map((r) => r.trim().slice(1, -1).split("|").map((c) => c.trim()));
      }

      const tableHtml = `
<div class="article-table-card">
  <div class="article-table-header-bar">
    <span class="table-badge">Bảng giá niêm yết</span>
    <span class="table-note">Cập nhật mới 2026 • Giá chuẩn không phát sinh</span>
  </div>
  <div class="article-table-scroll">
    <table class="article-pricing-table">
      <thead>
        <tr>
          ${headers.map((h, idx) => `<th style="${idx === 0 ? 'text-align:left;' : 'text-align:center;'}">${inlineMarkdownToHtml(h)}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${rows.map((row, rIdx) => `
          <tr class="${rIdx % 2 === 1 ? 'row-alt' : ''}">
            ${row.map((cell, cIdx) => {
              const isPrice = /giá|chi phí|đơn giá/i.test(headers[cIdx] || "") || /đ|vnđ|vnd|miễn phí/i.test(cell);
              const isWarranty = /bảo hành/i.test(headers[cIdx] || "");
              const cellClass = isPrice ? "cell-price" : isWarranty ? "cell-warranty" : "cell-item";
              const align = cIdx === 0 ? "left" : "center";
              return `<td class="${cellClass}" style="text-align:${align};">${inlineMarkdownToHtml(cell)}</td>`;
            }).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>
</div>`;
      htmlParts.push(tableHtml);
      continue;
    }

    // 2. Headings: ##, ###, ####
    if (line.startsWith("## ")) {
      const text = line.replace(/^##\s+/, "");
      htmlParts.push(`<h2 class="article-heading-h2"><span class="heading-marker"></span><span>${inlineMarkdownToHtml(text)}</span></h2>`);
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      const text = line.replace(/^###\s+/, "");
      htmlParts.push(`<h3 class="article-heading-h3">${inlineMarkdownToHtml(text)}</h3>`);
      i++;
      continue;
    }
    if (line.startsWith("#### ")) {
      const text = line.replace(/^####\s+/, "");
      htmlParts.push(`<h4 class="article-heading-h4">${inlineMarkdownToHtml(text)}</h4>`);
      i++;
      continue;
    }

    // 3. Blockquote / Callout box: > ...
    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      const fullQuote = quoteLines.join("<br />");
      let variant = "callout-info";
      if (/khuyến cáo|lưu ý|cảnh báo/i.test(fullQuote)) variant = "callout-warning";
      else if (/giá|báo giá|khuyến mãi|ưu đãi/i.test(fullQuote)) variant = "callout-price";
      else if (/mẹo|kinh nghiệm/i.test(fullQuote)) variant = "callout-tip";

      htmlParts.push(`
<div class="article-callout-box ${variant}">
  <div class="callout-body">
    <p>${inlineMarkdownToHtml(fullQuote)}</p>
  </div>
</div>`);
      continue;
    }

    // 4. Unordered List: - or *
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      htmlParts.push(`
<ul class="article-content-list list-unordered">
  ${items.map((it) => `<li>${inlineMarkdownToHtml(it)}</li>`).join("")}
</ul>`);
      continue;
    }

    // 5. Ordered List: 1. , 2.
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      htmlParts.push(`
<ol class="article-content-list list-ordered">
  ${items.map((it) => `<li>${inlineMarkdownToHtml(it)}</li>`).join("")}
</ol>`);
      continue;
    }

    // 6. Regular paragraph
    const pLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !isTableRow(lines[i].trim()) &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith(">") &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      pLines.push(lines[i].trim());
      i++;
    }

    const paragraphText = pLines.map((p) => inlineMarkdownToHtml(p)).join("<br />");
    htmlParts.push(`<p class="article-paragraph">${paragraphText}</p>`);
  }

  return htmlParts.join("\n\n");
}

export function ArticleContentRenderer({ content, className = "" }: ArticleContentRendererProps) {
  if (!content) return null;

  const html = normalizeArticleContentToHtml(content);

  return (
    <div
      className={`article-rendered-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
