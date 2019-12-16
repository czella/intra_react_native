import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {setToken} from '../store/actions';
import {DashboardIcon, LogoutIcon, WorkSessionsIcon} from '../svg/Icons';

const mapDispatchToProps = dispatch => ({
  setToken: token => dispatch(setToken(token)),
});

const {height} = Dimensions.get('window');

const SideMenu = props => {
  const {navigation, setToken} = props;
  const handleLogout = () => {
    setToken(null);
    navigation.closeDrawer();
  };

  return (
    <Container>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <MenuElement>
            <DashboardIcon />
            <Text>Dashboard</Text>
          </MenuElement>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('WorkSessions')}>
          <MenuElement>
            <WorkSessionsIcon />
            <Text>Work Sessions</Text>
          </MenuElement>
        </TouchableOpacity>
      </ScrollView>

      <FooterContainer>
        <TouchableOpacity onPress={handleLogout}>
          <MenuElement>
            <LogoutIcon />
            <Text>Logout</Text>
          </MenuElement>
        </TouchableOpacity>
      </FooterContainer>
    </Container>
  );
};

SideMenu.propTypes = {
  navigation: PropTypes.object,
  setToken: PropTypes.func,
};

SideMenu.defaultProps = {
  navigation: {},
  setToken: () => {},
};

const Container = styled.View`
  height: ${height - 20};
  padding-top: 20px;
  padding-left: 10px;
  padding-right: 10px;
`;

const Text = styled.Text`
  line-height: 30px;
  font-size: 17px;
  padding-left: 10px;
`;

const MenuElement = styled.View`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const FooterContainer = styled.View`
  border-top-width: 1px;
  border-top-color: lightgrey;
`;

export default connect(
  null,
  mapDispatchToProps,
)(SideMenu);
