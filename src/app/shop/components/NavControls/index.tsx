"use client";

import React from "react";
import styled from "styled-components";
import { NavToggle } from "@ui";
import { LanguageSwitcher } from "@components";
import { useLocale } from "@i18n";

const ControlsWrap = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
`;

const RightSlot = styled.div`
  margin-left: auto;
`;

export const NavControls: React.FC<{
  view: "shop" | "categories";
  setView: (v: "shop" | "categories") => void;
}> = ({ view, setView }) => {
  const { t } = useLocale();

  return (
    <ControlsWrap>
      <NavToggle $active={view === "shop"} onClick={() => setView("shop")}>
        {t("shop")}
      </NavToggle>
      <NavToggle
        $active={view === "categories"}
        onClick={() => setView("categories")}
      >
        {t("categories")}
      </NavToggle>

      <RightSlot>
        <LanguageSwitcher />
      </RightSlot>
    </ControlsWrap>
  );
};

export default NavControls;
