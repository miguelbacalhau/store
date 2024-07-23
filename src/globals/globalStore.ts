import { createStore } from '../factories/store';

export const {
  store: globalStore,
  initEntry,
  getEntryExternals,
  getEntryInternals,
  setEntryExternals,
  setEntryFetched,
} = createStore();
