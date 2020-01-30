import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styled from 'styled-components';
import {TouchableOpacity} from 'react-native';
import {SmallRightArrowIcon} from '../../svg/Icons';

const Contract = props => {
  const {project, displayedProperty, showLog, index} = props;
  return (
    <TouchableOpacity onPress={() => showLog(index)}>
      <Container>
        <Project numberOfLines={1}>{project}</Project>
        <DisplayedProperty numberOfLines={1}>
          {displayedProperty}
        </DisplayedProperty>
        <IconContainer>
          <SmallRightArrowIcon />
        </IconContainer>
      </Container>
    </TouchableOpacity>
  );
};

Contract.propTypes = {
  project: PropTypes.string,
  displayedProperty: PropTypes.string,
  showLog: PropTypes.func,
  index: PropTypes.number,
};

Contract.defaultProps = {
  project: '',
  displayedProperty: '',
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
  flex: 1;
  padding-left: 15px;
`;

const Project = styled.Text`
  line-height: 60px;
  flex: 0.8;
`;

export default Contract;
