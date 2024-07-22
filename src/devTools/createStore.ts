import { getEntryExternals } from '../store/globalStore';
import { addListener, removeListener } from '../store/listener';

export function createStore(key: string) {
  function subscribe(listener: () => void) {
    addListener(key, listener);

    return () => removeListener(key, listener);
  }

  function getSnapshot() {
    return getEntryExternals(key);
  }

  return { subscribe, getSnapshot };
}
