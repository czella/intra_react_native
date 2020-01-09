import React, {useState} from 'react';
import styled from 'styled-components';
import { SafeAreaView, ScrollView, FlatList, ActivityIndicator } from 'react-native';
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
  const [page, setPage] = useState(0);
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
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
        <Title
          style={{
            width: deviceWidth - 120,
          }}>
          Title
        </Title>
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
              title={item.title}
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

const LoaderContainer = styled.View`

`;

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

const Title = styled.Text`
  font-size: 18px;
  color: grey;
  line-height: 40px;
  padding-left: 20px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkSessions);
