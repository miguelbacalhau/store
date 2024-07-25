import { createContext, ReactNode } from 'react';

import { createListeners, Listeners } from '../factories/listeners';
import { createStore } from '../factories/store';

const store = createStore();
const listeners = createListeners();

export const StoreContext = createContext({
  store,
  listeners,
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
