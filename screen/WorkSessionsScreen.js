import React from 'react';
import styled from 'styled-components';
import MenuBar from '../component/MenuBar';

const WorksSessionsScreen = props => {
  const {navigation} = props;
  return (
    <Container>
      <MenuBar title="Works Sessions" navigation={navigation} />
      <Text> Work sessions</Text>
    </Container>
  );
};

const Container = styled.View``;

const Text = styled.Text``;

export default WorksSessionsScreen;
