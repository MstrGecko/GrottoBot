/**
 * React renderer.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Http from 'http';
// Import the styles here to process them with webpack
import '@public/style.css';
import { Main } from './components/Index';

ReactDOM.render(<Main />, document.getElementById('app'));
