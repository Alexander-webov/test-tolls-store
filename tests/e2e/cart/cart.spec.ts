import { test, expect } from "../../fixtures/cart.fixture";
import { CatalogPage } from "../../pages/CatalogPage";
/*

| ID | Type | Priority | Scenario | Expected |
|----|------|----------|----------|----------|
| UI-CART-01 | Positive | **smoke** | Add product to cart | Cart badge shows "1"; item is in cart |
| UI-CART-02 | Positive | regression | Add two different products | Both items present; correct quantities |
| UI-CART-03 | Positive | regression | Remove an item | Item disappears; badge updates |
| UI-CART-04 | Positive | regression | Cart persists across navigation | After browsing back to cart, items remain |
*/

test.describe("test cart page", () => {
  let catalogPage: CatalogPage;
  test("Add product to cart | Cart badge shows 1 item is in cart", { tag: "@smoke" }, async ({ page, cartPage }) => {
    const nameProduct = "Bolt Cutters";
    await cartPage.addProductsToTheCart(nameProduct, "1");
  });
  test("Add two different products | Both items present; correct quantities", { tag: "@regression" }, async ({ page, cartPage }) => {
    const nameProducts = ["Bolt Cutters", "Pliers"];
    catalogPage = new CatalogPage(page);
    for (let i = 0; i < nameProducts.length; i++) {
      await cartPage.addProductsToTheCart(nameProducts[i], (i + 1).toString());
    }
    await expect(page.getByTestId("cart-quantity")).toContainText(nameProducts.length.toString());
  });
  test("Remove an item | Item disappears; badge updates", { tag: "@regression" }, async ({ page, cartPage }) => {
    const nameProduct = "Bolt Cutters";
    await cartPage.addProductsToTheCart(nameProduct, "1");
    await cartPage.goTheCheckout();
    await expect(page.locator(".table")).toBeVisible();
    await cartPage.removeItemFromCart(1);
    await expect(page.getByTestId("cart-quantity")).toBeHidden();
  });
  test(
    "Cart persists across navigation | After browsing back to cart, items remain",
    { tag: "@regression" },
    async ({ page, cartPage }) => {
      const nameProduct = "Bolt Cutters";
      await cartPage.addProductsToTheCart(nameProduct, "1");
      await page.goBack();
      await expect(page.getByTestId("cart-quantity")).toContainText("1");
    },
  );
});
