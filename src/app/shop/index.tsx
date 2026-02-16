"use client";

import {
  useEffect,
  useState,
  ChangeEvent,
  startTransition,
  useCallback,
} from "react";

import { ShopRoot } from "@ui";
import { ShopView, CategoriesView, Header } from "@components";
import { Product, Category, StoredProduct } from "@models";
import { getCategories, getAllProducts, addProduct } from "@utils";
import { LocaleProvider } from "@i18n";

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

  const getOnChange = useCallback((key: keyof Product) => {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFields((c) => ({ ...c, [key]: e.target.value }) as Product);
  }, []);

  const reload = useCallback(() => {
    setList(getAllProducts());
  }, []);

  const onSave = useCallback(() => {
    // normalize empty category to null
    const toStore = {
      ...fields,
      category: fields.category === "" ? null : fields.category,
    };
    addProduct(toStore);
    reload();
    setFields(defaultValues);
  }, [fields, reload]);

  useEffect(() => {
    const cats = getCategories();
    const products = getAllProducts();
    startTransition(() => {
      setCategories(cats);
      setList(products);
    });
  }, []);

  return (
    <LocaleProvider>
      <ShopRoot>
        <Header view={view} setView={setView} />

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
          <CategoriesView
            categories={categories}
            setCategories={setCategories}
          />
        )}
      </ShopRoot>
    </LocaleProvider>
  );
};

export default Shop;
