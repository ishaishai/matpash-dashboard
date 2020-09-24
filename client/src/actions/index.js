import axios from 'axios';
import { FETCH_USER } from './types';

export const fetchUser = () => async dispatch => {
  try {
    const response = await axios.get('/api/current_user');
    dispatch({ type: FETCH_USER, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_USER, payload: false });
  }
};

export const login = user => async dispatch => {
  try {
    const response = await axios.post('/api/login', user);

    dispatch({ type: FETCH_USER, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_USER, payload: false });
  }
};
