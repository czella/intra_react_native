const initialState = {
  deviceHeight: 0,
  deviceWidth: 0,
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
    default: {
      return state;
    }
  }
};

// Exports
export default nonCachedReducer;
