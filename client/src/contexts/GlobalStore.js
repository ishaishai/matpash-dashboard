import React, { useReducer, createContext } from 'react';
import appReducer from './appReducer';
import axios from 'axios';

import { FETCH_USER } from './types';

const initialState = {
  user: null,
};

export const GlobalContext = createContext(initialState);

const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/current_user');
      const { user } = res.data;
      dispatch({ type: FETCH_USER, payload: user });
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <GlobalContext.Provider value={{ user: state.user, fetchUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
