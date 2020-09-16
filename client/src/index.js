import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Statistics from './components/Statistics/Statistics'

import axios from 'axios';

window.axios = axios;

ReactDOM.render(<App />, document.querySelector('#root'));
