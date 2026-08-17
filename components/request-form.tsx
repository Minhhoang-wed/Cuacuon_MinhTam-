"use client";

import { AlertCircle, CheckCircle2, ImagePlus, Loader2, Send, X } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

type SubmitState = { type: "idle" | "loading" | "success" | "error"; message?: string; code?: string };

export function RequestForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<SubmitState>({ type: "idle" });
  const fileInput = useRef<HTMLInputElement>(null);

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const next = [...files, ...Array.from(incoming)].slice(0, 4);
    setFiles(next);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ type: "loading" });
    const form = event.currentTarget;
    const data = new FormData(form);
    data.delete("images");
    files.forEach((file) => data.append("images", file));
    try {
      const response = await fetch("/api/requests", { method: "POST", body: data });
      const result = await response.json() as { ok?: boolean; message?: string; requestCode?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || "Không thể gửi yêu cầu.");
      setState({ type: "success", message: result.message, code: result.requestCode });
      form.reset(); setFiles([]);
    } catch (error) {
      setState({ type: "error", message: error instanceof Error ? error.message : "Có lỗi xảy ra. Vui lòng gọi hotline." });
    }
  }

  return (
    <form className="request-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading"><span>Yêu cầu sửa chữa</span><h2>Mô tả nhanh, chúng tôi gọi lại.</h2><p>Thông tin chỉ dùng để xác nhận lịch và tình trạng cửa.</p></div>
      <div className="form-grid">
        <label><span>Họ và tên *</span><input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Nguyễn Văn An" /></label>
        <label><span>Số điện thoại *</span><input name="phone" required inputMode="tel" autoComplete="tel" placeholder="09xx xxx xxx" pattern="[0-9+ .()-]{9,16}" /></label>
        <label className="full"><span>Địa chỉ cần hỗ trợ *</span><input name="address" required maxLength={220} autoComplete="street-address" placeholder="Số nhà, tên đường, phường/xã, quận/huyện" /></label>
        <label className="full"><span>Tình trạng cửa *</span><textarea name="issue" required minLength={10} maxLength={1200} rows={4} placeholder="Ví dụ: cửa dừng giữa chừng, motor vẫn kêu, đã thử remote khác..." /></label>
        <label><span>Thời gian mong muốn *</span><select name="preferredTime" required defaultValue=""><option value="" disabled>Chọn khung giờ</option><option>Sớm nhất có thể</option><option>08:00 – 11:00</option><option>13:00 – 17:00</option><option>17:00 – 21:00</option><option>Khung giờ khác</option></select></label>
        <label><span>Ngày mong muốn</span><input name="preferredDate" type="date" /></label>
      </div>
      <fieldset className="upload-field"><legend>Ảnh tình trạng (tối đa 4 ảnh, mỗi ảnh 5MB)</legend><button type="button" className="upload-button" onClick={() => fileInput.current?.click()}><ImagePlus /> Chọn ảnh JPG, PNG hoặc WebP</button><input ref={fileInput} className="sr-only" type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => addFiles(event.target.files)} />{files.length > 0 && <div className="file-list">{files.map((file, index) => <span key={`${file.name}-${index}`}>{file.name}<button type="button" aria-label={`Xóa ${file.name}`} onClick={() => setFiles(files.filter((_, i) => i !== index))}><X /></button></span>)}</div>}</fieldset>
      <label className="consent"><input type="checkbox" name="consent" value="yes" required /><span>Tôi đồng ý để doanh nghiệp liên hệ xác nhận yêu cầu này. *</span></label>
      <input type="text" name="company" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state.type === "success" && <div className="form-alert success" role="status"><CheckCircle2 /><span><b>Đã ghi nhận {state.code}</b>{state.message}</span></div>}
      {state.type === "error" && <div className="form-alert error" role="alert"><AlertCircle /><span><b>Chưa gửi được</b>{state.message}</span></div>}
      <button className="button button-primary form-submit" disabled={state.type === "loading"}>{state.type === "loading" ? <><Loader2 className="spin" /> Đang gửi...</> : <><Send /> Gửi yêu cầu</>}</button>
      <p className="form-fineprint">Nhân sự sẽ liên hệ xác nhận trước khi điều phối kỹ thuật viên.</p>
    </form>
  );
}
