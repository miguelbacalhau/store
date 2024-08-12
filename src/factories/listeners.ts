export type Listener = (trackedKeys: string[]) => void;

export function createListeners() {
  const listenerMap: Record<string, Listener[]> = {};

  function addListener(key: string, listener: Listener) {
    if (listenerMap[key]) {
      listenerMap[key].push(listener);
    } else {
      listenerMap[key] = [listener];
    }
  }

  function removeListener(key: string, listener: Listener) {
    listenerMap[key] = listenerMap[key]?.filter((l) => l !== listener);
  }

  function triggerListeners(key: string, trackedKeys: string[]) {
    listenerMap[key]?.forEach((listener) => listener(trackedKeys));
  }

  function getListenedKeys() {
    return Object.keys(listenerMap);
  }

  return { addListener, removeListener, triggerListeners, getListenedKeys };
}

export type Listeners = ReturnType<typeof createListeners>;
