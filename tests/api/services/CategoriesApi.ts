import { APIRequestContext } from "@playwright/test";

export class CategoriesApi {
  constructor(private readonly request: APIRequestContext) {}

  async getCategories() {
    return await this.request.get("/categories");
  }

  async getBrands() {
    return await this.request.get("/brands");
  }
}
