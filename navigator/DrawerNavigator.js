import React from 'react';
import {Dimensions} from 'react-native';
import {createDrawerNavigator} from 'react-navigation-drawer';

import SideMenu from '../component/SideMenu';
import {createAppContainer} from 'react-navigation';
import MainScreen from '../screen/MainScreen';
import WorksSessionsScreen from '../screen/WorkSessionsScreen';
import WorkSessionExpanded from '../component/WorkSessionExpanded';
import {createStackNavigator} from 'react-navigation-stack';
import NewWorkSession from '../component/NewWorkSession';

const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: MainScreen,
    },
    WorkSessions: {
      // screen: WorksSessionsScreen,
      screen: WorksSessionsScreen,
    },
    WorkSessionExpanded: {
      screen: WorkSessionExpanded,
    },
    NewWorkSession: {
      screen: NewWorkSession,
    }
  },
  {
    contentComponent: SideMenu,
    drawerWidth: Dimensions.get('window').width - 120,
  },
);
export default createAppContainer(DrawerNavigator);
