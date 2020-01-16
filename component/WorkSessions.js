import React, {useState} from 'react';
import styled from 'styled-components';
import {FlatList, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import RNPickerSelect from 'react-native-picker-select';
import WorkSession from './WorkSession';
import {setSelectedWorkSession} from '../store/actions';
import {SmallDownArrowIcon} from '../svg/Icons';

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
  } = props;
  const [displayedProperty, setDisplayedProperty] = useState('title');
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
      <TableHeader>
        <Date>Date</Date>
        <PickerContainer>
          <RNPickerSelect
            onValueChange={itemValue => {
              setDisplayedProperty(itemValue);
            }}
            value={displayedProperty}
            placeholder={{}}
            InputAccessoryView={() => {
              return null;
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => <SmallDownArrowIcon />}
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
            items={properties}
          />
        </PickerContainer>
      </TableHeader>
      <FlatList
        data={workSessions}
        renderItem={({item, index}) => (
          <WorkSession
            key={item.id}
            displayedProperty={item[displayedProperty]}
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
};

WorkSessions.defaultProps = {
  deviceHeight: 0,
  deviceWidth: 0,
  setSelectedWorkSession: () => {},
  workSessions: [],
  contracts: [],
  fetchMoreSessions: () => {},
  totalCount: 0,
};

const Container = styled.View`
  padding: 10px 10px 0px 10px;
  height: 100%;
`;

const LoaderContainer = styled.View``;

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

const PickerContainer = styled.View`
  width: 160px;
  padding-left: 20px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkSessions);
