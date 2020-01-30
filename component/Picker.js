import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import styled from 'styled-components';
import PickerTrigger from './PickerTrigger';
import PropTypes from 'prop-types';

const Picker = props => {
  const {
    hasTitle,
    title,
    onValueChange,
    value,
    items,
    label,
    labelStyle,
  } = props;
  return (
    <Container>
      {hasTitle && (
        <InputLabel style={{color: 'lightgrey'}}>{title}</InputLabel>
      )}
      <RNPickerSelect
        onValueChange={(itemValue, index) => onValueChange(itemValue, index)}
        value={value}
        placeholder={{}}
        InputAccessoryView={() => {
          return null;
        }}
        useNativeAndroidPickerStyle={false}
        Icon={() => null}
        style={{
          inputAndroidContainer: {
            textAlign: 'left',
          },
          inputAndroid: {
            height: 40,
            padding: 0,
            fontSize: 15,
            width: '100%',
          },
          inputIOS: {
            height: 40,
            fontSize: 18,
          },
          iconContainer: {
            height: 40,
            top: 15,
            right: 15,
          },
        }}
        items={items}>
        <PickerTrigger label={label} labelStyle={labelStyle} />
      </RNPickerSelect>
    </Container>
  );
};

Picker.propTypes = {
  hasTitle: PropTypes.bool,
  title: PropTypes.string,
  onValueChange: PropTypes.func,
  value: PropTypes.any,
  items: PropTypes.array,
  label: PropTypes.string,
  labelStyle: PropTypes.object,
};

Picker.defaultProps = {
  hasTitle: false,
  title: '',
  onValueChange: () => {},
  value: null,
  items: [],
  label: '',
  labelStyle: null,
};

const Container = styled.View`
  flex: 1;
`;

const InputLabel = styled.Text``;

export default Picker;
