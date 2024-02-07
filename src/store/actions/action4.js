export const saveWebData = (webtype, webcode) => ({
  type: 'SAVE_WEB_DATA',
  payload: { webtype, webcode },
});

export const clearWebData = () => ({
  type: 'CLEAR_WEB_DATA',
});
