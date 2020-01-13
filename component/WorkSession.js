import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styled from 'styled-components';
import {TouchableOpacity} from 'react-native';
import {SmallRightArrowIcon} from '../svg/Icons';

const WorkSession = props => {
  const {displayedProperty, date, showLog, index} = props;
  const [displayedPropWidth, setDisplayedPropWidth] = useState(0);
  return (
    <TouchableOpacity onPress={() => showLog(index)}>
      <Container
        onLayout={event =>
          setDisplayedPropWidth(event.nativeEvent.layout.width - 90)
        }>
        <Date>{date}</Date>
        <DisplayedProperty
          style={{
            width: displayedPropWidth,
          }}
          numberOfLines={1}>
          {displayedProperty}
        </DisplayedProperty>
        <IconContainer>
          <SmallRightArrowIcon />
        </IconContainer>
      </Container>
    </TouchableOpacity>
  );
};

WorkSession.propTypes = {
  displayedProperty: PropTypes.string,
  date: PropTypes.string,
  showLog: PropTypes.func,
  index: PropTypes.number,
};

WorkSession.defaultProps = {
  displayedProperty: '',
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
  width: 15px;
`;

const DisplayedProperty = styled.Text`
  line-height: 60px;
  padding-left: 20px;
  width: 75px;
`;

const Date = styled.Text`
  line-height: 60px;
  width: 75px;
`;

export default WorkSession;
