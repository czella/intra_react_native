import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {BackArrowIcon, DeleteIcon, SaveIcon} from '../../svg/Icons';
import InputElement, {NUMERIC_KEYBOARD} from '../util/InputElement';
import {connect} from 'react-redux';
import {graphql} from 'react-apollo';
import {find} from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import EventPool from '../../utils/EventPool';
import {deleteContract, editContract} from '../../queries/queries';
import Picker from '../util/Picker';
import {ADMIN_ROLE, hasPermission, useRole} from '../../hooks/useRole';

const mapStateToProps = state => ({
  contract: state.nonCachedReducer.selectedContract,
});

const ContractExpanded = props => {
  const {
    contract,
    currencies,
    users,
    projects,
    closeContract,
    saveContract,
    deleteContract,
    onContractSave,
    resetPageCount,
  } = props;
  const [position, setPosition] = useState(null);
  const [price, setPrice] = useState(null);
  const [user, setUser] = useState({label: null, value: null});
  const [project, setProject] = useState({label: null, value: null});
  const [currency, setCurrency] = useState({label: null, value: null});
  const handleSave = () => {
    resetPageCount();
    saveContract(
      contract.id,
      position,
      user.value,
      project.value,
      Number(price),
      currency.value,
    ).then(() => EventPool.emit('contractsUpdated'));
    onContractSave();
  };
  const handleDelete = () => {
    deleteContract(contract.id).then(() => EventPool.emit('contractsUpdated'));
    onContractSave();
  };
  useEffect(() => {
    if (contract) {
      setPosition(contract.position);
      setPrice(`${contract.price}`);
      setUser({
        label: contract.User.username,
        value: contract.User.id,
      });
      setProject({
        label: contract.Project.name,
        value: contract.Project.id,
      });
      setCurrency({
        label: find(currencies, {value: contract.CurrencyId}).label,
        value: contract.CurrencyId,
      });
    } else {
      setPosition(null);
      setPrice(null);
      setUser({label: null, value: null});
      setProject({label: null, value: null});
      setCurrency({label: null, value: null});
    }
  }, [contract, currencies]);
  const role = useRole();
  if (!contract) {
    return null;
  }
  const isDisabled = !hasPermission([ADMIN_ROLE], role);
  return (
    <Container>
      <NavigationButtonsContainer>
        <TouchableOpacity onPress={closeContract}>
          <BackArrowIcon />
        </TouchableOpacity>
        <TitleBar>
          {isDisabled ? 'Contract' : 'Edit Contract'}
        </TitleBar>
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
          <InputElement editable={false} placeholder={contract.id} label="Id" />
          <InputElement
            editable={!isDisabled}
            placeholder={contract.position}
            label="Position"
            onChange={setPosition}
          />
          <PickerContainer>
            <Picker
              title="User"
              editable={!isDisabled}
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
              editable={!isDisabled}
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
            editable={!isDisabled}
            placeholder={`${contract.price}`}
            label="Price"
            onChange={setPrice}
            keyBoardType={NUMERIC_KEYBOARD}
          />
          <PickerContainer>
            <Picker
              title="Currency"
              editable={!isDisabled}
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
          {!isDisabled && (
            <TouchableOpacity onPress={handleDelete}>
              <ButtonContainer stlye={{paddingTop: 10}}>
                <DeleteIcon />
                <ButtonLabel>Delete contract</ButtonLabel>
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

ContractExpanded.propTypes = {
  contract: PropTypes.object,
  currencies: PropTypes.array,
  users: PropTypes.array,
  projects: PropTypes.array,
  closeContract: PropTypes.func,
  saveContract: PropTypes.func,
  deleteWorkSession: PropTypes.func,
  onContractSave: PropTypes.func,
  resetPageCount: PropTypes.func,
};

ContractExpanded.defaultProps = {
  contract: null,
  currencies: [],
  users: [],
  projects: [],
  closeContract: () => {},
  saveContract: () => {},
  deleteWorkSession: () => {},
  onContractSave: () => {},
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

const saveContractQuery = graphql(editContract, {
  props: ({mutate}) => ({
    saveContract: (id, position, UserId, ProjectId, price, CurrencyId) =>
      mutate({
        variables: {id, position, UserId, ProjectId, price, CurrencyId},
      }),
  }),
});

const deleteContractQuery = graphql(deleteContract, {
  props: ({mutate}) => ({
    deleteContract: id =>
      mutate({
        variables: {id},
      }),
  }),
});

export default saveContractQuery(
  deleteContractQuery(
    connect(
      mapStateToProps,
      null,
    )(ContractExpanded),
  ),
);
