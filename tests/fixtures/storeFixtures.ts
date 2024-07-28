import { defaultEntryExternals } from '../../src/factories/store';

export const forceChange = () => {};

export const initialEntryExternalFixture = defaultEntryExternals;
export const initialEntryInternalFixture = {
  forceChange,
  inList: [],
};

export const initialEntryFixture = {
  externals: initialEntryExternalFixture,
  internals: initialEntryInternalFixture,
};
