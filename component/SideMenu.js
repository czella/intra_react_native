import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {setToken} from '../store/actions';
import {DashboardIcon, LogoutIcon, WorkSessionsIcon} from '../svg/Icons';

const mapDispatchToProps = dispatch => ({
  setToken: token => dispatch(setToken(token)),
});

const SideMenu = props => {
  const {navigation, setToken} = props;
  const handleLogout = () => {
    setToken(null);
    navigation.navigate('Home');
    navigation.closeDrawer();
  };

  return (
    <Container>
      <SafeAreaView>
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
      </SafeAreaView>

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
  padding-top: 20px;
  padding-left: 10px;
  padding-right: 10px;
  height: 100%;
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
  height: 50px;
  position: absolute;
  bottom: 0px;
  width: 100%;
  margin-left: 10px;
`;

export default connect(
  null,
  mapDispatchToProps,
)(SideMenu);
