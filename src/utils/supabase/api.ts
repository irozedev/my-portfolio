import { supabase } from './client';
import { projectId, publicAnonKey } from './info';

/** Base URL of the edge function that backs comments, reactions and contact. */
export const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a62f57c7`;

/**
 * Headers for a call to the edge function.
 *
 * There are TWO distinct credentials here, and conflating them is what broke
 * project reactions:
 *
 *   `apikey`        — the GATEWAY credential. Always the publishable (anon) key.
 *                     Supabase validates it and rejects the request before our
 *                     handler ever runs.
 *   `Authorization` — identifies the USER. Handlers read it back out with
 *                     `supabaseAdmin.auth.getUser(token)`.
 *
 * `project-reactions.tsx` used to put the user's session JWT straight into
 * `Authorization` with no `apikey` at all. A Supabase access token is valid for
 * roughly an hour, and the value it used came from React state in AuthContext —
 * a snapshot taken whenever the session was last read. Leave a tab open past
 * expiry and the gateway answered 401 to every reactions request, so the
 * reaction bar was dead while comments (which always sent the anon key) kept
 * working. The edge-function logs show exactly that: 401 on
 * `/reactions` paired with 200 on `/comments` in the same page load.
 *
 * The token here comes from `getSession()` rather than cached state because
 * that call transparently refreshes an expired session, so what we send is
 * always current. With no session at all we fall back to the anon key, which
 * is correct: every GET route treats "no user" as an anonymous read.
 */
export async function edgeHeaders(): Promise<Record<string, string>> {
  const token = await currentAccessToken();
  return {
    'Content-Type': 'application/json',
    apikey: publicAnonKey,
    Authorization: `Bearer ${token ?? publicAnonKey}`,
  };
}

/**
 * The current access token, refreshed if it had expired.
 *
 * Use this instead of `accessToken` from `useAuth()` for anything that hits the
 * server. The context value is fine for rendering ("is someone signed in") but
 * goes stale, and a stale token is indistinguishable from a forged one at the
 * gateway.
 */
export async function currentAccessToken(): Promise<string | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Could not read the Supabase session:', error);
    return null;
  }
  return data.session?.access_token ?? null;
}
