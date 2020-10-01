import axios from 'axios';
import {
  CLEAR_ERRORS,
  FETCH_USER,
  CREATE_USER,
  GET_ERRORS,
  LOADING,
  LOG_OUT,
  CREATE_USER_SUCCESS,
} from './types';

export const fetchUser = () => async dispatch => {
  try {
    const response = await axios.get('/api/current_user');

    dispatch({ type: FETCH_USER, payload: response.data });
  } catch (error) {
    dispatch(getErrors(error.response.data));
    dispatch({ type: FETCH_USER, payload: false });
  }
};

export const login = (user, history) => async dispatch => {
  dispatch({ type: LOADING, payload: true });
  try {
    const response = await axios.post('/api/login', user);

    dispatch({ type: FETCH_USER, payload: response.data });
    history.push('/');
  } catch (error) {
    dispatch(getErrors(error.response.data));
    dispatch({ type: FETCH_USER, payload: false });
  }
};

export const logout = () => {
  return {
    type: LOG_OUT,
  };
};

export const createUser = user => async dispatch => {
  dispatch({ type: CREATE_USER, payload: true });
  try {
    const response = await axios.post('/api/register', user);

    dispatch({ type: CREATE_USER_SUCCESS });
  } catch (error) {
    dispatch(getErrors(error.response.data));
  }
};

export const fetchStatistics = () => async dispatch => {};

export const getErrors = error => {
  return {
    type: GET_ERRORS,
    payload: error,
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};
