/**
 * Helpers for the path-based checkout URL: `/checkout/<id>`.
 *
 * The legacy form `/checkout?id=<id>` keeps working: it is permanently
 * redirected to the path-based form (see `app/checkout/page.tsx`). Checkouts
 * that do not use a saved config id (for example `?paywallConfig={...}`) are
 * never redirected.
 *
 * This module is pure (no imports) so it can be used from server components,
 * client components and tests alike.
 */

// Saved checkout config ids are opaque strings. Only ids made of URL-safe
// characters are redirected, anything else is served as before.
const CHECKOUT_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/

type SearchParamsRecord = Record<string, string | string[] | undefined>

export const isCheckoutId = (id?: string | null): id is string =>
  typeof id === 'string' && CHECKOUT_ID_PATTERN.test(id)

export const getCheckoutPath = (id: string) =>
  `/checkout/${encodeURIComponent(id)}`

/**
 * Returns the path (plus remaining query string) the legacy URL should be
 * redirected to, or `null` when the request is not a legacy `?id=` URL.
 * Every query parameter other than `id` is preserved, in order.
 */
export const getLegacyCheckoutRedirect = (
  searchParams: SearchParamsRecord = {}
): string | null => {
  const rawId = searchParams.id
  const id = (Array.isArray(rawId) ? rawId[0] : rawId)?.trim()

  if (!isCheckoutId(id)) {
    return null
  }

  const rest = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === 'id' || value === undefined) {
      continue
    }
    for (const item of Array.isArray(value) ? value : [value]) {
      rest.append(key, item)
    }
  }

  const query = rest.toString()
  return `${getCheckoutPath(id)}${query ? `?${query}` : ''}`
}
