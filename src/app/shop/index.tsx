"use client";

import { useEffect, useState, ChangeEvent, startTransition } from "react";
import { ShopRoot, NavBar, NavToggle } from "./ui/index";

import { ShopView, CategoriesView } from "./components/index";

import { Product, Category, StoredProduct } from "./models/index";

const defaultValues: Product = {
  name: "",
  price: "",
  category: null,
};

export const Shop = () => {
  const [view, setView] = useState<"shop" | "categories">("shop");

  const [categories, setCategories] = useState<Category[]>([]);

  const [fields, setFields] = useState<Product>(defaultValues);
  const [list, setList] = useState<StoredProduct[]>([]);

  const loadCategories = (): Category[] => {
    try {
      const raw = localStorage.getItem("categories");
      if (!raw) return [];
      return JSON.parse(raw) as Category[];
    } catch {
      return [];
    }
  };

  const getOnChange = (key: keyof Product) => {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFields((c) => ({ ...c, [key]: e.target.value }) as Product);
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

  const loadAllProducts = (): StoredProduct[] => {
    const res: StoredProduct[] = [];
    const indexStr = localStorage.getItem("index");
    const index = indexStr ? Number(indexStr) : 0;
    for (let i = 1; i <= index; i++) {
      const itemStr = localStorage.getItem(`index-${i}`);
      if (!itemStr) continue;
      try {
        const item = JSON.parse(itemStr) as Product;
        res.push({ ...item, __idx: i });
      } catch {
        // skip invalid
      }
    }
    return res;
  };

  const reload = () => {
    setList(loadAllProducts());
  };

  useEffect(() => {
    const cats = loadCategories();
    const products = loadAllProducts();
    startTransition(() => {
      setCategories(cats);
      setList(products);
    });
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
        <ShopView
          fields={fields}
          getOnChange={getOnChange}
          onCategoryChange={(v) => setFields((c) => ({ ...c, category: v }))}
          onSave={onSave}
          categories={categories}
          list={list}
          reload={reload}
        />
      ) : (
        <CategoriesView categories={categories} setCategories={setCategories} />
      )}
    </ShopRoot>
  );
};

export default Shop;
