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
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import WorkSessionExpanded from '../component/WorkSessionExpanded';
import {setWorkSessionsEdited} from '../store/actions';
import EventPool from '../utils/EventPool';
import WorkSessionNew from '../component/WorkSessionNew';

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
  const [topExpandedSession, setTopExpandedSession] = useState(new Animated.Value(deviceHeight + 500));
  const [topNewSession, setTopNewSession] = useState(new Animated.Value(deviceHeight + 500));
  const [translateYExpandedSession, setTranslateYExpandedSession] = useState(new Animated.Value(0));
  const [translateYNewSession, setTranslateYNewSession] = useState(new Animated.Value(0));
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
    Animated.timing(topExpandedSession, {toValue: 0, duration: 500}).start();
    Animated.timing(translateYExpandedSession, {toValue: 0, duration: 0}).start();
  };

  const newWorkSession = () => {
    Animated.timing(topNewSession, {toValue: 0, duration: 500}).start();
    Animated.timing(translateYNewSession, {toValue: 0, duration: 0}).start();
  };

  const closeExpandedWorkSession = () => {
    return new Promise(() => {
      Keyboard.dismiss();
      setTimeout(() => {
        Animated.timing(topExpandedSession, {toValue: deviceHeight, duration: 0}).start();
      }, 500);
      Animated.timing(translateYExpandedSession, {
        toValue: deviceHeight,
        duration: 500,
      }).start();
    });
  };

  const closeNewWorkSession = () => {
    return new Promise(() => {
      Keyboard.dismiss();
      setTimeout(() => {
        Animated.timing(topNewSession, {toValue: deviceHeight, duration: 0}).start();
      }, 500);
      Animated.timing(translateYNewSession, {
        toValue: deviceHeight,
        duration: 500,
      }).start();
    });
  };

  const onWorkSessionSave = () => {
    return new Promise(() => {
      Keyboard.dismiss();
      setTopExpandedSession(new Animated.Value(deviceHeight + 500));
      setTranslateYExpandedSession(new Animated.Value(0));
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
        <TouchableOpacity onPress={newWorkSession}>
          <AddButtonIcon />
        </TouchableOpacity>
      </ButtonContainer>
      <AnimatedWorkSessionModal
        style={{
          transform: [{translateY: translateYExpandedSession}],
          top: topExpandedSession,
        }}>
        <WorkSessionExpanded
          closeWorkSession={closeExpandedWorkSession}
          setWorkSessionsEdited={setWorkSessionsEdited}
          onWorkSessionSave={onWorkSessionSave}
        />
      </AnimatedWorkSessionModal>
      <AnimatedWorkSessionModal
        style={{
          transform: [{translateY: translateYNewSession}],
          top: topNewSession,
        }}>
        <WorkSessionNew
          lastWorkSession={data.items[0]}
          contracts={data.contracts}
          closeWorkSession={closeNewWorkSession}
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
