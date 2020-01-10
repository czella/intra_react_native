import React, {useState} from 'react';
import styled from 'styled-components';
import {SafeAreaView, FlatList, ActivityIndicator, Picker} from 'react-native';
import WorkSession from './WorkSession';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setSelectedWorkSession} from '../store/actions';

const mapStateToProps = state => ({
  deviceWidth: state.nonCachedReducer.deviceWidth,
});

const mapDispatchToProps = dispatch => ({
  setSelectedWorkSession: workSession =>
    dispatch(setSelectedWorkSession(workSession)),
});

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
          <Picker
            selectedValue={displayedProperty}
            style={{height: 40, width: '100%'}}
            onValueChange={itemValue => {
              setDisplayedProperty(itemValue);
            }}>
            <Picker.Item label="Title" value="title" key="title" />
            <Picker.Item
              label="Description"
              value="description"
              key="description"
            />
            <Picker.Item label="Url" value="url" key="url" />
          </Picker>
        </PickerContainer>
      </TableHeader>
      <SafeAreaView
        style={{
          height: '100%',
          flex: 1,
          zIndex: 1,
        }}>
        <FlatList
          data={workSessions}
          renderItem={({item, index}) => (
            <WorkSession
              key={item.id}
              title={item[displayedProperty]}
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
      </SafeAreaView>
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
  width: 20%;
  font-size: 18px;
  color: grey;
  line-height: 40px;
`;

const PickerContainer = styled.View`
  width: 80%;
  padding-left: 10px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkSessions);
