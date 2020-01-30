const initialState = {
  deviceHeight: 0,
  deviceWidth: 0,
  selectedWorkSession: null,
  selectedContract: null,
};

const nonCachedReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SELECTED_WORK_SESSION':
      return {
        ...state,
        selectedWorkSession: action.workSession,
      };
    case 'SET_SELECTED_CONTRACT':
      return {
        ...state,
        selectedContract: action.contract,
      };
    default: {
      return state;
    }
  }
};

// Exports
export default nonCachedReducer;
