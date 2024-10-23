import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getMessagesForLocale } from './i18n/lib';
import { config } from './config';

export default getRequestConfig(async ({ locale }) => {
  if (!Object.keys(config.i18n.locales).includes(locale)) {
    notFound();
  }

  return {
    messages: await getMessagesForLocale(locale)
  };
});
