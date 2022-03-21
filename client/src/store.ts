import { configureStore } from '@reduxjs/toolkit';
// This works, not sure why it's complaining
// eslint-disable-next-line import/no-unresolved
import { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/dist/getDefaultMiddleware';
import rootReducer from './slices';

export const configureStoreOptions = {
  reducer: rootReducer,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  middleware: (getDefaultMiddleware: CurriedGetDefaultMiddleware<ReturnType<typeof rootReducer>>) =>
    getDefaultMiddleware({ serializableCheck: false }),
};

const store = configureStore(configureStoreOptions);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
