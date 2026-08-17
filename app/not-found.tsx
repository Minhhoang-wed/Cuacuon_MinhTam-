import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
export default function NotFound() { return <section className="not-found"><div><span>404</span><h1>Trang này đang đóng để bảo trì.</h1><p>Liên kết có thể đã thay đổi hoặc nội dung chưa được cập nhật.</p><div><Link href="/" className="button button-dark"><Home /> Về trang chủ</Link><Link href="/lien-he" className="text-link"><ArrowLeft /> Liên hệ hỗ trợ</Link></div></div></section>; }
