"use client";

import React from "react";

import { Card, IconButton, IconEdit } from "@ui";
import { useLocale } from "@i18n";

export const ElementRow: React.FC<{
  name: string;
  price: string;
  categoryName?: string;
  index: number;
  onEdit: () => void;
}> = ({ name, price, categoryName, index, onEdit }) => {
  const { t } = useLocale();

  return (
    <Card $odd={index % 2 === 1}>
      <div>{name}</div>
      <div>{price}</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{categoryName ?? ""}</span>
        <IconButton onClick={onEdit} aria-label={t("edit")} title={t("edit")}>
          <IconEdit />
        </IconButton>
      </div>
    </Card>
  );
};

export default React.memo(ElementRow);
