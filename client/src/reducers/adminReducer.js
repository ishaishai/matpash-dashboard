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
  DELETE_TABLE_ERROR,
  DELETE_TABLE_LOADING,
  DELETE_TABLE_SUCCESS,
  FETCH_CONCEPT_LOADING,
  FETCH_CONCEPT_ERROR,
  FETCH_CONCEPT_SUCCESS,
  ADD_CONCEPT_LOADING,
  ADD_CONCEPT_SUCCESS,
  ADD_CONCEPT_ERROR,
  DELETE_CONCEPT_LOADING,
  DELETE_CONCEPT_SUCCESS,
  DELETE_CONCEPT_ERROR,
} from '../actions/types';

const initialState = {
  loading: false,
  error: null,
  result: 'null',
  tableNames: [],
  concepts: [],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  const { type, payload } = action;
  console.log(action, 'action');
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
        error: null,
      };
    case FETCH_TABLE_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case DELETE_TABLE_LOADING:
      return {
        ...state,
        loading: true,
      };
    case DELETE_TABLE_SUCCESS:
      return {
        ...state,
        loading: false,
        result: payload,
        error: null,
      };
    case DELETE_TABLE_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case FETCH_CONCEPT_LOADING:
      return {
        ...initialState,
        loading: true,
      };
    case FETCH_CONCEPT_SUCCESS: {
      return {
        ...initialState,
        concepts: payload,
        loading: false,
      };
    }
    case FETCH_CONCEPT_ERROR: {
      return {
        ...initialState,
        loading: false,
        error: null, ///add error
      };
    }
    case ADD_CONCEPT_LOADING: {
      console.log('ADDCONCEPT');
      console.log(action);
      return {
        ...state,
        loading: true,
      };
    }
    case ADD_CONCEPT_ERROR: {
      return {
        ...state,
        loading: false,
        error: payload, // change error
      };
    }
    case ADD_CONCEPT_SUCCESS: {
      return {
        ...state,
        concepts: [...state.concepts, payload],
        loading: false,
      };
    }
    case DELETE_CONCEPT_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case DELETE_CONCEPT_SUCCESS: {
      return {
        ...state,
        concepts: state.concepts.filter(item => item.title !== payload),
        loading: false,
      };
    }
    case DELETE_CONCEPT_ERROR: {
      return {
        ...state,
        error: null, //change error
        loading: payload,
      };
    }

    default:
      return state;
  }
};
