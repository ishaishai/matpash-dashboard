import axios from 'axios';
import { AUTH_ERROR, CLEAR_ERRORS, FETCH_USER, GET_ERRORS } from './types';

export const fetchUser = () => async dispatch => {
  try {
    const response = await axios.get('/api/current_user');

    dispatch({ type: FETCH_USER, payload: response.data });
  } catch (error) {
    dispatch(getErrors(error.response.data.error));
    dispatch({ type: AUTH_ERROR });
    dispatch({ type: FETCH_USER, payload: false });
  }
};

export const login = user => async dispatch => {
  try {
    const response = await axios.post('/api/login', user);

    dispatch({ type: FETCH_USER, payload: response.data });
  } catch (error) {
    dispatch(getErrors(error.response.data.error));
    dispatch({ type: AUTH_ERROR });
    dispatch({ type: FETCH_USER, payload: false });   
  }
};

export const getErrors = msg => {
  return {
    type: GET_ERRORS,
    payload: { msg },
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};
