import gql from 'graphql-tag';

export const loginUser = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const allWorkSessions = gql`
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

export const aggregatedWorkSessions = gql`
  query allStatsDailyUserWorkSessions($startDate: String!, $endDate: String!) {
    allStatsMonthlyUserAggregates(
      filter: {startDate: $startDate, endDate: $endDate}
    ) {
      UserId
      username
      userEmail
      minutes
      price
      CurrencyId
      CurrencyName
    }
  }
`;

export const editWorkSession = gql`
  mutation updateWorkSession(
    $id: ID!
    $title: String!
    $description: String!
    $url: String!
    $date: String!
    $minutes: Int!
    $ContractId: ID!
  ) {
    data: updateWorkSession(
      id: $id
      title: $title
      description: $description
      url: $url
      date: $date
      minutes: $minutes
      ContractId: $ContractId
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
  }
`;

export const deleteWorkSession = gql`
  mutation deleteWorkSession($id: ID!) {
    data: deleteWorkSession(id: $id) {
      id
      __typename
    }
  }
`;

export const createWorkSession = gql`
  mutation createWorkSession(
    $title: String!
    $description: String!
    $url: String!
    $date: String!
    $minutes: Int!
    $ContractId: ID!
  ) {
    data: createWorkSession(
      title: $title
      description: $description
      url: $url
      date: $date
      minutes: $minutes
      ContractId: $ContractId
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
  }
`;
