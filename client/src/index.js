import React from 'react';
import ReactDOM from 'react-dom';
import GlobalProvider from './contexts/GlobalStore';
import App from './components/App';

ReactDOM.render(
  <GlobalProvider>
    <App />
  </GlobalProvider>,
  document.getElementById('root')
);
