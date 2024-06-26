import React from 'react';
import EmailRow from './EmailRow';
import { Email } from '../../types';

interface EmailTableProps {
    emails: Email[];
    onSelectEmail: (id: string) => void;
    onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
    filter: string;
    handleUnsubscribeClick: (email: Email) => void;
}

const EmailTable: React.FC<EmailTableProps> = ({
   emails,
   onSelectEmail,
   onSelectAll,
   filter,
   handleUnsubscribeClick
}) => {
    const filteredEmails = emails.filter(email => {
        if (filter === 'all') return true;
        if (filter === 'unsubscribed') return email.status === 'unsubscribed';
        if (filter === 'error') return email.status === 'error';
        if (filter === 'pending') return !email.status;
        return true;
    });

    return (
        <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" onChange={onSelectAll} />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmails.map(email => (
                    <EmailRow
                        key={email.id}
                        email={email}
                        onSelectEmail={onSelectEmail}
                        handleUnsubscribeClick={handleUnsubscribeClick}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmailTable;
