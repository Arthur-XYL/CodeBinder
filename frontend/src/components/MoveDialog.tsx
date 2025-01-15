import React, { useState, useEffect } from 'react';
import { Modal, Button, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import { moveItemAsync } from '../store/itemSlice';
import { BinderItem, DirectoryItem } from '../types/itemTypes';

type MoveDialogProps = {
    isOpen: boolean;
    item: BinderItem;
    onClose: () => void;
};

const api = 'https://d23cilp68kckkp.cloudfront.net';

const MoveDialog: React.FC<MoveDialogProps> = ({ isOpen, item, onClose }) => {
    const dispatch = useAppDispatch();
    const uuid = useAppSelector((state) => state.user.uuid);

    const [destinationDirectory, setDestinationDirectory] = useState<DirectoryItem | null>(null);
    const [path, setPath] = useState<DirectoryItem[]>([]);
    const [directories, setDirectories] = useState<DirectoryItem[]>([]);

    const fetchDirectories = async (directoryId?: number, movingDirectoryId?: number) => {
        const apiUrl = directoryId ? `/api/codebinder/directories/${uuid}/${directoryId}/` : `/api/codebinder/directories/${uuid}/`;

        try {
            const { data } = await axios.get(api + apiUrl);
            const filteredDirectories = data.subdirectories.filter((dir: DirectoryItem) => dir.id !== movingDirectoryId);
            setDirectories(filteredDirectories);
        } catch (error) {
            console.error('Failed to fetch directories:', error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            const movingDirectoryId = item.type === 'directory' ? item.id : undefined;
            fetchDirectories(undefined, movingDirectoryId);
        }
    }, [isOpen, item]);

    const handleDirectoryClick = (directory: DirectoryItem) => {
        setPath(prev => [...prev, directory]);
        setDestinationDirectory(directory);
        fetchDirectories(directory.id, item.type === 'directory' ? item.id : undefined);
    };

    const handleBackClick = () => {
        const newPath = path.slice(0, -1);
        const backDirectory = newPath.length > 0 ? newPath[newPath.length - 1] : null;
        setPath(newPath);
        setDestinationDirectory(backDirectory);
        if (backDirectory) {
            fetchDirectories(backDirectory.id, item.type === 'directory' ? item.id : undefined);
        } else {
            fetchDirectories(undefined, item.type === 'directory' ? item.id : undefined);
        }
    };

    const handleMoveClick = () => {
        if (destinationDirectory) {
            dispatch(moveItemAsync({ itemId: item.id, newDirectoryId: destinationDirectory.id, type: item.type, userId: uuid }));
        } else {
            dispatch(moveItemAsync({ itemId: item.id, newDirectoryId: null, type: item.type, userId: uuid }));
        }
        setDestinationDirectory(null);
        onClose();
    };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Move Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {destinationDirectory ? destinationDirectory.name : 'Select a directory'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {path.length > 0 && (
                            <Dropdown.Item onClick={handleBackClick}>Back</Dropdown.Item>
                        )}
                        {directories.map(dir => (
                            <Dropdown.Item key={dir.id} onClick={() => handleDirectoryClick(dir)}>
                                {dir.name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {
                    setDestinationDirectory(null);
                    onClose();
                }}>Cancel</Button>
                <Button variant="primary" onClick={handleMoveClick}>Move</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MoveDialog;