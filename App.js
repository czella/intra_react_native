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
import {Dimensions} from 'react-native';
import styled from 'styled-components';

const mapStateToProps = state => ({
  token: state.cachedReducer.token,
});

const ApiWrapper = props => {
  const {children, token} = props;
  const headers = {};
  if (token) {
    headers.authorization = 'Bearer ' + token;
  }
  const onLayout = () =>  {
    const {width, height} = Dimensions.get('window');
    console.log(width, height, '-------------------------------------------------------------');
  };
  const client = new ApolloClient({
    uri: 'https://intra.modolit.com/api',
    headers: headers,
  });
  return (
    <ApolloProvider client={client}>
      <Container style={{height: 300}} onLayout={onLayout}>{children}</Container>
    </ApolloProvider>
  );
};

const Container = styled.View``;

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
