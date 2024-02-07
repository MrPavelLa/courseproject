const initialState = {
  webtype: null,
  webcode: null,
};

const webDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_WEB_DATA':
      return { ...state, webtype: action.payload.webtype, webcode: action.payload.webcode };
    case 'CLEAR_WEB_DATA':
      return { ...state, webtype: null, webcode: null };
    default:
      return state;
  }
};

export default webDataReducer;


