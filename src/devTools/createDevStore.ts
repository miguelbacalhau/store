import { Listeners } from '../factories/listeners';
import { Store } from '../factories/store';

export function createDevStore(store: Store, listeners: Listeners) {
  let storeCache = { ...store };

  function subscribe(listener: () => void) {
    function listenerWithUpdate() {
      // reset cache the dev store should always trigger a re-render
      // whenever a change is triggered
      storeCache = { ...store };
      listener();
    }

    const listenedKeys = listeners.getListenedKeys();
    const debouncedListener = debounce(listenerWithUpdate, 250);

    listenedKeys.forEach((key) =>
      listeners.addListener(key, debouncedListener),
    );

    return () => {
      listenedKeys.forEach((key) =>
        listeners.removeListener(key, debouncedListener),
      );
    };
  }

  function getSnapshot() {
    return storeCache;
  }

  return { subscribe, getSnapshot };
}

function debounce<TData, TArgs extends Array<TData>>(
  callback: (...args: TArgs) => void,
  wait: number,
) {
  let timeoutId: Parameters<typeof clearTimeout>[0];

  return (...args: TArgs) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}
