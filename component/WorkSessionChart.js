import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import {LineChart} from 'react-native-chart-kit';
import {Dimensions, TouchableOpacity} from 'react-native';
import {workSessionDataHelper} from '../services/WorkSessionChartService';
import {Svg, Path, G} from 'react-native-svg';

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
  console.log(date, 'mydata-----------------------------');
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
      <Container>
        <Text>Loading</Text>
      </Container>
    );
  }
  if (error) {
    return `Error! ${error}`;
  }
  const convertedData = workSessionDataHelper(data, startDate, endDate);
  console.log(convertedData, data);

  const line = {
    id: 1,
    labels: convertedData.labels,
    datasets: convertedData.dataset,
  };
  const monthName = [...convertedData.months].join(' / ');

  const handleback = () => {
    const newReferenceDate = new Date(referenceDate.getTime());
    newReferenceDate.setDate(referenceDate.getDate() - 7);
    setReferenceDate(newReferenceDate);
  };

  const handleForward = () => {
    const newReferenceDate = new Date(referenceDate.getTime());
    newReferenceDate.setDate(referenceDate.getDate() + 7);
    setReferenceDate(newReferenceDate);
  };
  return (
    <Container>
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
          // propsForLabels: {
          //   fontSize: 9,
          //   fill: 'red',
          // },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 5,
        }}
      />
      <ButtonsRow>
        <TouchableOpacity onPress={handleback}>
          <ButtonContainer>
            <Svg
              width="35"
              height="35"
              viewBox="0 0 105 188"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <Path
                d="M103 4C99.3333 7.66667 3 94 3 94L103 184V144L43 94L103 44V4Z"
                fill="#7423B5"
                stroke="#7423B5"
                stroke-width="3"
              />
            </Svg>
            <Text>Previous days</Text>
          </ButtonContainer>
        </TouchableOpacity>
        <MonthNameContainer>
          <Text>{monthName}</Text>
        </MonthNameContainer>
        <TouchableOpacity onPress={handleForward}>
          <ButtonContainer>
            <Text>Next days</Text>
            <Svg
              width="35"
              height="35"
              viewBox="0 0 105 188"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <Path
                d="M2 4C5.66667 7.66667 102 94 102 94L2 184V144L62 94L2 44V4Z"
                fill="#7423B5"
                stroke="#7423B5"
                stroke-width="3"
              />
            </Svg>
          </ButtonContainer>
        </TouchableOpacity>
      </ButtonsRow>
    </Container>
  );
};

const Container = styled.View`
  padding: 10px;
`;

const ButtonsRow = styled.View`
  display: flex;
  flex-direction: row;
  width: ${width};
  justify-content: space-between;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Text = styled.Text`
  line-height: 35px;
`;

const MonthNameContainer = styled.View`
  height: 35px
  align-items: center;
`;

export default WorkSessionChart;
