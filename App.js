/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import SplashScreen from 'react-native-splash-screen';
import React, {useEffect} from 'react';
import {persistor, store} from './store/store';
import {connect, Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import {find} from 'lodash';
import {StatusBar, SafeAreaView} from 'react-native';
import styled from 'styled-components';
import gql from 'graphql-tag';
import {
  introspectionQuery as rawIntrospectionQuery,
  buildClientSchema,
} from 'graphql/utilities';
import DrawerNavigator from './navigator/DrawerNavigator';
import {setUserRoles} from './store/actions';

const mapStateToProps = state => ({
  token: state.cachedReducer.token,
});

const mapDispatchToProps = dispatch => ({
  setUserRoles: userRoles => dispatch(setUserRoles(userRoles)),
});

const ApiWrapper = props => {
  const {children, token, setUserRoles} = props;
  const headers = {};
  if (token) {
    headers.authorization = 'Bearer ' + token;
  }
  const introspectionQuery = gql(rawIntrospectionQuery);
  const client = new ApolloClient({
    // uri: 'https://intra.modolit.com/api',
    // uri: 'http://localhost:3001/api',
    uri: 'http://10.0.2.2:3001/api',
    headers: headers,
  });
  client.query({query: introspectionQuery}).then(({data}) => {
    const userRoles = find(data.__schema.types, function(o) {
      return o.name === 'UserRoles';
    }).enumValues;
    const results = [];
    for (const role of userRoles) {
      results.push({label: role.name, value: role.name});
    }
    setUserRoles(results);
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
  mapDispatchToProps,
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
