import { createListeners } from '../factories/listeners';

export const { addListener, removeListener, triggerListeners } =
  createListeners();
