import { useState, useEffect, useCallback } from 'react';
import { supabase, type Professional } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/lib/supabase';
import { getCategoryIcon, getCategoryColor, getCategoryLabel } from '@/lib/categories';
import ProfessionalCard from '@/components/ProfessionalCard';
import StarRating from '@/components/StarRating';
import { Search, MapPin, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

type SortMode = 'rating' | 'price' | 'experience';

export default function CustomerHome({ onSelectPro, onSwitchMode }: { onSelectPro: (id: string) => void; onSwitchMode: () => void }) {
  const { t, lang } = useApp();
  const [pros, setPros] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>('rating');
  const [showFilters, setShowFilters] = useState(false);

  const fetchPros = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('professionals').select('*');
    if (activeCat) q = q.eq('category', activeCat);
    if (search.trim()) {
      const s = search.trim();
      q = q.or(`pincode.ilike.%${s}%,city.ilike.%${s}%,area.ilike.%${s}%`);
    }
    if (sort === 'rating') q = q.order('rating', { ascending: false });
    if (sort === 'price') q = q.order('starting_price', { ascending: true });
    if (sort === 'experience') q = q.order('experience_years', { ascending: false });
    const { data, error } = await q;
    if (error) { console.error(error); }
    setPros(data || []);
    setLoading(false);
  }, [activeCat, search, sort]);

  useEffect(() => { fetchPros(); }, [fetchPros]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-5 pt-6 pb-20 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img src="/bulid_india.jpeg" alt="Build India logo" className="w-9 h-9 rounded-lg object-cover" />
            <h1 className="text-xl font-bold">{t('appName')}</h1>
          </div>
          <button
            onClick={onSwitchMode}
            className="text-xs bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors"
          >
            {t('switchMode')}
          </button>
        </div>
        <p className="text-blue-100 text-sm mb-4">{t('locationPrompt')}</p>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-slate-700 text-sm bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="px-5 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">{t('filterByCategory')}</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <button
              onClick={() => setActiveCat(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                !activeCat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t('allCategories')}
            </button>
            {CATEGORIES.map((cat) => {
              const Icon = getCategoryIcon(cat.key);
              const color = getCategoryColor(cat.key);
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCat(activeCat === cat.key ? null : cat.key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                    activeCat === cat.key ? 'bg-blue-600 text-white' : `${color} hover:opacity-80`
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {getCategoryLabel(cat.key, lang)}
                </button>
              );
            })}
          </div>

          {showFilters && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              {(['rating', 'price', 'experience'] as SortMode[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    sort === s ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {s === 'rating' ? t('sortRating') : s === 'price' ? t('sortPrice') : t('sortExperience')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-700">{t('nearbyProfessionals')}</h2>
          {!loading && (
            <span className="text-xs text-slate-400">{pros.length} {t('resultsFound')}</span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : pros.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">{t('noResults')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pros.map((pro) => (
              <ProfessionalCard key={pro.id} pro={pro} onClick={() => onSelectPro(pro.id)} />
            ))}
          </div>
        )}
      </div>

      {activeCat && (
        <button
          onClick={() => setActiveCat(null)}
          className="fixed bottom-5 right-5 bg-blue-600 text-white rounded-full p-3 shadow-lg flex items-center gap-1 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <X className="w-4 h-4" /> Clear
        </button>
      )}
    </div>
  );
}
