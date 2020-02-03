import React from 'react';
import {useSelector} from 'react-redux';
import decodeJwt from 'jwt-decode';

export const useRole = () => {
  const token = useSelector(state => state.cachedReducer.token);
  if (!token) {
    return null;
  }
  return decodeJwt(token).role || null;
};

export const ADMIN_ROLE = 'admin';
export const DEVELOPER_ROLE = 'developer';
export const PROJECT_OWNER_ROLE = 'projectOwner';

export const hasPermission = (permissions, role) => {
  return permissions.indexOf(role) !== -1;
};
