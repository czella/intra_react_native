import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {TouchableOpacity} from 'react-native';
import {BackArrowIcon} from '../svg/Icons';

const WorkSessionExpanded = props => {
  const {navigation} = props;
  const workSession = navigation.getParam('workSession', {title: 'teyxt'});
  return (
    <Container>
      <BackButtonContainer>
        <TouchableOpacity onPress={() => navigation.navigate('WorkSessions')}>
          <BackArrowIcon />
        </TouchableOpacity>
      </BackButtonContainer>
      <Title>{workSession.title}</Title>
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

const BackButtonContainer = styled.View`
  height: 50px;
  background: #651fff;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
`;

const IconContainer = styled.View`
  height: 60px;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.Text`
  line-height: 60px;
`;

const Date = styled.Text`
  line-height: 60px;
  width: 80px;
  margin-right: 20px;
`;

export default WorkSessionExpanded;
