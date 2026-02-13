export type Product = {
  name: string;
  price: string;
  category: string | null;
};

export type Category = {
  id: string;
  name: string;
  parentId: string | null;
};

export class ProductItem {
  name: string;
  price: string;

  constructor(params: Product) {
    this.name = params.name;
    this.price = params.price;
  }
}

export type StoredProduct = Product & { __idx: number };