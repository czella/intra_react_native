import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {roundToTwoDecimals} from '../utils/MathHelpers';
import {Row, Rows, Table} from 'react-native-table-component';

const ProjectAggregated = props => {
  const {projectName, projectSum, projectData} = props;
  const tableHead = [projectName, 'Hours', 'Price', 'Currency'];
  const getFullTableData = data => {
    const tableData = [...data];
    for (let key in projectSum) {
      if (!projectSum.hasOwnProperty(key)) {
        continue;
      }
      tableData.push([
        '∑',
        roundToTwoDecimals(projectSum[key].hours),
        roundToTwoDecimals(projectSum[key].price),
        key,
      ]);
    }
    return tableData;
  };
  return (
    <Container>
      <Table>
        <Row
          data={tableHead}
          style={{
            paddingLeft: 10,
            height: 50,
            backgroundColor: '#651FFF',
          }}
          flexArr={[1.5, 1, 1, 1]}
          textStyle={{
            color: 'white',
          }}
        />
        <Rows
          data={getFullTableData(projectData)}
          flexArr={[1.5, 1, 1, 1]}
          style={{
            paddingLeft: 10,
            height: 40,
            borderTopColor: 'lightgrey',
            borderTopWidth: 1,
          }}
        />
      </Table>
    </Container>
  );
};

ProjectAggregated.propTypes = {
  projectName: PropTypes.string,
  projectSum: PropTypes.object,
  projectData: PropTypes.array,
};

ProjectAggregated.defaultProps = {
  projectName: '',
  projectSum: {},
  projectData: [],
};

const Container = styled.View`
  margin: 10px;
  border: 1px solid lightgrey;
  border-radius: 5px;
`;

export default ProjectAggregated;
