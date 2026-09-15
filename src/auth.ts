// src/auth.ts
//
// Single source of truth for the logged-in user's Cognito ID token.
//
// The parent Glixify app stores the ID token in localStorage after the user
// logs in. Because the chatbot is embedded on the same origin, it can read the
// exact same value. We read it fresh on every request (not once at import time)
// so that when Glixify refreshes the token, the chatbot automatically uses the
// new one — no manual re-pasting, no expiry surprises.
//
// The backend (auth/auth.py) specifically requires the *ID* token
// (token_use = "id", with custom:id and custom:roleId claims). The access token
// stored alongside it will NOT work.

/** localStorage key the Glixify app writes the Cognito ID token under. */
export const ID_TOKEN_STORAGE_KEY = "revival.user.idToken";

/**
 * Returns the current logged-in user's Cognito ID token, or null if there
 * isn't one (e.g. the app is opened outside a logged-in Glixify session).
 *
 * Dev-only fallback: when running the chatbot standalone (`npm run dev`) there
 * is no Glixify session, so localStorage is empty. In that case only, we fall
 * back to VITE_DEV_ID_TOKEN from a gitignored .env.local file. This never runs
 * in production and keeps tokens out of source control.
 */
export function getAuthToken(): string | null {
  const stored = localStorage.getItem(ID_TOKEN_STORAGE_KEY);
  if (stored) return stored;

  if (import.meta.env.DEV) {
    const devToken = import.meta.env.VITE_DEV_ID_TOKEN;
    if (devToken) return devToken;
  }

  return null;
}