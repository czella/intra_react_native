/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import MainScreen from './screen/MainScreen';
import {persistor, store} from './store/store';
import {connect, Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import DrawerNavigator from './navigator/DrawerNavigator';

const mapStateToProps = state => ({
  token: state.cachedReducer.token,
});

const ApiWrapper = props => {
  const {children, token} = props;
  const headers = {};
  if (token) {
    headers.authorization = 'Bearer ' + token;
  }
  const client = new ApolloClient({
    uri: `https://intra.modolit.com/api`,
    headers: headers,
  });
  console.log(client, 'pine--');
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

const ApiWrapperWithState = connect(
  mapStateToProps,
  null,
)(ApiWrapper);

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApiWrapperWithState>
          <DrawerNavigator />
        </ApiWrapperWithState>
      </PersistGate>
    </Provider>
  );
};

export default App;
