import React, {useState} from 'react';
import styled from 'styled-components';
import {SafeAreaView, ScrollView} from 'react-native';
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
  } = props;
  const [page, setPage] = useState(0);
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
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
          zIndex: 1,
        }}>
        <ScrollView
          contentContainerStyle={{paddingBottom: 90}}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              setPage(page + 1);
            }
          }}
          scrollEventThrottle={400}>
          {workSessions.map((item, index) => (
            <WorkSession
              key={index}
              title={item.title}
              date={item.date}
              deviceWidth={deviceWidth}
              showLog={showLog}
              index={index}
              contracts={contracts}
            />
          ))}
        </ScrollView>
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
};

WorkSessions.defaultProps = {
  deviceHeight: 0,
  deviceWidth: 0,
  setSelectedWorkSession: () => {},
  workSessions: [],
  contracts: [],
};

const Container = styled.View`
  padding: 10px 10px 0px 10px;
  height: 100%;
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
