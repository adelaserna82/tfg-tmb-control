import { useAuthStore } from "@/store/useAuthStore";
import { translations } from "@/i18n/translations";

const getNestedTranslation = (obj: any, path: string) => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) || path;
};

export const useTranslation = (section: keyof typeof translations["es"]) => {
  const { language } = useAuthStore();
  const translationSection = translations[language]?.[section] || {};

  return (key: string) => getNestedTranslation(translationSection, key);
};
