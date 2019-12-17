import React, {useState} from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import {LineChart} from 'react-native-chart-kit';
import {Dimensions, TouchableOpacity, ActivityIndicator} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {workSessionDataHelper} from '../services/WorkSessionChartService';
import {LeftArrowIcon, RightArrowIcon} from '../svg/Icons';

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

const width = Dimensions.get('window').width - 20;

const WorkSessionChart = () => {
  const [referenceDate, setReferenceDate] = useState(new Date());
  const {startDate, endDate} = getStartAndEndDate(referenceDate);

  const {loading, error, data} = useQuery(query, {
    variables: {
      startDate: dateToMysqlString(startDate),
      endDate: dateToMysqlString(endDate),
    },
  });

  if (loading) {
    return (
      <LoaderContainer>
        <ActivityIndicator size="large" color="#7423B5" />
      </LoaderContainer>
    );
  }
  if (error) {
    return `Error! ${error}`;
  }
  const convertedData = workSessionDataHelper(data, startDate, endDate);

  const line = {
    id: 1,
    labels: convertedData.labels,
    datasets: convertedData.dataset,
  };
  const monthLabel = [...convertedData.months].join(' / ');
  const yearLabel = [...convertedData.years].join(' / ');

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
      <GestureRecognizer
        onSwipeLeft={handleForward}
        onSwipeRight={handleBack}
        config={swipeConfig}>
        <LineChart
          data={line}
          width={width} // from react-native
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
            marginVertical: 8,
            borderRadius: 5,
          }}
        />
      </GestureRecognizer>
      <ButtonsRow>
        <TouchableOpacity onPress={handleBack}>
          <ButtonContainer>
            <LeftArrowIcon />
            <Text>Previous days</Text>
          </ButtonContainer>
        </TouchableOpacity>
        <MonthLabelContainer>
          <Text>{yearLabel}</Text>
          <Text>{monthLabel}</Text>
        </MonthLabelContainer>
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

const Container = styled.View`
  padding: 10px;
`;

const LoaderContainer = styled.View`
  margin: 10px;
  padding-top: 120px;
  width: ${width};
  height: 250;
`;

const ButtonsRow = styled.View`
  display: flex;
  flex-direction: row;
  width: ${width};
  justify-content: space-between;
  height: 40px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Text = styled.Text``;

const MonthLabelContainer = styled.View`
  height: 35px
  align-items: center;
  flex-direction: column;
`;

export default WorkSessionChart;
