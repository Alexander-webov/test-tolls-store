import { Page, expect } from "@playwright/test";

export class CatalogPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/");
  }
  async searchInput(nameProduct: string) {
    await this.page.getByTestId("search-query").fill(nameProduct);
  }

  async searchBtnCancel() {
    await this.page.getByTestId("search-reset").click();
  }
  async searchBtnSubmit() {
    await this.page.getByTestId("search-submit").click();
  }

  async checkCategory(nameCategory: string) {
    const checkBox = this.page.getByLabel(nameCategory);
    await checkBox.click();

    await expect(this.page.getByLabel(nameCategory)).toBeChecked();
    await expect(this.page.getByTestId("filter_completed")).toBeVisible();
  }

  getFirstItemProduct() {
    return this.page.locator(".card").first();
  }
}
