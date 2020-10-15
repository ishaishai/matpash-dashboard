import axios from 'axios';
import {
  LOG_OUT,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  CREATE_USER_ERROR,
  CREATE_USER_LOADING,
  FETCH_USER_LOADING,
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,
  CHECK_EXCEL_LOADING,
  CHECK_EXCEL_ERROR,
  CHECK_EXCEL_SUCCESS,
} from './types';

export const fetchUser = () => async dispatch => {
  dispatch({ type: FETCH_USER_LOADING });

  try {
    const response = await axios.get('/api/current_user');

    dispatch({ type: FETCH_USER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_USER_ERROR, payload: error.response.data });
  }
};

export const login = (user, history) => async dispatch => {
  dispatch({ type: FETCH_USER_LOADING });
  try {
    const response = await axios.post('/api/login', user);
    dispatch({ type: FETCH_USER_SUCCESS, payload: response.data });
    history.push('/');
  } catch (error) {
    dispatch({ type: FETCH_USER_ERROR, payload: error.response.data });
  }
};

export const logout = () => {
  return {
    type: LOG_OUT,
  };
};

export const createUser = user => async dispatch => {
  dispatch({ type: CREATE_USER_LOADING, payload: true });

  try {
    const response = await axios.post('/api/register', user);

    dispatch({ type: CREATE_USER_SUCCESS });
  } catch (error) {
    dispatch({ type: CREATE_USER_ERROR, payload: error.response.data });
  }
};

export const fetchStatistics = () => async dispatch => {};

export const checkExcel = excelFile => async dispatch => {
  dispatch({ type: CHECK_EXCEL_LOADING });

  try {
    const response = await axios.post('/api/upload/check-excel');
    dispatch({ type: CHECK_EXCEL_SUCCESS, payload: response.data });
  } catch (error) {
    console.log(error.response.data);
    dispatch({ type: CHECK_EXCEL_ERROR, payload: error.response.data });
  }
};
