import { Page } from "@playwright/test";

export class LoginPage {
  constructor(private readonly page: Page) {}

  async gotoLoginPage() {
    await this.page.goto("/auth/login");
  }

  async login(email: string, password: string) {
    await this.page.getByTestId("email").fill(email);
    await this.page.getByTestId("password").fill(password);
    await this.page.getByTestId("login-submit").click();
  }
  async logout() {
    await this.page.getByTestId("nav-menu").click();
    await this.page.getByTestId("nav-sign-out").click();
  }
}
