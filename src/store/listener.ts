export function createListener() {
  const listenerMap: Record<string, (() => void)[]> = {};

  function addListener(key: string, listener: () => void) {
    if (listenerMap[key]) {
      listenerMap[key].push(listener);
    } else {
      listenerMap[key] = [listener];
    }
  }

  function removeListener(key: string, listener: () => void) {
    listenerMap[key] = listenerMap[key]?.filter((l) => l !== listener);
  }

  function triggerListener(key: string) {
    listenerMap[key]?.forEach((listener) => listener());
  }

  return { addListener, removeListener, triggerListener };
}
