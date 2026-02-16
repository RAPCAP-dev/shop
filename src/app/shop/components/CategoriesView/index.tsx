"use client";

import React, { ChangeEvent, useState } from "react";
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

type Props = {
  categories: Category[];
  setCategories: (next: Category[]) => void;
};

export const CategoriesView: React.FC<Props> = ({
  categories,
  setCategories,
}) => {
  const [catName, setCatName] = useState("");
  const [catParent, setCatParent] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const addCategory = () => {
    if (!catName.trim()) return;
    const id = String(Date.now());
    const next = [
      ...categories,
      { id, name: catName.trim(), parentId: catParent },
    ];
    setCategories(next);
    saveCategories(next);
    setCatName("");
    setCatParent(null);
  };

  const buildChildrenMap = (items: Category[]) => {
    const map = new Map<string | null, typeof items>();
    items.forEach((it) => {
      const arr = map.get(it.parentId) || [];
      arr.push(it);
      map.set(it.parentId, arr);
    });
    return map;
  };

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const renderCategoryTree = (items: Category[], filter = "") => {
    const normalized = filter.trim().toLowerCase();
    const roots = items.filter((i) => i.parentId === null);
    const childrenMap = buildChildrenMap(items);

    if (!normalized) {
      return roots.map((r) => (
        <CategoryNode
          key={r.id}
          node={r}
          childrenMap={childrenMap}
          level={0}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      ));
    }

    const matched = items.filter((i) =>
      i.name.toLowerCase().includes(normalized),
    );
    if (!matched.length) return <div>No matches</div>;

    const toRender: Category[] = [];
    const byId = new Map(items.map((i) => [i.id, i] as const));
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
    return topRoots.map((r) => (
      <CategoryNode
        key={r.id}
        node={r}
        childrenMap={map2}
        level={0}
        expanded={expanded}
        setExpanded={setExpanded}
      />
    ));
  };

  return (
    <>
      <h2>Create category</h2>
      <CategoryPanel>
        <CategoryControls>
          <InputWrap>
            <Input
              placeholder="Category name"
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
              placeholder="(no parent)"
              onChange={(v) => setCatParent(v || null)}
            />
          </SelectWrap>
          <div>
            <Button onClick={addCategory}>Add</Button>
          </div>
        </CategoryControls>

        <h2>Search</h2>
        <SearchInput
          placeholder="Search categories"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />

        <TreeWrap>{renderCategoryTree(categories, search)}</TreeWrap>
      </CategoryPanel>
    </>
  );
};

export default CategoriesView;
