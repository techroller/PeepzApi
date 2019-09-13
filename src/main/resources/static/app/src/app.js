import React from 'react';
import {connect} from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import {AppNav} from './ui/layout/AppNav';
import UserList from './users/components/user-list';

// App container components

export const App = (props) => {
  return (
    <div className="container">
      <AppNav/>
      <div className="container">
        {props.children}
      </div>
    </div>
  );
}

export const AppContainer = connect(null, null)(App);

export default () => (
  <React.Fragment>
    <AppContainer>
      <UserList/>
    </AppContainer>
    <ReduxToastr timeOut={4000}
                 newestOnTop={true}
                 preventDuplicates
                 position="top-right"
                 progressBar={false}
                 transitionIn="fadeIn"
                 transitionOut="fadeOut"
                 closeOnToastrClick={true}/>
  </React.Fragment>
);