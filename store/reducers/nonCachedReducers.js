const initialState = {
  userRoles: null,
  selectedWorkSession: null,
  selectedContract: null,
  selectedUser: null,
};

const nonCachedReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_ROLES':
      return {
        ...state,
        userRoles: action.userRoles,
      };
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
    case 'SET_SELECTED_USER':
      return {
        ...state,
        selectedUser: action.user,
      };
    default: {
      return state;
    }
  }
};

// Exports
export default nonCachedReducer;
