import { defaultEntryExternals } from '../../src/factories/store';

export const forceChangeFixture = () => {};

export const initialEntryExternalFixture = defaultEntryExternals;
export const initialEntryInternalFixture = {
  forceChange: forceChangeFixture,
};

export const initialEntryFixture = {
  externals: initialEntryExternalFixture,
  internals: initialEntryInternalFixture,
};
