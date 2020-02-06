import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {graphql} from 'react-apollo';
import {find} from 'lodash';
import {BackArrowIcon, CancelIcon, SaveIcon} from '../../svg/Icons';
import InputElement, {EMAIL_KEYBOARD} from '../util/InputElement';
import EventPool from '../../utils/EventPool';

import {createUser} from '../../queries/queries';
import Picker from '../util/Picker';
import Switch from '../util/Switch';

const mapStateToProps = state => ({
  userRoles: state.nonCachedReducer.userRoles,
});

const UserNew = props => {
  const {
    userRoles,
    closeUser,
    createUser,
    onUserCreate,
    resetPageCount,
  } = props;
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [role, setRole] = useState(
    userRoles ? userRoles[1] : {label: null, value: null},
  );
  const [isActive, setIsActive] = useState(false);
  const handleSave = () => {
    if (username && role.value && email && isActive !== null) {
      resetPageCount();
      createUser(username, email, password, role.value, isActive).then(() =>
        EventPool.emit('usersUpdated'),
      );
      onUserCreate();
    } else {
      console.log('Form is not completed!');
    }
  };

  const clearFields = () => {
    setUsername(null);
    setEmail(null);
    setRole(userRoles ? userRoles[1] : {label: null, value: null});
    setPassword(null);
    setIsActive(null);
  };

  return (
    <Container>
      <NavigationButtonsContainer>
        <TouchableOpacity onPress={closeUser}>
          <BackArrowIcon />
        </TouchableOpacity>
        <TitleBar>New Contract</TitleBar>
        <TouchableOpacity onPress={handleSave}>
          <SaveIcon />
        </TouchableOpacity>
      </NavigationButtonsContainer>
      <KeyboardAwareScrollView
        extraScrollHeight={50}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 50}}>
        <Form>
          <InputElement
            label="Username"
            onChange={setUsername}
            value={username}
          />
          <InputElement
            label="Email"
            onChange={setEmail}
            keyBoardType={EMAIL_KEYBOARD}
            value={email}
          />
          <InputElement
            label="Password"
            onChange={setPassword}
            isPassword={true}
            value={password}
          />
          <PickerContainer>
            <Picker
              title="Role"
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
          <Switch value={isActive} setValue={setIsActive} label="is active" />
          <TouchableOpacity onPress={clearFields}>
            <ButtonContainer stlye={{paddingTop: 10}}>
              <CancelIcon />
              <ButtonLabel>Clear fields</ButtonLabel>
            </ButtonContainer>
          </TouchableOpacity>
        </Form>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <Background />
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </Container>
  );
};

UserNew.propTypes = {
  userRoles: PropTypes.array,
  closeUser: PropTypes.func,
  createUser: PropTypes.func,
  onUserCreate: PropTypes.func,
  resetPageCount: PropTypes.func,
};

UserNew.defaultProps = {
  userRoles: [],
  closeUser: () => {},
  createUser: () => {},
  onUserCreate: () => {},
  resetPageCount: () => {},
};

const Container = styled.View`
  width: 100%;
  height: 100%;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
  margin-top: 20px;
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

const ButtonLabel = styled.Text`
  line-height: 35px;
  font-size: 17px;
  padding-left: 10px;
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

export default graphql(createUser, {
  props: ({mutate}) => ({
    createUser: (username, email, password, role, isActive) =>
      mutate({
        variables: {username, email, password, role, isActive},
      }),
  }),
})(
  connect(
    mapStateToProps,
    null,
  )(UserNew),
);
