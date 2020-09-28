import { FETCH_USER, LOADING, LOG_OUT } from '../actions/types';

const initialState = {
  isLoading: false,
  user: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      return {
        user: action.payload || false,
        isLoading: false,
      };
    case LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case LOG_OUT:
      return undefined;
    default:
      return state;
  }
};
