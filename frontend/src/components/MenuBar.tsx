import React from 'react';
import { RootState } from '../store'; // Adjust the path as necessary
import { setActiveMenu } from '../store/menuSlice'; // Adjust the path as necessary
import './MenuBar.css';
import binderIcon from '../assets/icons/binder.png';
import userIcon from '../assets/icons/user-icon.png'
import {useAppDispatch, useAppSelector} from "../store/hooks.ts";
import {useAuth0} from "@auth0/auth0-react";
import { clearUUID } from '../store/userSlice';


const MenuBar: React.FC = () => {
    const activeMenu = useAppSelector((state: RootState) => state.menu.activeMenu);
    const dispatch = useAppDispatch();

    const { logout } = useAuth0();
    
    const handleLogoutClick = () => {
        dispatch(clearUUID());
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    const handleDragStart = (event: React.DragEvent<HTMLImageElement>) => event.preventDefault();

    return (
        <div className="menu-bar-container">
            <div
                className={`menu-item ${activeMenu === 'binder' ? 'active' : ''}`}
                onClick={() => dispatch(setActiveMenu('binder'))}
            >
                <img src={binderIcon} alt="CodeBinder" className="menu-icon" onDragStart={handleDragStart} />
                <div className="menu-text">CodeBinder</div>
            </div>

            <div className="bottom-icons">
                <div className="logout-button" onClick={handleLogoutClick}>
                    <img src={userIcon} alt="Logout" className="menu-icon" onDragStart={handleDragStart}/>
                    <div className="menu-text">Logout</div>
                </div>
            </div>
        </div>
    );
};

export default MenuBar;