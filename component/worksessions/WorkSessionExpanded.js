import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {BackArrowIcon, DeleteIcon, SaveIcon} from '../../svg/Icons';
import InputElement from '../util/InputElement';
import DateTimePicker from '@react-native-community/datetimepicker';
import {connect} from 'react-redux';
import {graphql} from 'react-apollo';
import {find} from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import EventPool from '../../utils/EventPool';
import { useRole, ADMIN_ROLE, PROJECT_OWNER_ROLE, hasPermission } from '../../hooks/useRole';
import {deleteWorkSession, editWorkSession} from '../../queries/queries';
import Picker from '../util/Picker';

const dateToString = date => {
  if (date) {
    return date.toISOString().split('T')[0];
  }
  return '';
};

const mapStateToProps = state => ({
  workSession: state.nonCachedReducer.selectedWorkSession,
});

const WorkSessionExpanded = props => {
  const {
    workSession,
    closeWorkSession,
    saveWorkSession,
    deleteWorkSession,
    onWorkSessionSave,
    resetPageCount,
  } = props;
  const role = useRole();
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [url, setUrl] = useState(null);
  const [date, setDate] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [contract, setContract] = useState({label: null, id: null});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleSave = () => {
    resetPageCount();
    saveWorkSession(
      workSession.id,
      title,
      description,
      url,
      dateToString(date),
      Number(minutes),
      contract.id,
    ).then(() => EventPool.emit('workSessionsUpdated'));
    onWorkSessionSave();
  };
  const handleDelete = () => {
    resetPageCount();
    deleteWorkSession(workSession.id).then(() =>
      EventPool.emit('workSessionsUpdated'),
    );
    onWorkSessionSave();
  };
  const handleDate = date => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setDate(date);
    }
  };
  const createSessionLabel = contract => {
    return `${contract.Project ? contract.Project.name : ''} - ${
      contract.position
    } - ${contract.User ? contract.User.username : ''}`;
  };

  useEffect(() => {
    if (workSession) {
      setTitle(workSession.title);
      setDescription(workSession.description);
      setMinutes(`${workSession.minutes}`);
      setContract({
        label: createSessionLabel(
          find(workSession.contracts, {id: workSession.ContractId}),
        ),
        id: workSession.ContractId,
      });
      setUrl(workSession.url);
      setDate(new Date(workSession.date ? workSession.date : null));
    } else {
      setTitle(null);
      setDescription(null);
      setMinutes(null);
      setContract({label: null, id: null});
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
        <TitleBar>Edit Session</TitleBar>
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
          {hasPermission([ADMIN_ROLE, PROJECT_OWNER_ROLE], role) && (
            <InputElement
              editable={false}
              placeholder={
                find(workSession.contracts, {id: workSession.ContractId}).User
                  .username
              }
              label="Username"
            />
          )}
          <InputElement
            editable={false}
            placeholder={workSession.id}
            label="Id"
          />
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
          <TouchableOpacity
            onPress={() => {
              setShowDatePicker(true);
            }}>
            <InputContainer
              style={{
                borderBottomWidth: 1,
                borderRadius: 1,
                borderBottomColor: 'lightgrey',
                color: 'lightgrey',
                background: 'red',
              }}
              pointerEvents="none">
              <InputLabel style={{color: 'lightgrey'}}>Date</InputLabel>
              <TextInput
                editable={false}
                onChange={() => {}}
                placeholder={dateToString(date)}
              />
            </InputContainer>
          </TouchableOpacity>
          <InputElement
            placeholder={`${workSession.minutes}`}
            label="Minutes"
            onChange={setMinutes}
            numeric={true}
          />
          <PickerContainer>
            <Picker
              onValueChange={(itemValue, index) => {
                setContract({
                  label: createSessionLabel(workSession.contracts[index]),
                  id: itemValue,
                });
              }}
              value={contract.id}
              title="Contract"
              items={workSession.contracts.map(contract => ({
                label: createSessionLabel(contract),
                value: contract.id,
              }))}
              label={contract.label}
            />
          </PickerContainer>
          <TouchableOpacity onPress={handleDelete}>
            <ButtonContainer stlye={{paddingTop: 10}}>
              <DeleteIcon />
              <ButtonLabel>Delete session</ButtonLabel>
            </ButtonContainer>
          </TouchableOpacity>
        </Form>
        {showDatePicker && (
          <DatePickerContainer>
            <DateTimePicker
              value={date}
              is24Hour={true}
              display="default"
              onChange={(event, date) => {
                handleDate(date);
              }}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <PickerButton>Done</PickerButton>
              </TouchableOpacity>
            )}
          </DatePickerContainer>
        )}
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <Background />
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </Container>
  );
};

WorkSessionExpanded.propTypes = {
  workSession: PropTypes.object,
  closeWorkSession: PropTypes.func,
  saveWorkSession: PropTypes.func,
  deleteWorkSession: PropTypes.func,
  onWorkSessionSave: PropTypes.func,
  resetPageCount: PropTypes.func,
};

WorkSessionExpanded.defaultProps = {
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
    )(WorkSessionExpanded),
  ),
);
