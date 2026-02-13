"use client";

import React, { ChangeEvent } from "react";
import { ShopRoot, CreateForm, Input, Button, Fields } from "../../ui";
import { CustomSelect } from "../CustomSelect";
import { List } from "../List";
import { Product, Category, StoredProduct } from "../../models";

type Props = {
  fields: Product;
  getOnChange: (
    key: keyof Product,
  ) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCategoryChange: (v: string | null) => void;
  onSave: () => void;
  categories: Category[];
  list: StoredProduct[];
  reload: () => void;
};

export const ShopView: React.FC<Props> = ({
  fields,
  getOnChange,
  onCategoryChange,
  onSave,
  categories,
  list,
  reload,
}) => {
  return (
    <>
      <h2>Сreate product</h2>
      <CreateForm>
        <Fields>
          <Input
            placeholder="Name"
            value={fields.name}
            onChange={getOnChange("name")}
          />
          <Input
            placeholder="Price"
            value={fields.price}
            onChange={getOnChange("price")}
          />
          <div style={{ width: 240 }}>
            <CustomSelect
              value={fields.category ?? ""}
              options={categories}
              placeholder="(no category)"
              onChange={(v) => onCategoryChange(v || null)}
            />
          </div>

          <Button onClick={onSave}>Save</Button>
        </Fields>
      </CreateForm>

      <List list={list} categories={categories} onReload={reload} />
    </>
  );
};

export default ShopView;
