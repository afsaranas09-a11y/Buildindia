import type { Professional } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { getCategoryIcon, getCategoryColor, getCategoryLabel } from '@/lib/categories';
import StarRating from './StarRating';
import { MapPin, Phone, BadgeCheck, Clock } from 'lucide-react';

export default function ProfessionalCard({ pro, onClick }: { pro: Professional; onClick: () => void }) {
  const { t, lang } = useApp();
  const Icon = getCategoryIcon(pro.category);
  const color = getCategoryColor(pro.category);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-md hover:border-slate-200 transition-all"
    >
      <div className="flex gap-3">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-800 truncate">{pro.name}</h3>
                <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
              </div>
              <p className="text-sm text-slate-500">{getCategoryLabel(pro.category, lang)}</p>
            </div>
            {pro.available && (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex-shrink-0">
                <Clock className="w-3 h-3" /> {t('availableNow')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={pro.rating} size={14} />
            <span className="text-xs text-slate-400">
              {pro.rating > 0 ? pro.rating.toFixed(1) : 'New'} ({pro.total_ratings} {t('ratings')})
            </span>
          </div>

          <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{pro.area}, {pro.city}</span>
            <span className="text-slate-300">•</span>
            <span>{pro.experience_years} {t('yearsExp')}</span>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
            <p className="text-sm font-semibold text-slate-700">
              {t('startingFrom')} <span className="text-blue-600">₹{pro.starting_price}</span>
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Phone className="w-3.5 h-3.5" />
              <span>Tap to view</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
