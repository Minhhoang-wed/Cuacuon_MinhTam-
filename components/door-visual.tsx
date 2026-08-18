import { Boxes, Cpu, Radio, Shield, Wrench } from "lucide-react";

const icons = { service: Wrench, product: Cpu, project: Boxes, safety: Shield, remote: Radio };
const fallbackImages = {
  service: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1000&q=80",
  product: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80",
  project: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&q=80",
  safety: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1000&q=80",
  remote: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1000&q=80",
};

export function DoorVisual({ label, accent, kind = "service", imageUrl, imageAlt }: { label: string; accent?: string; kind?: keyof typeof icons; imageUrl?: string | null; imageAlt?: string }) {
  const Icon = icons[kind];
  const resolvedImage = imageUrl || fallbackImages[kind];
  return (
    <div className={`door-visual-card door-visual-${kind}`} style={{ "--card-accent": accent || "#b9f5dc" } as React.CSSProperties}>
      <img className="door-visual-image" src={resolvedImage} alt={imageAlt || label} />
      {kind !== "product" && <div className="visual-badge"><Icon size={20} /><span>{label}</span></div>}
    </div>
  );
}
