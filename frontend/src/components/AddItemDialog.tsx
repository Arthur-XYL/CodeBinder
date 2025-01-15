import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import {useAppDispatch, useAppSelector} from "../store/hooks.ts";
import { addItemAsync } from '../store/itemSlice';
import {RootState} from "../store";


type AddItemDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

const AddItemDialog: React.FC<AddItemDialogProps> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const { currentDirectory } = useAppSelector((state: RootState) => state.item);
    const uuid = useAppSelector((state) => state.user.uuid);

    const [itemType, setItemType] = useState<'directory' | 'snippet'>('directory');
    const [itemName, setItemName] = useState('');

    const handleAddClick = () => {
        if (itemName.trim()) {
            const payload = {
                type: itemType,
                name: itemName,
                currentDirectoryId: currentDirectory?.id ?? null,
                userId: uuid
            };
            dispatch(addItemAsync(payload));

            setItemType('directory');
            setItemName('');
            onClose();
        }
    };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Check
                            type="radio"
                            label="Directory"
                            name="itemType"
                            value="directory"
                            checked={itemType === 'directory'}
                            onChange={() => setItemType('directory')}
                        />
                        <Form.Check
                            type="radio"
                            label="Snippet"
                            name="itemType"
                            value="snippet"
                            checked={itemType === 'snippet'}
                            onChange={() => setItemType('snippet')}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            placeholder="Enter name"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {
                    setItemType('directory');
                    setItemName('');
                    onClose();
                }}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleAddClick}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddItemDialog;
