export const config = {
  i18n: {
    locales: {
      fi: {
        currency: 'EUR',
        label: 'Suomi'
      },
      en: {
        currency: 'EUR',
        label: 'English'
      }
    },
    defaultLocale: 'fi',
    defaultCurrency: 'EUR',
    cookieName: 'NEXT_LOCALE'
  },
  mailing: {
    provider: 'plunk',
    // from: 'maija.tunturi@shelfcare.app'
    from: 'shelfcaretech@gmail.com'
  }
};
