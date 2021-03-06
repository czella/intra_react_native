import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useQuery} from '@apollo/react-hooks';
import {monthlyProjectAggregated} from '../../queries/queries';
import {dateToMysqlString} from '../../utils/DateHelpers';
import {ActivityIndicator} from 'react-native';
import {roundToTwoDecimals} from '../../utils/MathHelpers';
import ProjectAggregated from './ProjectAggregated';
import EventPool from '../../utils/EventPool';
import {useFocus} from '../../hooks/useFocus';

const ProjectsAggregated = props => {
  const {selectedMonth, navigation} = props;
  const [shouldRefetchOnFocus, setShouldRefetchOnFocus] = useState(false);
  const {loading, data, error, refetch} = useQuery(monthlyProjectAggregated, {
    variables: {
      startDate: dateToMysqlString(
        new Date(selectedMonth.year, selectedMonth.monthIndex, 1),
      ),
      endDate: dateToMysqlString(
        new Date(selectedMonth.year, selectedMonth.monthIndex + 1, 1),
      ),
    },
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  });
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
    EventPool.addListener('contractsUpdated', fetchSessions);
    return () => {
      EventPool.removeListener('workSessionsUpdated', fetchSessions);
      EventPool.removeListener('contractsUpdated', fetchSessions);
    };
  }, [navigation, refetch]);
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
  const projects = {};
  if (data) {
    data.monthlyProjectStats.map(contract => {
      const projectName = contract.projectName;
      const currencyName = contract.CurrencyName;
      if (!projects[projectName]) {
        projects[projectName] = {sumRows: {}, data: []};
      }
      const currentProject = projects[projectName];
      if (!currentProject.sumRows[currencyName]) {
        currentProject.sumRows[currencyName] = {hours: 0, price: 0};
      }
      currentProject.sumRows[currencyName].hours += contract.hours;
      currentProject.sumRows[currencyName].price += contract.price;
      currentProject.data.push([
        contract.username,
        roundToTwoDecimals(contract.hours),
        roundToTwoDecimals(contract.price),
        currencyName,
      ]);
    });
  }
  return (
    <Container>
      {Object.keys(projects).map(key => (
        <ProjectAggregated
          key={key}
          projectName={key}
          projectData={projects[key].data}
          sumRows={projects[key].sumRows}
        />
      ))}
    </Container>
  );
};

ProjectsAggregated.propTypes = {
  selectedMonth: PropTypes.object,
  navigation: PropTypes.object,
};

ProjectsAggregated.defaultProps = {
  selectedMonth: {},
  navigation: {},
};

const Container = styled.View`
  flex: 1;
`;

const LoaderContainer = styled.View``;

const Text = styled.Text``;

export default ProjectsAggregated;
