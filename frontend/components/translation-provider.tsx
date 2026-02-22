"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LanguageCode, languageMeta, messages } from "@/lib/i18n";

type ContextShape = {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: keyof (typeof messages)["en"]) => string;
};

const TranslationContext = createContext<ContextShape | null>(null);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>("en");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("lang") as LanguageCode | null;
    if (stored && languageMeta[stored]) {
      setLangState(stored);
    } else {
      setOpenModal(true);
    }
  }, []);

  const setLang = (next: LanguageCode) => {
    setLangState(next);
    sessionStorage.setItem("lang", next);
    setOpenModal(false);
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key: keyof (typeof messages)["en"]) => messages[lang][key]
    }),
    [lang]
  );

  return (
    <TranslationContext.Provider value={value}>
      {openModal && (
        <div className="fixed inset-0 z-50 grid place-content-center bg-black/40">
          <div className="card w-80 space-y-3">
            <h2 className="text-lg font-semibold">{messages.en.languagePrompt}</h2>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(languageMeta) as LanguageCode[]).map((code) => (
                <button key={code} className="rounded border p-2" onClick={() => setLang(code)}>
                  {languageMeta[code]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const value = useContext(TranslationContext);
  if (!value) throw new Error("TranslationProvider missing");
  return value;
}
