"use client";

import { useEffect, useState, ChangeEvent, useRef } from "react";
import {
  ShopRoot,
  CreateForm,
  Input,
  Button,
  Fields,
  NavBar,
  NavToggle,
  CategoryPanel,
  SearchInput,
  Select,
  TreeNode,
  CategoryControls,
  CustomSelectRoot,
  CustomSelectTrigger,
  CustomSelectList,
  CustomSelectItem,
} from "./ui";

import { styled } from "styled-components";
type ProductFields = {
  name: string;
  price: string;
  category: string | null;
};

const defaultValues: ProductFields = {
  name: "",
  price: "",
  category: null,
};

export const Shop = () => {
  const [view, setView] = useState<"shop" | "categories">("shop");

  type Category = {
    id: string;
    name: string;
    parentId: string | null;
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [catName, setCatName] = useState("");
  const [catParent, setCatParent] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadCategories = (): Category[] => {
    try {
      const raw = localStorage.getItem("categories");
      if (!raw) return [];
      return JSON.parse(raw) as Category[];
    } catch (e) {
      return [];
    }
  };

  const saveCategories = (next: Category[]) => {
    setCategories(next);
    localStorage.setItem("categories", JSON.stringify(next));
  };

  const addCategory = () => {
    if (!catName.trim()) return;
    const id = String(Date.now());
    const next = [
      ...categories,
      { id, name: catName.trim(), parentId: catParent },
    ];
    saveCategories(next);
    setCatName("");
    setCatParent(null);
  };
  const [fields, setFields] = useState<ProductFields>(defaultValues);
  const [list, setList] = useState<ProductFields[]>([]);

  const getOnChange = (key: keyof ProductFields) => {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFields((c) => ({ ...c, [key]: e.target.value }) as ProductFields);
  };

  // Custom select component (dark themed)
  const CustomSelect: React.FC<{
    value: string | null;
    options: { id: string; name: string }[];
    placeholder?: string;
    onChange: (v: string | null) => void;
  }> = ({ value, options, placeholder, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const onDoc = (e: MouseEvent) => {
        if (!ref.current) return;
        if (!ref.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const selected = options.find((o) => o.id === value);

    return (
      <CustomSelectRoot ref={ref}>
        <CustomSelectTrigger
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
        >
          <span>{selected ? selected.name : (placeholder ?? "Select")}</span>
          <span>{open ? "▴" : "▾"}</span>
        </CustomSelectTrigger>
        {open && (
          <CustomSelectList>
            <CustomSelectItem
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              (no category)
            </CustomSelectItem>
            {options.map((o) => (
              <CustomSelectItem
                key={o.id}
                onClick={() => {
                  onChange(o.id);
                  setOpen(false);
                }}
              >
                {o.name}
              </CustomSelectItem>
            ))}
          </CustomSelectList>
        )}
      </CustomSelectRoot>
    );
  };

  const onSave = () => {
    const indexStr = localStorage.getItem("index");
    const current = indexStr ? Number(indexStr) : 0;

    const next = current + 1;
    // normalize empty category to null
    const toStore = {
      ...fields,
      category: fields.category === "" ? null : fields.category,
    };
    localStorage.setItem(`index-${next}`, JSON.stringify(toStore));
    localStorage.setItem("index", String(next));
    reload();
    setFields(defaultValues);
  };

  const loadAllProducts = (): ProductFields[] => {
    const res: ProductFields[] = [];
    const indexStr = localStorage.getItem("index");
    const index = indexStr ? Number(indexStr) : 0;
    for (let i = 1; i <= index; i++) {
      const itemStr = localStorage.getItem(`index-${i}`);
      if (!itemStr) continue;
      try {
        const item = JSON.parse(itemStr) as ProductFields;
        res.push(item);
      } catch (e) {
        // skip invalid
      }
    }
    return res;
  };

  const reload = () => {
    setList(loadAllProducts());
  };

  // category tree rendering helpers
  const buildChildrenMap = (
    items: { id: string; parentId: string | null }[],
  ) => {
    const map = new Map<string | null, typeof items>();
    items.forEach((it) => {
      const arr = map.get(it.parentId) || [];
      arr.push(it);
      map.set(it.parentId, arr);
    });
    return map;
  };

  const renderNode = (
    node: { id: string; name: string },
    childrenMap: Map<string | null, { id: string; name: string }[]>,
    level = 0,
  ) => {
    const children = childrenMap.get(node.id) || [];
    const indent = { marginLeft: level * 12 };
    return (
      <div key={node.id}>
        <TreeNode style={indent}>{node.name}</TreeNode>
        {children.map((c) => renderNode(c, childrenMap, level + 1))}
      </div>
    );
  };

  const renderCategoryTree = (
    items: { id: string; name: string; parentId: string | null }[],
    filter = "",
  ) => {
    const normalized = filter.trim().toLowerCase();
    const roots = items.filter((i) => i.parentId === null);
    const childrenMap = buildChildrenMap(items as any);

    if (!normalized) {
      return roots.map((r) => renderNode(r, childrenMap));
    }

    // simple filter: include nodes whose name contains filter
    const matched = items.filter((i) =>
      i.name.toLowerCase().includes(normalized),
    );
    if (!matched.length) return <div>No matches</div>;

    // render matched nodes with ancestors
    const toRender: { id: string; name: string; parentId: string | null }[] =
      [];
    const byId = new Map(items.map((i) => [i.id, i] as const));
    matched.forEach((m) => {
      let cur: any = m;
      while (cur) {
        if (!toRender.find((t) => t.id === cur.id)) toRender.push(cur);
        cur = cur.parentId ? byId.get(cur.parentId) : null;
      }
    });
    const topRoots = toRender.filter((i) => i.parentId === null);
    const map2 = buildChildrenMap(toRender as any);
    return topRoots.map((r) => renderNode(r, map2));
  };

  useEffect(() => {
    const cats = loadCategories();
    const products = loadAllProducts();
    setCategories(cats);
    setList(products);
  }, []);

  return (
    <ShopRoot>
      <NavBar>
        <NavToggle $active={view === "shop"} onClick={() => setView("shop")}>
          Shop
        </NavToggle>
        <NavToggle
          $active={view === "categories"}
          onClick={() => setView("categories")}
        >
          Categories
        </NavToggle>
      </NavBar>
      <h1>{view === "shop" ? "Shop" : "Categories"}</h1>

      {view === "shop" ? (
        <>
          <CreateForm>
            <h2>Сreate product</h2>
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
                  onChange={(v) =>
                    setFields((c) => ({ ...c, category: v || null }))
                  }
                />
              </div>

              <Button onClick={onSave}>Save</Button>
            </Fields>
          </CreateForm>

          <List list={list} categories={categories} />
        </>
      ) : (
        <CategoryPanel>
          <h2>Create category</h2>
          <CategoryControls>
            <div style={{ flex: 1, minWidth: 220 }}>
              <Input
                placeholder="Category name"
                value={catName}
                onChange={(e) => setCatName((e as any).target.value)}
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
            onChange={(e) => setSearch((e as any).target.value)}
          />

          <div style={{ marginTop: 8 }}>
            {renderCategoryTree(categories, search)}
          </div>
        </CategoryPanel>
      )}
    </ShopRoot>
  );
};

const RowHeader = styled.div`
  display: flex;
  gap: 8px;
  padding: 6px 8px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #e5e7eb;
  > div:first-child {
    flex: 3;
  }
  > div:nth-child(2) {
    flex: 1;
    text-align: right;
  }
  > div:nth-child(3) {
    flex: 2;
    padding-left: 12px;
    text-align: left;
  }
`;

const Card = styled.div<{ $odd?: boolean }>`
  background: ${(p) => (p.$odd ? "#141414" : "#0b0b0b")};
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: row;
  padding: 6px 8px;
  margin-bottom: 6px;
  border-radius: 6px;
  > div:first-child {
    flex: 3;
  }
  > div:nth-child(2) {
    flex: 1;
    text-align: right;
  }
  > div:nth-child(3) {
    flex: 2;
    text-align: left;
    padding-left: 12px;
  }
  color: #e5e7eb;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
`;

const Element: React.FC<
  Pick<ProductFields, "name" | "price"> & {
    categoryName?: string;
    index: number;
  }
> = ({ name, price, categoryName, index }) => (
  <Card $odd={index % 2 === 1}>
    <div>{name}</div>
    <div>{price}</div>
    <div>{categoryName ?? ""}</div>
  </Card>
);

const List: React.FC<{
  list: ProductFields[];
  categories: { id: string; name: string }[];
}> = ({ list, categories }) => {
  const isEmpty = !list.length;

  return (
    <div>
      <RowHeader>
        <div>Name</div>
        <div>Price</div>
        <div>Category</div>
      </RowHeader>
      {!isEmpty
        ? list.map((item, i) => (
            <Element
              key={`${item.name}-${item.price}-${i}`}
              name={item.name}
              price={item.price}
              categoryName={
                categories.find((c) => c.id === item.category)?.name
              }
              index={i}
            />
          ))
        : "Empty"}
    </div>
  );
};
