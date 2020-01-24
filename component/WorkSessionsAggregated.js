import React from 'react';
import styled from 'styled-components';
import {useQuery} from '@apollo/react-hooks';
import {Table, Row, Rows} from 'react-native-table-component';
import {aggregatedWorkSessions} from '../queries/queries';
import {ActivityIndicator} from 'react-native';

const WorkSessionsAggregated = props => {
  const {loading, data, error, refetch} = useQuery(aggregatedWorkSessions, {
    variables: {
      startDate: '2020-01-01',
      endDate: '2020-01-31',
    },
    notifyOnNetworkStatusChange: true,
  });
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
      userAggregate.CurrencyName,
    ]);
  }
  const tableHead = ['User', 'Hours', 'Price', 'Currency'];
  return (
    <Container>
      <Text>Aggregated stuff</Text>
      <Table>
        <Row
          data={tableHead}
          style={{
            paddingLeft: 10,
            height: 50,
            borderTopColor: 'lightgrey',
            borderTopWidth: 1,
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

WorkSessionsAggregated.propTypes = {};

WorkSessionsAggregated.defaultProps = {};

const Container = styled.View`
  margin: 10px;
  border: 1px solid lightgrey;
  border-radius: 5px;
`;

const LoaderContainer = styled.View``;

const Text = styled.Text`
  font-size: 20px;
`;

export default WorkSessionsAggregated;
