"use client";

import React, { ChangeEvent, useState, useCallback } from "react";
import {
  CategoryPanel,
  CategoryControls,
  Input,
  Button,
  SearchInput,
  TreeWrap,
  InputWrap,
  SelectWrap,
} from "@ui";
import { CustomSelect, CategoryNode } from "@components";
import { Category } from "@models";
import { saveCategories } from "@utils";
import { useLocale } from "@i18n";

type Props = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const CategoriesView: React.FC<Props> = ({
  categories,
  setCategories,
}) => {
  const { t } = useLocale();
  const [catName, setCatName] = useState("");
  const [catParent, setCatParent] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const addCategory = useCallback(() => {
    if (!catName.trim()) return;
    const id = String(Date.now());
    const entry = { id, name: catName.trim(), parentId: catParent };
    setCategories((prev) => {
      const next = [...prev, entry];
      saveCategories(next);
      return next;
    });
    setCatName("");
    setCatParent(null);
  }, [catName, catParent, setCategories]);

  const buildChildrenMap = useCallback(
    (items: Category[]): Map<string | null, Category[]> => {
      const map = new Map<string | null, Category[]>();
      items.forEach((it) => {
        const arr = map.get(it.parentId) || [];
        arr.push(it);
        map.set(it.parentId, arr);
      });
      return map;
    },
    [],
  );

  const renderTreeNodes = (): React.ReactNode => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) {
      const childrenMap = buildChildrenMap(categories);
      const roots = categories.filter((i) => i.parentId === null);
      return (
        <>
          {roots.map((r) => (
            <CategoryNode
              key={r.id}
              node={r}
              childrenMap={childrenMap}
              level={0}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          ))}
        </>
      );
    }

    const matched = categories.filter((i) =>
      i.name.toLowerCase().includes(normalized),
    );
    if (!matched.length) return <div>{t("no_matches")}</div>;

    const toRender: Category[] = [];
    const byId = new Map(categories.map((i) => [i.id, i] as const));
    matched.forEach((m) => {
      for (
        let cur: Category | null | undefined = m;
        cur;
        cur = cur.parentId ? byId.get(cur.parentId) : null
      ) {
        if (!toRender.find((t) => t.id === cur.id)) toRender.push(cur);
      }
    });
    const topRoots = toRender.filter((i) => i.parentId === null);
    const map2 = buildChildrenMap(toRender);
    return (
      <>
        {topRoots.map((r) => (
          <CategoryNode
            key={r.id}
            node={r}
            childrenMap={map2}
            level={0}
            expanded={expanded}
            setExpanded={setExpanded}
          />
        ))}
      </>
    );
  };

  return (
    <>
      <h2>{t("create_category")}</h2>
      <CategoryPanel>
        <CategoryControls>
          <InputWrap>
            <Input
              placeholder={t("category_name_placeholder")}
              value={catName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCatName(e.target.value)
              }
            />
          </InputWrap>
          <SelectWrap>
            <CustomSelect
              value={catParent ?? ""}
              options={categories}
              placeholder={t("no_parent")}
              onChange={(v) => setCatParent(v || null)}
            />
          </SelectWrap>
          <div>
            <Button onClick={addCategory}>{t("add")}</Button>
          </div>
        </CategoryControls>

        <h2>{t("search")}</h2>
        <SearchInput
          placeholder={t("search_placeholder")}
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />

        <TreeWrap>{renderTreeNodes()}</TreeWrap>
      </CategoryPanel>
    </>
  );
};

export default CategoriesView;
