export const setToken = token => ({
  type: 'SET_TOKEN',
  token,
});

export const setUserRoles = userRoles => ({
  type: 'SET_USER_ROLES',
  userRoles,
});
export const setSelectedWorkSession = workSession => ({
  type: 'SET_SELECTED_WORK_SESSION',
  workSession,
});
export const setSelectedContract = contract => ({
  type: 'SET_SELECTED_CONTRACT',
  contract,
});
export const setSelectedUser = user => ({
  type: 'SET_SELECTED_USER',
  user,
});
