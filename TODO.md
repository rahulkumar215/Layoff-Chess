# Technical TODOs

Small improvements and patterns discovered during development.
Not features — those go in CLAUDE.md's version roadmap.

---

## Later

- [ ] **Implement two-token refresh system** — access token (short-lived, 1h) + refresh token (HttpOnly cookie, 7d). Fix `/auth/refresh` endpoint to read refresh cookie, issue new access token. Add axios response interceptor for 401 retry. Handle WebSocket reconnection with fresh token. Refresh on app load.
- [ ] Add Express **auth middleware** that reads `Authorization: Bearer <token>` header and verifies JWT for protected routes
- [ ] Add axios **response interceptor** to catch 401 errors, call refresh, retry request (depends on refresh system)
- [ ] Handle WebSocket token expiry in `useSocket.ts` — detect close code 1008, refresh token, reconnect
- [ ] Add loading/disabled state on "Play Game" button while guest auth request is in flight
- [ ] Remove unused `res.cookie("guest", ...)` line from `auth.route.ts` — will be replaced by refresh token cookie

## Done

- [x] Replace raw `axios` import in `__root.tsx` with the `api` instance from `lib/api.ts`
- [x] Create `VITE_API_URL` and `VITE_WS_URL` in `client/.env` and use them everywhere
