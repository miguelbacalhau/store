import { ReactNode } from 'react';

import { DevTools } from './DevTools';
import { RouterProvider } from './router/RouterProvider';
import { TimelineProvider } from './state/TimelineProvider';
import { UiProvider } from './ui/UiProvider';

type DevToolsProviderProps = {
  children: ReactNode;
};

export function DevToolsProvider({ children }: DevToolsProviderProps) {
  return (
    <>
      <TimelineProvider>
        {children}
        <RouterProvider>
          <UiProvider>
            <DevTools />
          </UiProvider>
        </RouterProvider>
      </TimelineProvider>
    </>
  );
}
