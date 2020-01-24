import React, { useEffect } from 'react';
import styled from 'styled-components';
import {useQuery} from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import {Table, Row, Rows} from 'react-native-table-component';
import {ActivityIndicator} from 'react-native';
import {aggregatedWorkSessions} from '../queries/queries';
import {dateToMysqlString} from '../utils/DateHelpers';
import EventPool from '../utils/EventPool';

const WorkSessionsAggregated = props => {
  const {selectedMonth} = props;
  const {loading, data, error, refetch} = useQuery(aggregatedWorkSessions, {
    variables: {
      startDate: dateToMysqlString(
        new Date(selectedMonth.year, selectedMonth.monthIndex, 1),
      ),
      endDate: dateToMysqlString(
        new Date(selectedMonth.year, selectedMonth.monthIndex + 1, 1),
      ),
    },
    notifyOnNetworkStatusChange: true,
  });
  useEffect(() => {
    const fetchSessions = () => refetch();
    EventPool.addListener('refreshWorkSessions', fetchSessions);
    return () => EventPool.removeListener('refreshWorkSessions', fetchSessions);
  }, [refetch]);
  if (error) {
    return <Text>`Error! ${error}`</Text>;
  }
  if (loading) {
    return (
      <LoaderContainer>
        <ActivityIndicator size="large" color="#7423B5" />
      </LoaderContainer>
    );
  }
  let tableData = [];
  if (data) {
    tableData = data.allStatsMonthlyUserAggregates.map(userAggregate => [
      userAggregate.username,
      Math.round((userAggregate.minutes / 60 + Number.EPSILON) * 100) / 100,
      Math.round((userAggregate.price) * 100) / 100,
      userAggregate.CurrencyName,
    ]);
  }
  const tableHead = ['User', 'Hours', 'Price', 'Currency'];
  return (
    <Container>
      <Table>
        <Row
          data={tableHead}
          style={{
            paddingLeft: 10,
            height: 50,
          }}
          flexArr={[1.5, 1, 1, 1]}
          textStyle={{
            color: 'grey',
          }}
        />
        <Rows
          data={tableData}
          flexArr={[1.5, 1, 1, 1]}
          style={{
            paddingLeft: 10,
            height: 40,
            borderTopColor: 'lightgrey',
            borderTopWidth: 1,
          }}
        />
      </Table>
    </Container>
  );
};

WorkSessionsAggregated.propTypes = {
  selectedMonth: PropTypes.object,
};

WorkSessionsAggregated.defaultProps = {
  selectedMonth: {},
};

const Container = styled.View`
  margin: 10px;
  border: 1px solid lightgrey;
  border-radius: 5px;
`;

const LoaderContainer = styled.View``;

const Text = styled.Text``;

export default WorkSessionsAggregated;
