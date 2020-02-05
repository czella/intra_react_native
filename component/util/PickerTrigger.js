import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {SmallDownArrowIcon} from '../../svg/Icons';

const PickerTrigger = props => {
  const {label, labelStyle} = props;
  return (
    <Container>
      <Label numberOfLines={1} style={labelStyle}>{label}</Label>
      <IconContainer>
        <SmallDownArrowIcon />
      </IconContainer>
    </Container>
  );
};

PickerTrigger.propTypes = {
  label: PropTypes.string,
  labelStyle: PropTypes.object,
};

PickerTrigger.defaultProps = {
  label: '',
  labelStyle: {},
};

const Container = styled.View`
  height: 40px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

const IconContainer = styled.View`
  height: 40px;
  width: 40px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Label = styled.Text`
  line-height: 40px;
  flex: 1;
`;

export default PickerTrigger;
