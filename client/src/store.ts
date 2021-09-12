import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';
import rootReducer from './slices';

export const storeOptions: ConfigureStoreOptions = {
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
};

const store = configureStore(storeOptions);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
