"use client";

import Link from "next/link";
import { languageMeta, LanguageCode } from "@/lib/i18n";
import { useTranslation } from "./translation-provider";

export function Header() {
  const { t, lang, setLang } = useTranslation();
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <h1 className="text-lg font-bold text-brand">{t("appTitle")}</h1>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/citizen">{t("report")}</Link>
          <Link href="/track">{t("track")}</Link>
          <Link href="/admin">{t("admin")}</Link>
          <div className="flex items-center gap-2 rounded border px-2 py-1">
            <span>🌐</span>
            <select value={lang} onChange={(e) => setLang(e.target.value as LanguageCode)}>
              {(Object.keys(languageMeta) as LanguageCode[]).map((code) => (
                <option key={code} value={code}>
                  {languageMeta[code]}
                </option>
              ))}
            </select>
          </div>
        </nav>
      </div>
    </header>
  );
}
