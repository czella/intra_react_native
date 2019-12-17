import React, {useState} from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import {Dimensions, TouchableOpacity, ActivityIndicator} from 'react-native';
import WorkSession from './WorkSession';

const query = gql`
  query allWorkSessions(
    $page: Int
    $perPage: Int
    $sortField: String
    $sortOrder: String
    $filter: WorkSessionFilter
  ) {
    items: allWorkSessions(
      page: $page
      perPage: $perPage
      sortField: $sortField
      sortOrder: $sortOrder
      filter: $filter
    ) {
      id
      title
      description
      url
      date
      minutes
      ContractId
      __typename
    }
    total: _allWorkSessionsMeta(
      page: $page
      perPage: $perPage
      filter: $filter
    ) {
      count
      __typename
    }
  }
`;

const width = Dimensions.get('window').width - 20;

const WorkSessions = () => {
  const {loading, error, data} = useQuery(query, {
    variables: {
      page: 0,
      filter: {},
      perPage: 10,
      sortField: 'id',
      sortOrder: 'DESC',
    },
  });

  const width = Dimensions.get('window').width;

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
  console.log(data);
  return (
    <Container>
      <TableHeader>
        <Date>Date</Date>
        <Title style={{
          width: width - 120,
        }}>Title</Title>
      </TableHeader>
      {data.items.map((item, index) => (
        <WorkSession key={index} title={item.title} date={item.date} />
      ))}
    </Container>
  );
};

const Container = styled.View`
  padding: 10px;
`;

const TableHeader = styled.View`
  display: flex;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: grey;
`;

const Date = styled.Text`
  width: 80px;
  margin-right: 20px;
  font-size: 18px;
`;

const Title = styled.Text`
  font-size: 18px;
`;

const LoaderContainer = styled.View`
  margin: 10px;
  padding-top: 120px;
  width: ${width};
  height: 250;
`;

const Text = styled.Text``;

export default WorkSessions;
