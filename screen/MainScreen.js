import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setToken} from '../store/actions';
import Login from '../component/Login';
import MenuBar from '../component/MenuBar';
import WorkSessionChart from '../component/WorkSessionChart';

const mapStateToProps = state => ({
  token: state.cachedReducer.token,
});

const mapDispatchToProps = dispatch => ({
  setToken: token => dispatch(setToken(token)),
});

const MainScreen = props => {
  const {token, setToken, navigation} = props;
  return (
    <Container>
      {token && (
        <Container>
          <MenuBar navigation={navigation} title="Dashboard" />
          <WorkSessionChart />
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
  token: '',
  setToken: () => {},
  navigation: {},
};

const Container = styled.View``;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainScreen);
