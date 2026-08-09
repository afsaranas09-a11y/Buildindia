import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { LANGUAGES, type LangCode } from '@/lib/i18n';
import { Check, Globe, ChevronRight } from 'lucide-react';

export default function LanguageSelect({ onContinue }: { onContinue: (lang: LangCode) => void }) {
  const { setLang, t } = useApp();
  const [selected, setSelected] = useState<LangCode | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/bulid_india.jpeg" alt="Build India logo" className="w-24 h-24 rounded-2xl object-cover shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">{t('appName')}</h1>
          <p className="text-slate-500 mt-2 text-sm">{t('tagline')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-700">{t('selectLanguage')}</h2>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setSelected(lang.code); setLang(lang.code); }}
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  selected === lang.code
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-left">
                  <p className="font-semibold text-slate-700 text-sm">{lang.nativeName}</p>
                  <p className="text-xs text-slate-400">{lang.name}</p>
                </div>
                {selected === lang.code && (
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => { if (selected) onContinue(selected); }}
            disabled={!selected}
            className="w-full mt-5 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('continue')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
