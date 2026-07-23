import { useApp } from '@/context/AppContext';
import { Search, HardHat, ChevronRight, ArrowLeft } from 'lucide-react';

export default function RoleSelect({ onSelect }: { onSelect: (mode: 'customer' | 'professional') => void }) {
  const { t, setMode } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <button
          onClick={() => setMode(null)}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-700 mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> {t('back')}
        </button>

        <div className="text-center mb-8">
          <img src="/bulid_india.jpeg" alt="Build India logo" className="w-20 h-20 rounded-2xl object-cover shadow-lg mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-slate-800">{t('appName')}</h1>
          <p className="text-slate-500 mt-2">{t('chooseRole')}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onSelect('customer')}
            className="w-full bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all group border-2 border-transparent hover:border-blue-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Search className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg">{t('customerMode')}</h3>
                <p className="text-sm text-slate-500">{t('customerDesc')}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>
          </button>

          <button
            onClick={() => onSelect('professional')}
            className="w-full bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all group border-2 border-transparent hover:border-amber-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                <HardHat className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg">{t('professionalMode')}</h3>
                <p className="text-sm text-slate-500">{t('professionalDesc')}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-600 transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
