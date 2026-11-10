# Consultants R Us — Company Web Panel: API Integration Plan

Status: **review draft, no code written yet.** Based on a read of `consultantsBackend` (Node/Express), `consultantsFrontend` (Flutter, company/"contractor" role only) and the Dexnive Frontend Architecture Guide.

> Terminology: the backend calls a company a **contractor** (`role: "contractor"`, routes under `/contractor`). An employee is a **consultant** in the web UI.

---

## 0. Decisions (from your answers)

* **Q1** Use the URL the mobile app uses. It comes from Firebase Remote Config (`remoteConfigData.BASE_URL`), not the repo → still need the value; goes in `NEXT_PUBLIC_API_URL`.
* **Q2** Subscriptions are **Apple/Google in-app purchase only** (`POST /payments/validate` takes `originalTransactionId` or `purchaseToken`+`productId`). Stripe has only unused env keys in `config.js`, no package or route. Web cannot buy; it reads `subscriptionStatus.status` and shows a gate when not `active`.
* **Q3** Everything real, mobile parity, **no mock data or components**. Mock-only UI (about, work history, skills, typeset resume) is removed.
* **Q4** Filters follow what the backend reads (§7), flows follow the mobile app.
* **Q5** Email = `mailto:` like mobile.
* **Q6** Restructure per guide, remove ESLint, add Prettier.
* **Q7** No Socket.io.
* **Q8** Token in localStorage **only**. No cookie, therefore **no `proxy.ts`**: route protection is a client-side `AuthGuard` (a cookie is only needed so server-side `proxy.ts` can redirect before render; not required here).

## 1. Open questions (superseded by §0 except Q1)

| # | Question | Why it matters | My default if you don't answer |
|---|----------|----------------|--------------------------------|
| Q1 | **API base URL(s)** for dev/staging/prod. The mobile app does not hardcode it; it reads `BASE_URL` from Firebase Remote Config (not in the repo). | Needed for `NEXT_PUBLIC_API_URL`. | I add `.env.example` with a placeholder and you fill it in. |
| Q2 | **Subscriptions.** On mobile, a company cannot reach the home screen until `subscriptionStatus.status === "active"` (bought via Apple/Google in-app purchase through `POST /payments/validate`). Web cannot do in-app purchase. The backend does **not** enforce it on `/contractor/*` routes; it is a client-side gate only. | Decides whether the web is usable on day one. | **Web shows a "Subscription required — subscribe in the mobile app" screen for non-active companies**, no web payment. |
| Q3 | **Resume tab / work-history.** The current web UI shows *About, Work experience timeline, Skills, a typeset resume*. **The backend has none of that data.** Employee records only hold: job title, years of experience, industry, shift type, availability date, travel, preferred state/city, **uploaded PDF documents** (4 resume types, 10 certificate types, 4 degree levels), profile picture and DOB. | Profile and Resume tabs must be rebuilt to match the mobile app (see §6). | **Replace** with mobile-equivalent: facts grid + document list with in-browser PDF view/download. |
| Q4 | **Filter fidelity.** Several filters the mobile app sends do not work against the current backend (details in §7). Fix the backend, or mirror the mobile app including its quirks? | Affects what "same as mobile" means. | I send the keys the **backend** actually reads, and list backend fixes you can pass to the backend dev. |
| Q5 | **Send email to employee.** Mobile opens the device mail client (`mailto:` with a canned "shortlisted" message). A backend endpoint `POST /contractor/send-email-to-employee` also exists and is unused by mobile. | Choose UX. | Default = **mailto** like mobile (keeps parity). Optional upgrade: a compose dialog that posts to the API. |
| Q6 | **Architecture guide vs existing code.** The guide mandates Redux Toolkit + TanStack Query + Axios + RHF/Zod + Prettier-only (no ESLint) + `features/` modules. The current app uses its own localStorage store, ESLint and a flat `components/` folder. OK to migrate (remove ESLint, add Prettier, restructure)? | Scope of refactor. | Yes, migrate per the guide. |
| Q7 | **Socket.io** (guide lists it). The backend has no socket server; notifications are FCM push + a REST list for employees only. | Skip a dependency we can't use. | **Not installed.** Add later if chat/real-time arrives. |
| Q8 | **Remember-me / session length.** Backend JWT is bound to a logged-device record, not a refresh-token flow. | Logout rules. | Token in localStorage + cookie as per guide; clear on 401. |

---

## 2. Backend contract (as built)

* Base: `{BASE_URL}`; routers mounted at `/auth`, `/user`, `/contractor`, `/admin`, `/payments`.
* **Success:** `{ "success": true, "message": "...", "data": {...}, "pagination": {...}? }`
* **Error:** `{ "success": false, "message": "..." }` (HTTP 4xx/5xx). Some "business" failures return **HTTP 200 with `success:false`** (e.g. wishlist empty, company already exists) — the Axios layer must check `success`, not only status.
* **Auth header:** `Authorization: Bearer <jwt>`. JWT = `{ id: <loggedDeviceId> }`; server looks up the logged-device row, so deleting that row (logout / password change on another device) kills the token.
* **Device headers:** mobile sends `devicemodel` and `deviceuniqueid` on *every* request. `DeviceMiddleware` (requires both) exists but is only wired in the unused `routes/index.js`, so it is probably not enforced today. **Send both anyway.** On web: `devicemodel = "Web <browser>"`, `deviceuniqueid` = UUID generated once per browser and kept in localStorage (login does `findOneAndDelete({deviceIdentity})`, so a shared constant would log every browser out of each other).
* **401 messages that mean "force logout"** (mobile interceptor): `Invalid or expired token provided`, `Unauthorized - Please relogin`, `No such User found - Access denied`.
* **CORS:** `origin: "*"`, methods GET/POST/PUT/PATCH/DELETE — browser calls work; no backend change needed.
* **Uploads:** `multer` memory/disk → URL string; field names are case-sensitive (`profilePicture`, `Licence`).
* **Pagination object:** `{ itemsPerPage, currentPage, totalItems, totalPages }`.

---

## 3. API → screen mapping (company role)

### 3.1 Auth

| Web screen (existing route) | Endpoint | Request | Response / notes |
|---|---|---|---|
| `/signup` | `POST /auth/check-email` | `{ email }` | `data.exists: boolean` — call on blur/next to give early "email taken". |
| `/signup` | `POST /auth/user-signup` | `{ fullName, email, password (min 8), confirmPassword, role: "contractor", fcmToken?: null }` | Company signup has **no `tfa`** → `isEmailVerified:true` immediately and `data: { name, email, phone, token }`. Token is stored, user is sent to **/setup**. (`fullName` becomes `companyName`.) |
| `/login` | `POST /auth/login` | `{ email (lowercased), password, role: "contractor", fcmToken: null }` | `data: { user: Company, token }`; `user.subscriptionStatus`, `user.isProfileCompleted`. Errors: "User doesn't exist!", "Invalid credentials!", "Your account has been restricted by admin…". Role mismatch is a *not found* (login is filtered by role). |
| `/forgot` step 1 | `POST /auth/forgot-password` | `{ email, role: "contractor" }` | "OTP Sent to Email Successfully". OTP valid **120 s**. (Dev backends return fixed `123456` when SendGrid is disabled.) |
| `/forgot` step 2 | `POST /auth/verify-reset-otp` | `{ email, otp }` | `data: { token, ... }` — a **real session token**, used as the Bearer for the reset call. |
| `/forgot` step 3 | `POST /auth/reset-password` | `{ newPassword }` + Bearer from step 2 | Kills all sessions; send user to `/login`. |
| Account menu → Change password *(new)* | `POST /auth/change-password` | `{ currentPassword, newPassword }` | Errors: "Current password is incorrect!", "Old password cannot be used again!". |
| Account menu → Log out | `POST /auth/logout` (Bearer) | – | Always clear local state even if the call fails. |
| Account menu → Delete account *(new)* | `POST /auth/delete-account` (Bearer) | `{ password }` | Soft delete; then clear session. |

Not needed for company: `/auth/verify-otp`, `/auth/request-email-otp` (only used when `tfa:true`, which the mobile company flow never sets).

### 3.2 Company profile

| Web screen | Endpoint | Request | Response / notes |
|---|---|---|---|
| `/setup` (complete profile) | `POST /contractor/complete-profile` **multipart** | `industryFocus` (string; mobile has a single option **"Oil Field"**), `companySize` (`0-1`,`1-10`,`10-50`,`50-200`,`200-500`,`500-1000`,`1000+`), `description` (≤1000, optional), `webUrl` (≤250, optional), `city`, `state`, `country`, files: `profilePicture` (optional), **`Licence`** (proof document, required by mobile) | `data.company`. "Company already exists" comes back as `success:false`. |
| App boot / `/company` | `GET /contractor/get-profile` | – | `data.company` = `{ id, signUpRecord, companyName, companySize, city, industryFocus, email, description, webUrl[], profilePicture, licence, isEmailVerified, isProfileCompleted, state, country, status ("pending"\|"approved"), subscriptionStatus{status,platform,currentPeriodEnd,lastValidated}, createdAt }`. Error text `"Contractor profile is not completed"` ⇒ send to `/setup`. |
| `/company` (edit) | `POST /contractor/update-profile` **multipart** | `companyName?`, `industryFocus`, `companySize`, `description`, `webUrl` (repeat field per URL), `city`, `state`, `country`, `profilePicture` file, `isProfileImageDeleted=true` to remove | `data.company`. **Licence cannot be updated** after setup. |

Company `status` (`pending`/`approved`) is admin-controlled; mobile treats both as "can use home" — web will show a "Pending verification" badge only.

### 3.3 Consultants (employees)

| Web screen | Endpoint | Request | Response / notes |
|---|---|---|---|
| `/consultants` (list + filters + infinite "Load more") | `GET /contractor/get-employees-by-contractor` | query `page`, `limit` (mobile uses its own `_limit`; default 20) + filters (§7) | `data: { employees: Employee[], companiesCount, pagination }`; each employee has `isWishList` for **this** company. |
| `/consultants` header counter | same call | – | `data.companiesCount` = total companies on the platform (the mobile "Total companies" bar → links to Companies list). |
| Search box | – | – | **Client-side name filter over already-loaded pages** (mobile does the same). There is no server search param. |
| Details sheet / `/consultants/[id]` | none dedicated | – | **No "get employee by id" endpoint exists.** Mobile passes the list item to the detail screen. Web needs: (a) cache in TanStack Query so the sheet and full page read the list item, and (b) for a direct URL / refresh, page through the list to find the id (fallback) — or backend adds `GET /contractor/get-employee/:id` (**recommended**, small change). |
| Detail → opening a resume | `POST /contractor/track-employee-event` | `{ employeeId: <signUpRecord id>, eventType: "view-resume" }` | Also `"resume-downloaded"` (on download) and `"profile-view"`. Sends a push/notification to the employee (deduped by backend TTL). |
| Detail → Email | mailto (see Q5) or `POST /contractor/send-email-to-employee` `{ employeeId, subject, message }` | | Mobile default subject "Congratulations — Your Profile Has Been Shortlisted". |

**IDs warning:** employee objects carry two ids: `id` (User doc) and `signUpRecord._id` / `signUpRecord` (account id). **Wishlist, track-event and send-email all take the `signUpRecord` id**, not `id`. The mobile code uses `resume.signUpRecord.id`.

### 3.4 Favorites

| Web screen | Endpoint | Request | Response / notes |
|---|---|---|---|
| Star button (list, sheet, detail) | `POST /contractor/add-wishlist` | `{ employeeId: <signUpRecord id> }` | It is a **toggle**: "Employee Marked as Favorite" / "Employee Removed from Favorites". Use optimistic update + rollback (mobile does). First add notifies the employee. |
| `/favorites` | `GET /contractor/get-wishlist` | – | Returns **max 10**, no page param. Empty wishlist ⇒ `{ success:false, message:"Wishlist is empty" }` (treat as empty list, not an error). Items are **raw** user docs with populated `signUpRecord` (not run through the transformer: no `name`; use `signUpRecord.fullName`). |

### 3.5 Companies directory

| Web screen | Endpoint | Notes |
|---|---|---|
| *New:* `/companies` (mobile "Total companies" → company list) | `GET /contractor/get-all-companies` | `data: [{ _id, companyName, profilePicture }]`, **not paginated** (mobile's `page/limit` body is ignored). Read-only list. |

### 3.6 Not in scope for company
Notifications (`/user/get-notification-content`, settings) — mobile hides "Notification Settings" for contractors. Employee-only: `/user/*`, document upload, availability, preferences.

### 3.7 Subscription
`GET /payments/users/subscription-status` (Bearer) also exists; status is already embedded in login and `get-profile`, so web just reads `company.subscriptionStatus.status === "active"`. See Q2.

---

## 4. Data models (TypeScript, to live in `src/features/*/types`)

```ts
type ApiResponse<T> = { success: boolean; message?: string; data: T; pagination?: Pagination };
type Pagination = { itemsPerPage: number; currentPage: number; totalItems: number; totalPages: number };

type Company = {
  id: string; signUpRecord: string; role: "contractor"; companyName: string | null;
  companySize: string | null; industryFocus: string | null; description: string | null;
  webUrl: string[]; profilePicture: string | null; licence: string | null;
  city: string | null; state: string | null; country: string | null; email: string;
  isEmailVerified: boolean; isProfileCompleted: boolean; status: "pending" | "approved" | null;
  subscriptionStatus: { status: "none" | "active" | string; platform?: string; currentPeriodEnd?: string; lastValidated?: string } | null;
};

type Employee = {            // transformer output of /get-employees-by-contractor
  id: string; employeeId: string | null; name: string; email: string | null; phone: string | null;
  jobTitle: string | null; experience: number | null; industry: string | null;
  availability: string | null /* ISO date */; shiftType: "Day" | "Night" | "Both" | null;
  rotationalShifts: boolean; openToTravel: boolean; prefferedJobTypes: string[];
  prefferedStateToWork: string | null; prefferedCityToWork: string | null;
  completionResumes: string[]; engineeringResumes: string[];
  workOverCompletionResumes: string[]; drillingResumes: string[];   // PDF URLs
  certificates: Partial<Record<CertKey, string>>;                    // value = document URL, "" if none
  degrees: Record<"highSchool" | "associate" | "bachelor" | "master", string[]>;
  primary: Record<string, unknown>;                                  // the employee's chosen "primary" docs
  profilePicture: string | null; isWishList: boolean;
  signUpRecord: { _id: string; fullName: string; email: string; phone?: string; dob?: string; gender?: string } | null;
};
type CertKey = "H2S" | "WellControl" | "CPR_AED" | "ConfinedSpaceCertified" | "Bop"
             | "DrillingWellControl" | "RodHandling" | "RescueTraining" | "FitTest" | "Excavation";
```

Display-name mapping for the existing `Consultant` UI fields:

| Current mock field | Real source |
|---|---|
| `name` | `name` (fallback `signUpRecord.fullName`) |
| `role` | `jobTitle` |
| `years` | `experience` |
| `expertise` | which `*Resumes` arrays are non-empty (Completion / Engineering / Work Over Completion / Drilling) |
| `location` | `prefferedCityToWork, prefferedStateToWork` |
| `availability` | `availability` (a date: "Available now" if ≤ today) |
| `shift` | `shiftType` + `rotationalShifts` |
| `education` | non-empty `degrees.*` keys |
| `certs` | non-empty `certificates.*` keys |
| `phone`, `email` | `phone`, `email` |
| `about`, `experience[]` (work history), `skills` | **no API data** (see Q3) |

---

## 5. Auth/session design (per architecture guide)

* `features/auth/` slice (Redux Toolkit): `{ user: Company | null, token, isAuthenticated, hydrated }`.
* Persist: `localStorage["auth-token"]`, `localStorage["auth-user"]`, **cookie `auth-token`** (so `proxy.ts` can guard routes server-side).
* `src/proxy.ts` (Next 16 replaces middleware) + `src/config/routes.ts`: public = `/`, `/login`, `/signup`, `/forgot`; everything else needs the cookie. Redirect authed users away from auth pages.
* Axios instance (`src/lib/api/client.ts`): baseURL from env, request interceptor adds `Authorization`, `devicemodel`, `deviceuniqueid`; response interceptor unwraps `data`, throws on `success:false`, and on the 3 force-logout messages dispatches `logout()` and redirects to `/login`.
* Post-login routing (mirrors mobile `whereToGoContractor`):
  1. `!isProfileCompleted` or error "profile is not completed" → `/setup`
  2. `subscriptionStatus.status !== "active"` → `/subscription-required` (Q2)
  3. else → `/consultants`
* Device id helper: `crypto.randomUUID()` persisted once.

---

## 6. Frontend work (what must be built / changed)

### 6.1 Foundation
- [ ] Install: `@reduxjs/toolkit react-redux @tanstack/react-query axios react-hook-form zod @hookform/resolvers prettier` ; remove `eslint`, `eslint-config-next`, `eslint.config.mjs`, `lint` script; add `.prettierrc`.
- [ ] Providers (`src/providers/`): Redux, QueryClient, Sonner Toaster, auth hydrator.
- [ ] `src/config/{routes,env,api-endpoints}.ts`, `src/lib/api/{client,errors}.ts`, `src/lib/device.ts`, `.env.example` (`NEXT_PUBLIC_API_URL`).
- [ ] `src/proxy.ts` route guard.

### 6.2 Feature modules (guide layout)
```
src/features/
  auth/        api/ hooks/ schemas/ store/ components/ types/
  company/     (profile get/complete/update, forms, picture + licence upload)
  consultants/ (list query w/ infinite pages, filters state→query-params, detail, document viewer)
  favorites/   (wishlist query + toggle mutation)
  companies/   (directory list)
src/components/ui/ (shadcn, unchanged)  src/components/layout/ (app-header, shell)
```
Existing components to **keep & rewire**: `app-header`, `consultant-browser`, `filter-bar`, `consultant-sheet`, `consultant-detail`, `favorite-button`, `availability`, `company-form`, `auth-fields`. To **delete**: `lib/data.ts` mock + `lib/store.ts` (localStorage) once rewired.

### 6.3 Screens — change list
| Screen | Change |
|---|---|
| Login / Signup / Forgot | Wire to API (RHF+Zod). Signup = fullName, email, password, confirm. Forgot = 3-step with OTP input + 120 s resend timer. Add "email already exists" async check. |
| Setup | Add **proof document (Licence) upload**, profile picture upload, company size enum, industry select ("Oil Field"), country/state/city, website URL (≤250), description (≤1000). |
| Company | Edit form hits `update-profile` multipart; picture remove; **Licence read-only link**; show `status` badge; add **Change password** and **Delete account** dialogs in account menu. |
| Consultants list | Real data, server-side filters, "Load more"/infinite page, skeleton states, empty state, client-side name search, companies-count chip → `/companies`. |
| Filters | Rebuild groups to real backend dimensions (§7): Experience, Age range, Education, Certifications (10), Resume specialty (4), Industry, Availability date, Location (country/state/city), preferred state/city. Remove mock-only groups: **Skills**, free-text "Expertise" values not in backend. |
| Details sheet + full page | New data mapping (§4). **Profile tab:** contact, experience, preferred job type, availability, open-to-travel, DOB, preferred location. **Resume tab:** documents grouped by Completion / Engineering / Work Over / Drilling + Certificates + Degrees, each with *View* (PDF in iframe/new tab) and *Download*; fire `track-employee-event` (`view-resume` on open, `resume-downloaded` on download). Remove the typeset "paper" resume and work-history timeline (no data). |
| Favorites | Real list from `get-wishlist`; empty-state on `success:false`. Note 10-item cap (backend). |
| Companies *(new)* | Simple searchable grid of `{ companyName, profilePicture }`. |
| Subscription gate *(new)* | Static page explaining subscription is managed in the mobile app (Q2). |

---

## 7. Filter contract (query params for `GET /contractor/get-employees-by-contractor`)

| UI filter | Query param | Backend behaviour | Mobile sends | Issue |
|---|---|---|---|---|
| Experience | `experience` = `"1"`…`"5"` or `"6+"` | `"N+"` → `>= N`; plain number → **exact match** | same | OK (exact for 1–5 may be unexpected) |
| Age | `age` = `"25-30"` | converts to DOB range via `signUpRecord.dob` | `"25–30"` (en-dash) | ⚠ Mobile's en-dash does **not** match `includes("-")` → age filter silently ignored. Web will send ASCII `-`; `60+` unsupported. |
| Education | `highSchool\|associate\|bachelor\|master` = `true` | has non-empty `degrees.<level>` | `"$education": true` | OK |
| Certifications | **`H2S`, `WellControl`, `CPR_AED`, `ConfinedSpaceCertified`, `Bop`, `DrillingWellControl`, `RodHandling`, `RescueTraining`, `FitTest`, `Excavation`** = `true` | has non-empty `certificates.<key>` | `h2sCertified`, `wellControlCertified`, … | ⚠ **Mismatch** — mobile keys are never read by the backend, so cert filtering likely does nothing on mobile. Web uses the backend keys. |
| Resume specialty | `completionResumes\|engineeringResumes\|workOverCompletionResumes\|drillingResumes` = `true` | array non-empty | same | OK |
| Industry | `industryFocus` | matches `industry` | same | OK |
| Availability | `availability` | **exact Date equality** on `availability` | a picked date | ⚠ Effectively "available on exactly this date"; a `$lte` would be more useful (backend change). |
| Preferred state / city | `prefferedStateToWork`, `prefferedCityToWork` | exact | mobile maps its State/City pickers to these | OK |
| Country / state / city | `country`, `state`, `city` | matched on User doc which has **no such fields** | `country` only | ⚠ `country` returns zero rows if sent. Web will **not** send `country/state/city`, only the `preffered*` pair. |
| Name search | – | none | client-side | — |

---

## 8. Backend issues found (for the backend dev; none block the web build)

1. **No get-employee-by-id endpoint** (needed for deep links / refresh on `/consultants/[id]`).
2. Cert filter keys differ from mobile's (above) — mobile bug or backend bug, fix one side.
3. `age` en-dash handling, `availability` exact match, `country/state/city` fields missing on `UserModel`.
4. Age filter uses `populate({match})`, which yields rows with `signUpRecord:null` instead of filtering them out → pages can contain empty rows and `pagination.totalItems` ignores the age/role match. Web will drop null-`signUpRecord` rows.
5. `get-wishlist` hard-capped to 10, no pagination, raw documents, and `success:false` when empty.
6. `get-all-companies` ignores `page/limit`.
7. `complete-profile` reads `webUrl` as a string but the model stores `[String]`; update-profile sends an array. Web will send repeated `webUrl` fields in both.
8. Subscription is not enforced server-side on `/contractor/*`.
9. `DeviceMiddleware` is not mounted (only in unused `routes/index.js`).
10. Dev behaviour: OTP is a fixed `123456` when SendGrid is disabled — don't hardcode in the web.

---

## 9. Delivery plan

1. **Foundation** — deps, Prettier, providers, Axios client, env, proxy/route config. *(~0.5 d)*
2. **Auth** — signup/login/forgot/change/delete/logout, session hydration, guard. *(~1 d)*
3. **Company** — setup + profile edit + uploads + status badge + subscription gate. *(~1 d)*
4. **Consultants** — list, filters→query, pagination, detail sheet/page, document viewer, event tracking. *(~2 d)*
5. **Favorites + Companies directory.** *(~0.5 d)*
6. **Hardening** — error/empty/loading states, 401 handling, responsive pass, remove mocks, build + typecheck, manual test against the real API. *(~1 d)*

Each step is shippable on its own and verified against the live backend before moving on.
