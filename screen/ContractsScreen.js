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
import MenuBar from '../component/MenuBar';
import {AddButtonIcon} from '../svg/Icons';
import EventPool from '../utils/EventPool';
import {allContracts, allWorkSessions} from '../queries/queries';
import Contracts from '../component/contracts/Contracts';
import ContractExpanded from '../component/contracts/ContractExpanded';

const mapStateToProps = state => ({
  token: state.cachedReducer.token,
});

let deviceHeight = Dimensions.get('screen').height;
let deviceWidth = Dimensions.get('screen').width;

let page = 0;

const ContractsScreen = props => {
  const {navigation, token} = props;
  const [topExpandedContract, setTopExpandedContract] = useState(
    new Animated.Value(deviceHeight + 500),
  );
  const [topNewContract, setTopNewContract] = useState(
    new Animated.Value(deviceHeight + 500),
  );
  const [translateYExpandedContract, setTranslateYExpandedContract] = useState(
    new Animated.Value(0),
  );
  const [translateYNewContract, setTranslateYNewContract] = useState(
    new Animated.Value(0),
  );
  const {loading, data, error, refetch, fetchMore, networkStatus} = useQuery(
    allContracts,
    {
      variables: {
        page: 0,
        filter: {},
        perPage: 20,
        sortField: 'ProjectId',
        sortOrder: 'ASC',
        currencyFilter: {},
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
  const fetchMoreContracts = () => {
    if (data.items.length < data.total.count) {
      page++;
      fetchMore({
        variables: {
          page: page,
          filter: {},
          perPage: 20,
          sortField: 'ProjectId',
          sortOrder: 'ASC',
          currencyFilter: {},
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
  const expandContract = () => {
    Animated.timing(topExpandedContract, {toValue: 0, duration: 500}).start();
    Animated.timing(translateYExpandedContract, {
      toValue: 0,
      duration: 0,
    }).start();
  };
  const newContract = () => {
    Animated.timing(topNewContract, {toValue: 0, duration: 500}).start();
    Animated.timing(translateYNewContract, {toValue: 0, duration: 0}).start();
  };
  const closeExpandedWorkSession = () => {
    return new Promise(() => {
      Keyboard.dismiss();
      setTimeout(() => {
        Animated.timing(topExpandedContract, {
          toValue: deviceHeight,
          duration: 0,
        }).start();
      }, 500);
      Animated.timing(translateYExpandedContract, {
        toValue: deviceHeight,
        duration: 500,
      }).start();
    });
  };
  const closeNewContract = () => {
    return new Promise(() => {
      Keyboard.dismiss();
      setTimeout(() => {
        Animated.timing(topNewContract, {
          toValue: deviceHeight,
          duration: 0,
        }).start();
      }, 500);
      Animated.timing(translateYNewContract, {
        toValue: deviceHeight,
        duration: 500,
      }).start();
    });
  };
  const onContractSave = () => {
    Keyboard.dismiss();
    setTopExpandedContract(new Animated.Value(deviceHeight + 500));
    setTranslateYExpandedContract(new Animated.Value(0));
  };
  const onContractCreate = () => {
    Keyboard.dismiss();
    setTopNewContract(new Animated.Value(deviceHeight + 500));
    setTranslateYNewContract(new Animated.Value(0));
  };
  const onLayout = event => {
    deviceHeight = event.nativeEvent.layout.height;
    deviceWidth = event.nativeEvent.layout.width;
  };
  return (
    <Container onLayout={event => onLayout(event)}>
      <MenuBar title="Contracts" navigation={navigation} />
      <Contracts
        onExpandContract={expandContract}
        contracts={data ? data.items : []}
        fetchMoreContracts={fetchMoreContracts}
        totalCount={data ? data.total.count : 0}
        currencies={data ? data.currencies : []}
      />
      <ButtonContainer>
        <TouchableOpacity onPress={newContract}>
          <AddButtonIcon />
        </TouchableOpacity>
      </ButtonContainer>
      {!loading && (
        <AnimatedContractModal
          style={{
            transform: [{translateY: translateYExpandedContract}],
            top: topExpandedContract,
          }}>
          <ContractExpanded
            closeWorkSession={closeExpandedWorkSession}
            onContractSave={onContractSave}
            resetPageCount={resetPageCount}
          />
        </AnimatedContractModal>
      )}
      {/*{!loading && (*/}
        {/*<AnimatedContractModal*/}
          {/*style={{*/}
            {/*transform: [{translateY: translateYNewContract}],*/}
            {/*top: topNewContract,*/}
          {/*}}>*/}
          {/*<WorkSessionNew*/}
            {/*lastWorkSession={data ? data.items[0] : null}*/}
            {/*contracts={data ? data.contracts : []}*/}
            {/*closeWorkSession={closeNewContract}*/}
            {/*onContractCreate={onContractCreate}*/}
            {/*resetPageCount={resetPageCount}*/}
          {/*/>*/}
        {/*</AnimatedContractModal>*/}
      {/*)}*/}
    </Container>
  );
};

ContractsScreen.proptypes = {
  navigation: PropTypes.object,
  token: PropTypes.string,
};

ContractsScreen.defaultProps = {
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
)(ContractsScreen);
