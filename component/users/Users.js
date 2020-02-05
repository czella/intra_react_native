import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {FlatList, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setSelectedUser} from '../../store/actions';
import Picker from '../util/Picker';
import User from './User';

const mapDispatchToProps = dispatch => ({
  setSelectedUser: user => dispatch(setSelectedUser(user)),
});

const properties = [
  {label: 'Email', value: 'email'},
  {label: 'Role', value: 'role'},
];
const Users = props => {
  const {
    setSelectedUser,
    onExpandUser,
    users,
    fetchMoreUsers,
    totalCount,
  } = props;
  const [displayedProperty, setDisplayedProperty] = useState(properties[0]);
  const renderFooter = () => {
    if (users.length < totalCount) {
      return (
        <LoaderContainer style={{paddingVertical: 45}}>
          <ActivityIndicator size="large" color="#7423B5" />
        </LoaderContainer>
      );
    }
    return null;
  };
  const showUser = index => {
    setSelectedUser(users[index]);
    onExpandUser();
  };
  return (
    <Container>
      <TableHeader>
        <Project>Name</Project>
        <PropertyPickerContainer>
          <Picker
            onValueChange={(itemValue, index) => {
              setDisplayedProperty(properties[index]);
            }}
            value={displayedProperty.value}
            items={properties}
            label={displayedProperty.label}
            labelStyle={{fontSize: 18}}
          />
        </PropertyPickerContainer>
      </TableHeader>
      <FlatList
        data={users}
        renderItem={({item, index}) => (
          <User
            name={item ? item.username : ''}
            displayedProperty={item[displayedProperty.value]}
            index={index}
            showUser={showUser}
          />
        )}
        keyExtractor={item => item.id}
        ListFooterComponent={renderFooter}
        onEndReached={fetchMoreUsers}
        onEndReachedThreshold={0.5}
        initialNumToRender={20}
      />
    </Container>
  );
};

Users.propTypes = {
  setSelectedUser: PropTypes.func,
  onExpandUser: PropTypes.func,
  users: PropTypes.array,
  userRoles: PropTypes.array,
  currencies: PropTypes.array,
  fetchMoreUsers: PropTypes.func,
  totalCount: PropTypes.number,
};

Users.defaultProps = {
  setSelectedUser: () => {},
  onExpandUser: () => {},
  users: [],
  userRoles: [],
  currencies: [],
  fetchMoreUsers: () => {},
  totalCount: 0,
};

const Container = styled.View`
  padding: 10px 10px 0px 10px;
  flex: 1;
`;

const LoaderContainer = styled.View``;

const TableHeader = styled.View`
  display: flex;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: grey;
  height: 40px;
`;

const Project = styled.Text`
  flex: 0.8;
  font-size: 18px;
  color: grey;
  line-height: 40px;
`;

const PropertyPickerContainer = styled.View`
  width: 160px;
  flex: 1;
`;

export default connect(
  null,
  mapDispatchToProps,
)(Users);
