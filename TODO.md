# Technical TODOs

Small improvements and patterns discovered during development.
Not features — those go in CLAUDE.md's version roadmap.

---

## Later

- [ ] Add axios **response interceptor** to catch 401 errors and redirect to login (in `client/src/lib/api.ts`)
- [ ] Add Express **auth middleware** that reads `Authorization: Bearer <token>` header and verifies JWT for protected routes
- [ ] Replace raw `axios` import in `__root.tsx` with the `api` instance from `lib/api.ts`
- [ ] Remove unused `res.cookie("guest", ...)` line from `auth.route.ts` — not using cookie-based auth
- [ ] Create `VITE_API_URL` and `VITE_WS_URL` in `client/.env` and use them everywhere
- [ ] Add loading/disabled state on "Play Game" button while guest auth request is in flight

## Done

_(move items here when completed)_
