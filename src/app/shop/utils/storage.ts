import { Product, Category, StoredProduct } from "@models";

const CATEGORIES_KEY = "categories";
const INDEX_KEY = "index";

export function getCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Category[];
  } catch {
    return [];
  }
}

export function saveCategories(next: Category[]) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(next));
}

export function getIndex(): number {
  const indexStr = localStorage.getItem(INDEX_KEY);
  return indexStr ? Number(indexStr) : 0;
}

export function setIndex(n: number) {
  localStorage.setItem(INDEX_KEY, String(n));
}

export function setProduct(idx: number, product: Product) {
  localStorage.setItem(`index-${idx}`, JSON.stringify(product));
}

export function getProduct(idx: number): Product | null {
  const itemStr = localStorage.getItem(`index-${idx}`);
  if (!itemStr) return null;
  try {
    return JSON.parse(itemStr) as Product;
  } catch {
    return null;
  }
}

export function addProduct(product: Product): number {
  const next = getIndex() + 1;
  setProduct(next, product);
  setIndex(next);
  return next;
}

export function updateProduct(idx: number, product: Product) {
  setProduct(idx, product);
}

export function getAllProducts(): StoredProduct[] {
  const res: StoredProduct[] = [];
  const index = getIndex();
  for (let i = 1; i <= index; i++) {
    const p = getProduct(i);
    if (!p) continue;
    res.push({ ...p, __idx: i });
  }
  return res;
}

const storage = {
  getCategories,
  saveCategories,
  getIndex,
  setIndex,
  getProduct,
  setProduct,
  addProduct,
  updateProduct,
  getAllProducts,
};

export default storage;
