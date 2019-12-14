// Imports: Dependencies
import AsyncStorage from '@react-native-community/async-storage';
import {createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
// Imports: Redux
import rootReducer from './reducers/index';
// Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: ['cachedReducer'],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: ['nonCachedReducer'],
};
// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);
// Redux: Store
const store = createStore(persistedReducer);
// Middleware: Redux Persist Persister
let persistor = persistStore(store);
// Exports
export {store, persistor};
