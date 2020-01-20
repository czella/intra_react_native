import React, {useState} from 'react';
import styled from 'styled-components';
import {TouchableOpacity} from 'react-native';
import {graphql} from 'react-apollo';
import PropTypes from 'prop-types';
import {loginUser} from '../queries/queries';

const Login = props => {
  const {login, setToken} = props;
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleLogin = (email, password) => {
    login(email, password).then(({data}) => setToken(data.login));
  };

  return (
    <Container>
      <TextInput
        onChangeText={email => setEmail(email)}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        onChangeText={password => setPassword(password)}
        placeholder="Password"
        secureTextEntry={true}
      />
      <TouchableOpacity onPress={() => handleLogin(email, password)}>
        <Button
          style={{
            elevation: 15,
          }}>
          <ButtonText>Log in</ButtonText>
        </Button>
      </TouchableOpacity>
      <Image source={require('../assets/logo.png')} />
    </Container>
  );
};

Login.proptypes = {
  login: PropTypes.func,
  setToken: PropTypes.func,
};

Login.defaultProps = {
  login: () => {},
  setToken: () => {},
};

const Container = styled.View`
  padding-top: 50px;
  align-items: center;
  background-color: #651fff;
  height: 100%;
`;

const TextInput = styled.TextInput`
  border: 1px solid #dbdfea;
  width: 295px;
  height: 44px;
  border-radius: 10px;
  font-size: 17px;
  color: #3c4560;
  margin-top: 20px;
  padding-left: 44px;
  background-color: white;
`;

const Button = styled.View`
  background: #5263ff;
  width: 295px;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 1px 1px #000000;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 20px;
  text-transform: uppercase;
`;

const Image = styled.Image`
  height: 250px;
  width: 250px;
  resize-mode: contain;
`;

export default graphql(loginUser, {
  props: ({mutate}) => ({
    login: (email, password) => mutate({variables: {email, password}}),
  }),
})(Login);
