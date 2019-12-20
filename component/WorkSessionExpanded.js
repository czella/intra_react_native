import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Picker,
} from 'react-native';
import {BackArrowIcon, SaveIcon} from '../svg/Icons';
import InputElement from './InputElement';
import DateTimePicker from '@react-native-community/datetimepicker';
import {connect} from 'react-redux';

const dateToString = date => {
  console.log(date, 'converting date...........................................................');
  if (date) {

    return date.toISOString().split('T')[0];
  }
  return '';
};

const mapStateToProps = state => ({
  workSession: state.nonCachedReducer.selectedWorkSession,
});

const WorkSessionExpanded = props => {
  const {workSession, closeWorkSession} = props;
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [url, setUrl] = useState(null);
  const [contract, setContract] = useState('js');
  const [showDatePicker, setShowDatePicker] = useState(false);
  console.log(workSession);
  const [date, setDate] = useState(
    null
  );
  const handleSave = () => {};
  const handleDate = date => {
    setShowDatePicker(false);
    if (date) {
      setDate(date);
    }
  };
  useEffect(() => {
    if (workSession) {

      setDate(new Date(workSession.date ? workSession.date : null));
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
      <Form>
        <InputElement
          editable={false}
          placeholder={workSession.id}
          label="Id"
          onChange={() => {}}
        />
        <InputElement
          placeholder={workSession.title}
          label="Title"
          onChange={() => {}}
        />
        <InputElement
          placeholder={workSession.description}
          label="Description"
          onChange={() => {}}
        />
        <InputElement
          placeholder={workSession.url}
          label="Url"
          onChange={() => {}}
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
          <InputLabel style={{color: 'lightgrey'}}>Contract</InputLabel>
          <Picker
            selectedValue={contract}
            style={{height: 40, width: '100%'}}
            onValueChange={(itemValue, itemIndex) => {
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
        </InputContainer>
        <InputElement
          placeholder={`${workSession.minutes}`}
          label="Minutes"
          onChange={() => {}}
        />
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
    </Container>
  );
};

WorkSessionExpanded.propTypes = {
  workSession: PropTypes.object,
  closeWorkSession: PropTypes.func,
};

WorkSessionExpanded.defaultProps = {
  workSession: null,
  closeWorkSession: () => {},
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

const InputContainer = styled.View`
  margin-bottom: 10px;
`;

const InputLabel = styled.Text``;

const TextInput = styled.TextInput`
  line-height: 60px;
`;

export default connect(
  mapStateToProps,
  null,
)(WorkSessionExpanded);
