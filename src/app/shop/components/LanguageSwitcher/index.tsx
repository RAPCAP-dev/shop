"use client";

import React from "react";
import { useLocale } from "@i18n";
import { SelectWrap } from "@ui";

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useLocale();

  return (
    <SelectWrap style={{ width: 140 }}>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as "en" | "ru")}
      >
        <option value="en">English</option>
        <option value="ru">Русский</option>
      </select>
    </SelectWrap>
  );
};

export default LanguageSwitcher;
