"use client";

import { createContext, useContext, type ReactNode } from "react";
import { translateScreen } from "@/lib/screen-translations";

const ScreenLocale = createContext("ru");
export function ScreenLocaleProvider({ locale, children }: { locale: string; children: ReactNode }) {
  return <ScreenLocale.Provider value={locale}>{children}</ScreenLocale.Provider>;
}
export function useScreenTranslation() {
  const locale = useContext(ScreenLocale);
  return (text: string) => translateScreen(text, locale);
}
