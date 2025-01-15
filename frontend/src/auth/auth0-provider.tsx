import { useNavigate } from 'react-router-dom';
import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { ReactNode } from 'react';

interface Auth0ProviderWithHistoryProps {
    children: ReactNode;
}

const Auth0ProviderWithHistory = ({ children }: Auth0ProviderWithHistoryProps) => {
    const domain = import.meta.env.VITE_AUTH0_DOMAIN as string;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string;

    const navigate = useNavigate();

    const onRedirectCallback = (appState?: AppState) => {
        navigate(appState?.returnTo || '/');
    };

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: window.location.origin
            }}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
};

export default Auth0ProviderWithHistory;