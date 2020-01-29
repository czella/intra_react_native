import React, {useEffect} from 'react';
import styled from 'styled-components';
import {useQuery} from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import {Table, Row, Rows} from 'react-native-table-component';
import {ActivityIndicator} from 'react-native';
import {aggregatedWorkSessions} from '../../queries/queries';
import {dateToMysqlString} from '../../utils/DateHelpers';
import EventPool from '../../utils/EventPool';
import { roundToTwoDecimals } from '../../utils/MathHelpers';


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
  let sumRows = {};
  if (data) {
    tableData = data.allStatsMonthlyUserAggregates.map(userAggregate => {
      const currencyName = userAggregate.CurrencyName;
      if (!sumRows[currencyName]) {
        sumRows[currencyName] = {hours: 0, price: 0};
      }
      sumRows[currencyName].hours += userAggregate.minutes;
      sumRows[currencyName].price += userAggregate.price;
      return [
        userAggregate.username,
        roundToTwoDecimals(userAggregate.minutes / 60),
        roundToTwoDecimals(userAggregate.price),
        currencyName,
      ];
    });
    for (let key in sumRows) {
      if (!sumRows.hasOwnProperty(key)) {
        continue;
      }
      tableData.push([
        '∑',
        roundToTwoDecimals(sumRows[key].hours / 60),
        roundToTwoDecimals(sumRows[key].price),
        key,
      ]);
    }
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
