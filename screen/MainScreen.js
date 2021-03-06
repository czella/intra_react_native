import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {ScrollView} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {setToken} from '../store/actions';
import Login from '../component/dashboard/Login';
import MenuBar from '../component/menu/MenuBar';
import WorkSessionChart from '../component/dashboard/WorkSessionChart';
import {
  useRole,
  ADMIN_ROLE,
  PROJECT_OWNER_ROLE,
  hasPermission,
} from '../hooks/useRole';
import WorkSessionsAggregated from '../component/dashboard/WorkSessionsAggregated';
import {getDateFilters} from '../utils/DateHelpers';
import ProjectsAggregated from '../component/dashboard/ProjectsAggregated';
import EventPool from '../utils/EventPool';
import Picker from '../component/util/Picker';

const mapStateToProps = state => ({
  token: state.cachedReducer.token,
});

const mapDispatchToProps = dispatch => ({
  setToken: token => dispatch(setToken(token)),
});

const MainScreen = props => {
  const {token, setToken, navigation, userRoles} = props;
  const now = new Date();
  const nextMonthFirstDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const dateFilters = getDateFilters(new Date('2018-06-01'), nextMonthFirstDay);
  const [selectedMonth, setSelectedMonth] = useState(
    dateFilters[dateFilters.length - 1],
  );

  const role = useRole();
  useEffect(() => {
    const resetState = () => {
      console.log('logging out');
    };
    EventPool.addListener('logout', resetState);
    return () => EventPool.removeListener('logout', resetState);
  }, []);
  return (
    <Container>
      {token && (
        <DashboardContainer>
          <MenuBar navigation={navigation} title="Dashboard" />
          <MonthPickerContainer>
            <Picker
              onValueChange={itemValue => {
                setSelectedMonth(itemValue);
              }}
              value={selectedMonth}
              items={dateFilters.map(date => ({
                label: date.label,
                value: {
                  label: date.label,
                  monthIndex: date.monthIndex,
                  year: date.year,
                },
              }))}
              label={selectedMonth.label}
              labelStyle={{fontSize: 18}}
            />
          </MonthPickerContainer>
          <ScrollView style={{height: '100%'}}>
            <WorkSessionChart
              selectedMonth={selectedMonth}
              navigation={navigation}
            />
            {hasPermission([ADMIN_ROLE, PROJECT_OWNER_ROLE], role) && (
              <MonthlyAggregatesContainer>
                <Text>Monthly Aggregates</Text>
                <WorkSessionsAggregated
                  selectedMonth={selectedMonth}
                  navigation={navigation}
                />
              </MonthlyAggregatesContainer>
            )}
            {hasPermission([ADMIN_ROLE], role) && (
              <ProjectsAggregated
                selectedMonth={selectedMonth}
                navigation={navigation}
              />
            )}
          </ScrollView>
        </DashboardContainer>
      )}
      {!token && <Login setToken={setToken} />}
    </Container>
  );
};

MainScreen.proptypes = {
  token: PropTypes.string,
  setToken: PropTypes.func,
  navigation: PropTypes.object,
};

MainScreen.defaultProps = {
  token: null,
  setToken: () => {},
  navigation: {},
};

const Container = styled.View`
  flex: 1;
  flex-direction: row;
`;

const MonthPickerContainer = styled.View`
  width: 160px;
  padding-left: 20px;
  margin: auto;
`;

const DashboardContainer = styled.View`
  flex: 1;
`;

const MonthlyAggregatesContainer = styled.View`
  flex: 1;
`;

const Text = styled.Text`
  padding-left: 20px;
  font-size: 18px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainScreen);
