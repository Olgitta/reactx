import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {ConfigProvider} from './contexts/ConfigContext';
import {PopupProvider} from './contexts/PopupContext.tsx';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <ConfigProvider>
            <PopupProvider>
                <App/>
            </PopupProvider>
        </ConfigProvider>
    </React.StrictMode>
);
