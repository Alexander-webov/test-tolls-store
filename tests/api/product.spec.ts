import { expect, test } from "@playwright/test";
import { ProductApi } from "./services/ProductApi";
/*
### 7.1 Products — `ProductsApi`

| ID | Method | Endpoint | Type | Priority | Expected |
|----|--------|----------|------|----------|----------|
| API-PROD-01 | GET | `/products` | Positive | **smoke** | 200; array of products; each item has `id`, `name`, `price` |
| API-PROD-02 | GET | `/products?page=1` | Positive | regression | 200; pagination metadata present |
| API-PROD-03 | GET | `/products?category={id}` | Positive | regression | 200; all items belong to the filtered category |
| API-PROD-04 | GET | `/products/{id}` | Positive | regression | 200; item shape matches contract |
| API-PROD-05 | GET | `/products/99999` (nonexistent) | Negative | regression | 404 |
| API-PROD-06 | GET | `/products/abc` (invalid id format) | Negative | regression | 400 or 404 (verify in Swagger) |
*/
test.use({
  baseURL: process.env.API_URL,
});
test.describe("products", () => {
  test("/products`  200; array of products; each item has `id`, `name`, `price`", { tag: "@smoke" }, async ({ request }) => {
    const products = new ProductApi(request);
    const response = await products.getProductsAPI();
    const data = await response.json();

    expect(response.status()).toBe(200);
    for (const element of data.data) {
      expect(element.id).toBeDefined();
      expect(typeof element.name).toBe("string");
      expect(element.price).toBeGreaterThan(0);
    }
  });

  test("/products?page=1` 200; pagination metadata present ", { tag: "@regression" }, async ({ request }) => {
    const product = new ProductApi(request);
    const response = await product.getProductsPageAPI(1);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.current_page).toBe(1);
    console.log(data);
  });
  test("/products?category={id}` | Positive | regression | 200; all items belong to the filtered category", async ({ request }) => {
    const products = new ProductApi(request);
    const response = await products.getProductCategoryIdAPI("01KV128NMS3RJ044HZPT22PA0F");
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.slug).toBe("hammer");
  });
  test("/products/{id}` | Positive | regression | 200; item shape matches contract", async ({ request }) => {
    const products = new ProductApi(request);
    const response = await products.getProductById("01KV128NMNJ03X19Y6B8Q6BN1T");
    expect(response.status()).toBe(200);
  });
  test("/products/99999` (nonexistent) | Negative | regression | 404", async ({ request }) => {
    const products = new ProductApi(request);
    const response = await products.getProductById("99999");
    expect(response.status()).toBe(404);
  });
  test("/products/abc` (invalid id format) | Negative | regression | 400 or 404 (verify in Swagger)", async ({ request }) => {
    const products = new ProductApi(request);
    const response = await products.getProductById("99999");
    expect(response.status()).toBe(404);
  });
});
