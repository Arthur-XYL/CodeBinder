import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App.tsx';
import Auth0ProviderWithHistory from './auth/auth0-provider';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router>
            <Auth0ProviderWithHistory>
                <Provider store={store}>
                    <App />
                </Provider>
            </Auth0ProviderWithHistory>
        </Router>
    </React.StrictMode>
);