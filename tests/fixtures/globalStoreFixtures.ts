export const forceChangeFixture = () => {};

export const initialEntryExternalFixture = { data: null, isLoading: false };
export const initialEntryInternalFixture = {
  forceChange: forceChangeFixture,
  fetched: false,
};

export const initialEntryFixture = {
  externals: initialEntryExternalFixture,
  internals: initialEntryInternalFixture,
};
