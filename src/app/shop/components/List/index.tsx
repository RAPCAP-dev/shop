"use client";

import React, { useState } from "react";

import { Input, RowHeader, Card, IconButton, IconSave, IconCancel } from "@ui";
import { CustomSelect, ElementRow } from "@components";
import { StoredProduct, Product, Category } from "@models";

const defaultValues: Product = {
  name: "",
  price: "",
  category: null,
};

export const List: React.FC<{
  list: StoredProduct[];
  categories: Category[];
  onReload: () => void;
}> = ({ list, categories, onReload }) => {
  const isEmpty = !list.length;
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editFields, setEditFields] = useState<Product>(defaultValues);

  const startEdit = (item: StoredProduct) => {
    setEditingIdx(item.__idx);
    setEditFields({
      name: item.name,
      price: item.price,
      category: item.category,
    });
  };

  const cancelEdit = () => {
    setEditingIdx(null);
    setEditFields(defaultValues);
  };

  const saveEdit = (idx: number) => {
    const toStore = {
      ...editFields,
      category: editFields.category === "" ? null : editFields.category,
    };
    localStorage.setItem(`index-${idx}`, JSON.stringify(toStore));
    setEditingIdx(null);
    setEditFields(defaultValues);
    onReload();
  };

  return (
    <div>
      <RowHeader>
        <div>Name</div>
        <div>Price</div>
        <div>Category</div>
      </RowHeader>
      {!isEmpty
        ? list.map((item, i) => {
            const isEditing = editingIdx === item.__idx;
            return isEditing ? (
              <Card $odd={i % 2 === 1} key={item.__idx}>
                <div>
                  <Input
                    value={editFields.name}
                    onChange={(e) =>
                      setEditFields((s) => ({ ...s, name: e.target.value }))
                    }
                  />
                </div>
                <div style={{ textAlign: "right" }}>
                  <Input
                    value={editFields.price}
                    onChange={(e) =>
                      setEditFields((s) => ({ ...s, price: e.target.value }))
                    }
                  />
                </div>
                <div
                  style={{
                    textAlign: "left",
                    paddingLeft: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <CustomSelect
                    value={editFields.category ?? ""}
                    options={categories}
                    placeholder="(no category)"
                    onChange={(v) =>
                      setEditFields((s) => ({ ...s, category: v || null }))
                    }
                  />
                  <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
                    <IconButton
                      $white
                      onClick={() => saveEdit(item.__idx)}
                      aria-label="Save"
                    >
                      <IconSave />
                    </IconButton>
                    <IconButton onClick={cancelEdit} aria-label="Cancel">
                      <IconCancel />
                    </IconButton>
                  </div>
                </div>
              </Card>
            ) : (
              <ElementRow
                key={item.__idx}
                name={item.name}
                price={item.price}
                categoryName={
                  categories.find((c) => c.id === item.category)?.name
                }
                index={i}
                onEdit={() => startEdit(item)}
              />
            );
          })
        : "Empty"}
    </div>
  );
};

export default List;
