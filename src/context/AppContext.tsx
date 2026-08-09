import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { LangCode, TranslationKey } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

type AppMode = 'customer' | 'professional';

type AppState = {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: TranslationKey) => string;
  mode: AppMode | null;
  setMode: (mode: AppMode | null) => void;
  proId: string | null;
  setProId: (id: string | null) => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangCode>('en');
  const [mode, setMode] = useState<AppMode | null>(null);
  const [proId, setProId] = useState<string | null>(null);

  const t = useCallback((key: TranslationKey) => {
    return getTranslations(lang)[key] || getTranslations('en')[key] || key;
  }, [lang]);

  return (
    <AppContext.Provider value={{ lang, setLang, t, mode, setMode, proId, setProId }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
