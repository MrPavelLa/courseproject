
const initialState = {
  taskcode: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_TASK':
      return { ...state, taskcode: action.payload };
    case 'CLEAR_TASK':
      return { ...state, taskcode: null };
    default:
      return state;
  }
};

export default taskReducer;

