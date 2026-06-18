import { type APIRequestContext } from "@playwright/test";

export type NewUser = {
  first_name: string;
  last_name: string;
  address: {
    street: string;
    house_number: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  phone: string;
  dob: string;
  password: string;
  email: string;
};

export type User = {
  email: string;
  password: string;
};

export class AuthApi {
  private readonly request: APIRequestContext;
  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(user: User) {
    return this.request.post(`/users/login`, { data: user });
  }

  async register(newUser: NewUser) {
    return this.request.post(`/users/register`, { data: newUser });
  }
}
