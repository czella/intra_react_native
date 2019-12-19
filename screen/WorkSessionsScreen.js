import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import MenuBar from '../component/MenuBar';
import WorkSessions from '../component/WorkSessions';
import {AddButtonIcon} from '../svg/Icons';
import {connect} from 'react-redux';

const mapStateToProps = state => ({
  deviceHeight: state.nonCachedReducer.deviceHeight,
});

const WorksSessionsScreen = props => {
  const {navigation, deviceHeight} = props;
  return (
    <Container>
      <MenuBar title="Works Sessions" navigation={navigation} />
      <WorkSessions navigation={navigation} />
      <ButtonContainer>
        <TouchableOpacity onPress={() => navigation.navigate('NewWorkSession')}>
          <AddButtonIcon />
        </TouchableOpacity>
      </ButtonContainer>
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

const Container = styled.View`
  height: 100%;
`;

const Text = styled.Text``;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
`;

export default connect(
  mapStateToProps,
  null,
)(WorksSessionsScreen);
