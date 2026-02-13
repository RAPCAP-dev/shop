"use client";

import React, { ChangeEvent, useState } from "react";
import {
  CategoryPanel,
  CategoryControls,
  Input,
  Button,
  SearchInput,
  TreeNode,
} from "../../ui";
import { CustomSelect } from "../CustomSelect";
import { Category } from "../../models";

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
    localStorage.setItem("categories", JSON.stringify(next));
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

  const renderNode = (
    node: { id: string; name: string },
    childrenMap: Map<string | null, Category[]>,
    level = 0,
  ) => {
    const children = childrenMap.get(node.id) || [];
    const isOpen = !!expanded[node.id];

    const toggle = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setExpanded((s) => ({ ...s, [node.id]: !s[node.id] }));
    };

    return (
      <div key={node.id}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingLeft: level * 12,
            cursor: children.length ? "pointer" : "default",
          }}
          onClick={children.length ? toggle : undefined}
        >
          {children.length ? (
            <div onClick={toggle} style={{ width: 18, textAlign: "center" }}>
              {isOpen ? "▾" : "▸"}
            </div>
          ) : (
            <div style={{ width: 18 }} />
          )}
          <TreeNode style={{ padding: 6 }}>{node.name}</TreeNode>
        </div>
        {isOpen && children.map((c) => renderNode(c, childrenMap, level + 1))}
      </div>
    );
  };

  const renderCategoryTree = (items: Category[], filter = "") => {
    const normalized = filter.trim().toLowerCase();
    const roots = items.filter((i) => i.parentId === null);
    const childrenMap = buildChildrenMap(items);

    if (!normalized) {
      return roots.map((r) => renderNode(r, childrenMap));
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
    return topRoots.map((r) => renderNode(r, map2));
  };

  return (
    <>
      <h2>Create category</h2>
      <CategoryPanel>
        <CategoryControls>
          <div style={{ flex: 1, minWidth: 220 }}>
            <Input
              placeholder="Category name"
              value={catName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCatName(e.target.value)
              }
            />
          </div>
          <div style={{ width: 240 }}>
            <CustomSelect
              value={catParent ?? ""}
              options={categories}
              placeholder="(no parent)"
              onChange={(v) => setCatParent(v || null)}
            />
          </div>
          <div>
            <Button onClick={addCategory}>Add</Button>
          </div>
        </CategoryControls>

        <h2 style={{ marginTop: 12 }}>Search</h2>
        <SearchInput
          placeholder="Search categories"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />

        <div style={{ marginTop: 8 }}>
          {renderCategoryTree(categories, search)}
        </div>
      </CategoryPanel>
    </>
  );
};

export default CategoriesView;
