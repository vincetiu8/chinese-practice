import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import * as serviceWorker from "./serviceWorker";
import {Provider} from "react-redux";
import store from './app/store'

ReactDOM.render((
	<BrowserRouter>
		<Provider store={store}>
			<App />
		</Provider>
	</BrowserRouter>
	), document.getElementById('root'));

serviceWorker.unregister();