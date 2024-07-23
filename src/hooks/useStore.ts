import { useContext } from 'react';

import { StoreContext } from './StoreProvider';

export function useStore() {
  return useContext(StoreContext);
}
