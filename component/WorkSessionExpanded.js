import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {TouchableOpacity} from 'react-native';
import {BackArrowIcon, SaveIcon} from '../svg/Icons';

const WorkSessionExpanded = props => {
  const {navigation} = props;
  const workSession = navigation.getParam('workSession', {title: 'teyxt'});
  const handleSave = () => {
    navigation.navigate('WorkSessions');
  };
  return (
    <Container>
      <NavigationButtonsContainer>
        <TouchableOpacity onPress={() => navigation.navigate('WorkSessions')}>
          <BackArrowIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <SaveIcon />
        </TouchableOpacity>
      </NavigationButtonsContainer>
      <InputContainer style={{
        borderBottomWidth: '1px',
        borderBottomColor: 'lightgrey',
      }}>
        <InputLabel>Title</InputLabel>
        <TextInput  placeholder={workSession.title} />
      </InputContainer >
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

const InputContainer = styled.View``;

const InputLabel = styled.Text``;

const NavigationButtonsContainer = styled.View`
  height: 50px;
  background: #651fff;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
  justify-content: space-between;
`;

const IconContainer = styled.View`
  height: 60px;
  flex-direction: row;
  align-items: center;
`;

const TextInput = styled.TextInput`
  line-height: 60px;
`;

const Date = styled.Text`
  line-height: 60px;
  width: 80px;
  margin-right: 20px;
`;

export default WorkSessionExpanded;
