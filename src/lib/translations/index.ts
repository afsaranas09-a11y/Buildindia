import type { LangCode, Translations } from '../i18n';
import { en } from './en';
import { hi } from './hi';
import { te } from './te';

const allTranslations: Record<LangCode, Translations> = {
  en, hi, te,
  ta: en, kn: en, ml: en, bn: en, mr: en, gu: en, pa: en, ur: en,
};

export function getTranslations(lang: LangCode): Translations {
  return allTranslations[lang] || en;
}
