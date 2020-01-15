import React from 'react';
import {Dimensions} from 'react-native';
import {createDrawerNavigator} from 'react-navigation-drawer';

import SideMenu from '../component/SideMenu';
import {createAppContainer} from 'react-navigation';
import MainScreen from '../screen/MainScreen';
import WorksSessionsScreen from '../screen/WorkSessionsScreen';

const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: MainScreen,
    },
    WorkSessions: {
      screen: WorksSessionsScreen,
    },
  },
  {
    contentComponent: SideMenu,
    drawerWidth: Dimensions.get('window').width - 120,
  },
);
export default createAppContainer(DrawerNavigator);
