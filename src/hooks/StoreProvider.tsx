import { createContext, ReactNode } from 'react';

import { createListeners, Listeners } from '../factories/listeners';
import { createStore } from '../factories/store';

export const StoreContext = createContext({
  store: createStore(),
  listeners: createListeners(),
});

export function StoreProvider({
  store,
  listeners,
  children,
}: {
  store: ReturnType<typeof createStore>;
  listeners: Listeners;
  children: ReactNode;
}) {
  return (
    <StoreContext.Provider value={{ store, listeners }}>
      {children}
    </StoreContext.Provider>
  );
}
