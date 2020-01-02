import React, {useState} from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import {ActivityIndicator, SafeAreaView, ScrollView} from 'react-native';
import WorkSession from './WorkSession';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setSelectedWorkSession} from '../store/actions';

const query = gql`
  query allWorkSessions(
    $page: Int
    $perPage: Int
    $sortField: String
    $sortOrder: String
    $filter: WorkSessionFilter
  ) {
    items: allWorkSessions(
      page: $page
      perPage: $perPage
      sortField: $sortField
      sortOrder: $sortOrder
      filter: $filter
    ) {
      id
      title
      description
      url
      date
      minutes
      ContractId
      __typename
    }
    total: _allWorkSessionsMeta(
      page: $page
      perPage: $perPage
      filter: $filter
    ) {
      count
      __typename
    }
    contracts: allContracts {
      id
      position
      Project {
        name
      }
      User {
        username
      }
    }
  }
`;

const mapStateToProps = state => ({
  deviceWidth: state.nonCachedReducer.deviceWidth,
  deviceHeight: state.nonCachedReducer.deviceHeight,
});

const mapDispatchToProps = dispatch => ({
  setSelectedWorkSession: workSession =>
    dispatch(setSelectedWorkSession(workSession)),
});

const workSessions = [];
let contracts = [];

const WorkSessions = props => {
  const {deviceWidth, setSelectedWorkSession, onExpandWorkSession} = props;
  const [page, setPage] = useState(0);

  const {loading, error, data} = useQuery(query, {
    variables: {
      page: page,
      filter: {},
      perPage: 20,
      sortField: 'id',
      sortOrder: 'DESC',
    },
  });
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  if (loading) {
    return (
      <LoaderContainer
        style={{
          width: deviceWidth - 20,
        }}>
        <ActivityIndicator size="large" color="#7423B5" />
      </LoaderContainer>
    );
  }
  if (error) {
    return `Error! ${error}`;
  }
  workSessions.push(...data.items);
  contracts = data.contracts;
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
};

WorkSessions.defaultProps = {
  deviceHeight: 0,
  deviceWidth: 0,
  setSelectedWorkSession: () => {},
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

const LoaderContainer = styled.View`
  margin: 10px;
  padding-top: 120px;
  height: 250;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkSessions);
