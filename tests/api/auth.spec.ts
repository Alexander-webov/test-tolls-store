import { test, expect } from "@playwright/test";
import { AuthApi, type User, type NewUser } from "./services/AuthApi";

/* ### 7.3 Authentication — `AuthApi`

| ID | Method | Endpoint | Type | Priority | Expected |
|----|--------|----------|------|----------|----------|
| API-AUTH-01 | POST | `/users/login` (valid creds) | Positive | **smoke** | 200; response contains `access_token` (JWT shape: 3 parts) |
| API-AUTH-02 | POST | `/users/login` (wrong password) | Negative | regression | 401 |
| API-AUTH-03 | POST | `/users/login` (nonexistent user) | Negative | regression | 401 |
| API-AUTH-04 | POST | `/users/login` (empty body) | Negative | regression | 400 or 422 |
| API-AUTH-05 | POST | `/users/register` (unique faker email) | Positive | regression | 201; user object returned |
| API-AUTH-06 | POST | `/users/register` (duplicate email) | Negative | regression | 409 or 422 |
| API-AUTH-07 | POST | `/users/register` (missing required field) | Negative | regression | 422 | */

test.use({
  baseURL: process.env.API_URL,
});
const user: User = {
  email: "customer@practicesoftwaretesting.com",
  password: "welcome01",
};
const userWrongPassword: User = {
  email: "customer@practicesoftwaretesting.com",
  password: "welcome3325401",
};
const userNonexistent: User = {
  email: "cusefmer@practicesoffeesting.com",
  password: "welcome01",
};
const newUser: NewUser = {
  first_name: "John",
  last_name: "Doe",
  address: {
    street: "Street 1",
    house_number: "12",
    city: "City",
    state: "State",
    country: "Country",
    postal_code: "1234AA",
  },
  phone: "0987654321",
  dob: "1970-01-01",
  password: "S6757Secure@123",
  email: `${Date.now()}john@doe.example`,
};

const duplicateUser: NewUser = {
  ...newUser,
  email: "cusefmer@practicesoffeesting.com",
};

test.describe("AuthApi", () => {
  test("/users/login` (valid creds) | Positive | **smoke** | 200; response contains `access_token` (JWT shape: 3 parts) ", async ({
    request,
  }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login(user);
    const data = await response.json();
    expect(response.status()).toBe(200);
    expect(data.access_token.length).toBeGreaterThan(1);
  });
  test("/users/login` (wrong password) | Negative | regression | 401 ", async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login(userWrongPassword);
    expect(response.status()).toBe(401);
  });
  test("/users/login` (nonexistent user) | Negative | regression | 401 ", async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login(userNonexistent);
    expect(response.status()).toBe(401);
  });

  test("/users/register` (unique faker email) | Positive | regression | 201; user object returned ", async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.register(newUser);
    const data = await response.json();
    expect(response.status()).toBe(201);
    expect(data).toMatchObject({ first_name: "John", last_name: "Doe", phone: "0987654321", dob: "1970-01-01" });
  });
  test("/users/register` (duplicate email) | Negative | regression | 409 or 422 ", async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.register(duplicateUser);
    expect([409, 422]).toContain(response.status());
  });
  test("/users/register` (missing required field) | Negative | regression | 422", async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.register({
      first_name: "John",
      last_name: "Doe",
      address: {
        street: "Street 1",
        house_number: "12",
        city: "City",
        state: "State",
        country: "Country",
        postal_code: "1234AA",
      },
      phone: "0987654321",
      dob: "1970-01-01",
      password: "",
      email: "",
    });
    const data = await response.json();
    expect(response.status()).toBe(422);
    expect(data).toMatchObject({
      email: ["The email field is required."],
      password: ["The password field is required."],
    });
  });
});
