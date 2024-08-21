export type Listener = (transactionId: number, trackedKeys: string[]) => void;

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

  function triggerListeners(
    transactionId: number,
    key: string,
    trackedKeys: string[],
  ) {
    listenerMap[key]?.forEach((listener) =>
      listener(transactionId, trackedKeys),
    );
  }

  function getListenedKeys() {
    return Object.keys(listenerMap);
  }

  return { addListener, removeListener, triggerListeners, getListenedKeys };
}

export type Listeners = ReturnType<typeof createListeners>;
