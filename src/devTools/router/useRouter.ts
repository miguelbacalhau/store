import { useContext } from 'react';

import { RouterContext } from './RouterProvider';

export function useRouter() {
  const { history, currentRoute, setHistory, setCurrentRoute } =
    useContext(RouterContext);

  function navigate(route: string) {
    setHistory((prev) => [...prev, route]);
    setCurrentRoute(history.length);
  }

  function hasNext() {
    return currentRoute < history.length - 1;
  }

  function hasPrevious() {
    return currentRoute > 0;
  }

  function navigateBack() {
    if (!hasPrevious()) {
      return;
    }

    setCurrentRoute((prev) => prev - 1);
  }

  function navigateForward() {
    if (!hasNext()) {
      return;
    }

    setCurrentRoute((prev) => prev + 1);
  }

  const currentRouteValue = history[currentRoute];

  return {
    navigate,
    currentRoute: currentRouteValue,
    hasPrevious,
    hasNext,
    navigateBack,
    navigateForward,
  };
}
