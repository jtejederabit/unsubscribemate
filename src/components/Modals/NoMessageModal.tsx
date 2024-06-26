import React from 'react';
import Modal from 'react-modal';

interface NoMessagesModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

const NoMessageModal: React.FC<NoMessagesModalProps> = ({
    isOpen,
    onRequestClose
}) => (
    <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="No Messages Modal"
        className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
    >
        <div className="text-center">
            <h2 className="text-xl font-bold mb-4">No messages to process</h2>
            <button
                onClick={onRequestClose}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Close
            </button>
        </div>
    </Modal>
);

export default NoMessageModal;
