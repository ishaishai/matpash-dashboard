import {
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,
  FETCH_USER_LOADING,
  LOG_OUT,
} from '../actions/types';

const initialState = {
  isLoading: false,
  user: null,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...initialState,
        user: action.payload || false,
      };
    case FETCH_USER_ERROR:
      return {
        ...initialState,
        user: false,
        error: action.payload,
      };
    case LOG_OUT:
      return undefined;
    default:
      return state;
  }
};
