import { expect, test } from "@playwright/test";
import { CategoriesApi } from "./services/CategoriesApi";
/* 
| API-CAT-01 | GET | `/categories` | regression | 200; non-empty array |
| API-CAT-02 | GET | `/brands` | regression | 200; non-empty array |
*/
test.use({
  baseURL: process.env.API_URL,
});
test.describe("categories", () => {
  test("/categories` | regression | 200; non-empty array", { tag: "@regression" }, async ({ request }) => {
    const categoriesApi = new CategoriesApi(request);

    const response = await categoriesApi.getCategories();
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.length).toBeGreaterThanOrEqual(1);
  });

  test("/brands` | regression | 200; non-empty array", { tag: "@regression" }, async ({ request }) => {
    const categoriesApi = new CategoriesApi(request);
    const response = await categoriesApi.getBrands();
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.length).toBeGreaterThanOrEqual(1);
  });
});
