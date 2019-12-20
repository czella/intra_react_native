import React, {useState} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {Animated, TouchableOpacity, Dimensions} from 'react-native';
import MenuBar from '../component/MenuBar';
import WorkSessions from '../component/WorkSessions';
import {AddButtonIcon} from '../svg/Icons';
import {connect} from 'react-redux';
import WorkSessionExpanded from '../component/WorkSessionExpanded';
const mapStateToProps = state => ({
  deviceHeight: state.nonCachedReducer.deviceHeight,
});

let deviceHeight = Dimensions.get('screen').height;

const WorksSessionsScreen = props => {
  const {navigation} = props;
  const [top, setTop] = useState(new Animated.Value(deviceHeight + 200));
  const [scale, setScale] = useState(new Animated.Value(1.3));
  const [translateY, setTranslateY] = useState(new Animated.Value(0));
  const expandWorkSession = () => {
    Animated.timing(top, {toValue: 0, duration: 0}).start();
    Animated.spring(scale, {toValue: 1}).start();
    Animated.timing(translateY, {toValue: 0, duration: 0}).start();
  };
  const closeWorkSession = () => {
    setTimeout(() => {
      Animated.timing(top, {toValue: deviceHeight, duration: 0}).start();
      Animated.spring(scale, {toValue: 1.3}).start();
    }, 500);
    Animated.timing(translateY, {toValue: deviceHeight, duration: 500}).start();
  };

  const onLayout = event => {
    deviceHeight = event.nativeEvent.layout.height;
  };

  return (
    <Container onLayout={event => onLayout(event)}>
      <MenuBar title="Works Sessions" navigation={navigation} />
      <WorkSessions
        onExpandWorkSession={expandWorkSession}
        navigation={navigation}
      />
      <ButtonContainer>
        <TouchableOpacity onPress={() => navigation.navigate('NewWorkSession')}>
          <AddButtonIcon />
        </TouchableOpacity>
      </ButtonContainer>
      <AnimatedWorkSessionModal
        style={{
          transform: [{scale: scale}, {translateY: translateY}],
          top: top,
        }}>
        <WorkSessionExpanded
          navigation={navigation}
          closeWorkSession={closeWorkSession}
        />
      </AnimatedWorkSessionModal>
    </Container>
  );
};

WorksSessionsScreen.proptypes = {
  navigation: PropTypes.object,
  deviceHeight: PropTypes.number,
};

WorksSessionsScreen.defaultProps = {
  navigation: {},
  deviceHeight: 0,
};

const WorkSessionModal = styled.View`
  padding: 0px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  justify-content: center;
  align-items: center;
  z-index: 20;
`;

const AnimatedWorkSessionModal = Animated.createAnimatedComponent(
  WorkSessionModal,
);

const Container = styled.View`
  height: 100%;
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 10;
`;

export default connect(
  mapStateToProps,
  null,
)(WorksSessionsScreen);
