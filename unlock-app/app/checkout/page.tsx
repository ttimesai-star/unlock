import React from 'react'
import { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { CheckoutPage as CheckoutPageComponent } from '~/components/interface/checkout'
import { getLegacyCheckoutRedirect } from '~/utils/checkoutPath'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

// Checkouts that use a saved config (`?id=`) are served from `/checkout/<id>`
// (see `[id]/page.tsx`, which also generates their metadata). What remains
// here are checkouts without a saved config id, such as `?paywallConfig=`.
export const metadata: Metadata = {
  title: 'Checkout | Unlock Protocol',
}

const CheckoutPage: React.FC<Props> = ({ searchParams }) => {
  // Permanently redirect the legacy `/checkout?id=<id>` URL to
  // `/checkout/<id>`, keeping all other query parameters.
  const redirectTo = getLegacyCheckoutRedirect(searchParams)
  if (redirectTo) {
    permanentRedirect(redirectTo)
  }

  return <CheckoutPageComponent />
}

export default CheckoutPage
