import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { aggregatedWorkSessions } from '../queries/queries';

const WorkSessionsAggregated = props => {
  // const {loading, data, error, refetch} = useQuery(aggregatedWorkSessions, {
  //
  //   variables: {
  //     startDate: dateToMysqlString(startDate),
  //     endDate: dateToMysqlString(endDate),
  //   },
  //   notifyOnNetworkStatusChange: true,
  // });
  return (
    <Container>
      <Text>Aggregated stuff</Text>
    </Container>
  );
};

WorkSessionsAggregated.propTypes = {
};

WorkSessionsAggregated.defaultProps = {
};

const Container = styled.View`
  padding: 10px 10px 0px 10px;
  background: red;
  margin-top: 0px;
  background: green;
`;

const Text = styled.Text`
  font-size: 20px;
`;

export default WorkSessionsAggregated;
