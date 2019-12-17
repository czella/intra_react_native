import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {TouchableOpacity, ScrollView, Dimensions} from 'react-native';

const {height} = Dimensions.get('window');

const WorkSession = props => {
  const {title, date} = props;
  return (
    <Container>
      <Date>{date}</Date>
      <Title>{title} hello</Title>
    </Container>
  );
};

WorkSession.propTypes = {
  title: PropTypes.string,
  date: PropTypes.string,
};

WorkSession.defaultProps = {
  title: '',
  date: '',
};

const Container = styled.View`
  height: 60px;
  border-bottom-width: 1px;
  border-bottom-color: lightgrey;
  margin: 0;
  display: flex;
  flex-direction: row;
`;

const Title = styled.Text`
  line-height: 60px;
`;

const Date = styled.Text`
  line-height: 60px;
   width: 80px;
  background: red;
  margin-right: 20px;
`;

export default WorkSession;
