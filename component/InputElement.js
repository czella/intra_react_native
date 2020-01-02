import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styled from 'styled-components';

const InputElement = props => {
  const {editable, placeholder, label, onChange} = props;
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
        multiline={true}
        editable={editable}
        onChangeText={input => onChange(input)}
        placeholder={placeholder}
        onFocus={() => setColor('blue')}
        onBlur={() => setColor('lightgrey')}
      />
    </InputContainer>
  );
};

InputElement.propTypes = {
  editable: PropTypes.bool,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

InputElement.defaultProps = {
  editable: true,
  placeholder: '',
  label: '',
  onChange: () => {},
};

const InputContainer = styled.View`
  margin-bottom: 10px;
`;

const InputLabel = styled.Text``;

const TextInput = styled.TextInput`
  line-height: 60px;
`;

export default InputElement;
