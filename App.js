/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import SplashScreen from 'react-native-splash-screen'
import React, {useEffect} from 'react';
import {persistor, store} from './store/store';
import {connect, Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import DrawerNavigator from './navigator/DrawerNavigator';
import {StatusBar, SafeAreaView} from 'react-native';
import styled from 'styled-components';

const mapStateToProps = state => ({
  token: state.cachedReducer.token,
  deviceHeight: state.nonCachedReducer.deviceHeight,
});

const ApiWrapper = props => {
  const {
    children,
    token,
  } = props;
  const headers = {};
  if (token) {
    headers.authorization = 'Bearer ' + token;
  }
  const client = new ApolloClient({
    // uri: 'https://intra.modolit.com/api',
    uri: 'http://10.0.2.2:3001/api',
    headers: headers,
  });

  return (
    <ApolloProvider client={client}>
      <StatusBar backgroundColor="#651FFF" />
      <SafeAreaView style={{flex: 1}}>
        <Container>{children}</Container>
      </SafeAreaView>
    </ApolloProvider>
  );
};

const Container = styled.View`
  flex: 1;
`;

const ApiWrapperWithState = connect(
  mapStateToProps,
  null,
)(ApiWrapper);

const App: () => React$Node = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
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
