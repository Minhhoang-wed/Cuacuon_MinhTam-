import { Boxes, Cpu, Radio, Shield, Wrench } from "lucide-react";

const icons = { service: Wrench, product: Cpu, project: Boxes, safety: Shield, remote: Radio };

export function DoorVisual({ label, accent, kind = "service", imageUrl, imageAlt }: { label: string; accent?: string; kind?: keyof typeof icons; imageUrl?: string | null; imageAlt?: string }) {
  const Icon = icons[kind];
  return (
    <div className="door-visual-card" style={{ "--card-accent": accent || "#b9f5dc" } as React.CSSProperties}>
      {imageUrl ? <img className="door-visual-image" src={imageUrl} alt={imageAlt || label} /> : <div className="mini-door"><span /><span /><span /><span /><span /><span /></div>}
      <div className="visual-badge"><Icon size={20} /><span>{label}</span></div>
    </div>
  );
}
