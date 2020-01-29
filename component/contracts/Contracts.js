import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {FlatList, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import RNPickerSelect from 'react-native-picker-select';
import Contract from './Contract';
import {setSelectedContract} from '../../store/actions';
import PickerTrigger from '../PickerTrigger';
import {find} from 'lodash';

const mapDispatchToProps = dispatch => ({
  setSelectedContract: contract =>
    dispatch(setSelectedContract(contract)),
});

const properties = [
  {label: 'Position', value: 'position'},
  {label: 'Username', value: 'username'},
  {label: 'Price', value: 'price'},
];
const Contracts = props => {
  const {
    setSelectedContract,
    onExpandContract,
    contracts,
    fetchMoreContracts,
    totalCount,
    currencies,
  } = props;
  const [displayedProperty, setDisplayedProperty] = useState(properties[0]);
  const renderFooter = () => {
    if (contracts.length < totalCount) {
      return (
        <LoaderContainer style={{paddingVertical: 45}}>
          <ActivityIndicator size="large" color="#7423B5" />
        </LoaderContainer>
      );
    }
    return null;
  };
  const showLog = index => {
    setSelectedContract(contracts[index]);
    onExpandContract();
  };
  const getDisplayedProp = item => {
    switch (displayedProperty.label) {
      case 'Position':
        return item.position;
      case 'Username':
        return item.User.username;
      case 'Price':
        return `${item.price} ${find(currencies, {id: item.CurrencyId}).name} / hour`;
      default:
        return item.position;
    }
  };
  return (
    <Container>
      <TableHeader>
        <Project>Project</Project>
        <PropertyPickerContainer>
          <RNPickerSelect
            onValueChange={(itemValue, index) => {
              setDisplayedProperty(properties[index]);
            }}
            value={displayedProperty.value}
            placeholder={{}}
            InputAccessoryView={() => {
              return null;
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => null}
            style={{
              inputAndroid: {
                height: 40,
                padding: 0,
                fontSize: 18,
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
            items={properties}>
            <PickerTrigger
              label={displayedProperty.label}
              labelStyle={{fontSize: 18}}
            />
          </RNPickerSelect>
        </PropertyPickerContainer>
      </TableHeader>
      <FlatList
        data={contracts}
        renderItem={({item, index}) => (
          <Contract project={item.Project.name} displayedProperty={getDisplayedProp(item)} index={index} showLog={showLog}/>
        )}
        keyExtractor={item => item.id}
        ListFooterComponent={renderFooter}
        onEndReached={fetchMoreContracts}
        onEndReachedThreshold={0.5}
        initialNumToRender={20}
      />
    </Container>
  );
};

Contracts.propTypes = {
  setSelectedContract: PropTypes.func,
  onExpandContract: PropTypes.func,
  contracts: PropTypes.array,
  currencies: PropTypes.array,
  fetchMoreContracts: PropTypes.func,
  totalCount: PropTypes.number,
};

Contracts.defaultProps = {
  setSelectedContract: () => {},
  onExpandContract: () => {},
  contracts: [],
  currencies: [],
  fetchMoreContracts: () => {},
  totalCount: 0,
};

const Container = styled.View`
  padding: 10px 10px 0px 10px;
  flex: 1;
`;

const LoaderContainer = styled.View``;

const TableHeader = styled.View`
  display: flex;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: grey;
  height: 40px;
`;

const Project = styled.Text`
  flex: 0.8;
  font-size: 18px;
  color: grey;
  line-height: 40px;
`;

const PropertyPickerContainer = styled.View`
  width: 160px;
  flex: 1;
`;

export default connect(
  null,
  mapDispatchToProps,
)(Contracts);
