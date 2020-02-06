import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {BackArrowIcon, DeleteIcon, SaveIcon} from '../../svg/Icons';
import InputElement from '../util/InputElement';
import {connect} from 'react-redux';
import {graphql} from 'react-apollo';
import {find} from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import EventPool from '../../utils/EventPool';
import { deleteContract, deleteUser, editContract, editUser } from '../../queries/queries';
import {ADMIN_ROLE, hasPermission, useRole} from '../../hooks/useRole';
import {useUserId} from '../../hooks/useUserId';
import Picker from '../util/Picker';
import Switch from '../util/Switch';

const mapStateToProps = state => ({
  user: state.nonCachedReducer.selectedUser,
  userRoles: state.nonCachedReducer.userRoles,
});

const UserExpanded = props => {
  const {
    user,
    userRoles,
    closeUser,
    saveUser,
    deleteUser,
    onUserSave,
    resetPageCount,
  } = props;
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [role, setRole] = useState({label: null, value: null});
  const [isActive, setIsActive] = useState(null);
  const handleSave = () => {
    resetPageCount();
    saveUser(
      user.id,
      username,
      email,
      role.value,
      isActive,
      password,
    ).then(() => EventPool.emit('usersUpdated'));
    onUserSave();
  };
  const handleDelete = () => {
    deleteUser(user.id).then(() => EventPool.emit('usersUpdated'));
    onUserSave();
  };
  const userId = useUserId();
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setRole({
        label: user.role,
        value: user.role,
      });
      setIsActive(user.isActive);
    } else {
      setUsername(null);
      setEmail(null);
      setRole({label: null, value: null});
      setPassword(null);
      setIsActive(null);
    }
  }, [user]);
  const userRole = useRole();
  if (!user) {
    return null;
  }
  const hasAdminPermission = hasPermission([ADMIN_ROLE], userRole);
  const editingOwnUser = Number(user.id) === Number(userId);
  const isDisabled = !hasAdminPermission && !editingOwnUser;
  return (
    <Container>
      <NavigationButtonsContainer>
        <TouchableOpacity onPress={closeUser}>
          <BackArrowIcon />
        </TouchableOpacity>
        <TitleBar>{isDisabled ? 'User' : 'Edit User'}</TitleBar>
        <TouchableOpacity
          style={{
            opacity: isDisabled ? 0 : 1,
          }}
          disabled={isDisabled}
          onPress={handleSave}>
          <SaveIcon />
        </TouchableOpacity>
      </NavigationButtonsContainer>
      <KeyboardAwareScrollView
        extraScrollHeight={50}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 50}}>
        <Form>
          <InputElement editable={false} placeholder={user.id} label="Id" />
          <InputElement
            editable={!isDisabled}
            placeholder={user.username}
            label="Username"
            onChange={setUsername}
          />
          <InputElement
            editable={!isDisabled}
            placeholder={user.email}
            label="Email"
            onChange={setEmail}
            numeric={true}
          />
          {!isDisabled && (
            <InputElement
              editable={!isDisabled}
              label="Password"
              onChange={setPassword}
              isPassword={true}
            />
          )}
          <PickerContainer>
            <Picker
              title="Role"
              editable={hasAdminPermission}
              onValueChange={itemValue => {
                setRole({
                  label: find(userRoles, {value: itemValue}).label,
                  value: itemValue,
                });
              }}
              value={role.value}
              items={userRoles}
              label={role.label}
            />
          </PickerContainer>
          {hasAdminPermission && (
            <Switch value={isActive} setValue={setIsActive} label="is active" />
          )}
          {hasAdminPermission && (
            <TouchableOpacity onPress={handleDelete}>
              <ButtonContainer stlye={{paddingTop: 10}}>
                <DeleteIcon />
                <ButtonLabel>Delete user</ButtonLabel>
              </ButtonContainer>
            </TouchableOpacity>
          )}
        </Form>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <Background />
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </Container>
  );
};

UserExpanded.propTypes = {
  user: PropTypes.object,
  currencies: PropTypes.array,
  userRoles: PropTypes.array,
  projects: PropTypes.array,
  closeUser: PropTypes.func,
  saveUser: PropTypes.func,
  deleteWorkSession: PropTypes.func,
  onUserSave: PropTypes.func,
  resetPageCount: PropTypes.func,
};

UserExpanded.defaultProps = {
  user: null,
  currencies: [],
  userRoles: [],
  projects: [],
  closeUser: () => {},
  saveUser: () => {},
  deleteWorkSession: () => {},
  onUserSave: () => {},
  resetPageCount: () => {},
};

const Container = styled.View`
  width: 100%;
  height: 100%;
`;

const Background = styled.View`
  height: 100%;
`;

const TitleBar = styled.Text`
  font-size: 25px;
  color: white;
  line-height: 50px;
`;

const Form = styled.View`
  padding: 10px;
`;

const NavigationButtonsContainer = styled.View`
  height: 50px;
  background: #651fff;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
  justify-content: space-between;
`;

const PickerContainer = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: lightgrey;
  margin-bottom: 8px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
  margin-top: 20px;
`;

const ButtonLabel = styled.Text`
  line-height: 35px;
  font-size: 17px;
  padding-left: 10px;
`;

const saveUserQuery = graphql(editUser, {
  props: ({mutate}) => ({
    saveUser: (id, username, email, role, isActive, password) =>
      mutate({
        variables: {id, username, email, role, isActive, password},
      }),
  }),
});

const deleteUserQuery = graphql(deleteUser, {
  props: ({mutate}) => ({
    deleteUser: id =>
      mutate({
        variables: {id},
      }),
  }),
});

export default saveUserQuery(
  deleteUserQuery(
    connect(
      mapStateToProps,
      null,
    )(UserExpanded),
  ),
);
