// app/clerk-config.js
import { ClerkProvider, RedirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider
      frontChannelLogoutUri={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}
      apiKey={process.env.NEXT_PUBLIC_CLERK_API_KEY}
    >
      <Component {...pageProps} />
    </ClerkProvider>
  );
}
