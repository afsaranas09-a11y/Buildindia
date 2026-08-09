import { useState, useEffect, useCallback } from 'react';
import { supabase, type Professional, type Booking, type WorkPhoto } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { getCategoryIcon, getCategoryColor, getCategoryLabel } from '@/lib/categories';
import StarRating from '@/components/StarRating';
import { Phone, MapPin, Calendar, Clock, CheckCircle, XCircle, Camera, Plus, X, Power, Briefcase, IndianRupee } from 'lucide-react';

export default function ProDashboard({ proId, onSwitchMode }: { proId: string; onSwitchMode: () => void }) {
  const { t, lang, setMode } = useApp();
  const [pro, setPro] = useState<Professional | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [photos, setPhotos] = useState<WorkPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'leads' | 'profile'>('leads');
  const [showPhotoForm, setShowPhotoForm] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [{ data: p }, { data: bk }, { data: ph }] = await Promise.all([
      supabase.from('professionals').select('*').eq('id', proId).maybeSingle(),
      supabase.from('bookings').select('*').eq('professional_id', proId).order('created_at', { ascending: false }),
      supabase.from('work_photos').select('*').eq('professional_id', proId).order('created_at', { ascending: false }),
    ]);
    setPro(p as Professional | null);
    setBookings(bk || []);
    setPhotos(ph || []);
    setLoading(false);
  }, [proId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateBookingStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    fetchAll();
  };

  const toggleAvailability = async () => {
    if (!pro) return;
    await supabase.from('professionals').update({ available: !pro.available }).eq('id', proId);
    fetchAll();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!pro) return null;

  const Icon = getCategoryIcon(pro.category);
  const color = getCategoryColor(pro.category);
  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 pt-6 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src="/bulid_india.jpeg" alt="Build India logo" className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <h1 className="text-lg font-bold">{pro.name}</h1>
              <p className="text-amber-100 text-sm">{getCategoryLabel(pro.category, lang)}</p>
            </div>
          </div>
          <button
            onClick={onSwitchMode}
            className="text-xs bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors"
          >
            {t('switchMode')}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/15 rounded-xl p-2.5 text-center backdrop-blur-sm">
            <p className="text-xl font-bold">{bookings.length}</p>
            <p className="text-xs text-amber-100">{t('leads')}</p>
          </div>
          <div className="bg-white/15 rounded-xl p-2.5 text-center backdrop-blur-sm">
            <p className="text-xl font-bold">{pro.rating > 0 ? pro.rating.toFixed(1) : '—'}</p>
            <p className="text-xs text-amber-100">{t('rating')}</p>
          </div>
          <div className="bg-white/15 rounded-xl p-2.5 text-center backdrop-blur-sm">
            <p className="text-xl font-bold">{pro.experience_years}</p>
            <p className="text-xs text-amber-100">{t('yearsExp')}</p>
          </div>
        </div>

        <button
          onClick={toggleAvailability}
          className={`w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-colors ${
            pro.available ? 'bg-green-500 hover:bg-green-600' : 'bg-white/20 hover:bg-white/30'
          }`}
        >
          <Power className="w-4 h-4" />
          {pro.available ? t('available') : t('unavailable')} — {t('toggleAvailability')}
        </button>
      </div>

      {/* Tabs */}
      <div className="px-5 mt-4">
        <div className="flex gap-2 bg-white rounded-xl shadow-sm p-1">
          <button
            onClick={() => setTab('leads')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === 'leads' ? 'bg-amber-500 text-white' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {t('myLeads')} ({bookings.length})
          </button>
          <button
            onClick={() => setTab('profile')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === 'profile' ? 'bg-amber-500 text-white' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {t('profile')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 mt-4">
        {tab === 'leads' ? (
          bookings.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">{t('noLeads')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((bk) => (
                <div key={bk.id} className="bg-white rounded-2xl shadow-sm p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-800">{bk.customer_name}</h3>
                      <p className="text-sm text-slate-500">{bk.service_needed}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[bk.status]}`}>
                      {bk.status.charAt(0).toUpperCase() + bk.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> {bk.customer_phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> {bk.address} — {bk.pincode}
                    </div>
                    {bk.scheduled_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> {bk.scheduled_date}
                      </div>
                    )}
                    {bk.notes && <p className="text-slate-400 italic">"{bk.notes}"</p>}
                  </div>
                  {bk.status === 'pending' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
                      <button
                        onClick={() => updateBookingStatus(bk.id, 'confirmed')}
                        className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 text-sm font-medium py-2 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" /> {t('confirm')}
                      </button>
                      <button
                        onClick={() => updateBookingStatus(bk.id, 'cancelled')}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 text-sm font-medium py-2 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> {t('cancel')}
                      </button>
                    </div>
                  )}
                  {bk.status === 'confirmed' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
                      <button
                        onClick={() => updateBookingStatus(bk.id, 'completed')}
                        className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-600 text-sm font-medium py-2 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" /> {t('markComplete')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-3">
            {/* Profile info */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{pro.name}</h3>
                  <p className="text-sm text-slate-500">{getCategoryLabel(pro.category, lang)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <StarRating rating={pro.rating} size={12} />
                    <span className="text-xs text-slate-400">{pro.total_ratings} {t('ratings')}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoRow icon={<MapPin className="w-4 h-4" />} label={`${pro.area}, ${pro.city}`} />
                <InfoRow icon={<IndianRupee className="w-4 h-4" />} label={`₹${pro.starting_price} onwards`} />
                <InfoRow icon={<Briefcase className="w-4 h-4" />} label={`${pro.experience_years} ${t('yearsExp')}`} />
                <InfoRow icon={<MapPin className="w-4 h-4" />} label={`Pin: ${pro.pincode}`} />
              </div>
              {pro.bio && (
                <div className="mt-3 pt-3 border-t border-slate-50">
                  <p className="text-sm text-slate-500">{pro.bio}</p>
                </div>
              )}
            </div>

            {/* Work photos */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-slate-600" />
                  <h3 className="text-sm font-semibold text-slate-700">{t('workPhotos')}</h3>
                </div>
                <button
                  onClick={() => setShowPhotoForm(true)}
                  className="flex items-center gap-1 text-xs text-amber-600 font-medium hover:text-amber-700"
                >
                  <Plus className="w-4 h-4" /> {t('addWorkPhoto')}
                </button>
              </div>
              {photos.length === 0 ? (
                <p className="text-sm text-slate-400">{t('noPhotos')}</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((ph) => (
                    <div key={ph.id} className="relative rounded-lg overflow-hidden aspect-square">
                      <img src={ph.image_url} alt={ph.caption || ''} className="w-full h-full object-cover" />
                      {ph.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                          <p className="text-[10px] text-white truncate">{ph.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showPhotoForm && (
        <PhotoForm proId={proId} onClose={() => setShowPhotoForm(false)} onAdded={fetchAll} />
      )}
    </div>
  );
}

function InfoRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-500">
      <span className="text-slate-400">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

function PhotoForm({ proId, onClose, onAdded }: { proId: string; onClose: () => void; onAdded: () => void }) {
  const { t } = useApp();
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) { setError('Photo URL required'); return; }
    setSubmitting(true);
    const { error: err } = await supabase.from('work_photos').insert({
      professional_id: proId,
      image_url: url,
      caption,
    });
    setSubmitting(false);
    if (err) { setError(err.message); return; }
    onAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-5 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">{t('addWorkPhoto')}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">{t('photoUrl')} *</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://images.pexels.com/..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">{t('photoCaption')}</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-500 text-white font-semibold py-3 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {submitting ? t('loading') : t('addPhoto')}
          </button>
        </form>
      </div>
    </div>
  );
}
