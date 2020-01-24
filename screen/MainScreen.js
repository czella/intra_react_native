import React, {useState} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {ScrollView} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {setToken} from '../store/actions';
import Login from '../component/Login';
import MenuBar from '../component/MenuBar';
import WorkSessionChart from '../component/WorkSessionChart';
import {useRole, ADMIN_ROLE, PROJECT_OWNER} from '../hooks/useRole';
import WorkSessionsAggregated from '../component/WorkSessionsAggregated';
import PickerTrigger from '../component/PickerTrigger';
import {getDateFilters} from '../utils/DateHelpers';

const mapStateToProps = state => ({
  token: state.cachedReducer.token,
});

const mapDispatchToProps = dispatch => ({
  setToken: token => dispatch(setToken(token)),
});

const MainScreen = props => {
  const {token, setToken, navigation} = props;
  const now = new Date();
  const nextMonthFirstDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const dateFilters = getDateFilters(new Date('2018-06-01'), nextMonthFirstDay);
  const [selectedMonth, setSelectedMonth] = useState(dateFilters[dateFilters.length - 1]);

  const role = useRole();
  return (
    <Container>
      {console.log(selectedMonth, dateFilters, 'hello')}
      {token && (
        <DashboardContainer>
          <MenuBar navigation={navigation} title="Dashboard" />
          <MonthPickerContainer>
            <RNPickerSelect
              onValueChange={(itemValue, index) => {
                setSelectedMonth(itemValue);
              }}
              value={selectedMonth}
              placeholder={{}}
              InputAccessoryView={() => {
                return null;
              }}
              useNativeAndroidPickerStyle={false}
              Icon={() => null}
              style={{
                inputAndroid: {
                  height: 40,
                  padding: 0,
                  fontSize: 18,
                },
                inputIOS: {
                  height: 40,
                  fontSize: 18,
                },
                iconContainer: {
                  height: 40,
                  top: 15,
                  right: 15,
                },
              }}
              items={dateFilters.map(date => ({
                label: date.label,
                value: {label: date.label, monthIndex: date.monthIndex, year: date.year},
              }))}>
              <PickerTrigger
                label={selectedMonth.label}
                labelStyle={{fontSize: 18}}
              />
            </RNPickerSelect>
          </MonthPickerContainer>
          <ScrollView style={{height: '100%'}}>
            <WorkSessionChart token={token} />
            {[ADMIN_ROLE, PROJECT_OWNER].indexOf(role) !== -1 && (
              <WorkSessionsAggregated selectedMonth={selectedMonth}/>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainScreen);
