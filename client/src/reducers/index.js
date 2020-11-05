import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import userReducer from './userReducer';
import adminReducer from './adminReducer';

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  users: userReducer,
  admin: adminReducer,
});
