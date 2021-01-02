import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import reportWebVitals from './reportWebVitals';
import 'fontsource-roboto';
import {createStore} from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import { BrowserRouter } from "react-router-dom";

const store = createStore(rootReducer)

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App/>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
