import { test as baseTest } from "@playwright/test";
import { CartPage } from "../pages/CartPage";

type Page = {
  cartPage: CartPage;
};

export const test = baseTest.extend<Page>({
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    use(cartPage);
  },
});
export { expect } from "@playwright/test";
