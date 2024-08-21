import { Listeners } from '../../factories/listeners';
import { Store, StoreEntry } from '../../factories/store';

type TimelineEntry = {
  key: string;
  externals: StoreEntry['externals'];
};

export function createStoreTimeline(
  store: Store,
  listeners: Listeners,
  onReady: () => void,
) {
  const transactions: Record<string, TimelineEntry[]> = {};
  const storeTimeline: Set<number> = new Set();

  // initializes the setEntryExternals and call onReady to guarantee
  // that when before anything is loaded and update to the DevTools
  // store don't happen before it's initialized
  new Promise(() => {
    // we are wrapping the store setEntryExternals to be able
    // to keep track of the updates done to the store
    // so we can replicate them when time-traveling
    Object.defineProperty(store, 'setEntryExternals', {
      get() {
        function wrappedSetExternals(
          transactionId: number,
          key: string,
          externals: Partial<StoreEntry['externals']>,
        ) {
          const currentExternals = store.store[key].externals;
          const updatedExternals = { ...currentExternals, ...externals };
          const entry = { key, externals: updatedExternals };

          transactions[transactionId]
            ? transactions[transactionId].push(entry)
            : (transactions[transactionId] = [entry]);

          store.store[key].externals = updatedExternals;
          storeTimeline.add(transactionId);
        }

        return wrappedSetExternals;
      },
    });

    onReady();
  });

  function timeTravel(time: number) {
    Array.from(storeTimeline).forEach((transactionId, index) => {
      if (index > time) {
        return;
      }

      transactions[transactionId].forEach(({ key, externals }) => {
        store.store[key].externals = externals;

        const timeTravelTransactionId = Date.now();

        listeners.triggerListeners(timeTravelTransactionId, key, [
          'data',
          'isLoading',
          'isFetching',
        ]);

        Array.from(store.store[key].internals.referencedBy).forEach(
          ({ referenceKey }) =>
            listeners.triggerListeners(timeTravelTransactionId, referenceKey, [
              'data',
              'isLoading',
              'isFetching',
            ]),
        );
      });
    });
  }

  return { storeTimeline, timeTravel };
}
