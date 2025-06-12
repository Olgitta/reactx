import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {PopupProvider} from './contexts/PopupContext.tsx';
import { Provider } from 'react-redux';
import {store} from "./store.ts";

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <Provider store={store}>
                <PopupProvider>
                    <App/>
                </PopupProvider>
        </Provider>
    </React.StrictMode>
);
