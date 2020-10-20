import {
  CHECK_EXCEL_ERROR,
  CHECK_EXCEL_LOADING,
  CHECK_EXCEL_SUCCESS,
  RESET_RESULTS,
} from '../actions/types';

const initialState = {
  loading: false,
  error: null,
  result: 'null',
};

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
    default:
      return state;
  }
};
