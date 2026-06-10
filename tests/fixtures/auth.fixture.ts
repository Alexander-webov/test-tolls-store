import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/AuthPga";
import { RegisterPage } from "../pages/RegisterPage";

type Page = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
};

export const test = baseTest.extend<Page>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    await use(loginPage);
  },
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await registerPage.gotoRegisterPage();
    await use(registerPage);
  },
});

export { expect } from "@playwright/test";
