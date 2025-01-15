import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { deleteItemAsync } from '../store/itemSlice'; // Assuming you have a deleteItemAsync action
import { BinderItem } from '../types/itemTypes.ts';
import {useAppDispatch, useAppSelector} from "../store/hooks.ts"; // Ensure types are correct

type DeleteDialogProps = {
    isOpen: boolean;
    item: BinderItem;
    onClose: () => void;
};

const DeleteDialog: React.FC<DeleteDialogProps> = ({ isOpen, item, onClose  }) => {
    const dispatch = useAppDispatch();
    const uuid = useAppSelector((state) => state.user.uuid);

    const handleDelete = () => {
        if (item) {
            dispatch(deleteItemAsync({ itemId: item.id, type: item.type, userId: uuid }));
            onClose(); // Close the modal after action
        }
    };

    // Determine item type for display in the dialog
    const itemType = item?.type === 'directory' ? 'directory' : 'snippet';

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {`Are you sure you want to delete this ${itemType} named "${item?.name}"?`}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteDialog;