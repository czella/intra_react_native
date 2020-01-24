import React, {useState} from 'react';
import styled from 'styled-components';
import {FlatList, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import RNPickerSelect from 'react-native-picker-select';
import WorkSession from './WorkSession';
import {setSelectedWorkSession} from '../store/actions';
import PickerTrigger from './PickerTrigger';

const mapStateToProps = state => ({
  deviceWidth: state.nonCachedReducer.deviceWidth,
});

const mapDispatchToProps = dispatch => ({
  setSelectedWorkSession: workSession =>
    dispatch(setSelectedWorkSession(workSession)),
});

const properties = [
  {label: 'Title', value: 'title'},
  {label: 'Description', value: 'description'},
  {label: 'Url', value: 'url'},
];

const WorkSessions = props => {
  const {
    deviceWidth,
    setSelectedWorkSession,
    onExpandWorkSession,
    workSessions,
    contracts,
    fetchMoreSessions,
    totalCount,
    users,
    selectedUser,
    setSelectedUser,
  } = props;
  const [displayedProperty, setDisplayedProperty] = useState(properties[0]);
  const renderFooter = () => {
    if (workSessions.length < totalCount) {
      return (
        <LoaderContainer style={{paddingVertical: 45}}>
          <ActivityIndicator size="large" color="#7423B5" />
        </LoaderContainer>
      );
    }
    return null;
  };
  const showLog = index => {
    setSelectedWorkSession({...workSessions[index], contracts});
    onExpandWorkSession();
  };
  return (
    <Container>
      <UserSelectContainer>
        <UserLabel>Selected user:</UserLabel>
        <UserPickerContainer>
          <RNPickerSelect
            onValueChange={(itemValue, index) => {
              setSelectedUser(users[index]);
            }}
            value={selectedUser.value}
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
            items={users}>
            <PickerTrigger
              label={selectedUser.label}
              labelStyle={{fontSize: 18}}
            />
          </RNPickerSelect>
        </UserPickerContainer>
      </UserSelectContainer>
      <TableHeader>
        <Date>Date</Date>
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
        data={workSessions}
        renderItem={({item, index}) => (
          <WorkSession
            key={item.id}
            displayedProperty={item[displayedProperty.value]}
            date={item.date}
            deviceWidth={deviceWidth}
            showLog={showLog}
            contracts={contracts}
            index={index}
          />
        )}
        keyExtractor={item => item.id}
        ListFooterComponent={renderFooter}
        onEndReached={fetchMoreSessions}
        onEndReachedThreshold={0.5}
        initialNumToRender={20}
      />
    </Container>
  );
};

WorkSessions.propTypes = {
  deviceHeight: PropTypes.number,
  deviceWidth: PropTypes.number,
  setSelectedWorkSession: PropTypes.func,
  workSessions: PropTypes.array,
  contracts: PropTypes.array,
  fetchMoreSessions: PropTypes.func,
  totalCount: PropTypes.number,
  users: PropTypes.array,
  selectedUser: PropTypes.object,
  setSelectedUser: PropTypes.func,
};

WorkSessions.defaultProps = {
  deviceHeight: 0,
  deviceWidth: 0,
  setSelectedWorkSession: () => {},
  workSessions: [],
  contracts: [],
  fetchMoreSessions: () => {},
  totalCount: 0,
  users: [],
  selectedUser: {},
  setSelectedUser: () => {},
};

const Container = styled.View`
  padding: 10px 10px 0px 10px;
  flex: 1;
`;

const LoaderContainer = styled.View``;

const UserSelectContainer = styled.View`
  flex-direction: row;
  border-bottom-width: 3px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom-color: #eeeeee;
`;

const UserLabel = styled.Text`
  flex: 1;
  font-size: 18px;
  color: grey;
  line-height: 40px;
`;

const UserPickerContainer = styled.View`
  flex: 2;
  margin: auto;
`;

const TableHeader = styled.View`
  display: flex;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: grey;
  height: 40px;
`;

const Date = styled.Text`
  width: 80px;
  font-size: 18px;
  color: grey;
  line-height: 40px;
`;

const PropertyPickerContainer = styled.View`
  width: 160px;
  flex: 1;
  padding-left: 20px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkSessions);
