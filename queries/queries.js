import gql from 'graphql-tag';

export const loginUser = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const allStatsDailyUserWorkSessions = gql`
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

export const monthlyProjectAggregated = gql`
  query monthlyProjectAggregatedStats($startDate: String!, $endDate: String!) {
    monthlyProjectStats(filter: {startDate: $startDate, endDate: $endDate}) {
      username
      projectName
      hours
      price
      CurrencyName
    }
  }
`;

export const allWorkSessions = gql`
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
    contracts: allContracts {
      id
      position
      Project {
        name
      }
      User {
        username
      }
    }
    users: allUsers {
      id
      username
      email
      role
      isActive
      __typename
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

export const allContracts = gql`
  query allContracts($page: Int, $perPage: Int, $sortField: String, $sortOrder: String, $filter: ContractFilter, $currencyFilter: CurrencyFilter) {
    items: allContracts(page: $page, perPage: $perPage, sortField: $sortField, sortOrder: $sortOrder, filter: $filter) {
      id
      position
      UserId
      ProjectId
      price
      CurrencyId
      Project {
        id
        name
        __typename
      }
      User {
        id
        username
        __typename
      }
      __typename
    }
    total: _allContractsMeta(page: $page, perPage: $perPage, filter: $filter) {
      count
      __typename
    }
    currencies: allCurrencies(filter: $currencyFilter) {
    id
    name
    __typename
    }
    totalCurrency: _allCurrenciesMeta(filter: $currencyFilter) {
      count
      __typename
    }
  }
`;

export const allDataForContract = gql`
  query allDataForContract($userFilter: UserFilter, $projectFilter: ProjectFilter, $currencyFilter: CurrencyFilter) {
    users: allUsers(filter: $userFilter) {
      id
      username
      email
      role
      isActive
      __typename
    }
    usersTotal: _allUsersMeta(filter: $userFilter) {
      count
      __typename
    }
    projects: allProjects(filter: $projectFilter) {
      id
      name
      isActive
      __typename
    }
    projectsTotal: _allProjectsMeta(filter: $projectFilter) {
      count
      __typename
    }
    currencies: allCurrencies(filter: $currencyFilter) {
    id
    name
    __typename
    }
    totalCurrency: _allCurrenciesMeta(filter: $currencyFilter) {
      count
      __typename
    }
  }
`;
