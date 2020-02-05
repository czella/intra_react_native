import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {Switch as NativeSwitch} from 'react-native';

const Switch = props => {
  const {label, labelStyle, value, setValue} = props;
  return (
    <Container>
      <SwitchContainer>
        <NativeSwitch
          trackColor={{true: 'rgba(101, 31, 255, 0.5)', false: 'grey'}}
          thumbColor={value ? 'rgba(101, 31, 255, 1)' : 'lightgrey'}
          onValueChange={setValue}
          value={value}
        />
      </SwitchContainer>
      <Label numberOfLines={1} style={labelStyle}>
        {label}
      </Label>
    </Container>
  );
};

Switch.propTypes = {
  label: PropTypes.string,
  labelStyle: PropTypes.object,
  value: PropTypes.bool,
  setValue: PropTypes.func,
};

Switch.defaultProps = {
  label: '',
  labelStyle: {},
  value: false,
  setValue: () => {},
};

const Container = styled.View`
  height: 40px;
  flex-direction: row;
  justify-content: space-between;
`;

const SwitchContainer = styled.View`
  margin-left: -10px;
  flex-direction: row;
  align-items: center;
  padding-left: 0px;
  justify-content: flex-start;
`;

const Label = styled.Text`
  margin-left: 10px;
  line-height: 40px;
  flex: 1;
`;

export default Switch;
