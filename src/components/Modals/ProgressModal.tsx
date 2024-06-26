import React from 'react';
import Modal from 'react-modal';

interface ProgressModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    progress: number;
    totalLinks: number;
}

const ProgressModal: React.FC<ProgressModalProps> = ({
     isOpen,
     onRequestClose,
     progress,
     totalLinks
}) => (
    <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Progress Modal"
        className="bg-white p-6 rounded shadow-md w-96 min-w-52 mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
    >
        <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
                <div>
                    <span className="text-xs flex font-semibold py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200">
                        {
                            progress !== totalLinks ? <span className="loader mr-2" style={{width: 15, height: 15}}></span> :
                                (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check mr-2">
                                        <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                )
                        }
                        {progress === totalLinks ? 'Processed' : 'Processing'}
                    </span>
                </div>
                <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-pink-600">
                        {`${Math.round((progress / totalLinks) * 100)}%`}
                    </span>
                </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
                <div style={{ width: `${(progress / totalLinks) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"></div>
            </div>
            <div className="text-center text-sm">
                {progress} of {totalLinks} links processed
            </div>
        </div>
    </Modal>
);

export default ProgressModal;
