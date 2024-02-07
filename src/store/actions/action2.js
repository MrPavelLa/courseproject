// action2.js
export const saveRole = (value) => {
  return {
    type: 'SAVE_ROLE',
    payload: value,
  };
};

export const clearRole = () => {
  return {
    type: 'CLEAR_ROLE',
  };
};