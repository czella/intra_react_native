import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styled from 'styled-components';
import {
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Picker,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import {graphql} from 'react-apollo';
import {find} from 'lodash';
import {BackArrowIcon, CancelIcon, CopyIcon, SaveIcon} from '../svg/Icons';
import InputElement from './InputElement';
import EventPool from '../utils/EventPool';

import {createWorkSession} from '../queries/queries';
import PickerTrigger from './PickerTrigger';
import RNPickerSelect from 'react-native-picker-select';

const dateToString = date => {
  if (date) {
    return date.toISOString().split('T')[0];
  }
  return '';
};
const WorkSessionNew = props => {
  const {
    lastWorkSession,
    contracts,
    closeWorkSession,
    createWorkSession,
    onWorkSessionCreate,
    resetPageCount,
  } = props;

  const createSessionLabel = contract => {
    return `${contract.Project.name} - ${contract.position} - ${
      contract.User.username
    }`;
  };
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [url, setUrl] = useState(null);
  const [date, setDate] = useState(new Date());
  const [minutes, setMinutes] = useState(null);
  const [contract, setContract] = useState({
    label: createSessionLabel(contracts[0]),
    id: contracts[0].id,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleSave = () => {
    if (title && description && url && date && minutes && contract) {
      resetPageCount();
      createWorkSession(
        title,
        description,
        url,
        dateToString(date),
        Number(minutes),
        contract.id,
      ).then(() => EventPool.emit('refreshWorkSessions'));
      onWorkSessionCreate();
    } else {
      console.log('Form is not completed!');
    }
  };

  const handleDate = date => {
    setShowDatePicker(false);
    if (date) {
      setDate(date);
    }
  };

  const clearFields = () => {
    setTitle(null);
    setDescription(null);
    setMinutes(null);
    setContract({
      label: createSessionLabel(contracts[0]),
      id: contracts[0].id,
    });
    setUrl(null);
    setDate(new Date());
  };

  const copyTemplateValues = () => {
    setTitle(lastWorkSession.title);
    setDescription(lastWorkSession.description);
    setMinutes(`${lastWorkSession.minutes}`);
    setContract({
      label: createSessionLabel(
        find(contracts, {id: lastWorkSession.ContractId}),
      ),
      id: lastWorkSession.ContractId,
    });
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
                placeholder={dateToString(date)}
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
            <RNPickerSelect
              onValueChange={(itemValue, index) => {
                setContract({
                  label: createSessionLabel(contracts[index]),
                  id: itemValue,
                });
              }}
              value={contract.id}
              placeholder={{}}
              InputAccessoryView={() => {
                return null;
              }}
              useNativeAndroidPickerStyle={false}
              Icon={() => null}
              style={{
                inputAndroidContainer: {
                  textAlign: 'left',
                },
                inputAndroid: {
                  height: 40,
                  padding: 0,
                  fontSize: 15,
                  width: '100%',
                },
                inputIOS: {
                  height: 40,
                  fontSize: 18,
                },
                iconContainer: {
                  height: 40,
                  top: 15,
                  right: 15,
                },
              }}
              items={contracts.map(contract => ({
                label: createSessionLabel(contract),
                value: contract.id,
              }))}>
              <PickerTrigger label={contract.label} />
            </RNPickerSelect>
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
    </Container>
  );
};

WorkSessionNew.propTypes = {
  lastWorkSession: PropTypes.object,
  contracts: PropTypes.array,
  closeWorkSession: PropTypes.func,
  createWorkSession: PropTypes.func,
  onWorkSessionCreate: PropTypes.func,
  resetPageCount: PropTypes.func,
};

WorkSessionNew.defaultProps = {
  lastWorkSession: null,
  contracts: [],
  closeWorkSession: () => {},
  createWorkSession: () => {},
  onWorkSessionCreate: () => {},
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

export default graphql(createWorkSession, {
  props: ({mutate}) => ({
    createWorkSession: (title, description, url, date, minutes, ContractId) =>
      mutate({
        variables: {title, description, url, date, minutes, ContractId},
      }),
  }),
})(WorkSessionNew);
