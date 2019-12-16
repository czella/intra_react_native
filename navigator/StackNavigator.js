import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {createAppContainer} from 'react-navigation';

import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import IOSIcon from 'react-native-vector-icons/Ionicons';
import MainScreen from '../screen/MainScreen';

const StackNavigator = toggler =>
  createStackNavigator({
    Main: {
      screen: MainScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Main',
        headerLeft: (
          <TouchableOpacity
            onPress={toggler}>
            <IOSIcon name="ios-menu" size={30} />
          </TouchableOpacity>
        ),
        headerStyle: {paddingRight: 10, paddingLeft: 15},
      }),
    },
  });

export default StackNavigator;
