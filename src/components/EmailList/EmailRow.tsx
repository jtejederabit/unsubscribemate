import React from 'react';
import { FaEnvelope, FaLink, FaQuestionCircle } from 'react-icons/fa';
import { Email } from '../../types';

interface EmailRowProps {
    email: Email;
    onSelectEmail: (id: string) => void;
    handleUnsubscribeClick: (email: Email) => void;
}

const EmailRow: React.FC<EmailRowProps> = ({
   email,
   onSelectEmail,
   handleUnsubscribeClick
}) => {

    const unsubscribeClick = (email: Email) => {
        if (email.status === 'unsubscribed') return;
        handleUnsubscribeClick(email);
        window.open(email.unsubscribeLink, '_blank');
    }

    return (
    <tr key={email.id} className={email.selected ? "bg-gray-100" : ""}>
        <td className="px-6 py-4">
            <input
                type="checkbox"
                checked={email.selected}
                onChange={() => onSelectEmail(email.id)}
            />
        </td>
        <td className="px-6 py-4">
            {email.unsubscribeType === 'email' && <FaEnvelope className="text-gray-500" />}
            {email.unsubscribeType === 'link' && <FaLink className="text-gray-500" />}
            {email.unsubscribeType === 'unknown' && <FaQuestionCircle className="text-gray-500" />}
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">
            {email.from}
            {email.deleted && (
                <div className="mt-1 text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                    Deleted
                </div>
            )}
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">{email.subject}</td>
        <td className="px-6 py-4">
            {email.status === 'unsubscribed' ? (
                <button className="bg-green-500 text-white font-bold py-1 px-3 rounded whitespace-nowrap">
                    Unsubscribed
                </button>
            ) : email.status === 'error' ? (
                <a
                    href={email.unsubscribeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded whitespace-nowrap"
                >
                    Try manually
                </a>
            ) : (
                <a
                    onClick={() => unsubscribeClick(email)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded whitespace-nowrap"
                >
                    Unsubscribe
                </a>
            )}
        </td>
    </tr>
)};

export default EmailRow;
