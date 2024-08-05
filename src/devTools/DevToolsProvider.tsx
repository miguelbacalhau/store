import { DevTools } from './DevTools';
import { RouterProvider } from './router/RouterProvider';
import { UiProvider } from './ui/UiProvider';

export function DevToolsProvider() {
  return (
    <RouterProvider>
      <UiProvider>
        <DevTools />
      </UiProvider>
    </RouterProvider>
  );
}
