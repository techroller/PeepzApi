import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose
} from 'redux';
import {createEpicMiddleware} from 'redux-observable';
import {reducer as toastr} from 'react-redux-toastr';

import users, {userEpics} from './users';

const rootReducer = combineReducers({
  users,
  toastr
});

const epicMiddleware = createEpicMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore() {
  const store = createStore(rootReducer, composeEnhancers(applyMiddleware(epicMiddleware)));
  epicMiddleware.run(userEpics);
  return store;
}

export default configureStore();


