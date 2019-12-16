import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
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
  const {token, setToken} = props;

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

MainScreen.proptypes = {
  token: PropTypes.string,
  setToken: PropTypes.func,
};

MainScreen.defaultProps = {
  token: '',
  setToken: () => {},
};

const Container = styled.View``;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainScreen);
