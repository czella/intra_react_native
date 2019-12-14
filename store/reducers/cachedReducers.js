const initialState = {
  token: '',
};

const cachedReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.token,
      };
    // Default
    default: {
      return state;
    }
  }
};

// Exports
export default cachedReducer;
