import { defaultEntryExternals } from '../../src/factories/store';

export const forceChange = () => {};
export const referencedBy = new Set();

export const initialEntryExternalFixture = defaultEntryExternals;
export const initialEntryInternalFixture = {
  forceChange,
  referencedBy,
};

export const initialEntryFixture = {
  externals: initialEntryExternalFixture,
  internals: initialEntryInternalFixture,
};
