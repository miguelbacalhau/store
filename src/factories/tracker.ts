export function createTracker() {
  const trackedKeys = new Set();
  let proxyCache = {};

  function track<TData extends Record<string, unknown>>(value: TData) {
    Object.keys(value).forEach((key) => {
      Object.defineProperty(proxyCache, key, {
        configurable: true,
        enumerable: true,
        get() {
          trackedKeys.add(key);

          return value[key];
        },
      });
    });

    return proxyCache as TData;
  }

  function reset() {
    proxyCache = {};
  }

  function isTracking(keys: string[]) {
    // when the trackedKeys is empty mean that all keys are being tracked
    return trackedKeys.size === 0 || keys.some((key) => trackedKeys.has(key));
  }

  return { track, reset, isTracking };
}
