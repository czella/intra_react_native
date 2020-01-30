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
import {useQuery} from '@apollo/react-hooks';
import {find} from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import EventPool from '../../utils/EventPool';
import {useRole, ADMIN_ROLE, PROJECT_OWNER} from '../../hooks/useRole';
import {
  allDataForContract,
  deleteWorkSession,
  editWorkSession,
} from '../../queries/queries';
import Picker from '../Picker';

const mapStateToProps = state => ({
  contract: state.nonCachedReducer.selectedContract,
});

const ContractExpanded = props => {
  const {
    contract,
    closeWorkSession,
    saveWorkSession,
    deleteWorkSession,
    onWorkSessionSave,
    resetPageCount,
  } = props;
  const role = useRole();
  const getUsersForPicker = users => {
    return users.map(user => {
      return {label: user.username, value: user.id};
    });
  };
  console.log(contract, '.........................................');
  const [position, setPosition] = useState(null);
  const [price, setPrice] = useState(null);
  const [user, setUser] = useState({label: null, value: null});
  const [description, setDescription] = useState(null);
  const [url, setUrl] = useState(null);
  const [date, setDate] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  // resetPageCount();
  useEffect(() => {
    if (contract) {
      setPosition(contract.position);
      setPrice(`${contract.price}`);
      setUser({
        label: contract.User.username,
        value: contract.User.id,
      });
      // setDescription(workSession.description);
      // setUrl(workSession.url);
      // setDate(new Date(workSession.date ? workSession.date : null));
    } else {
      setPosition(null);
      setPrice(null);
      setUser({label: null, value: null});
      // setDescription(null);
      // setUrl(null);
      // setDate(null);
    }
  }, [contract]);
  const {loading, data, error, refetch, fetchMore, networkStatus} = useQuery(
    allDataForContract,
    {
      variables: {
        userFilter: {},
        currencyFilter: {},
        projectFilter: {},
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
  );
  if (loading) {
    return (
      <LoaderContainer
        style={{
          width: 300,
        }}>
        <ActivityIndicator size="large" color="#7423B5" />
      </LoaderContainer>
    );
  }
  if (error) {
    return <Text>`Error! ${error}`</Text>;
  }
  console.log(data, 'stuff');
  const handleSave = () => {
    // saveWorkSession(
    //   workSession.id,
    //   position,
    //   description,
    //   url,
    //   dateToString(date),
    //   Number(price),
    //   user.id,
    // ).then(() => EventPool.emit('refreshWorkSessions'));
    // onWorkSessionSave();
    // resetPageCount();
  };
  const handleDelete = () => {
    // deleteWorkSession(workSession.id).then(() =>
    //   EventPool.emit('refreshWorkSessions'),
    // );
    // onWorkSessionSave();
  };

  if (!contract) {
    return null;
  }
  return (
    <Container>
      <NavigationButtonsContainer>
        <TouchableOpacity onPress={closeWorkSession}>
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
              onValueChange={(itemValue, index) => {
                setUser({
                  label: find(data.users, {id: itemValue}).username,
                  value: itemValue,
                });
              }}
              value={user.value}
              items={getUsersForPicker(data.users)}
              label={user.label}
            />
          </PickerContainer>
          <InputElement
            placeholder={`${contract.price}`}
            label="Price"
            onChange={setPrice}
            numeric={true}
          />
          {/*<InputElement*/}
          {/*placeholder={workSession.description}*/}
          {/*label="Description"*/}
          {/*onChange={setDescription}*/}
          {/*/>*/}
          {/*<InputElement*/}
          {/*placeholder={workSession.url}*/}
          {/*label="Url"*/}
          {/*onChange={setUrl}*/}
          {/*/>*/}
          {/*<TouchableOpacity*/}
          {/*onPress={() => {*/}
          {/*setShowDatePicker(true);*/}
          {/*}}>*/}
          {/*<InputContainer*/}
          {/*style={{*/}
          {/*borderBottomWidth: 1,*/}
          {/*borderRadius: 1,*/}
          {/*borderBottomColor: 'lightgrey',*/}
          {/*color: 'lightgrey',*/}
          {/*background: 'red',*/}
          {/*}}*/}
          {/*pointerEvents="none">*/}
          {/*<InputLabel style={{color: 'lightgrey'}}>Date</InputLabel>*/}
          {/*<TextInput*/}
          {/*editable={false}*/}
          {/*onChange={() => {}}*/}
          {/*placeholder={dateToString(date)}*/}
          {/*/>*/}
          {/*</InputContainer>*/}
          {/*</TouchableOpacity>*/}
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
  closeWorkSession: PropTypes.func,
  saveWorkSession: PropTypes.func,
  deleteWorkSession: PropTypes.func,
  onWorkSessionSave: PropTypes.func,
  resetPageCount: PropTypes.func,
};

ContractExpanded.defaultProps = {
  workSession: null,
  closeWorkSession: () => {},
  saveWorkSession: () => {},
  deleteWorkSession: () => {},
  onWorkSessionSave: () => {},
  resetPageCount: () => {},
};

const Container = styled.View`
  width: 100%;
  height: 100%;
`;

const LoaderContainer = styled.View`
  margin: 10px;
  padding-top: 120px;
  height: 250;
`;

const Text = styled.Text``;

const Background = styled.View`
  height: 100%;
`;

const TitleBar = styled.Text`
  font-size: 25px;
  color: white;
  line-height: 50px;
`;

const PickerButton = styled.Text`
  width: 50px;
  font-size: 18px;
  margin: auto;
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

const InputContainer = styled.View`
  margin-bottom: 10px;
`;

const DatePickerContainer = styled.View``;

const InputLabel = styled.Text``;

const TextInput = styled.TextInput``;

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

const saveWorkSessionQuery = graphql(editWorkSession, {
  props: ({mutate}) => ({
    saveWorkSession: (id, title, description, url, date, minutes, ContractId) =>
      mutate({
        variables: {id, title, description, url, date, minutes, ContractId},
      }),
  }),
});

const deleteWorkSessionQuery = graphql(deleteWorkSession, {
  props: ({mutate}) => ({
    deleteWorkSession: id =>
      mutate({
        variables: {id},
      }),
  }),
});

export default saveWorkSessionQuery(
  deleteWorkSessionQuery(
    connect(
      mapStateToProps,
      null,
    )(ContractExpanded),
  ),
);
