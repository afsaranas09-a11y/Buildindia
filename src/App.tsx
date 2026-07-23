import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import type { LangCode } from '@/lib/i18n';
import LanguageSelect from '@/screens/LanguageSelect';
import RoleSelect from '@/screens/RoleSelect';
import CustomerHome from '@/screens/CustomerHome';
import ProDetail from '@/screens/ProDetail';
import ProRegister from '@/screens/ProRegister';
import ProDashboard from '@/screens/ProDashboard';

function AppContent() {
  const { mode, setMode, proId, setProId } = useApp();
  const [selectedProId, setSelectedProId] = useState<string | null>(null);
  const [langSelected, setLangSelected] = useState(false);

  // Persist language + mode in localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('bb_lang') as LangCode | null;
    const savedMode = localStorage.getItem('bb_mode');
    const savedProId = localStorage.getItem('bb_proId');
    if (savedLang) setLangSelected(true);
    if (savedMode === 'customer' || savedMode === 'professional') setMode(savedMode);
    if (savedProId) setProId(savedProId);
  }, [setMode, setProId]);

  if (!langSelected) {
    return (
      <LanguageSelect
        onContinue={(lang: LangCode) => {
          localStorage.setItem('bb_lang', lang);
          setLangSelected(true);
        }}
      />
    );
  }

  if (!mode) {
    return (
      <RoleSelect
        onSelect={(m: 'customer' | 'professional') => {
          localStorage.setItem('bb_mode', m);
          setMode(m);
        }}
      />
    );
  }

  if (mode === 'customer') {
    if (selectedProId) {
      return <ProDetail proId={selectedProId} onBack={() => setSelectedProId(null)} />;
    }
    return (
      <CustomerHome
        onSelectPro={(id) => setSelectedProId(id)}
        onSwitchMode={() => {
          setMode(null);
          localStorage.removeItem('bb_mode');
        }}
      />
    );
  }

  // Professional mode
  if (!proId) {
    return (
      <ProRegister
        onBack={() => { setMode(null); localStorage.removeItem('bb_mode'); }}
        onRegistered={(id) => {
          localStorage.setItem('bb_proId', id);
          setProId(id);
        }}
      />
    );
  }

  return (
    <ProDashboard
      proId={proId}
      onSwitchMode={() => {
        setMode(null);
        localStorage.removeItem('bb_mode');
      }}
    />
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="max-w-md mx-auto bg-slate-50 min-h-screen shadow-xl">
        <AppContent />
      </div>
    </AppProvider>
  );
}
