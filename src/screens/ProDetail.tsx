import { useState, useEffect } from 'react';
import { supabase, type Professional, type WorkPhoto, type Review } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { getCategoryIcon, getCategoryColor, getCategoryLabel } from '@/lib/categories';
import StarRating from '@/components/StarRating';
import { ArrowLeft, MapPin, Phone, BadgeCheck, Clock, Briefcase, IndianRupee, X, Camera, Star } from 'lucide-react';

export default function ProDetail({ proId, onBack }: { proId: string; onBack: () => void }) {
  const { t, lang } = useApp();
  const [pro, setPro] = useState<Professional | null>(null);
  const [photos, setPhotos] = useState<WorkPhoto[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [{ data: p }, { data: ph }, { data: rv }] = await Promise.all([
        supabase.from('professionals').select('*').eq('id', proId).maybeSingle(),
        supabase.from('work_photos').select('*').eq('professional_id', proId).order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').eq('professional_id', proId).order('created_at', { ascending: false }),
      ]);
      setPro(p as Professional | null);
      setPhotos(ph || []);
      setReviews(rv || []);
      setLoading(false);
    })();
  }, [proId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <p className="text-slate-400">{t('noResults')}</p>
        <button onClick={onBack} className="mt-4 text-blue-600 font-medium">{t('back')}</button>
      </div>
    );
  }

  const Icon = getCategoryIcon(pro.category);
  const color = getCategoryColor(pro.category);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-600 text-white px-5 pt-6 pb-6 rounded-b-3xl">
        <button onClick={onBack} className="flex items-center gap-1 text-blue-100 text-sm mb-4 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> {t('back')}
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Icon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold">{pro.name}</h1>
              <BadgeCheck className="w-5 h-5 text-amber-300" />
            </div>
            <p className="text-blue-100 text-sm">{getCategoryLabel(pro.category, lang)}</p>
            <div className="flex items-center gap-1 mt-1">
              <StarRating rating={pro.rating} size={14} />
              <span className="text-xs text-blue-100">
                {pro.rating > 0 ? pro.rating.toFixed(1) : 'New'} ({pro.total_ratings})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="px-5 -mt-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <Briefcase className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-slate-800">{pro.experience_years}</p>
            <p className="text-xs text-slate-400">{t('yearsExp')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <IndianRupee className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-slate-800">₹{pro.starting_price}</p>
            <p className="text-xs text-slate-400">{t('startingFrom')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="text-sm font-bold text-slate-800">{pro.available ? t('available') : t('unavailable')}</p>
            <p className="text-xs text-slate-400">{t('status')}</p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm p-4 mt-3 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-700">{pro.area}, {pro.city}</p>
            <p className="text-xs text-slate-400">Pincode: {pro.pincode}</p>
          </div>
        </div>

        {/* Bio */}
        {pro.bio && (
          <div className="bg-white rounded-xl shadow-sm p-4 mt-3">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">{t('about')}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{pro.bio}</p>
          </div>
        )}

        {/* Work Photos */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Camera className="w-5 h-5 text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-700">{t('workPhotos')}</h3>
          </div>
          {photos.length === 0 ? (
            <p className="text-sm text-slate-400 bg-white rounded-xl p-4">{t('noPhotos')}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative rounded-xl overflow-hidden shadow-sm aspect-square group">
                  <img src={photo.image_url} alt={photo.caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-xs text-white">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="mt-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-700">{t('reviews')}</h3>
          </div>
          {reviews.length === 0 ? (
            <p className="text-sm text-slate-400 bg-white rounded-xl p-4">No reviews yet.</p>
          ) : (
            <div className="space-y-2">
              {reviews.map((rv) => (
                <div key={rv.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-700">{rv.reviewer_name}</p>
                    <StarRating rating={rv.rating} size={12} />
                  </div>
                  {rv.comment && <p className="text-sm text-slate-500">{rv.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 flex gap-3 max-w-md mx-auto">
        <a
          href={`tel:${pro.phone}`}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-semibold py-3.5 rounded-xl hover:bg-slate-200 transition-colors"
        >
          <Phone className="w-5 h-5" /> {t('callNow')}
        </a>
        <button
          onClick={() => setShowBooking(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          {t('bookNow')}
        </button>
      </div>

      {showBooking && <BookingModal pro={pro} onClose={() => setShowBooking(false)} />}
    </div>
  );
}

function BookingModal({ pro, onClose }: { pro: Professional; onClose: () => void }) {
  const { t } = useApp();
  const [form, setForm] = useState({ name: '', phone: '', service: '', address: '', pincode: '', date: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.service || !form.address) {
      setError('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    setError('');
    const { error: err } = await supabase.from('bookings').insert({
      professional_id: pro.id,
      customer_name: form.name,
      customer_phone: form.phone,
      service_needed: form.service,
      address: form.address,
      pincode: form.pincode || pro.pincode,
      scheduled_date: form.date || null,
      notes: form.notes,
      status: 'pending',
    });
    setSubmitting(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BadgeCheck className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-slate-700 font-medium mb-4">{t('bookingSuccess')}</p>
          <button onClick={onClose} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">
            {t('close')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-5 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">{t('bookService')}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label={t('yourName')} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label={t('yourPhone')} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required type="tel" />
          <Field label={t('serviceNeeded')} value={form.service} onChange={(v) => setForm({ ...form, service: v })} required />
          <Field label={t('yourAddress')} value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
          <Field label={t('pincode')} value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} placeholder={pro.pincode} />
          <Field label={t('preferredDate')} value={form.date} onChange={(v) => setForm({ ...form, date: v })} type="date" />
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">{t('notes')}</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? t('loading') : t('submitBooking')}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500 mb-1 block">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
