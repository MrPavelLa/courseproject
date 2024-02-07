// rootReducer.js
import { combineReducers } from 'redux';
import codeReducer from './codeReducer';
import roleReducer from './roleReducer';
import taskReducer from './taskReducer';
import webDataReducer from './webDataReducer';

const rootReducer = combineReducers({
  code: codeReducer,
  role: roleReducer,
  task: taskReducer,
  webData: webDataReducer,
});

export default rootReducer;


