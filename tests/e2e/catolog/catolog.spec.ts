import { test, expect } from "../../fixtures/catolog.fixture";

test.describe("catalog page", () => {
  test(" Open home, products displayed ", { tag: "@smoke" }, async ({ page, catalogPage }) => {
    await expect(page.locator("a.card").first()).toBeVisible();
  });

  test(" Search by product name | Results contain the search term ", { tag: "@regression" }, async ({ page, catalogPage }) => {
    const productName = "Pliers";
    await catalogPage.searchInput(productName);
    await expect(page.getByTestId("search-query")).toHaveValue(productName);
    await catalogPage.searchBtnSubmit();
    const searchResult = page.getByTestId("search-result-count");
    await expect(searchResult).toHaveText(/found for 'Pliers'/);
  });

  test(" Filter by a category | Only items of that category shown ", { tag: "@regression" }, async ({ page, catalogPage }) => {
    await catalogPage.checkCategory("Pliers");
    const filterCompleted = page.getByTestId("filter_completed");
    const cards = filterCompleted.locator(".card");
    const count = (await cards.all()).length;
    let i = 1;
    for (const el of await cards.all()) {
      await el.click();
      await expect(page.getByLabel("category")).toContainText("Pliers");
      if (count === i) return;
      await catalogPage.goto();
      await catalogPage.checkCategory("Pliers");
      i++;
    }
  });
  test(" Sort by price ascending | Prices appear in ascending order ", { tag: "@regression" }, async ({ page, catalogPage }) => {
    const prices = page.getByTestId("product-price");
    await prices.first().waitFor();
    const defaultPrices = await prices.allTextContents();
    await page.getByTestId("sort").selectOption("price,asc");
    await expect
      .poll(async () => {
        const nums = (await prices.allTextContents()).map((p) => +p.replace(/[^0-9.]/g, ""));
        return nums.every((v, i) => i === 0 || v >= nums[i - 1]);
      })
      .toBe(true);
  });
  test(" Open product detail | Name and price match the catalog card | ", { tag: "@regression" }, async ({ page, catalogPage }) => {
    const item = catalogPage.getFirstItemProduct();
    await expect(item).toBeVisible();
    const itemName = await item.getByTestId("product-name").innerText();
    const itemPrice = await item.getByTestId("product-price").innerText();
    await item.click();
    await expect(page.getByTestId("product-name")).toHaveText(itemName);
    await expect(page.getByTestId("unit-price")).toHaveText(itemPrice.replace("$", ""));
  });
});
