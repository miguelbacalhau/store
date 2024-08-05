import { defaultEntryExternals } from '../../src/factories/store';

export const forceChange = () => {};

export const initialEntryExternalFixture = defaultEntryExternals;
export const initialEntryInternalFixture = {
  forceChange,
  referencedBy: new Set(),
};

export const initialEntryFixture = {
  externals: initialEntryExternalFixture,
  internals: initialEntryInternalFixture,
};
