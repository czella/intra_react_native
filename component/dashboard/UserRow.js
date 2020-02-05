import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styled from 'styled-components';
import { UserCircle } from '../../svg/Icons';

const UserRow = props => {
  const {users} = props;
  return (
    <UserRowContainer>
      {users.map(user => (
        <UserContainer>
          <Text>{user.name}</Text>
          <UserCircle color={user.color}/>
        </UserContainer>
      ))}
    </UserRowContainer>
  );
};

UserRow.propTypes = {
  users: PropTypes.array,
};

UserRow.defaultProps = {
  users: [],
};

const UserRowContainer = styled.View`
  flex: 1
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

const UserContainer = styled.View`
  flex-direction: row;
`;

const Text = styled.Text`
  margin-right: 3px;
  margin-left: 10px;
`;

const TextInput = styled.TextInput``;

export default UserRow;
