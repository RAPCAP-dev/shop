"use client";

import React from "react";

import { Card, IconButton, IconEdit } from "@ui";

export const ElementRow: React.FC<{
  name: string;
  price: string;
  categoryName?: string;
  index: number;
  onEdit: () => void;
}> = ({ name, price, categoryName, index, onEdit }) => (
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
      <IconButton onClick={onEdit} aria-label="Edit" title="Edit">
        <IconEdit />
      </IconButton>
    </div>
  </Card>
);

export default ElementRow;
