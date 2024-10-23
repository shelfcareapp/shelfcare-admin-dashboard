'use client';

import { Provider } from 'react-redux';
import { store } from 'store/store';

export function StoreProviders({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

export default StoreProviders;
