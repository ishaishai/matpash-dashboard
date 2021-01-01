import {
  CHECK_EXCEL_ERROR,
  CHECK_EXCEL_LOADING,
  CHECK_EXCEL_SUCCESS,
  SAVE_EXCEL_ERROR,
  SAVE_EXCEL_LOADING,
  SAVE_EXCEL_SUCCESS,
  RESET_RESULTS,
  FETCH_TABLE_NAMES_ERROR,
  FETCH_TABLE_NAMES_LOADING,
  FETCH_TABLE_NAMES_SUCCESS,
  FETCH_TABLE_ERROR,
  FETCH_TABLE_LOADING,
  FETCH_TABLE_SUCCESS,
} from '../actions/types';

const initialState = {
  loading: false,
  error: null,
  result: 'null',
  tableNames: []
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case CHECK_EXCEL_LOADING:
      return {
        ...initialState,
        loading: true,
      };
    case CHECK_EXCEL_SUCCESS:
      return {
        ...initialState,
        result: payload,
      };
    case CHECK_EXCEL_ERROR:
      return {
        ...initialState,
        error: payload,
      };
    case RESET_RESULTS:
      return initialState;
    case SAVE_EXCEL_LOADING:
      return {
        ...initialState,
        loading: true,
      };
    case SAVE_EXCEL_SUCCESS:
      return {
        ...initialState,
        result: payload,
      };
    case SAVE_EXCEL_ERROR:
      return {
        ...initialState,
        error: payload,
      };
    case FETCH_TABLE_NAMES_LOADING:
      return {
        ...initialState,
        loading: true,
      };
    case FETCH_TABLE_NAMES_SUCCESS:
      return {
        ...initialState,
        tableNames: payload,
      };
    case FETCH_TABLE_NAMES_ERROR:
      return {
        ...initialState,
        error: payload,
      };
    case FETCH_TABLE_LOADING:
      return {
        ...state,
        loading: true,
      };
    case FETCH_TABLE_SUCCESS:
      return {
        ...state,
        loading: false,
        result: payload,
      };
    case FETCH_TABLE_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};
