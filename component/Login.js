import React, {useState} from 'react';
import styled from 'styled-components';
import { StatusBar, TouchableOpacity } from 'react-native';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

const query = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const Login = props => {
  const {login, setToken} = props;
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleLogin = (email, password) => {
    login(email, password).then(({data}) => setToken(data.login));
  };

  return (
    <Container>
      <StatusBar backgroundColor="#651FFF" />
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

const Container = styled.View`
  padding-top: 50px;
  align-items: center;
  background-color: #651FFF;
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
  box-shadow: 0 10px 20px #c2cbff;
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

export default graphql(query, {
  props: ({mutate}) => ({
    login: (email, password) => mutate({variables: {email, password}}),
  }),
})(Login);
