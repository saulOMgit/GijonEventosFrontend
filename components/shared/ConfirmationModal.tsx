
import React from 'react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
    confirmButtonText?: string;
    cancelButtonText?: string;
    loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
    confirmButtonText = 'Confirmar',
    cancelButtonText = 'Cancelar',
    loading = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div>
                <div className="mt-2">
                    {children}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                        {cancelButtonText}
                    </Button>
                    <Button type="button" variant="danger" onClick={onConfirm} loading={loading}>
                        {confirmButtonText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
