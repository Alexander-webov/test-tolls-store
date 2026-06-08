# Test Plan — Tool Shop (practicesoftwaretesting.com)

**Application under test:** https://practicesoftwaretesting.com
**API:** REST API with Swagger documentation (verify exact paths at the live Swagger URL)
**Type:** E-commerce demo (browse tools → cart → register/login → checkout)
**Author:** Alexander
**Framework:** Playwright + TypeScript (POM, fixtures, API service layer, CI via GitHub Actions)

---

## 1. Purpose

Define what is tested in Tool Shop, why, and at what priority. This project
covers both UI (E2E) and API testing, with a deliberate emphasis on the API
layer as the main learning and demonstration goal.

---

## 2. Scope

### In scope — UI
- Product catalog (display, filtering by category/brand, search, sort)
- Product detail page
- Cart (add, view, remove, persistence)
- Registration of a new customer
- Login / Logout
- Checkout flow up to invoice/confirmation

### In scope — API (primary focus)
- Public read endpoints (products, categories, brands)
- Authentication (login → bearer token, register)
- Authenticated endpoints (current user, cart/invoice operations)
- Authorization rules (which actions are admin-only)
- Contract validation (response shape, types, required fields)
- Negative cases (bad input, missing fields, unauthorized, forbidden)

### Out of scope — and why
| Area | Reason |
|------|--------|
| Visual styling, layout pixels | Belongs to visual testing (separate discipline) |
| Performance / load testing | Separate discipline; this project is functional only |
| Admin panel UI in depth | Test users available are non-admin; admin paths covered minimally via API negative cases |
| Real payment processing | Demo site; no real payment provider integrated |
| Cross-browser matrix (Firefox/WebKit) | Chromium first; expand later if needed |
| Email verification flows | Not exposed to automation reliably; covered by manual spot-check if needed |

---

## 3. Test Strategy

- **Pyramid position:** since the app exposes a real API, prioritize API tests
  for business logic (auth, cart math, validation), and use E2E only for the
  user-facing flows that depend on the UI itself.
- **Categories:**
  - `@smoke` — critical few. "Is the product usable?" Run on every push.
  - regression — full suite, includes detailed and negative cases. Nightly.
- **Test types:** positive (happy path), negative (invalid input, error
  handling), authorization (correct user can / wrong user can't), contract
  (response shape stable).
- **Design techniques:** equivalence partitioning and boundary value analysis
  to keep cases minimal but representative.

---

## 4. Test Environment & Data

- **UI URL:** https://practicesoftwaretesting.com (set via `MAIN_URL` env / `baseURL`)
- **API base URL:** confirm in Swagger (typically `https://api.practicesoftwaretesting.com`).
  Set via `API_URL` env.
- **Test users (provided by the site):**
  - Customer 1: `customer@practicesoftwaretesting.com` / `welcome01`
  - Customer 2: `customer2@practicesoftwaretesting.com` / `welcome01`
  - Admin: confirm in their docs
- **Important:** the database is **shared** across all users of the demo.
  Use unique generated data for any created entities (registration emails,
  cart items) via `@faker-js/faker`. Never put real personal info.

---

## 5. Architecture (automation structure)

### Folder layout
```
tests/
├── e2e/                     # UI tests
│   ├── catalog.spec.ts
│   ├── auth.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
├── api/                     # API tests
│   ├── auth.spec.ts
│   ├── products.spec.ts
│   ├── categories.spec.ts
│   └── cart.spec.ts
├── pages/                   # Page Objects (UI)
├── api/services/            # API service classes (HTTP clients)
├── fixtures/
└── data/                    # Test data builders, faker helpers
```

### Page Objects (UI)
| POM | Represents | Key elements |
|-----|------------|--------------|
| `CatalogPage` | Home / product list | product cards, search, category/brand filter, sort |
| `ProductDetailPage` | Single product view | name, price, description, add-to-cart |
| `CartPage` | Cart contents | items, quantity, remove, proceed to checkout |
| `RegisterPage` | Registration form | name, email, password, address fields, submit |
| `LoginPage` | Login form | email, password, submit, error message |
| `CheckoutPage` | Checkout steps | address review, payment method, place order, confirmation |

### API Service Layer
| Service | Wraps | Methods |
|---------|-------|---------|
| `AuthApi` | `/users/login`, `/users/register` | `login(email, password)`, `register(data)` |
| `ProductsApi` | `/products`, `/products/{id}` | `getAll(filters?)`, `getById(id)` |
| `CategoriesApi` | `/categories` | `getAll()` |
| `BrandsApi` | `/brands` | `getAll()` |
| `UsersApi` | `/users/me` (auth) | `getCurrent(token)` |

Each service follows the same pattern: takes `request` + base URL + (optional)
token in constructor, exposes methods that return raw `APIResponse`.
The test asserts on the response (status, body) — services do not assert.

---

## 6. UI Test Cases

### 6.1 Catalog — `CatalogPage`

| ID | Type | Priority | Scenario | Expected |
|----|------|----------|----------|----------|
| UI-CAT-01 | Positive | **smoke** | Open home, products displayed | At least 1 product card visible |
| UI-CAT-02 | Positive | regression | Search by product name | Results contain the search term |
| UI-CAT-03 | Positive | regression | Filter by a category | Only items of that category shown |
| UI-CAT-04 | Positive | regression | Sort by price ascending | Prices appear in ascending order |
| UI-CAT-05 | Positive | regression | Open product detail | Name and price match the catalog card |

### 6.2 Auth — `RegisterPage` / `LoginPage`

| ID | Type | Priority | Scenario | Expected |
|----|------|----------|----------|----------|
| UI-AUTH-01 | Positive | **smoke** | Login with provided customer creds | Lands on account/home as logged-in user |
| UI-AUTH-02 | Negative | regression | Login with wrong password | Error message visible; not logged in |
| UI-AUTH-03 | Negative | regression | Login with empty fields | HTML5 / inline validation triggers |
| UI-AUTH-04 | Positive | regression | Register a new user (unique email via faker) | Success; account exists |
| UI-AUTH-05 | Negative | regression | Register with existing email | Error: email already in use |
| UI-AUTH-06 | Positive | regression | Logout | Returns to anonymous state |

### 6.3 Cart — `CartPage`

| ID | Type | Priority | Scenario | Expected |
|----|------|----------|----------|----------|
| UI-CART-01 | Positive | **smoke** | Add product to cart | Cart badge shows "1"; item is in cart |
| UI-CART-02 | Positive | regression | Add two different products | Both items present; correct quantities |
| UI-CART-03 | Positive | regression | Remove an item | Item disappears; badge updates |
| UI-CART-04 | Positive | regression | Cart persists across navigation | After browsing back to cart, items remain |

### 6.4 Checkout

| ID | Type | Priority | Scenario | Expected |
|----|------|----------|----------|----------|
| UI-CO-01 | Positive | **smoke** | Full flow: login → add product → cart → checkout → confirmation | Order confirmation page reached |
| UI-CO-02 | Negative | regression | Continue checkout while not logged in | Prompted to log in or register |
| UI-CO-03 | Negative | regression | Checkout with empty required field | Validation error shown |

---

## 7. API Test Cases (primary focus)

### 7.1 Products — `ProductsApi`

| ID | Method | Endpoint | Type | Priority | Expected |
|----|--------|----------|------|----------|----------|
| API-PROD-01 | GET | `/products` | Positive | **smoke** | 200; array of products; each item has `id`, `name`, `price` |
| API-PROD-02 | GET | `/products?page=1` | Positive | regression | 200; pagination metadata present |
| API-PROD-03 | GET | `/products?category={id}` | Positive | regression | 200; all items belong to the filtered category |
| API-PROD-04 | GET | `/products/{id}` | Positive | regression | 200; item shape matches contract |
| API-PROD-05 | GET | `/products/99999` (nonexistent) | Negative | regression | 404 |
| API-PROD-06 | GET | `/products/abc` (invalid id format) | Negative | regression | 400 or 404 (verify in Swagger) |

### 7.2 Categories / Brands

| ID | Method | Endpoint | Priority | Expected |
|----|--------|----------|----------|----------|
| API-CAT-01 | GET | `/categories` | regression | 200; non-empty array |
| API-CAT-02 | GET | `/brands` | regression | 200; non-empty array |

### 7.3 Authentication — `AuthApi`

| ID | Method | Endpoint | Type | Priority | Expected |
|----|--------|----------|------|----------|----------|
| API-AUTH-01 | POST | `/users/login` (valid creds) | Positive | **smoke** | 200; response contains `access_token` (JWT shape: 3 parts) |
| API-AUTH-02 | POST | `/users/login` (wrong password) | Negative | regression | 401 |
| API-AUTH-03 | POST | `/users/login` (nonexistent user) | Negative | regression | 401 |
| API-AUTH-04 | POST | `/users/login` (empty body) | Negative | regression | 400 or 422 |
| API-AUTH-05 | POST | `/users/register` (unique faker email) | Positive | regression | 201; user object returned |
| API-AUTH-06 | POST | `/users/register` (duplicate email) | Negative | regression | 409 or 422 |
| API-AUTH-07 | POST | `/users/register` (missing required field) | Negative | regression | 422 |

### 7.4 Authenticated endpoints

| ID | Method | Endpoint | Type | Priority | Expected |
|----|--------|----------|------|----------|----------|
| API-USR-01 | GET | `/users/me` (with valid bearer token) | Positive | regression | 200; current user's email matches login |
| API-USR-02 | GET | `/users/me` (no token) | Negative | regression | 401 |
| API-USR-03 | GET | `/users/me` (invalid/expired token) | Negative | regression | 401 |

### 7.5 Authorization rules

| ID | Method | Endpoint | Type | Priority | Expected |
|----|--------|----------|------|----------|----------|
| API-AUTHZ-01 | DELETE | `/products/{id}` as customer | Negative | regression | 403 (forbidden — admin only) |
| API-AUTHZ-02 | POST | `/products` as customer | Negative | regression | 403 |

(Confirm admin-only endpoints in Swagger — these examples illustrate the authorization category.)

---

## 8. Smoke Suite (the critical few)

Run on every push/PR. Must be green:

- UI-CAT-01 — catalog loads
- UI-AUTH-01 — login works
- UI-CART-01 — add to cart works
- UI-CO-01 — full checkout flow completes
- API-PROD-01 — products API responds
- API-AUTH-01 — login API returns token

If these pass, the product is fundamentally usable end-to-end (UI and API).

---

## 9. Risk Notes

- **Highest risk / highest value:** authentication, the full checkout E2E, and
  the products listing API. Failure here makes the product unusable or
  insecure. → smoke.
- **Medium:** filtering, sorting, cart management, registration validation
  → regression.
- **Low / excluded:** styling, performance, admin UI depth — see Out of Scope.

## 10. Notes on the Shared Database

This is a public practice site with a shared backend. To keep tests reliable
and avoid polluting the dataset:

- Generate **unique** registration emails with faker (e.g. `aqa-${faker.string.uuid()}@example.test`).
- Do not assume specific products exist by name; query the API for the
  current catalog when a test needs a real product reference.
- Do not store created users back to disk; treat them as ephemeral.
- Do not put any real personal information in test data.
