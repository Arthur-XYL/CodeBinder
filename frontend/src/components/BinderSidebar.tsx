import React, { useRef, useState } from 'react';

import { RootState } from '../store';
import { setSelectedSnippet, fetchDirectoryContents } from '../store/itemSlice';
import { BinderItem } from '../types/itemTypes';
import { Dropdown, ListGroup } from 'react-bootstrap';
import directoryIcon from '../assets/icons/directory.png';
import snippetIcon from '../assets/icons/snippet.png';
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import './BinderSidebar.css';
import CustomDropdownToggle from './CustomDropdownToggle';
import AddItemDialog from "./AddItemDialog.tsx";
import RenameDialog from "./RenameDialog.tsx";
import MoveDialog from "./MoveDialog.tsx";
import DeleteDialog from "./DeleteDialog.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';

const BinderSidebar: React.FC<{ parentRef: React.RefObject<HTMLDivElement>; }> = ({parentRef}) => {
    const dispatch = useAppDispatch();
    const {items, currentDirectory, selectedSnippet,} = useAppSelector((state: RootState) => state.item);
    const uuid = useAppSelector((state) => state.user.uuid);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const isResizing = useRef<boolean>(false);
    const [width, setWidth] = useState(320); // Starting width of the sidebar
    const closeThreashold = 120;

    const [currentItem, setCurrentItem] = useState<BinderItem | null>(null);
    const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleSelectBinderItem = (item: BinderItem) => {
        if (item.type === 'directory') {
            dispatch(fetchDirectoryContents({directoryId: item.id, userId: uuid}));
        } else if (item.type === 'snippet') {
            dispatch(setSelectedSnippet(item));
        }
    };

    const handleReturnClick = () => {
        if (currentDirectory) {
            const directoryId = currentDirectory.directory || null;
            dispatch(fetchDirectoryContents({directoryId: directoryId, userId: uuid}));
        }
    };


    const startResize = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        isResizing.current = true;
        document.addEventListener('mousemove', resizing);
        document.addEventListener('mouseup', stopResize);
    };

    const resizing = (event: MouseEvent) => {
        if (isResizing.current && parentRef.current && containerRef.current) {
            const containerLeft = parentRef.current.getBoundingClientRect().left;
            const containerWidth = parentRef.current.clientWidth;
            const maxSidebarWidth = containerWidth - 320 - 6; // Adjust based on your layout
            const potentialWidth = event.clientX - containerLeft;

            let newWidth;
            if (potentialWidth < closeThreashold) newWidth = 0;
            else if (potentialWidth > parentRef.current.clientWidth - 120) newWidth = parentRef.current.clientWidth - 6;
            else newWidth = Math.max(240, Math.min(potentialWidth, maxSidebarWidth));
            setWidth(newWidth);
        }
    };

    const stopResize = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', resizing);
        document.removeEventListener('mouseup', stopResize);
    };
    const renderItem = (item: BinderItem) => (
        <ListGroup.Item key={`${item.type}-${item.id}`}

                        className={`item d-flex justify-content-between align-items-center ${item.type === 'snippet' && item.id === selectedSnippet?.id ? 'selected' : ''}`}
                        onClick={() => handleSelectBinderItem(item)}>
            <div className="item-content">
                <img src={item.type === 'directory' ? directoryIcon : snippetIcon} alt={item.type}
                     style={{marginRight: '12px'}}/>
                <span className="item-name">{item.name}</span>
            </div>
            <Dropdown onClick={(e) => e.stopPropagation()}>
                <Dropdown.Toggle as={CustomDropdownToggle}>
                    <span>⋮</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={(e) => {
                        e.stopPropagation();
                        setCurrentItem(item);
                        setIsRenameDialogOpen(true);
                    }}>Rename</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => {
                        e.stopPropagation();
                        setCurrentItem(item);
                        setIsMoveDialogOpen(true);
                    }}>Move</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => {
                        e.stopPropagation();
                        setCurrentItem(item);
                        setIsDeleteDialogOpen(true);
                    }}>Delete</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </ListGroup.Item>
    );

    return (
        <>
            <div className="sidebar-container" ref={containerRef}>
                <div className="sidebar" style={{width: `${width}px`}}>
                    <h1 className="sidebar-heading">CodeBinder</h1>
                    <hr className="heading-divider"/>
                    <button className="return-button" onClick={() => handleReturnClick()}>Return</button>
                    <hr className="heading-divider"/>
                    <ListGroup className="item-list">
                        {items.map(renderItem)}
                    </ListGroup>
                    <hr className="heading-divider"/>
                    <button className="add-button" onClick={() => {
                        setIsAddItemDialogOpen(true)
                    }}>+</button>
                </div>
                <div className="divider" onMouseDown={startResize}></div>
            </div>
            {<AddItemDialog isOpen={isAddItemDialogOpen} onClose={() => setIsAddItemDialogOpen(false)}/>}
            {currentItem && <RenameDialog isOpen={isRenameDialogOpen} item={currentItem}
                                          onClose={() => setIsRenameDialogOpen(false)}/>}
            {currentItem && <MoveDialog isOpen={isMoveDialogOpen} item={currentItem}
                                        onClose={() => setIsMoveDialogOpen(false)}/>}
            {currentItem && <DeleteDialog isOpen={isDeleteDialogOpen} item={currentItem}
                                          onClose={() => setIsDeleteDialogOpen(false)}/>}
        </>
    );
};

export default BinderSidebar;

