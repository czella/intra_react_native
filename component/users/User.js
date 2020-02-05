import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {TouchableOpacity} from 'react-native';
import {SmallRightArrowIcon} from '../../svg/Icons';

const User = props => {
  const {name, displayedProperty, showUser, index} = props;
  return (
    <TouchableOpacity onPress={() => showUser(index)}>
      <Container>
        <Name numberOfLines={1}>{name}</Name>
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

User.propTypes = {
  name: PropTypes.string,
  displayedProperty: PropTypes.string,
  showUser: PropTypes.func,
  index: PropTypes.number,
};

User.defaultProps = {
  name: '',
  displayedProperty: '',
  showUser: () => {},
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

const Name = styled.Text`
  line-height: 60px;
  flex: 0.8;
`;

export default User;
