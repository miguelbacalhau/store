import { useMemo, useState } from 'react';

import { createMutation, CreateMutationConfig } from '../core/createMutation';
import { useStore } from './useStore';

export function createMutationHook<TData, TId, TArgs>(
  config: CreateMutationConfig<TData, TId, TArgs>,
) {
  function useMutation() {
    const { store } = useStore();
    const [isLoading, setIsloading] = useState(false);

    const mutationMemo = useMemo(() => createMutation(store, config), [store]);

    async function mutation(args: TArgs) {
      setIsloading(true);

      await mutationMemo(args);

      setIsloading(false);
    }

    return { isLoading, mutation };
  }

  return useMutation;
}
