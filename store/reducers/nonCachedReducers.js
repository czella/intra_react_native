const initialState = {
  deviceHeight: 0,
  deviceWidth: 0,
  selectedWorkSession: null,
  workSessionsEdited: false,
};

const nonCachedReducer = (state = initialState, action) => {
  switch (action.type) {
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
