import React from 'react';
import {useSelector} from 'react-redux';
import decodeJwt from 'jwt-decode';

export const useUserId = () => {
  const token = useSelector(state => state.cachedReducer.token);
  if (!token) {
    return null;
  }
  return decodeJwt(token).id || null;
};
