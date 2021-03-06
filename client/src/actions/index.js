import axios from 'axios';
import {
  LOG_OUT,
  CREATE_USER_SUCCESS,
  CREATE_USER_ERROR,
  CREATE_USER_LOADING,
  FETCH_USER_LOADING,
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,
  CHECK_EXCEL_LOADING,
  CHECK_EXCEL_ERROR,
  CHECK_EXCEL_SUCCESS,
  SAVE_EXCEL_LOADING,
  SAVE_EXCEL_SUCCESS,
  SAVE_EXCEL_ERROR,
  RESET_RESULTS,
  FETCH_TABLE_NAMES_LOADING,
  FETCH_TABLE_NAMES_ERROR,
  FETCH_TABLE_NAMES_SUCCESS,
  FETCH_TABLE_ERROR,
  FETCH_TABLE_LOADING,
  FETCH_TABLE_SUCCESS,
  DELETE_TABLE_ERROR,
  DELETE_TABLE_LOADING,
  DELETE_TABLE_SUCCESS,
  FETCH_CONCEPT_LOADING,
  FETCH_CONCEPT_SUCCESS,
  FETCH_CONCEPT_ERROR,
  ADD_CONCEPT_LOADING,
  ADD_CONCEPT_SUCCESS,
  ADD_CONCEPT_ERROR,
  DELETE_CONCEPT_SUCCESS,
  DELETE_CONCEPT_ERROR,
  DELETE_CONCEPT_LOADING,
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
    await axios.post('/api/register', user);

    dispatch({ type: CREATE_USER_SUCCESS });
  } catch (error) {
    dispatch({ type: CREATE_USER_ERROR, payload: error.response.data });
  }
};

export const uploadExcelFile = (excelFile, history) => async dispatch => {
  dispatch({ type: CHECK_EXCEL_LOADING });

  try {
    const formData = new FormData();
    formData.append('excel-file', excelFile);
    const response = await axios.post('/api/upload/check-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch({ type: CHECK_EXCEL_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: CHECK_EXCEL_ERROR, payload: error.response.data });
    if (error.response.status === 500) {
      window.alert('משהו השתבש');
      history.push('/admin');
    }
  }
};

export const saveExcelFile = fileName => async dispatch => {
  dispatch({ type: SAVE_EXCEL_LOADING });

  try {
    const response = await axios.post(`/api/upload/save-excel`, { fileName });
    dispatch({ type: SAVE_EXCEL_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: SAVE_EXCEL_ERROR, payload: error.response.data });
  }
};

export const getTableNames = () => async dispatch => {
  dispatch({ type: FETCH_TABLE_NAMES_LOADING });

  try {
    const response = await axios.get('/api/tables/get-names');
    dispatch({ type: FETCH_TABLE_NAMES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_TABLE_NAMES_ERROR, payload: error.response.data });
  }
};

export const getTable = tableName => async dispatch => {
  dispatch({ type: FETCH_TABLE_LOADING });

  try {
    const response = await axios.get(`/api/tables/get-table/${tableName}`);
    dispatch({ type: FETCH_TABLE_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_TABLE_ERROR, payload: error.response.data });
  }
};

export const deleteTable = tableName => async dispatch => {
  dispatch({ type: DELETE_TABLE_LOADING });

  try {
    const response = await axios.delete(
      `/api/tables/delete-table/${tableName}`,
    );
    dispatch({ type: DELETE_TABLE_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: DELETE_TABLE_ERROR, payload: error.response.data });
  }
};

export const getConcepts = () => async dispatch => {
  dispatch({ type: FETCH_CONCEPT_LOADING });

  try {
    const response = await axios.get('/api/concepts/get-all');

    dispatch({ type: FETCH_CONCEPT_SUCCESS, payload: response.data.concepts });
  } catch (error) {
    dispatch({ type: FETCH_CONCEPT_ERROR, payload: error.response.data.msg });
  }
};

export const addConcept = concept => async dispatch => {
  console.log(concept);
  dispatch({ type: ADD_CONCEPT_LOADING });
  try {
    const response = await axios.post('/api/concepts/add-concept', { concept });
    console.log(response);
    console.log(concept);
    dispatch({ type: ADD_CONCEPT_SUCCESS, payload: concept });
  } catch (error) {
    console.log(error);
    dispatch({ type: ADD_CONCEPT_ERROR, payload: error.response.data.msg });
  }
};

export const deleteConcept = ({ title }) => async dispatch => {
  dispatch({ type: DELETE_CONCEPT_LOADING });
  try {
    const response = await axios.post('/api/concepts/delete-concept', {
      title,
    });
    dispatch({ type: DELETE_CONCEPT_SUCCESS, payload: title });
  } catch (error) {
    dispatch({ type: DELETE_CONCEPT_ERROR, payload: error.response.data.msg });
  }
};

export const resetResults = () => ({ type: RESET_RESULTS });
