import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styled from 'styled-components';
import {
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {graphql} from 'react-apollo';
import {find} from 'lodash';
import {BackArrowIcon, CancelIcon, CopyIcon, SaveIcon} from '../../svg/Icons';
import InputElement, {NUMERIC_KEYBOARD} from '../util/InputElement';
import EventPool from '../../utils/EventPool';

import {createContract} from '../../queries/queries';
import Picker from '../util/Picker';

const ContractNew = props => {
  const {
    currencies,
    users,
    projects,
    closeContract,
    createContract,
    onContractCreate,
    resetPageCount,
  } = props;
  const [position, setPosition] = useState(null);
  const [price, setPrice] = useState(null);
  const [user, setUser] = useState(
    users ? users[0] : {label: null, value: null},
  );
  const [project, setProject] = useState(
    projects ? projects[0] : {label: null, value: null},
  );
  const [currency, setCurrency] = useState(
    currencies ? currencies[0] : {label: null, value: null},
  );
  const handleSave = () => {
    if (position && user.value && project.value && price && currency.value) {
      resetPageCount();
      createContract(
        position,
        user.value,
        project.value,
        Number(price),
        currency.value,
      ).then(() => EventPool.emit('contractsUpdated'));
      onContractCreate();
    } else {
      console.log('Form is not completed!');
    }
  };

  const clearFields = () => {
    setPosition(null);
    setPrice(null);
    setUser(users ? users[0] : {label: null, value: null});
    setProject(projects ? projects[0] : {label: null, value: null});
    setCurrency(currencies ? currencies[0] : {label: null, value: null});
  };

  return (
    <Container>
      <NavigationButtonsContainer>
        <TouchableOpacity onPress={closeContract}>
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
            label="Position"
            onChange={setPosition}
            value={position}
          />
          <PickerContainer>
            <Picker
              title="User"
              onValueChange={itemValue => {
                setUser({
                  label: find(users, {value: itemValue}).label,
                  value: itemValue,
                });
              }}
              value={user.value}
              items={users}
              label={user.label}
            />
          </PickerContainer>
          <PickerContainer>
            <Picker
              title="Project"
              onValueChange={itemValue => {
                setProject({
                  label: find(projects, {value: itemValue}).label,
                  value: itemValue,
                });
              }}
              value={project.value}
              items={projects}
              label={project.label}
            />
          </PickerContainer>
          <InputElement
            label="Price"
            onChange={setPrice}
            keyBoardType={NUMERIC_KEYBOARD}
          />
          <PickerContainer>
            <Picker
              title="Currency"
              onValueChange={itemValue => {
                setCurrency({
                  label: find(currencies, {value: itemValue}).label,
                  value: itemValue,
                });
              }}
              value={currency.value}
              items={currencies}
              label={currency.label}
            />
          </PickerContainer>
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

ContractNew.propTypes = {
  currencies: PropTypes.array,
  users: PropTypes.array,
  projects: PropTypes.array,
  closeContract: PropTypes.func,
  createContract: PropTypes.func,
  onContractCreate: PropTypes.func,
  resetPageCount: PropTypes.func,
  saveContract: PropTypes.func,
};

ContractNew.defaultProps = {
  currencies: [],
  users: [],
  projects: [],
  closeContract: () => {},
  createContract: () => {},
  onContractCreate: () => {},
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

export default graphql(createContract, {
  props: ({mutate}) => ({
    createContract: (position, UserId, ProjectId, price, CurrencyId) =>
      mutate({
        variables: {position, UserId, ProjectId, price, CurrencyId},
      }),
  }),
})(ContractNew);
