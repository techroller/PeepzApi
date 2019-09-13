import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import store from './store';
import AppRoot from './app';

ReactDOM.render(
  <Provider store={store}>
    <AppRoot />
  </Provider>, document.getElementById('app-root'));
