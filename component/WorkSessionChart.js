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

  const line = {
    id: 1,
    labels: convertedData.labels,
    datasets: convertedData.dataset,
  };

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
        yAxisLabel={'h'}
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
          borderRadius: 16,
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
            <Text>Previous Day</Text>
          </ButtonContainer>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForward}>
          <ButtonContainer>
            <Text>Next day</Text>
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

const Button = styled.Text`
  padding-top: 15px;
  margin: 10px;
  height: 50px;
  width: 150px;
  color: white;
  border-radius: 5px;
  background-color: blue;
  text-align: center;
`;

const Text = styled.Text``;

export default WorkSessionChart;
