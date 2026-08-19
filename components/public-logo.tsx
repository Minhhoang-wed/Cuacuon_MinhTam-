import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site";

export function PublicLogo({ name = siteConfig.name, shortName = siteConfig.shortName }: { name?: string; shortName?: string }) {
  return (
    <Link href="/" className="logo logo-image-link" aria-label={`${name} - Trang chủ`} title={shortName}>
      <Image
        src="/logo/logo.png"
        alt=""
        width={2172}
        height={724}
        priority
        className="logo-image"
        aria-hidden="true"
      />
    </Link>
  );
}
