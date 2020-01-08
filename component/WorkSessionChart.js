import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import {LineChart} from 'react-native-chart-kit';
import {TouchableOpacity, ActivityIndicator} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import {workSessionDataHelper} from '../services/WorkSessionChartService';
import {LeftArrowIcon, RightArrowIcon, RefreshIcon} from '../svg/Icons';
import {connect} from 'react-redux';
import EventPool from '../utils/EventPool';

const query = gql`
  query allStatsDailyUserWorkSessions($startDate: String!, $endDate: String!) {
    allStatsDailyUserWorkSessions(
      filter: {startDate: $startDate, endDate: $endDate}
    ) {
      date
      UserId
      username
      userEmail
      minutes
    }
  }
`;

const dateToMysqlString = date => {
  const compensateUTCConversion = new Date(
    date.getTime() + date.getTimezoneOffset() * 60000,
  );

  return compensateUTCConversion
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d+Z$/, '');
};

const getStartAndEndDate = referenceDate => {
  const startDate = new Date(referenceDate.getTime());
  startDate.setDate(referenceDate.getDate() - 7);
  const endDate = new Date(referenceDate.getTime());
  endDate.setDate(referenceDate.getDate() + 7);
  return {startDate: startDate, endDate: endDate};
};

const mapStateToProps = state => ({
  deviceWidth: state.nonCachedReducer.deviceWidth,
});

let convertedData;
let line;
let monthLabel;
let yearLabel;

const WorkSessionChart = props => {
  const {deviceWidth} = props;
  const [referenceDate, setReferenceDate] = useState(new Date());
  const {startDate, endDate} = getStartAndEndDate(referenceDate);
  const [chartDimensions, setChartDimensions] = useState({height: 0, width: 0});

  const {loading, data, error, refetch} = useQuery(query, {
    variables: {
      startDate: dateToMysqlString(startDate),
      endDate: dateToMysqlString(endDate),
    },
    notifyOnNetworkStatusChange: true,
  });
  useEffect(() => {
    const fetchSessions = () => refetch();
    EventPool.addListener('refreshWorkSessions', fetchSessions);
    return () => EventPool.removeListener('refreshWorkSessions', fetchSessions);
  }, []);
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
    return <Text>`Error! ${error}`</Text>;
  }
  convertedData = workSessionDataHelper(data, startDate, endDate);
  line = {
    id: 1,
    labels: convertedData.labels,
    datasets: convertedData.dataset,
  };
  monthLabel = [...convertedData.months].join(' / ');
  yearLabel = [...convertedData.years].join(' / ');

  const handleBack = () => {
    const newReferenceDate = new Date(referenceDate.getTime());
    newReferenceDate.setDate(referenceDate.getDate() - 7);
    setReferenceDate(newReferenceDate);
  };

  const handleForward = () => {
    const newReferenceDate = new Date(referenceDate.getTime());
    newReferenceDate.setDate(referenceDate.getDate() + 7);
    setReferenceDate(newReferenceDate);
  };

  const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
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
        <GestureRecognizer
          onSwipeLeft={handleForward}
          onSwipeRight={handleBack}
          config={swipeConfig}>
          <LineChart
            data={line}
            width={chartDimensions.width} // from react-native
            height={chartDimensions.height}
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
        </GestureRecognizer>
      </ChartContainer>
      <ButtonsRow>
        <TouchableOpacity onPress={handleBack}>
          <ButtonContainer>
            <LeftArrowIcon />
            <Text>Previous days</Text>
          </ButtonContainer>
        </TouchableOpacity>
        <TestContainer>

          <MonthLabelContainer>
            <Text>{yearLabel}</Text>
            <Text>{monthLabel}</Text>
          </MonthLabelContainer>
          <TouchableOpacity onPress={() => refetch()}>
            <ButtonContainer>
              <RefreshIcon />
            </ButtonContainer>
          </TouchableOpacity>
        </TestContainer>
        <TouchableOpacity onPress={handleForward}>
          <ButtonContainer>
            <Text>Next days</Text>
            <RightArrowIcon />
          </ButtonContainer>
        </TouchableOpacity>
      </ButtonsRow>
    </Container>
  );
};

WorkSessionChart.propTypes = {
  deviceWidth: PropTypes.number,
};

WorkSessionChart.defaultProps = {
  deviceWidth: 0,
};

const Container = styled.View`
  padding: 10px;
  width: 100%;
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
  padding-top: 20px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TestContainer = styled.View`
  flex-direction: row;
`;

const Text = styled.Text``;

const MonthLabelContainer = styled.View`
  height: 35px
  align-items: center;
  flex-direction: column;
`;

export default connect(
  mapStateToProps,
  null,
)(WorkSessionChart);
