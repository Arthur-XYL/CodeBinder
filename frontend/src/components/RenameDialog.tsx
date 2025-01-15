import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { renameItemAsync } from '../store/itemSlice';
import {BinderItem} from "../types/itemTypes.ts";
import {useAppDispatch, useAppSelector} from "../store/hooks.ts"; // Assuming you have an async thunk to handle rename

type RenameDialogProps = {
    isOpen: boolean;

    item: BinderItem;
    onClose: () => void;
};

const RenameDialog: React.FC<RenameDialogProps> = ({ isOpen, item, onClose }) => {
    const dispatch = useAppDispatch();
    const [newName, setNewName] = useState(item.name);
    const uuid = useAppSelector((state) => state.user.uuid);


    const handleRenameClick = () => {
        if (newName !== item.name && newName.trim()) {
            dispatch(renameItemAsync({ itemId: item.id, newName, type: item.type, userId: uuid }));
        }

        setNewName('');
        onClose();
    };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Rename "{item.name}"</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>New Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter new name"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {
                    setNewName('');
                    onClose();
                }}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleRenameClick}>
                    Rename
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RenameDialog;