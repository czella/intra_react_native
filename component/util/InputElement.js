import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styled from 'styled-components';

export const EMAIL_KEYBOARD = 'email-address';
export const NUMERIC_KEYBOARD = 'numeric';

const InputElement = props => {
  const {
    editable,
    placeholder,
    label,
    onChange,
    value,
    isPassword,
    keyBoardType,
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
        keyboardType={keyBoardType || 'default'}
        secureTextEntry={isPassword}
        multiline={!isPassword}
        editable={editable}
        onChangeText={input => onChange(input)}
        placeholder={placeholder}
        onFocus={() => setColor('blue')}
        onBlur={() => setColor('lightgrey')}
        value={value}
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
  isPassword: PropTypes.bool,
  keyBoardType: PropTypes.string,
};

InputElement.defaultProps = {
  editable: true,
  placeholder: '',
  label: '',
  onChange: () => {},
  value: null,
  isPassword: false,
  keyBoardType: null,
};

const InputContainer = styled.View`
  margin-bottom: 10px;
`;

const InputLabel = styled.Text``;

const TextInput = styled.TextInput``;

export default InputElement;
