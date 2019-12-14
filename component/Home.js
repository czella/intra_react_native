import React from 'react';
import styled from 'styled-components';
import WorkSessionChart from './WorkSessionChart';

const Home = props => {
  const {} = props;
  return (
    <Container>
      <WorkSessionChart />
    </Container>
  );
};

const Container = styled.View``;

const Text = styled.Text``;

export default Home;
