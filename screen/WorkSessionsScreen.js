import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Animated,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import MenuBar from '../component/MenuBar';
import WorkSessions from '../component/WorkSessions';
import {AddButtonIcon} from '../svg/Icons';
import {connect} from 'react-redux';
import WorkSessionExpanded from '../component/WorkSessionExpanded';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {setWorkSessionsEdited} from '../store/actions';
import EventPool from '../utils/EventPool';

const mapStateToProps = state => ({
  workSessionsEdited: state.nonCachedReducer.workSessionsEdited,
});

const mapDispatchToProps = dispatch => ({
  setWorkSessionsEdited: workSessionsEdited =>
    dispatch(setWorkSessionsEdited(workSessionsEdited)),
});

let deviceHeight = Dimensions.get('screen').height;
let deviceWidth = Dimensions.get('screen').width;

const query = gql`
  query allWorkSessions(
    $page: Int
    $perPage: Int
    $sortField: String
    $sortOrder: String
    $filter: WorkSessionFilter
  ) {
    items: allWorkSessions(
      page: $page
      perPage: $perPage
      sortField: $sortField
      sortOrder: $sortOrder
      filter: $filter
    ) {
      id
      title
      description
      url
      date
      minutes
      ContractId
      __typename
    }
    total: _allWorkSessionsMeta(
      page: $page
      perPage: $perPage
      filter: $filter
    ) {
      count
      __typename
    }
    contracts: allContracts {
      id
      position
      Project {
        name
      }
      User {
        username
      }
    }
  }
`;

const workSessions = [];
const contracts = [];
const WorkSessionsScreen = props => {
  const {navigation, setWorkSessionsEdited} = props;
  const [top, setTop] = useState(new Animated.Value(deviceHeight + 500));
  const [translateY, setTranslateY] = useState(new Animated.Value(0));
  const [page, setPage] = useState(0);

  const {loading, data, error, refetch} = useQuery(query, {
    variables: {
      page: page,
      filter: {},
      perPage: 20,
      sortField: 'id',
      sortOrder: 'DESC',
    },
    notifyOnNetworkStatusChange: true,
  });
  useEffect(() => {
    const fetchSessions = () => refetch();
    EventPool.addListener('refreshWorkSessions', fetchSessions);
    return () => EventPool.removeListener('refreshWorkSessions', fetchSessions);
  }, []);
  if (data) {
  }
  if (loading) {
    return (
      <LoaderContainer
        style={{
          width: deviceWidth - 20,
        }}>
        <ActivityIndicator size="large" color="#7423B5" />
      </LoaderContainer>
    );
  }
  if (error) {
    return `Error! ${error}`;
  }
  workSessions.push(...data.items);
  contracts.push(...data.contracts);
  const expandWorkSession = () => {
    Animated.timing(top, {toValue: 0, duration: 500}).start();
    Animated.timing(translateY, {toValue: 0, duration: 0}).start();
  };

  const closeWorkSession = () => {
    return new Promise(() => {
      Keyboard.dismiss();
      setTimeout(() => {
        Animated.timing(top, {toValue: deviceHeight, duration: 0}).start();
      }, 500);
      Animated.timing(translateY, {
        toValue: deviceHeight,
        duration: 500,
      }).start();
    });
  };

  const onWorkSessionSave = () => {
    return new Promise(() => {
      Keyboard.dismiss();
      setTop(new Animated.Value(deviceHeight + 500));
      setTranslateY(new Animated.Value(0));
    });
  };

  const onLayout = event => {
    deviceHeight = event.nativeEvent.layout.height;
    deviceWidth = event.nativeEvent.layout.width;
  };

  return (
    <Container onLayout={event => onLayout(event)}>
      <MenuBar title="Work Sessions" navigation={navigation} />
      <WorkSessions
        onExpandWorkSession={expandWorkSession}
        navigation={navigation}
        workSessions={data.items}
        contracts={data.contracts}
      />
      <ButtonContainer>
        <TouchableOpacity onPress={() => refetch()}>
          <AddButtonIcon />
        </TouchableOpacity>
      </ButtonContainer>
      <AnimatedWorkSessionModal
        style={{
          transform: [{translateY: translateY}],
          top: top,
        }}>
        <WorkSessionExpanded
          navigation={navigation}
          closeWorkSession={closeWorkSession}
          setWorkSessionsEdited={setWorkSessionsEdited}
          onWorkSessionSave={onWorkSessionSave}
        />
      </AnimatedWorkSessionModal>
    </Container>
  );
};

WorkSessionsScreen.proptypes = {
  navigation: PropTypes.object,
  setWorkSessionsEdited: PropTypes.func,
};

WorkSessionsScreen.defaultProps = {
  navigation: {},
  setWorkSessionsEdited: () => {},
};

const LoaderContainer = styled.View`
  margin: 10px;
  padding-top: 120px;
  height: 250;
`;

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
  mapDispatchToProps,
)(WorkSessionsScreen);
