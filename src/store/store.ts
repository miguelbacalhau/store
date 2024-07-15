type CreateStoreArgs<T> = {
  resolver: () => T;
};

export function createStore<T>({ resolver }: CreateStoreArgs) {
  let state: T = initialState;
  let listeners: (() => void)[] = [];

  function emitChange() {
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  function setState(newState: T) {
    state = { ...newState };

    emitChange();
  }

  function getSnapshot() {
    return state;
  }

  return { subscribe, getSnapshot, setState };
}
