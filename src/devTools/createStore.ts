import { addListener, removeListener } from '../globals/globalListeners';
import { getEntryExternals } from '../globals/globalStore';

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
