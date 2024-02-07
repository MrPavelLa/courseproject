// roleReducer.js
const initialState = {
  userrole: null,
};

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_ROLE':
      return { ...state, userrole: action.payload };
    case 'CLEAR_ROLE':
      return { ...state, userrole: null };
    default:
      return state;
  }
};

export default roleReducer;
