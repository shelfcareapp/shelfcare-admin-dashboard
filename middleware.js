import { config as projectConfig } from './config';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: Object.keys(projectConfig.i18n.locales),
  defaultLocale: projectConfig.i18n.defaultLocale,
  localePrefix: 'never'
});

export default async function middleware(req) {
  try {
    return intlMiddleware(req);
  } catch (error) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
