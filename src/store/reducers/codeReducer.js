// codeReducer.js
const initialState = {
  usercode: null,
};

const codeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_CODE':
      return { ...state, usercode: action.payload };
    case 'CLEAR_CODE':
      return { ...state, usercode: null };
    default:
      return state;
  }
};

export default codeReducer;

