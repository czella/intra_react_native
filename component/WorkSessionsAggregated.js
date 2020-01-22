import React from 'react';
import styled from 'styled-components';

const WorkSessionsAggregated = props => {
  return (
    <Container>
      <Text>Aggregated stuff</Text>
    </Container>
  );
};

WorkSessionsAggregated.propTypes = {
};

WorkSessionsAggregated.defaultProps = {
};

const Container = styled.View`
  padding: 10px 10px 0px 10px;
  background: red;
  margin-top: 0px;
  background: green;
`;

const Text = styled.Text`
  font-size: 20px;
`;

export default WorkSessionsAggregated;
