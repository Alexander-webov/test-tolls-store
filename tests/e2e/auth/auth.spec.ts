import { test, expect } from "../../fixtures/auth.fixture";
import { faker } from "@faker-js/faker";
/* 
### 6.2 Auth — `RegisterPage` / `LoginPage`
| ID | Type | Priority | Scenario | Expected |
|----|------|----------|----------|----------|
| UI-AUTH-01 | Positive | **smoke** | Login with provided customer creds | Lands on account/home as logged-in user |
| UI-AUTH-02 | Negative | regression | Login with wrong password | Error message visible; not logged in |
| UI-AUTH-03 | Negative | regression | Login with empty fields | HTML5 / inline validation triggers |
| UI-AUTH-04 | Positive | regression | Register a new user (unique email via faker) | Success; account exists |
| UI-AUTH-05 | Negative | regression | Register with existing email | Error: email already in use |
| UI-AUTH-06 | Positive | regression | Logout | Returns to anonymous state |
*/

const dataForLogin = {
  email: "customer@practicesoftwaretesting.com",
  password: "welcome01",
};

const dataNewUser = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  dob: "2000-04-18",
  postalCode: faker.number.int({ min: 10000, max: 19999 }).toString(),
  houseNumber: faker.number.int(99).toString(),
  street: "string",
  country: "CA",
  city: "NYC",
  state: "NY",
  phone: "8074846833",
  email: `aqa-${faker.string.uuid()}@postplan.local`,
  password: "Go7dMarrQP58OvW@",
};
const dataNewUserExistEmail = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  dob: "2000-04-18",
  postalCode: faker.number.int({ min: 10000, max: 19999 }).toString(),
  houseNumber: faker.number.int(99).toString(),
  street: "string",
  country: "CA",
  city: "NYC",
  state: "NY",
  phone: "8074846833",
  email: `customer@practicesoftwaretesting.com`,
  password: "Go7dMarrQP58OvW@",
};

test.describe("test login page", () => {
  test("Login with provided customer creds | Lands on account/home as logged-in user", { tag: "@smoke" }, async ({ page, loginPage }) => {
    expect(page.getByRole("heading", { name: "Login" }));
    loginPage.login(dataForLogin.email, dataForLogin.password);
    await expect(page.getByTestId("page-title")).toHaveText("My account");
  });
  /* login-error */
  test(" Login with wrong password | Error message visible; not logged in ", { tag: "@regression" }, async ({ page, loginPage }) => {
    expect(page.getByRole("heading", { name: "Login" }));
    loginPage.login(dataForLogin.email, "MyWronGPassoerd");
    await expect(page.getByTestId("login-error")).toHaveText("Invalid email or password");
  });

  test("Login with empty fields | HTML5 / inline validation triggers", { tag: "@regression" }, async ({ page, loginPage }) => {
    expect(page.getByRole("heading", { name: "Login" }));
    loginPage.login("", "");
    await expect(page.getByTestId("email-error")).toHaveText("Email is required");
    await expect(page.getByTestId("password-error")).toHaveText("Password is required");
  });
});

test.describe("test regicter page", () => {
  test.skip("Register a new user | Success; account exists", { tag: "@regression" }, async ({ page, registerPage }) => {
    expect(page.getByRole("heading", { name: "Customer registration" }));
    await registerPage.registerForm(dataNewUser);
    await registerPage.registerBtn();
    await expect(page).toHaveURL("/auth/login");
  });

  test.skip("Register with existing email", { tag: "@regression" }, async ({ page, registerPage }) => {
    expect(page.getByRole("heading", { name: "Customer registration" }));
    await registerPage.registerForm(dataNewUserExistEmail);
    await registerPage.registerBtn();
    await expect(page.getByTestId("register-error")).toHaveText("A customer with this email address already exists.");
  });

  test("Login with provided customer creds | Lands on account/home as logged-in user", { tag: "@smoke" }, async ({ page, loginPage }) => {
    expect(page.getByRole("heading", { name: "Login" }));
    await loginPage.login(dataForLogin.email, dataForLogin.password);
    await loginPage.logout();
    await expect(page).toHaveURL("/auth/login");
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  });
});
