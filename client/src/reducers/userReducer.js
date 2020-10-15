import {
  CREATE_USER_SUCCESS,
  CREATE_USER_ERROR,
  CREATE_USER_LOADING,
} from '../actions/types';

const initialState = {
  success: false,
  isLoading: false,
  errors: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER_SUCCESS:
      return {
        ...initialState,
        success: true,
      };
    case CREATE_USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case CREATE_USER_ERROR:
      return {
        ...initialState,
        errors: action.payload,
      };
    default:
      return state;
  }
};
