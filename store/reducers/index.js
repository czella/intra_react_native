// Imports: Dependencies
import {combineReducers} from 'redux';

// Imports: Reducers
import cachedReducer from './cachedReducers';
import nonCachedReducer from './nonCachedReducers';

// Redux: Root Reducer
const rootReducer = combineReducers({
  cachedReducer: cachedReducer,
  nonCachedReducer: nonCachedReducer,
});

// Exports
export default rootReducer;
