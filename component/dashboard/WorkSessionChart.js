import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {useQuery} from '@apollo/react-hooks';
import {LineChart} from 'react-native-chart-kit';
import {ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {workSessionDataHelper} from '../../services/WorkSessionChartService';
import EventPool from '../../utils/EventPool';
import {allStatsDailyUserWorkSessions} from '../../queries/queries';
import {dateToMysqlString} from '../../utils/DateHelpers';
import {useFocus} from '../../hooks/useFocus';
import {UserCircle} from '../../svg/Icons';

let convertedData;
let line;

const WorkSessionChart = props => {
  const {selectedMonth, navigation} = props;
  const [shouldRefetchOnFocus, setShouldRefetchOnFocus] = useState(false);
  const startDate = new Date(selectedMonth.year, selectedMonth.monthIndex, 1);
  const endDate = new Date(selectedMonth.year, selectedMonth.monthIndex + 1, 1);
  const [chartDimensions, setChartDimensions] = useState({height: 0, width: 0});
  const {loading, data, error, refetch} = useQuery(
    allStatsDailyUserWorkSessions,
    {
      variables: {
        startDate: dateToMysqlString(startDate),
        endDate: dateToMysqlString(endDate),
      },
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    },
  );
  const hasFocus = useFocus(navigation);
  if (hasFocus && shouldRefetchOnFocus) {
    setShouldRefetchOnFocus(false);
    refetch();
  }
  useEffect(() => {
    const fetchSessions = () => {
      if (navigation.isFocused()) {
        refetch();
      } else {
        setShouldRefetchOnFocus(true);
      }
    };
    EventPool.addListener('workSessionsUpdated', fetchSessions);
    return () => EventPool.removeListener('workSessionsUpdated', fetchSessions);
  }, [navigation, refetch]);

  const getHiddenIndices = () => {
    const lastDayOfMonth = new Date(
      selectedMonth.year,
      selectedMonth.monthIndex + 1,
      0,
    ).getDate();
    const hiddenIndices = [];
    for (let i = 1; i < lastDayOfMonth; i++) {
      if (i === 14 || i === lastDayOfMonth - 1) {
        continue;
      } else {
        hiddenIndices.push(i);
      }
    }
    return hiddenIndices;
  };

  if (loading) {
    return (
      <LoaderContainer>
        <ActivityIndicator size="large" color="#7423B5" />
      </LoaderContainer>
    );
  }
  if (error) {
    return <Text>`Error! ${error}`</Text>;
  }
  convertedData = workSessionDataHelper(data, startDate, endDate);
  getHiddenIndices();
  line = {
    id: 1,
    labels: convertedData.labels,
    datasets: convertedData.dataset,
  };
  return (
    <Container>
      <ChartContainer
        onLayout={event =>
          setChartDimensions({
            height: event.nativeEvent.layout.height,
            width: event.nativeEvent.layout.width,
          })
        }>
        <LineChart
          data={line}
          width={chartDimensions.width} // from react-native
          height={250}
          yAxisSuffix={' h'}
          hidePointsAtIndex={getHiddenIndices()}
          withDots={false}
          withShadow={false}
          withInnerLines={false}
          withOuterLines={true}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2, // optional, defaults to 2dp
            propsForBackgroundLines: {
              fill: 'black',
              strokeWidth: 1,
              strokeDasharray: 10000,
              stroke: 'grey',
            },
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
          style={{
            borderRadius: 5,
          }}
        />
      </ChartContainer>
      <UserRowContainer>
        {convertedData.userLabels.map(user => (
          <UserContainer>
            <Text>{user.name}</Text>
            <UserCircle color={user.color} />
          </UserContainer>
        ))}
      </UserRowContainer>
    </Container>
  );
};

WorkSessionChart.propTypes = {
  selectedMonth: PropTypes.object,
  navigation: PropTypes.object,
};

WorkSessionChart.defaultProps = {
  selectedMonth: {},
  navigation: {},
};

const Container = styled.View`
  margin-top: 10px;
  flex: 1;
  padding-right: 15px;
`;

const ChartContainer = styled.View`
  width: 100%;
  height: 75%;
  max-height: 250px;
`;

const LoaderContainer = styled.View`
  margin: 10px;
  padding-top: 120px;
  height: 250;
`;

const UserRowContainer = styled.View`
  flex: 1
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-top: 25px;
`;

const UserContainer = styled.View`
  flex-direction: row;
`;

const Text = styled.Text`
  margin-right: 3px;
  margin-left: 10px;
`;

export default WorkSessionChart;
