"use client";

import React from "react";
import styled from "styled-components";
import { NavBar } from "@ui";
import NavControls from "../NavControls";
import { useLocale } from "@i18n";

const TitleWrap = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const Header: React.FC<{
  view: "shop" | "categories";
  setView: (v: "shop" | "categories") => void;
}> = ({ view, setView }) => {
  const { t } = useLocale();

  return (
    <>
      <NavBar>
        <NavControls view={view} setView={setView} />
      </NavBar>
      <TitleWrap>
        <h1>{view === "shop" ? t("shop") : t("categories")}</h1>
      </TitleWrap>
    </>
  );
};

export default Header;
