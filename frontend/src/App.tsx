import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import MenuBar from './components/MenuBar';
import Section from "./components/Section";
import './App.css';
import { setUUID } from './store/userSlice';
import {useAppDispatch} from "./store/hooks.ts";
import {fetchDirectoryContents} from "./store/itemSlice.ts";

function App() {
    const { isAuthenticated, user, loginWithRedirect, isLoading } = useAuth0();
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            loginWithRedirect();
        }
        if (isAuthenticated && user?.sub) {
            dispatch(setUUID(user.sub));
            dispatch(fetchDirectoryContents({directoryId: null, userId: user.sub}));
        }
    }, [isAuthenticated, isLoading, loginWithRedirect, user]);

    if (!isAuthenticated || isLoading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="app-container">
            <MenuBar />
            <Section />
        </div>
    );
}

export default App;