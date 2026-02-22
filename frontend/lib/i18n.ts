export type LanguageCode = "en" | "hi" | "gu";

export const languageMeta: Record<LanguageCode, string> = {
  en: "English",
  hi: "हिन्दी",
  gu: "ગુજરાતી"
};

export const messages = {
  en: {
    appTitle: "Smart Complaint Resolution System",
    report: "Report Complaint",
    admin: "Admin",
    track: "Track",
    dashboard: "Dashboard",
    submit: "Submit Complaint",
    languagePrompt: "Choose your preferred language"
  },
  hi: {
    appTitle: "स्मार्ट शिकायत समाधान प्रणाली",
    report: "शिकायत दर्ज करें",
    admin: "एडमिन",
    track: "ट्रैक",
    dashboard: "डैशबोर्ड",
    submit: "शिकायत जमा करें",
    languagePrompt: "अपनी भाषा चुनें"
  },
  gu: {
    appTitle: "સ્માર્ટ ફરિયાદ નિવારણ સિસ્ટમ",
    report: "ફરિયાદ નોંધાવો",
    admin: "એડમિન",
    track: "ટ્રેક",
    dashboard: "ડેશબોર્ડ",
    submit: "ફરિયાદ મોકલો",
    languagePrompt: "તમારી ભાષા પસંદ કરો"
  }
} as const;
