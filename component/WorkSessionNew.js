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
import {BackArrowIcon, SaveIcon} from '../svg/Icons';
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

const mapStateToProps = state => ({
  workSession: state.nonCachedReducer.selectedWorkSession,
});

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
    workSession,
    closeWorkSession,
    saveWorkSession,
    onWorkSessionSave,
  } = props;
  const [usingTemplate, setUsingTemplate] = useState(false);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [url, setUrl] = useState(null);
  const [date, setDate] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [contract, setContract] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleSave = () => {
    saveWorkSession(
      workSession.id,
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

  useEffect(() => {
    if (workSession) {
      setTitle(workSession.title);
      setDescription(workSession.description);
      setMinutes(`${workSession.minutes}`);
      setContract(workSession.ContractId);
      setUrl(workSession.url);
      setDate(new Date(workSession.date ? workSession.date : null));
    } else {
      setTitle(null);
      setDescription(null);
      setMinutes(null);
      setContract(null);
      setUrl(null);
      setDate(null);
    }
  }, [workSession]);

  if (!workSession) {
    return null;
  }
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
          zIndex: 1,
        }}>
        <ScrollView>
          <Form>
            <CheckBoxContainer>
              <CheckBox
                value={usingTemplate}
                onValueChange={() => setUsingTemplate(!usingTemplate)}
              />
              <CheckBoxLabel> Use previous session as a template</CheckBoxLabel>
            </CheckBoxContainer>
            <InputElement
              placeholder={workSession.title}
              label="Title"
              onChange={setTitle}
            />
            <InputElement
              placeholder={workSession.description}
              label="Description"
              onChange={setDescription}
            />
            <InputElement
              placeholder={workSession.url}
              label="Url"
              onChange={setUrl}
            />
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
                  placeholder={dateToString(date)}
                />
              </TouchableOpacity>
            </InputContainer>
            <InputElement
              placeholder={`${workSession.minutes}`}
              label="Minutes"
              onChange={setMinutes}
            />
            <PickerContainer>
              <InputLabel style={{color: 'lightgrey'}}>Contract</InputLabel>
              <Picker
                selectedValue={contract}
                style={{height: 40, width: '100%'}}
                onValueChange={itemValue => {
                  setContract(itemValue);
                }}>
                {workSession.contracts.map(contract => (
                  <Picker.Item
                    label={`${contract.Project.name} - ${contract.position} - ${
                      contract.User.username
                    }`}
                    value={contract.id}
                  />
                ))}
              </Picker>
            </PickerContainer>
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
        </ScrollView>
      </SafeAreaView>
    </Container>
  );
};

WorkSessionNew.propTypes = {
  workSession: PropTypes.object,
  closeWorkSession: PropTypes.func,
  saveWorkSession: PropTypes.func,
  setWorkSessionsEdited: PropTypes.func,
  onWorkSessionSave: PropTypes.func,
};

WorkSessionNew.defaultProps = {
  workSession: null,
  closeWorkSession: () => {},
  saveWorkSession: () => {},
  setWorkSessionsEdited: () => {},
  onWorkSessionSave: () => {},
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

const CheckBoxContainer = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;

const CheckBoxLabel = styled.Text`
  margin-top: 5;
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
})(
  connect(
    mapStateToProps,
    null,
  )(WorkSessionNew),
);
