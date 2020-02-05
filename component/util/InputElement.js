import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styled from 'styled-components';

const InputElement = props => {
  const {
    editable,
    placeholder,
    label,
    onChange,
    value,
    numeric,
    isPassword,
  } = props;
  const [color, setColor] = useState('lightgrey');
  return (
    <InputContainer
      style={{
        borderBottomWidth: editable ? 1 : 0,
        borderRadius: 1,
        borderBottomColor: color,
        color: color,
      }}>
      <InputLabel style={{color: color}}>{label}</InputLabel>
      <TextInput
        secureTextEntry={isPassword}
        multiline={!isPassword}
        editable={editable}
        onChangeText={input => onChange(input)}
        placeholder={placeholder}
        onFocus={() => setColor('blue')}
        onBlur={() => setColor('lightgrey')}
        value={value}
        keyboardType={numeric ? 'numeric' : 'default'}
      />
    </InputContainer>
  );
};

InputElement.propTypes = {
  editable: PropTypes.bool,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  numeric: PropTypes.bool,
  isPassword: PropTypes.bool,
};

InputElement.defaultProps = {
  editable: true,
  placeholder: '',
  label: '',
  onChange: () => {},
  value: null,
  numeric: false,
  isPassword: false,
};

const InputContainer = styled.View`
  margin-bottom: 10px;
`;

const InputLabel = styled.Text``;

const TextInput = styled.TextInput``;

export default InputElement;