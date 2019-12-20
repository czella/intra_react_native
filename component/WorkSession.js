import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {TouchableOpacity} from 'react-native';
import {SmallRightArrowIcon} from '../svg/Icons';

const WorkSession = props => {
  const {title, date, showLog, index} = props;
  return (
    <TouchableOpacity onPress={() => showLog(index)}>
      <Container>
        <Date>{date}</Date>
        <Title numberOfLines={1}>{title}</Title>
        <IconContainer>
          <SmallRightArrowIcon />
        </IconContainer>
      </Container>
    </TouchableOpacity>
  );
};

WorkSession.propTypes = {
  title: PropTypes.string,
  date: PropTypes.string,
  showLog: PropTypes.func,
  index: PropTypes.number,
};

WorkSession.defaultProps = {
  title: '',
  date: '',
  showLog: () => {},
  index: 0,
};

const Container = styled.View`
  height: 60px;
  border-bottom-width: 1px;
  border-bottom-color: lightgrey;
  margin: 0;
  display: flex;
  flex-direction: row;
  z-index: 10;
  width: 100%;
`;

const IconContainer = styled.View`
  height: 60px;
  flex-direction: row;
  align-items: center;
  width: 5%;
`;

const Title = styled.Text`
  line-height: 60px;
  width: 75%;
  padding-left: 20px;
`;

const Date = styled.Text`
  line-height: 60px;
  width: 20%;
`;

export default WorkSession;
