import { APIRequestContext } from "@playwright/test";

export class ProductApi {
  constructor(private readonly request: APIRequestContext) {}
  async getProductsAPI() {
    return await this.request.get("/products");
  }
  async getProductsPageAPI(numberPage: number) {
    return await this.request.get(`/products?page=${numberPage}`);
  }

  async getProductCategoryIdAPI(id: string) {
    return await this.request.get(`/categories/tree/${id}`);
  }
  async getProductById(id: string) {
    return await this.request.get(`/products/${id}`);
  }
}
