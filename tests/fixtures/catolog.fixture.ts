import { test as base } from "@playwright/test";
import { CatalogPage } from "../pages/CatalogPage";

type Page = {
  catalogPage: CatalogPage;
};

export const test = base.extend<Page>({
  catalogPage: async ({ page }, use) => {
    const catalogPage = new CatalogPage(page);
    await catalogPage.goto();
    await use(catalogPage);
  },
});
export { expect } from "@playwright/test";
