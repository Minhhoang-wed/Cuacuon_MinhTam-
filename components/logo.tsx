import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/data/site";

export function Logo({ name = siteConfig.name, shortName = siteConfig.shortName }: { name?: string; shortName?: string }) {
  return (
    <Link href="/" className="logo" aria-label={`${name} - Trang chủ`}>
      <span className="logo-mark" aria-hidden="true"><ShieldCheck size={24} /></span>
      <span>
        <b>{shortName}</b>
        <small>CỬA ÊM · NHÀ AN</small>
      </span>
    </Link>
  );
}
