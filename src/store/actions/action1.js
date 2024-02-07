// action1.js
export const saveCode = (value) => {
  return {
    type: 'SAVE_CODE',
    payload: value,
  };
};

export const clearCode = () => {
  return {
    type: 'CLEAR_CODE',
  };
};