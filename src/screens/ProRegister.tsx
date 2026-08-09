import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/lib/supabase';
import { getCategoryIcon, getCategoryColor, getCategoryLabel } from '@/lib/categories';
import { ArrowLeft, Check, User, Phone, Briefcase, MapPin, FileText, IndianRupee, ChevronRight } from 'lucide-react';

export default function ProRegister({ onBack, onRegistered }: { onBack: () => void; onRegistered: (id: string) => void }) {
  const { t, lang } = useApp();
  const [form, setForm] = useState({
    name: '', phone: '', category: '', experience: '', bio: '',
    city: '', area: '', pincode: '', startingPrice: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.category || !form.city || !form.area || !form.pincode) {
      setError('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    setError('');
    const { data, error: err } = await supabase.from('professionals').insert({
      name: form.name,
      phone: form.phone,
      category: form.category,
      experience_years: parseInt(form.experience) || 1,
      bio: form.bio,
      city: form.city,
      area: form.area,
      pincode: form.pincode,
      starting_price: parseInt(form.startingPrice) || 200,
      available: true,
    }).select().single();
    setSubmitting(false);
    if (err) { setError(err.message); return; }
    onRegistered(data.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 pt-6 pb-6 rounded-b-3xl">
        <button onClick={onBack} className="flex items-center gap-1 text-amber-100 text-sm mb-4 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> {t('back')}
        </button>
        <div className="flex items-center gap-3">
          <img src="/bulid_india.jpeg" alt="Build India logo" className="w-12 h-12 rounded-xl object-cover" />
          <div>
            <h1 className="text-xl font-bold">{t('registerAsPro')}</h1>
            <p className="text-amber-100 text-sm">{t('professionalDesc')}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-5 mt-4 space-y-3">
        {/* Category selection */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <label className="text-sm font-semibold text-slate-700 mb-3 block">{t('proCategory')} *</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = getCategoryIcon(cat.key);
              const color = getCategoryColor(cat.key);
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.key })}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    form.category === cat.key ? 'border-amber-500 bg-amber-50' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">{getCategoryLabel(cat.key, lang)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Card icon={<User className="w-4 h-4" />}>
          <Input label={t('proName')} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Input label={t('proPhone')} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required type="tel" />
        </Card>

        <Card icon={<Briefcase className="w-4 h-4" />}>
          <Input label={t('proExperience')} value={form.experience} onChange={(v) => setForm({ ...form, experience: v })} type="number" />
          <Input label={`${t('proStartingPrice')}`} value={form.startingPrice} onChange={(v) => setForm({ ...form, startingPrice: v })} type="number" placeholder="200" />
        </Card>

        <Card icon={<MapPin className="w-4 h-4" />}>
          <Input label={t('proCity')} value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
          <Input label={t('proArea')} value={form.area} onChange={(v) => setForm({ ...form, area: v })} required />
          <Input label={t('proPincode')} value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} required />
        </Card>

        <Card icon={<FileText className="w-4 h-4" />}>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">{t('proBio')}</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </Card>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          {submitting ? t('loading') : t('register')}
          <ChevronRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

function Card({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="flex items-center gap-2 text-slate-600 mb-3">{icon}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, required, type = 'text', placeholder }: {
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
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
    </div>
  );
}
