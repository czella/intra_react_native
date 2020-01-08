import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Picker,
  SafeAreaView,
  ScrollView,
  CheckBox,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {BackArrowIcon, CancelIcon, CopyIcon, SaveIcon} from '../svg/Icons';
import InputElement from './InputElement';
import DateTimePicker from '@react-native-community/datetimepicker';
import {connect} from 'react-redux';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import EventPool from '../utils/EventPool';

const dateToString = date => {
  if (date) {
    return date.toISOString().split('T')[0];
  }
  return '';
};

const query = gql`
  mutation updateWorkSession(
    $id: ID!
    $title: String!
    $description: String!
    $url: String!
    $date: String!
    $minutes: Int!
    $ContractId: ID!
  ) {
    data: updateWorkSession(
      id: $id
      title: $title
      description: $description
      url: $url
      date: $date
      minutes: $minutes
      ContractId: $ContractId
    ) {
      id
      title
      description
      url
      date
      minutes
      ContractId
      __typename
    }
  }
`;

const WorkSessionNew = props => {
  const {
    lastWorkSession,
    contracts,
    closeWorkSession,
    saveWorkSession,
    onWorkSessionSave,
  } = props;
  const [usingTemplate, setUsingTemplate] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [url, setUrl] = useState(null);
  const [date, setDate] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [contract, setContract] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleSave = () => {
    saveWorkSession(
      lastWorkSession.id,
      title,
      description,
      url,
      dateToString(date),
      Number(minutes),
      contract,
    ).then(() => EventPool.emit('refreshWorkSessions'));
    onWorkSessionSave();
  };
  const handleDate = date => {
    setShowDatePicker(false);
    if (date) {
      setDate(date);
    }
  };

  const clearFields = () => {
    setUsingTemplate(false);
    setTitle(null);
    setDescription(null);
    setMinutes(null);
    setContract(null);
    setUrl(null);
    setDate(null);
  };

  const copyTemplateValues = () => {
    setUsingTemplate(true);
    setTitle(lastWorkSession.title);
    setDescription(lastWorkSession.description);
    setMinutes(`${lastWorkSession.minutes}`);
    setContract(lastWorkSession.ContractId);
    setUrl(lastWorkSession.url);
    setDate(new Date(lastWorkSession.date));
  };

  return (
    <Container>
      <NavigationButtonsContainer>
        <TouchableOpacity onPress={closeWorkSession}>
          <BackArrowIcon />
        </TouchableOpacity>
        <TitleBar>New Session</TitleBar>
        <TouchableOpacity onPress={handleSave}>
          <SaveIcon />
        </TouchableOpacity>
      </NavigationButtonsContainer>
      <SafeAreaView
        style={{
          height: '100%',
          wdith: '100%',
          zIndex: 1,
        }}>
        <KeyboardAwareScrollView
          extraScrollHeight={50}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: 50}}>
          <Form>
            <TouchableOpacity onPress={copyTemplateValues}>
              <ButtonContainer>
                <CopyIcon />
                <ButtonLabel>Copy last session</ButtonLabel>
              </ButtonContainer>
            </TouchableOpacity>
            <InputElement label="Title" onChange={setTitle} value={title} />
            <InputElement
              label="Description"
              onChange={setDescription}
              value={description}
            />
            <InputElement label="Url" onChange={setUrl} value={url} />
            <InputContainer
              style={{
                borderBottomWidth: 1,
                borderRadius: 1,
                borderBottomColor: 'lightgrey',
                color: 'lightgrey',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowDatePicker(true);
                }}>
                <InputLabel style={{color: 'lightgrey'}}>Date</InputLabel>
                <TextInput
                  editable={false}
                  onChange={() => {}}
                  placeholder={
                    usingTemplate
                      ? dateToString(date)
                      : dateToString(new Date())
                  }
                />
              </TouchableOpacity>
            </InputContainer>
            <InputElement
              label="Minutes"
              onChange={setMinutes}
              value={minutes}
              numeric={true}
            />
            <PickerContainer>
              <InputLabel style={{color: 'lightgrey'}}>Contract</InputLabel>
              <Picker
                selectedValue={contract}
                style={{height: 40, width: '100%'}}
                onValueChange={itemValue => {
                  setContract(itemValue);
                }}>
                {contracts.map(contract => (
                  <Picker.Item
                    label={`${contract.Project.name} - ${contract.position} - ${
                      contract.User.username
                    }`}
                    value={contract.id}
                  />
                ))}
              </Picker>
            </PickerContainer>
            <TouchableOpacity onPress={clearFields}>
              <ButtonContainer stlye={{paddingTop: 10}}>
                <CancelIcon />
                <ButtonLabel>Clear fields</ButtonLabel>
              </ButtonContainer>
            </TouchableOpacity>
          </Form>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              is24Hour={true}
              display="default"
              onChange={(event, date) => {
                handleDate(date);
              }}
            />
          )}
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Background />
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Container>
  );
};

WorkSessionNew.propTypes = {
  lastWorkSession: PropTypes.object,
  contracts: PropTypes.array,
  closeWorkSession: PropTypes.func,
  saveWorkSession: PropTypes.func,
  setWorkSessionsEdited: PropTypes.func,
  onWorkSessionSave: PropTypes.func,
};

WorkSessionNew.defaultProps = {
  lastWorkSession: null,
  contracts: [],
  closeWorkSession: () => {},
  saveWorkSession: () => {},
  setWorkSessionsEdited: () => {},
  onWorkSessionSave: () => {},
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

const CopyContainer = styled.View`
  flex-direction: row;
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

const InputContainer = styled.View`
  margin-bottom: 10px;
`;

const InputLabel = styled.Text``;

const TextInput = styled.TextInput`
  line-height: 60px;
`;

const PickerContainer = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: lightgrey;
`;

export default graphql(query, {
  props: ({mutate}) => ({
    saveWorkSession: (id, title, description, url, date, minutes, ContractId) =>
      mutate({
        variables: {id, title, description, url, date, minutes, ContractId},
      }),
  }),
})(WorkSessionNew);
