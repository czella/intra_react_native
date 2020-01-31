import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {useQuery} from '@apollo/react-hooks';
import {LineChart} from 'react-native-chart-kit';
import {TouchableOpacity, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {workSessionDataHelper} from '../../services/WorkSessionChartService';
import {LeftArrowIcon, RightArrowIcon, RefreshIcon} from '../../svg/Icons';
import EventPool from '../../utils/EventPool';
import {allStatsDailyUserWorkSessions} from '../../queries/queries';
import {
  dateToMysqlString,
  getTodaysUTCDate,
  getWeekCount,
  getFirstDayOfWeek,
  getLastDayOfWeek,
  getTodaysMonthWeekNumber,
} from '../../utils/DateHelpers';
import { useFocus } from '../../hooks/useFocus';

let convertedData;
let line;

const WorkSessionChart = props => {
  const {selectedMonth, navigation} = props;
  const [currentWeek, setCurrentWeek] = useState(1);
  const [shouldRefetchOnFocus, setShouldRefetchOnFocus] = useState(false);
  const weekCount = getWeekCount(selectedMonth.year, selectedMonth.monthIndex);
  const startDate = getFirstDayOfWeek(
    selectedMonth.year,
    selectedMonth.monthIndex,
    currentWeek,
  );
  const endDate = getLastDayOfWeek(
    selectedMonth.year,
    selectedMonth.monthIndex,
    currentWeek,
  );
  endDate.setDate(endDate.getDate() + 1);
  useEffect(() => {
    const currentDate = getTodaysUTCDate();
    if (
      selectedMonth.monthIndex === currentDate.getMonth() &&
      selectedMonth.year === currentDate.getFullYear()
    ) {
      setCurrentWeek(getTodaysMonthWeekNumber());
    } else {
      setCurrentWeek(1);
    }
  }, [selectedMonth]);
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
  console.log(dateToMysqlString(endDate));
  convertedData = workSessionDataHelper(data, startDate, endDate);
  console.log(convertedData.data, 'lllllllllllll');
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
          chartConfig={{
            backgroundColor: '#DCDCDC',
            backgroundGradientFrom: '#E6E6FA',
            backgroundGradientTo: '#D8BFD8',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            borderRadius: 5,
          }}
        />
      </ChartContainer>
      <ButtonsRow>
        <TouchableOpacity
          onPress={() => setCurrentWeek(currentWeek - 1)}
          disabled={currentWeek === 1}>
          <ButtonContainer>
            <LeftArrowIcon color={currentWeek !== 1 ? '#651FFF' : '#eeeeee'} />
            <Text style={{opacity: currentWeek !== 1 ? 1 : 0.5}}>
              Previous week
            </Text>
          </ButtonContainer>
        </TouchableOpacity>
        <DateContainer>
          <TouchableOpacity onPress={() => refetch()}>
            <ButtonContainer>
              <RefreshIcon />
            </ButtonContainer>
          </TouchableOpacity>
        </DateContainer>
        <TouchableOpacity
          onPress={() => setCurrentWeek(currentWeek + 1)}
          disabled={currentWeek === weekCount}>
          <ButtonContainer>
            <Text style={{opacity: currentWeek !== weekCount ? 1 : 0.5}}>
              Next week
            </Text>
            <RightArrowIcon
              color={currentWeek !== weekCount ? '#651FFF' : '#eeeeee'}
            />
          </ButtonContainer>
        </TouchableOpacity>
      </ButtonsRow>
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
  padding: 10px;
  flex: 1;
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

const ButtonsRow = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-height: 60px;
  height: 20%;
  padding-top: 30px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DateContainer = styled.View`
  flex-direction: row;
`;

const Text = styled.Text``;

const ButtonTextContainer = styled.View`
  flex-direction: column;
  align-items: center;
`;

export default WorkSessionChart;
