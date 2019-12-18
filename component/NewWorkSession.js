import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {TouchableOpacity} from 'react-native';
import {BackArrowIcon} from '../svg/Icons';

const NewWorkSession = props => {
  const {navigation} = props;
  return (
    <Container>
      <BackButtonContainer>
        <TouchableOpacity onPress={() => navigation.navigate('WorkSessions')}>
          <BackArrowIcon />
        </TouchableOpacity>
      </BackButtonContainer>
      <Title>New work session</Title>
    </Container>
  );
};

NewWorkSession.propTypes = {
  navigation: PropTypes.object,
};

NewWorkSession.defaultProps = {
  navigation: {},
};

const Container = styled.View``;

const Title = styled.Text`
  line-height: 60px;
`;

const BackButtonContainer = styled.View`
  height: 50px;
  background: #651fff;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
`;

export default NewWorkSession;
