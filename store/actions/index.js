export const setToken = token => ({
  type: 'SET_TOKEN',
  token,
});

export const setSelectedWorkSession = workSession => ({
  type: 'SET_SELECTED_WORK_SESSION',
  workSession,
});
