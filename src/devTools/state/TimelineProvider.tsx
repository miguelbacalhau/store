import { createContext, ReactNode, useMemo, useState } from 'react';

import { useStore } from '../../react/useStore';
import { createStoreTimeline } from './createStoreTimeline';

type TimelineProviderProps = { children: ReactNode };

export const TimelineContext = createContext<
  ReturnType<typeof createStoreTimeline>
>({
  storeTimeline: new Set(),
  timeTravel: () => {},
});

export function TimelineProvider({ children }: TimelineProviderProps) {
  const { store, listeners } = useStore();
  const [isReady, setIsReady] = useState(false);

  const storeTimeline = useMemo(
    () => createStoreTimeline(store, listeners, () => setIsReady(true)),
    [store, listeners],
  );

  if (!isReady) {
    return null;
  }

  return (
    <TimelineContext.Provider value={storeTimeline}>
      {children}
    </TimelineContext.Provider>
  );
}
