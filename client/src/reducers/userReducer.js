import { CREATE_USER, CREATE_USER_SUCCESS } from '../actions/types';

const initialState = {
  success: false,
  isLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER_SUCCESS:
      return {
        success: true,
        isLoading: false,
      };
    case CREATE_USER:
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
};
