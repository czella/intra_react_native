import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setToken} from '../store/actions';
import Login from '../component/Login';
import MenuBar from '../component/MenuBar';
import WorkSessionChart from '../component/WorkSessionChart';
import {useRole, ADMIN_ROLE} from '../hooks/useRole';
import WorkSessionsAggregated from '../component/WorkSessionsAggregated';
import {SafeAreaView, ScrollView} from 'react-native';

const mapStateToProps = state => ({
  token: state.cachedReducer.token,
});

const mapDispatchToProps = dispatch => ({
  setToken: token => dispatch(setToken(token)),
});

const MainScreen = props => {
  const {token, setToken, navigation} = props;
  const role = useRole();

  return (
    <Container>
      {token && (
        <Container>
          <MenuBar navigation={navigation} title="Dashboard" />
          <SafeAreaView
            style={{
              height: '100%',
              zIndex: 1,
            }}>
            <ScrollView style={{height: '100%'}}>
              <WorkSessionChart token={token} />
              {role === ADMIN_ROLE && <WorkSessionsAggregated />}
            </ScrollView>
          </SafeAreaView>
        </Container>
      )}
      {!token && <Login setToken={setToken} />}
    </Container>
  );
};

MainScreen.proptypes = {
  token: PropTypes.string,
  setToken: PropTypes.func,
  navigation: PropTypes.object,
};

MainScreen.defaultProps = {
  token: null,
  setToken: () => {},
  navigation: {},
};

const Container = styled.View`
  height: 100%;
  width: 100%;
  flex-direction: column;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainScreen);
