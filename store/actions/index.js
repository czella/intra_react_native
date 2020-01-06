export const setToken = token => ({
  type: 'SET_TOKEN',
  token,
});

export const setDeviceHeight = height => ({
  type: 'SET_DEVICE_HEIGHT',
  height,
});

export const setDeviceWidth = width => ({
  type: 'SET_DEVICE_WIDTH',
  width,
});

export const setSelectedWorkSession = workSession => ({
  type: 'SET_SELECTED_WORK_SESSION',
  workSession,
});

export const setWorkSessionsEdited = workSessionsEdited => ({
  type: 'SET_WORK_SESSIONS_EDITED',
  workSessionsEdited,
});
