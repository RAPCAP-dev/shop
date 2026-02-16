"use client";

import React, { ChangeEvent } from "react";

import { CreateForm, Input, Button, Fields, SelectWrap } from "@ui";
import { CustomSelect, List } from "@components";
import { Product, Category, StoredProduct } from "@models";
import { useLocale } from "@i18n";

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
  const { t } = useLocale();

  return (
    <>
      <h2>{t("create_product")}</h2>
      <CreateForm>
        <Fields>
          <Input
            placeholder={t("name_placeholder")}
            value={fields.name}
            onChange={getOnChange("name")}
          />
          <Input
            placeholder={t("price_placeholder")}
            value={fields.price}
            onChange={getOnChange("price")}
          />
          <SelectWrap>
            <CustomSelect
              value={fields.category ?? ""}
              options={categories}
              placeholder={t("no_category")}
              onChange={(v) => onCategoryChange(v || null)}
            />
          </SelectWrap>

          <Button onClick={onSave}>{t("save")}</Button>
        </Fields>
      </CreateForm>

      <List list={list} categories={categories} onReload={reload} />
    </>
  );
};

export default ShopView;
