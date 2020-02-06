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
import MenuBar from '../component/menu/MenuBar';
import EventPool from '../utils/EventPool';
import {allUsers} from '../queries/queries';
import {useFocus} from '../hooks/useFocus';
import {
  ADMIN_ROLE,
  PROJECT_OWNER_ROLE,
  hasPermission,
  useRole,
} from '../hooks/useRole';
import Users from '../component/users/Users';
import UserExpanded from '../component/users/UserExpanded';
import { AddButtonIcon } from '../svg/Icons';
import UserNew from '../component/users/UserNew';

const mapStateToProps = state => ({
  token: state.cachedReducer.token,
});

let deviceHeight = Dimensions.get('screen').height;
let deviceWidth = Dimensions.get('screen').width;

let page = 0;

const UsersScreen = props => {
  const {navigation, token} = props;
  const [shouldRefetchOnFocus, setShouldRefetchOnFocus] = useState(false);
  const [topExpandedUser, setTopExpandedUser] = useState(
    new Animated.Value(deviceHeight + 500),
  );
  const [topNewContract, setTopNewContract] = useState(
    new Animated.Value(deviceHeight + 500),
  );
  const [translateYExpandedUser, setTranslateYExpandedUser] = useState(
    new Animated.Value(0),
  );
  const [translateYNewUser, setTranslateYNewUser] = useState(
    new Animated.Value(0),
  );
  const role = useRole();
  const {loading, data, error, refetch, fetchMore, networkStatus} = useQuery(
    allUsers,
    {
      variables: {
        page: page,
        filter: {},
        perPage: 20,
        sortField: 'id',
        sortOrder: 'DESC',
      },
      skip: !token,
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    },
  );
  const hasFocus = useFocus(navigation);
  if (hasFocus && shouldRefetchOnFocus) {
    setShouldRefetchOnFocus(false);
    refetch();
  }
  useEffect(() => {
    const fetchContracts = () => {
      if (navigation.isFocused()) {
        refetch();
      } else {
        setShouldRefetchOnFocus(true);
      }
    };
    EventPool.addListener('usersUpdated', fetchContracts);
    return () => EventPool.removeListener('usersUpdated', fetchContracts);
  }, [navigation, refetch]);
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
  const fetchMoreUsers = () => {
    if (data.items.length < data.total.count) {
      page++;
      fetchMore({
        variables: {
          page: page,
          filter: {},
          perPage: 20,
          sortField: 'id',
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
  const expandUser = () => {
    Animated.timing(topExpandedUser, {toValue: 0, duration: 500}).start();
    Animated.timing(translateYExpandedUser, {
      toValue: 0,
      duration: 0,
    }).start();
  };
  const newUser = () => {
    Animated.timing(topNewContract, {toValue: 0, duration: 500}).start();
    Animated.timing(translateYNewUser, {toValue: 0, duration: 0}).start();
  };
  const closeExpandedUser = () => {
    return new Promise(() => {
      Keyboard.dismiss();
      setTimeout(() => {
        Animated.timing(topExpandedUser, {
          toValue: deviceHeight,
          duration: 0,
        }).start();
      }, 500);
      Animated.timing(translateYExpandedUser, {
        toValue: deviceHeight,
        duration: 500,
      }).start();
    });
  };
  const closeNewUser = () => {
    return new Promise(() => {
      Keyboard.dismiss();
      setTimeout(() => {
        Animated.timing(topNewContract, {
          toValue: deviceHeight,
          duration: 0,
        }).start();
      }, 500);
      Animated.timing(translateYNewUser, {
        toValue: deviceHeight,
        duration: 500,
      }).start();
    });
  };
  const onUserSave = () => {
    Keyboard.dismiss();
    setTopExpandedUser(new Animated.Value(deviceHeight + 500));
    setTranslateYExpandedUser(new Animated.Value(0));
  };
  const onUserCreate = () => {
    Keyboard.dismiss();
    setTopNewContract(new Animated.Value(deviceHeight + 500));
    setTranslateYNewUser(new Animated.Value(0));
  };
  const onLayout = event => {
    deviceHeight = event.nativeEvent.layout.height;
    deviceWidth = event.nativeEvent.layout.width;
  };
  return (
    <Container onLayout={event => onLayout(event)}>
      <MenuBar title="Users" navigation={navigation} />
      <Users
        onExpandUser={expandUser}
        users={data ? data.items : []}
        fetchMoreUsers={fetchMoreUsers}
        totalCount={data ? data.total.count : 0}
      />
      {hasPermission([ADMIN_ROLE], role) && (
        <ButtonContainer>
          <TouchableOpacity onPress={newUser}>
            <AddButtonIcon />
          </TouchableOpacity>
        </ButtonContainer>
      )}
      {!loading && (
        <AnimatedContractModal
          style={{
            transform: [{translateY: translateYExpandedUser}],
            top: topExpandedUser,
          }}>
          <UserExpanded
            closeUser={closeExpandedUser}
            onUserSave={onUserSave}
            resetPageCount={resetPageCount}
          />
        </AnimatedContractModal>
      )}
      {!loading && hasPermission([ADMIN_ROLE], role) && (
        <AnimatedContractModal
          style={{
            transform: [{translateY: translateYNewUser}],
            top: topNewContract,
          }}>
          <UserNew
            closeUser={closeNewUser}
            onUserCreate={onUserCreate}
            resetPageCount={resetPageCount}
          />
        </AnimatedContractModal>
      )}
    </Container>
  );
};

UsersScreen.proptypes = {
  navigation: PropTypes.object,
  token: PropTypes.string,
};

UsersScreen.defaultProps = {
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

const AnimatedContractModal = Animated.createAnimatedComponent(
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
)(UsersScreen);
