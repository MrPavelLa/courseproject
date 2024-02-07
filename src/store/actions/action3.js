// action2.js
export const saveTask = (value) => {
  return {
    type: 'SAVE_TASK',
    payload: value,
  };
};

export const clearTask = () => {
  return {
    type: 'CLEAR_TASK',
  };
};