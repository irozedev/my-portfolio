import { supabase } from './client';
import { projectId, publicAnonKey } from './info';

/** Base URL of the edge function that backs comments, reactions and contact. */
export const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a62f57c7`;

/**
 * Headers for a call to the edge function.
 *
 * `Authorization` does double duty here: it is both the Supabase gateway
 * credential and how a handler identifies the user (handlers read it back with
 * `supabaseAdmin.auth.getUser(token)`). A valid user JWT satisfies both roles;
 * with no session we fall back to the anon key, which is correct because every
 * GET route treats "no user" as an anonymous read.
 *
 * The bug this replaced: `project-reactions.tsx` read the token from React
 * state in AuthContext — a snapshot taken whenever the session was last read.
 * A Supabase access token is valid for about an hour, so any tab left open past
 * expiry sent a stale JWT and the gateway answered 401 to every reactions
 * request. The reaction bar was dead while comments, which always sent the anon
 * key, kept working. The edge-function logs showed exactly that pairing: 401 on
 * `/reactions` next to 200 on `/comments` in the same page load. Reading from
 * `getSession()` fixes it because that call transparently refreshes an expired
 * session, so what we send is always current.
 *
 * Deliberately NO `apikey` header. Sending one is the more orthodox way to
 * present the gateway credential, but it pushes the request into a CORS
 * preflight, and the edge function's `allowHeaders` did not list `apikey` —
 * every call then failed at the preflight with an opaque
 * "TypeError: Failed to fetch" rather than an HTTP status. `allowHeaders` has
 * since been widened in `supabase/functions/server/index.tsx`, but that only
 * takes effect once the function is redeployed, and nothing here needs it.
 */
export async function edgeHeaders(): Promise<Record<string, string>> {
  const token = await currentAccessToken();
  return {
    'Content-Type': 'application/json',
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
