import React from 'react';
import styled from 'styled-components';
import MenuBar from '../component/MenuBar';
import PropTypes from 'prop-types';
import WorkSessions from '../component/WorkSessions';



const WorksSessionsScreen = props => {
  const {navigation} = props;
  return (
    <Container>
      <MenuBar title="Works Sessions" navigation={navigation} />
      <WorkSessions />
    </Container>
  );
};

WorksSessionsScreen.proptypes = {
  navigation: PropTypes.object,
};

WorksSessionsScreen.defaultProps = {
  navigation: {},
};

const Container = styled.View``;

const Text = styled.Text``;

export default WorksSessionsScreen;
