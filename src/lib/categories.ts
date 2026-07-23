import { Hammer, Wrench, Zap, TreePine, PaintRoller, Grid3x3, HardHat, type LucideIcon } from 'lucide-react';

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  mason: Hammer,
  plumber: Wrench,
  electrician: Zap,
  carpenter: TreePine,
  painter: PaintRoller,
  tile_layer: Grid3x3,
  contractor: HardHat,
};

export function getCategoryIcon(key: string): LucideIcon {
  return CATEGORY_ICONS[key] || HardHat;
}

export const CATEGORY_COLORS: Record<string, string> = {
  mason: 'bg-orange-100 text-orange-600',
  plumber: 'bg-blue-100 text-blue-600',
  electrician: 'bg-amber-100 text-amber-600',
  carpenter: 'bg-green-100 text-green-600',
  painter: 'bg-pink-100 text-pink-600',
  tile_layer: 'bg-purple-100 text-purple-600',
  contractor: 'bg-slate-100 text-slate-700',
};

export function getCategoryColor(key: string): string {
  return CATEGORY_COLORS[key] || 'bg-slate-100 text-slate-600';
}

export const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  mason: { en: 'Mason / Mestri', hi: 'मिस्त्री', te: 'మేస్త్రీ' },
  plumber: { en: 'Plumber', hi: 'प्लंबर', te: 'ప్లంబర్' },
  electrician: { en: 'Electrician', hi: 'इलेक्ट्रीशियन', te: 'ఎలక్ట్రీషియన్' },
  carpenter: { en: 'Carpenter', hi: 'बढ़ई', te: 'వడ్రంగి' },
  painter: { en: 'Painter', hi: 'पेंटर', te: 'పెయింటర్' },
  tile_layer: { en: 'Tile Layer', hi: 'टाइल वर्कर', te: 'టైల్ వర్కర్' },
  contractor: { en: 'Contractor', hi: 'ठेकेदार', te: 'కాంట్రాక్టర్' },
};

export function getCategoryLabel(key: string, lang: string): string {
  return CATEGORY_LABELS[key]?.[lang] || CATEGORY_LABELS[key]?.en || key;
}
