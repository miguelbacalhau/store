import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

type RouterProviderProps = { children: ReactNode };

type RouterContextValue = {
  history: string[];
  currentRoute: number;
  setHistory: Dispatch<SetStateAction<string[]>>;
  setCurrentRoute: Dispatch<SetStateAction<number>>;
};

export const RouterContext = createContext<RouterContextValue>({
  history: [],
  currentRoute: 0,
  setHistory: () => {},
  setCurrentRoute: () => {},
});

export function RouterProvider({ children }: RouterProviderProps) {
  const [history, setHistory] = useState<RouterContextValue['history']>([]);
  const [currentRoute, setCurrentRoute] = useState<
    RouterContextValue['currentRoute']
  >(history.length);

  return (
    <RouterContext.Provider
      value={{ history, currentRoute, setHistory, setCurrentRoute }}
    >
      {children}
    </RouterContext.Provider>
  );
}
