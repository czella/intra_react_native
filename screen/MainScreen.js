import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import {setToken} from '../store/actions';
import Home from '../component/Home';
import Login from '../component/Login';

const mapStateToProps = state => ({
  token: state.cachedReducer.token,
});

const mapDispatchToProps = dispatch => ({
  setToken: token => dispatch(setToken(token)),
});

const MainScreen = props => {
  const {setToken, token} = props;

  const handleLogout = () => {
    setToken(null);
  };
  return (
    <Container>
      {token && (
        <Container>
          <Home />
          <TouchableOpacity onPress={handleLogout}>
            <Button>Logout</Button>
          </TouchableOpacity>
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

const Button = styled.Text`
  padding-top: 15px;
  margin: 10px;
  height: 50px;
  width: 150px;
  color: white;
  border-radius: 5px;
  background-color: blue;
  text-align: center;
`;
