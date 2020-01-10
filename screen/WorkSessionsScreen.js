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
import {connect} from 'react-redux';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import MenuBar from '../component/MenuBar';
import WorkSessions from '../component/WorkSessions';
import {AddButtonIcon} from '../svg/Icons';
import WorkSessionExpanded from '../component/WorkSessionExpanded';
import EventPool from '../utils/EventPool';
import WorkSessionNew from '../component/WorkSessionNew';

const mapStateToProps = state => ({
  workSessionsEdited: state.nonCachedReducer.workSessionsEdited,
  token: state.cachedReducer.token,
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

let page = 0;

const WorkSessionsScreen = props => {
  const {navigation, token} = props;
  const [topExpandedSession, setTopExpandedSession] = useState(
    new Animated.Value(deviceHeight + 500),
  );
  const [topNewSession, setTopNewSession] = useState(
    new Animated.Value(deviceHeight + 500),
  );
  const [translateYExpandedSession, setTranslateYExpandedSession] = useState(
    new Animated.Value(0),
  );
  const [translateYNewSession, setTranslateYNewSession] = useState(
    new Animated.Value(0),
  );
  const {loading, data, error, refetch, fetchMore, networkStatus} = useQuery(
    query,
    {
      variables: {
        page: 0,
        filter: {},
        perPage: 20,
        sortField: 'date',
        sortOrder: 'DESC',
      },
      skip: !token,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
  );
  useEffect(() => {
    const fetchSessions = () => refetch();
    EventPool.addListener('refreshWorkSessions', fetchSessions);
    return () => EventPool.removeListener('refreshWorkSessions', fetchSessions);
  }, []);
  if (!token) {
    return null;
  }
  if (loading) {
    if (networkStatus !== 3) {
      return (
        <LoaderContainer
          style={{
            width: deviceWidth - 20,
          }}>
          <ActivityIndicator size="large" color="#7423B5" />
        </LoaderContainer>
      );
    }
  }
  if (error) {
    return <Text>`Error! ${error}`</Text>;
  }
  const fetchMoreSessions = () => {
    if (data.items.length < data.total.count) {
      page++;
      fetchMore({
        variables: {
          page: page,
          filter: {},
          perPage: 20,
          sortField: 'date',
          sortOrder: 'DESC',
        },
        updateQuery: (prev, {fetchMoreResult}) => {
          if (!fetchMoreResult) {
            return prev;
          }
          const dat = Object.assign({}, prev, {
            items: [...prev.items, ...fetchMoreResult.items],
          });
          return dat;
        },
      });
    }
  };
  const resetPageCount = () => {
    page = 0;
  };
  const expandWorkSession = () => {
    Animated.timing(topExpandedSession, {toValue: 0, duration: 500}).start();
    Animated.timing(translateYExpandedSession, {
      toValue: 0,
      duration: 0,
    }).start();
  };
  const newWorkSession = () => {
    Animated.timing(topNewSession, {toValue: 0, duration: 500}).start();
    Animated.timing(translateYNewSession, {toValue: 0, duration: 0}).start();
  };
  const closeExpandedWorkSession = () => {
    return new Promise(() => {
      Keyboard.dismiss();
      setTimeout(() => {
        Animated.timing(topExpandedSession, {
          toValue: deviceHeight,
          duration: 0,
        }).start();
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
        Animated.timing(topNewSession, {
          toValue: deviceHeight,
          duration: 0,
        }).start();
      }, 500);
      Animated.timing(translateYNewSession, {
        toValue: deviceHeight,
        duration: 500,
      }).start();
    });
  };
  const onWorkSessionSave = () => {
    Keyboard.dismiss();
    setTopExpandedSession(new Animated.Value(deviceHeight + 500));
    setTranslateYExpandedSession(new Animated.Value(0));
  };
  const onWorkSessionCreate = () => {
    Keyboard.dismiss();
    setTopNewSession(new Animated.Value(deviceHeight + 500));
    setTranslateYNewSession(new Animated.Value(0));
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
        workSessions={data ? data.items : []}
        contracts={data ? data.contracts : []}
        fetchMoreSessions={fetchMoreSessions}
        totalCount={data ? data.total.count : 0}
      />
      <ButtonContainer>
        <TouchableOpacity onPress={newWorkSession}>
          <AddButtonIcon />
        </TouchableOpacity>
      </ButtonContainer>
      {!loading && (
        <AnimatedWorkSessionModal
          style={{
            transform: [{translateY: translateYExpandedSession}],
            top: topExpandedSession,
          }}>
          <WorkSessionExpanded
            closeWorkSession={closeExpandedWorkSession}
            onWorkSessionSave={onWorkSessionSave}
            resetPageCount={resetPageCount}
          />
        </AnimatedWorkSessionModal>
      )}
      {!loading && (
        <AnimatedWorkSessionModal
          style={{
            transform: [{translateY: translateYNewSession}],
            top: topNewSession,
          }}>
          <WorkSessionNew
            lastWorkSession={data ? data.items[0] : null}
            contracts={data ? data.contracts : []}
            closeWorkSession={closeNewWorkSession}
            onWorkSessionCreate={onWorkSessionCreate}
            resetPageCount={resetPageCount}
          />
        </AnimatedWorkSessionModal>
      )}
    </Container>
  );
};

WorkSessionsScreen.proptypes = {
  navigation: PropTypes.object,
  token: PropTypes.string,
};

WorkSessionsScreen.defaultProps = {
  navigation: {},
  token: '',
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

const Text = styled.Text``;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 10;
`;

export default connect(
  mapStateToProps,
  null,
)(WorkSessionsScreen);
