type ProductItemParamsType  = {
  name: string;
  price: number;
}
  
export class ProductItem {
  name: string;
  price: number;

  constructor(params: ProductItemParamsType) {
    this.name = params.name
    this.price = params.price
  }
}