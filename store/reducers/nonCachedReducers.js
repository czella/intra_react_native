const initialState = {
  deviceHeight: 0,
  deviceWidth: 0,
  selectedWorkSession: null,
};

const nonCachedReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DEVICE_HEIGHT':
      return {
        ...state,
        deviceHeight: action.height,
      };
    case 'SET_DEVICE_WIDTH':
      return {
        ...state,
        deviceWidth: action.width,
      };
    case 'SET_SELECTED_WORK_SESSION':
      return {
        ...state,
        selectedWorkSession: action.workSession,
      };
    default: {
      return state;
    }
  }
};

// Exports
export default nonCachedReducer;
