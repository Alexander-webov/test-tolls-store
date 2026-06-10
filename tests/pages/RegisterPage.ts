import { Page } from "@playwright/test";
export type UserData = {
  firstName: string;
  lastName: string;
  dob: string;
  postalCode: string;
  houseNumber: string;
  street: string;
  country: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  password: string;
};

export class RegisterPage {
  constructor(private readonly page: Page) {}
  async gotoRegisterPage() {
    await this.page.goto("/auth/register");
  }
  async registerForm({ ...newUser }: UserData) {
    await this.page.getByTestId("first-name").fill(newUser.firstName);
    await this.page.getByTestId("last-name").fill(newUser.lastName);
    await this.page.getByTestId("dob").fill(newUser.dob);
    await this.page.getByTestId("postal_code").fill(newUser.postalCode);
    await this.page.getByTestId("house_number").fill(newUser.houseNumber);
    await this.page.getByTestId("street").fill(newUser.street);
    await this.page.getByTestId("city").fill(newUser.city);
    await this.page.getByTestId("country").selectOption(newUser.country);
    await this.page.getByTestId("state").fill(newUser.state);
    await this.page.getByTestId("phone").fill(newUser.phone);
    await this.page.getByTestId("email").fill(newUser.email);
    await this.page.getByTestId("password").fill(newUser.password);
  }
  async registerBtn() {
    await this.page.getByTestId("register-submit").click();
  }
}
