import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {BackArrowIcon, DeleteIcon, SaveIcon} from '../../svg/Icons';
import InputElement from '../InputElement';
import {connect} from 'react-redux';
import {graphql} from 'react-apollo';
import {find} from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import EventPool from '../../utils/EventPool';
import {deleteContract, editContract} from '../../queries/queries';
import Picker from '../Picker';

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
  const getUsersForPicker = users => {
    return users.map(user => {
      return {label: user.username, value: user.id};
    });
  };
  const getProjectsForPicker = projects => {
    return projects.map(project => {
      return {label: project.name, value: project.id};
    });
  };
  const getCurrenciesForPicker = currencies => {
    return currencies.map(currency => {
      return {label: currency.name, value: currency.id};
    });
  };
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
        label: find(currencies, {id: contract.CurrencyId}).name,
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
  if (!contract) {
    return null;
  }
  return (
    <Container>
      <NavigationButtonsContainer>
        <TouchableOpacity onPress={closeContract}>
          <BackArrowIcon />
        </TouchableOpacity>
        <TitleBar>Edit Contract</TitleBar>
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
          <InputElement editable={false} placeholder={contract.id} label="Id" />
          <InputElement
            placeholder={contract.position}
            label="Position"
            onChange={setPosition}
          />
          <PickerContainer>
            <Picker
              title="User"
              onValueChange={itemValue => {
                setUser({
                  label: find(users, {id: itemValue}).username,
                  value: itemValue,
                });
              }}
              value={user.value}
              items={getUsersForPicker(users)}
              label={user.label}
            />
          </PickerContainer>
          <PickerContainer>
            <Picker
              title="Project"
              onValueChange={itemValue => {
                setProject({
                  label: find(projects, {id: itemValue}).name,
                  value: itemValue,
                });
              }}
              value={project.value}
              items={getProjectsForPicker(projects)}
              label={project.label}
            />
          </PickerContainer>
          <InputElement
            placeholder={`${contract.price}`}
            label="Price"
            onChange={setPrice}
            numeric={true}
          />
          <PickerContainer>
            <Picker
              title="Currency"
              onValueChange={itemValue => {
                setCurrency({
                  label: find(currencies, {id: itemValue}).name,
                  value: itemValue,
                });
              }}
              value={currency.value}
              items={getCurrenciesForPicker(currencies)}
              label={currency.label}
            />
          </PickerContainer>
          <TouchableOpacity onPress={handleDelete}>
            <ButtonContainer stlye={{paddingTop: 10}}>
              <DeleteIcon />
              <ButtonLabel>Delete session</ButtonLabel>
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

ContractExpanded.propTypes = {
  workSession: PropTypes.object,
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
  workSession: null,
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
