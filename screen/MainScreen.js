import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {setToken} from '../store/actions';
import Home from '../component/Home';
import Login from '../component/Login';
import MenuBar from '../component/MenuBar';

const mapStateToProps = state => ({
  token: state.cachedReducer.token,
});

const mapDispatchToProps = dispatch => ({
  setToken: token => dispatch(setToken(token)),
});

const MainScreen = props => {
  const {token} = props;

  return (
    <Container>
      {token && (
        <Container>
          <MenuBar navigation={props.navigation} title="Dashboard" />
          <Home />
        </Container>
      )}
      {!token && <Login setToken={setToken} />}
    </Container>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainScreen);

const Container = styled.View``;
