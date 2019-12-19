import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styled from 'styled-components';
import {TouchableOpacity} from 'react-native';
import {BackArrowIcon, SaveIcon} from '../svg/Icons';
import InputElement from './InputElement';
import DateTimePicker from '@react-native-community/datetimepicker';

const dateToString = date => {
  const compensateUTCConversion = new Date(
    date.getTime() + date.getTimezoneOffset() * 60000,
  );

  return compensateUTCConversion.toISOString().split('T')[0];
};

const WorkSessionExpanded = props => {
  const {navigation} = props;
  const workSession = navigation.getParam('workSession', {});
  const [title, setTitle] = useState(workSession.title);
  const [description, setDescription] = useState(workSession.description);
  const [url, setUrl] = useState(workSession.url);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date(workSession.date));
  const handleSave = () => {
    navigation.navigate('WorkSessions');
  };
  const handleDate = date => {
    setShowDatePicker(false);
    if (date) {
      setDate(date);
    }
  };
  return (
    <Container>
      <NavigationButtonsContainer>
        <TouchableOpacity onPress={() => navigation.navigate('WorkSessions')}>
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
              console.log('this runs');
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
      <TouchableOpacity onPress={() => {console.log('hide kexboard')}}>

        <Test/>
      </TouchableOpacity>

      {console.log(date, 'this is the date')}
      {console.log(showDatePicker, 'this is the bool')}
    </Container>
  );
};

WorkSessionExpanded.propTypes = {
  navigation: PropTypes.object,
};

WorkSessionExpanded.defaultProps = {
  navigation: {},
};

const Container = styled.View``;
const Test = styled.View`
  height: 100%;
  background: red;
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

export default WorkSessionExpanded;
