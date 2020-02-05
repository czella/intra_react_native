import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import styled from 'styled-components';
import PickerTrigger from './PickerTrigger';
import PropTypes from 'prop-types';

const Picker = props => {
  const {
    title,
    onValueChange,
    value,
    items,
    label,
    labelStyle,
    editable,
  } = props;
  return (
    <Container>
      {title && <InputLabel style={{color: 'lightgrey'}}>{title}</InputLabel>}
      <RNPickerSelect
        disabled={!editable}
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
        <PickerTrigger
          label={label}
          labelStyle={{
            paddingLeft: 5,
            color: !editable ? 'grey' : 'black',
            ...labelStyle,
          }}
        />
      </RNPickerSelect>
    </Container>
  );
};

Picker.propTypes = {
  title: PropTypes.string,
  onValueChange: PropTypes.func,
  value: PropTypes.any,
  items: PropTypes.array,
  label: PropTypes.string,
  labelStyle: PropTypes.object,
  editable: PropTypes.bool,
};

Picker.defaultProps = {
  title: null,
  onValueChange: () => {},
  value: null,
  items: [],
  label: '',
  labelStyle: null,
  editable: true,
};

const Container = styled.View``;

const InputLabel = styled.Text``;

export default Picker;
