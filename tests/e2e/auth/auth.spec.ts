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
