import { test, expect } from "@playwright/test";
import { AuthApi, type NewUser } from "./services/AuthApi";

test.use({
  baseURL: process.env.API_URL,
});
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
  password: "SuperSecure@123",
  email: `${Date.now()}john@doe.example`,
};

test.describe("testing API registration", () => {
  test("register", async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.register(newUser);
    const data = await response.json();
    expect(response.status()).toBe(201);
    expect(data.email).toBe(newUser.email);
  });
});
