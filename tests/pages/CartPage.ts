import { expect, Page } from "@playwright/test";
import { CatalogPage } from "./CatalogPage";

export class CartPage {
  constructor(private readonly page: Page) {}

  async getCartQuantityProducts() {
    return await this.page.getByTestId("cart-quantity").innerText();
  }

  async addProductsToTheCart(nameProduct: string, cartQuantity: string) {
    const catalogPage = new CatalogPage(this.page);
    await catalogPage.goto();
    await expect(this.page.getByTestId(/product-/).first()).toBeVisible();
    await this.page.getByRole("heading", { name: nameProduct, exact: true }).click();
    await this.page.getByTestId("add-to-cart").click();
    await expect(this.page.getByTestId("cart-quantity")).toContainText(cartQuantity);
  }

  async productDetails(nameProduct: string) {
    await this.page.getByRole("heading", { name: nameProduct, exact: true }).click();
  }
  async clickOnBtnAddToTheCart() {
    await this.page.getByTestId("add-to-cart").click();
  }
  async goTheCheckout() {
    await this.page.goto("/checkout");
  }
  async removeItemFromCart(WhatIsNumberProductShouldRemove: number) {
    await this.page
      .locator(".btn.btn-danger")
      .nth(WhatIsNumberProductShouldRemove - 1)
      .click();
  }
}
