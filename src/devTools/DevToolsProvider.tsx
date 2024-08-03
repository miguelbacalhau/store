import { DevTools } from './DevTools';
import { UiProvider } from './ui/UiProvider';

export function DevToolsProvider() {
  return (
    <UiProvider>
      <DevTools />
    </UiProvider>
  );
}
