import React from 'react';
import Modal from 'react-modal';

interface ConfirmModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onConfirm: () => void;
    deleteAfterUnsubscribe: boolean;
    onDeleteAfterUnsubscribeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
   isOpen,
   onRequestClose,
   onConfirm,
   deleteAfterUnsubscribe,
   onDeleteAfterUnsubscribeChange
}) => (
    <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Confirm Bulk Action Modal"
        className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
    >
        <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Bulk Action</h2>
            <div className="mb-4">
                <label className="text-gray-700">
                    <input
                        type="checkbox"
                        checked={deleteAfterUnsubscribe}
                        onChange={onDeleteAfterUnsubscribeChange}
                        className="mr-2"
                    />
                    Delete emails after successful unsubscribe
                </label>
            </div>
            <button
                onClick={onConfirm}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
                Confirm
            </button>
            <button
                onClick={onRequestClose}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
                Cancel
            </button>
        </div>
    </Modal>
);

export default ConfirmModal;
