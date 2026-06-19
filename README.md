# Tool Shop — Playwright + TypeScript (UI + API)

End-to-end and API test automation for [practicesoftwaretesting.com](https://practicesoftwaretesting.com), an e-commerce demo site. Built with **Playwright** and **TypeScript**, with a deliberate emphasis on the **API layer** as the primary learning and demonstration goal — UI tests cover the user-facing flows that genuinely need a browser.

This is my second QA automation portfolio project. The first ([saucedemo](https://github.com/Alexander-webov/test-dress-online-store-playwright-ts)) was UI-only; this one adds an API service layer, contract checks, and authorization testing on top of the same POM/fixtures foundation.

---

## Tech stack

- **[Playwright](https://playwright.dev/)** — UI and API testing in one framework
- **TypeScript**
- **@faker-js/faker** — unique test data for a shared, public database
- **GitHub Actions** — CI on every push and pull request

---

## Why API-first

The site exposes a real REST API behind the storefront. Business logic — authentication, validation, authorization rules — lives there, not in the DOM. Testing it directly is faster, more stable, and catches things UI tests can't easily reach (wrong status code, wrong error shape, a customer hitting an admin-only endpoint). UI tests are reserved for flows where the browser interaction itself is the thing under test: filtering, sorting, cart state, checkout.

---

## What's covered

### API

**Auth** (`/users/login`, `/users/register`)
- Valid login returns `200` with a JWT access token
- Wrong password / nonexistent user → `401`
- Register with a unique, faker-generated email → `201`
- Register with a duplicate email → `409` / `422`
- Register with missing required fields → `422` with field-level error messages

**Products** (`/products`)
- List endpoint returns `200` with a well-formed array (`id`, `name`, `price` on every item)
- Pagination metadata present on `?page=1`
- Filtering by category returns only matching items
- Single product by ID matches the contract
- Nonexistent / malformed ID → `404`

**Categories & brands**
- Both list endpoints return `200` with a non-empty array

### UI

**Catalog**
- Home page loads with products visible
- Search by name filters results correctly
- Filtering by category shows only matching items
- Sort by price (ascending) — verified with `expect.poll` against the live list rather than a single snapshot, since the re-sort happens asynchronously
- Product detail page name/price match the catalog card

**Auth**
- Login with valid credentials reaches the account page
- Wrong password / empty fields show the right validation messages
- Logout returns to an anonymous state
- Registration (new user / duplicate email) — implemented, currently skipped while a flow issue is investigated

**Cart**
- Add one / multiple products → badge count and quantities correct
- Remove an item → badge updates
- Cart persists across back-navigation

---

## Project structure

```
tests/
├── api/
│   ├── auth.spec.ts
│   ├── product.spec.ts
│   ├── categories.spec.ts
│   └── services/          # AuthApi, ProductApi, CategoriesApi
├── e2e/
│   ├── auth/
│   ├── cart/
│   └── catolog/
├── pages/                  # CatalogPage, CartPage, AuthPage, RegisterPage
└── fixtures/                # catolog.fixture, cart.fixture, auth.fixture
```

---

## Architecture notes

### API service layer

Each service wraps one resource and returns the raw `APIResponse` — assertions live in the test, not the service:

```typescript
export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  async login(user: User) {
    return this.request.post(`/users/login`, { data: user });
  }

  async register(newUser: NewUser) {
    return this.request.post(`/users/register`, { data: newUser });
  }
}
```

```typescript
test("/users/login (valid creds) → 200 with access_token", async ({ request }) => {
  const authApi = new AuthApi(request);
  const response = await authApi.login(user);
  const data = await response.json();
  expect(response.status()).toBe(200);
  expect(data.access_token.length).toBeGreaterThan(1);
});
```

### Handling the shared database

This is a public demo with one shared backend across every visitor. To keep tests reliable:
- Registration emails are generated per run (`faker.string.uuid()` / timestamp-based), never hardcoded
- Tests query the API for real category/product IDs rather than assuming fixed catalog content where practical
- No test writes back real personal data

### Custom `testIdAttribute`

The app uses `data-test` instead of Playwright's default `data-testid`, configured once in `playwright.config.ts`:

```typescript
use: {
  testIdAttribute: "data-test",
}
```

This makes `getByTestId()` work app-wide without repeating the raw attribute selector in every test.

### Sort assertion with `expect.poll`

Sorting re-renders the list asynchronously, so a single read-after-click is flaky. Polling the DOM until the order condition holds removes that flakiness:

```typescript
await page.getByTestId("sort").selectOption("price,asc");
await expect
  .poll(async () => {
    const nums = (await prices.allTextContents()).map((p) => +p.replace(/[^0-9.]/g, ""));
    return nums.every((v, i) => i === 0 || v >= nums[i - 1]);
  })
  .toBe(true);
```

---

## Running tests

```bash
# install
npm install
npx playwright install

# all tests
npx playwright test

# only API
npx playwright test tests/api

# only UI
npx playwright test tests/e2e

# by tag
npx playwright test --grep @smoke
npx playwright test --grep @regression

# headed / debug
npx playwright test --headed
npx playwright test --debug

# last HTML report
npx playwright show-report
```

### Environment variables

```
MAIN_URL=https://practicesoftwaretesting.com
API_URL=https://api.practicesoftwaretesting.com
```

`.env` is gitignored — copy `.env.example` (or create one) before running locally.

---

## Known limitations / next steps

- Registration UI tests are currently `test.skip` — being revisited
- CI workflow doesn't yet inject `MAIN_URL` / `API_URL` as environment variables, so tests will fail in GitHub Actions until that's added to `playwright.yml` (works locally via `.env`)
- Authorization tests for admin-only endpoints (`API-AUTHZ-01/02` in the test plan) are planned but not yet implemented
- No cross-browser run yet — Chromium only

See [`TEST_PLAN_toolshop.md`](./TEST_PLAN_toolshop.md) for the full test design, scope, and risk notes.

---

## Author

[Alexander-webov](https://github.com/Alexander-webov) — built while learning QA automation, with a focus on API testing for the job search.
