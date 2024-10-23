import { useCallback, useEffect } from 'react';
import { useRouter as useBaseRouter, usePathname } from '../modules/i18n';
import NProgress from 'nprogress';

export const useRouter = () => {
  const router = useBaseRouter();
  const pathname = usePathname();
  useEffect(() => {
    NProgress.done();
  }, [pathname]);
  const replace = useCallback(
    (href, options) => {
      href !== pathname && NProgress.start();
      router.replace(href, options);
    },
    [router, pathname]
  );

  const push = useCallback(
    (href, options) => {
      href !== pathname && NProgress.start();
      router.push(href, options);
    },
    [router, pathname]
  );

  return {
    ...router,
    replace,
    push
  };
};
