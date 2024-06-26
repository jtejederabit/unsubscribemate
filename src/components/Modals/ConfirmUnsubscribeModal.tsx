import React from 'react';
import Modal from 'react-modal';

interface ConfirmUnsubscribeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onDeleteChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    deleteAfterUnsubscribe: boolean;
}

const ConfirmUnsubscribeModal: React.FC<ConfirmUnsubscribeModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    onDeleteChange,
    deleteAfterUnsubscribe,
}) => (
    <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Confirm Unsubscribe Modal"
        className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
    >
        <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Did you unsubscribe?</h2>
            <div className="mb-4">
                <label className="text-gray-700">
                    <input
                        type="checkbox"
                        checked={deleteAfterUnsubscribe}
                        onChange={onDeleteChange}
                        className="mr-2"
                    />
                    Delete email after successful unsubscribe
                </label>
            </div>
            <button
                onClick={onConfirm}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
                Yes
            </button>
            <button
                onClick={onClose}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
                No
            </button>
        </div>
    </Modal>
);

export default ConfirmUnsubscribeModal;
