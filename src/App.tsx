import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import { io } from 'socket.io-client';
import Modal from 'react-modal';
import SignInButton from './components/Auth/SignInButton';
import SignOutButton from './components/Auth/SignOutButton';
import EmailTable from './components/EmailList/EmailTable';
import FilterSelect from './components/Filters/FilterSelect';
import ProgressModal from './components/Modals/ProgressModal';
import NoMessagesModal from './components/Modals/NoMessageModal';
import ConfirmModal from './components/Modals/ConfirmModal';
import ConfirmUnsubscribeModal from "./components/Modals/ConfirmUnsubscribeModal.tsx";
import { findUnsubscribeLink, cleanUnsubscribeLink, determineUnsubscribeType, normalizeUrl } from './utils/helpers.ts';
import { Email } from './types';
import { deleteEmail } from './services/api';

Modal.setAppElement('#root');

const socket = io(import.meta.env.VITE_API_URL);

const App: React.FC = () => {
    const [emails, setEmails] = useState<Email[]>([]);
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [totalLinks, setTotalLinks] = useState<number>(0);
    const [_, setProcessedLinks] = useState<{ [key: string]: boolean }>({});
    const [filter, setFilter] = useState<string>('all');
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [noMessagesModalIsOpen, setNoMessagesModalIsOpen] = useState<boolean>(false);
    const [confirmModalIsOpen, setConfirmModalIsOpen] = useState<boolean>(false);
    const [confirmUnsubscribeModalIsOpen, setConfirmUnsubscribeModalIsOpen] = useState<boolean>(false);
    const [deleteAfterUnsubscribe, setDeleteAfterUnsubscribe] = useState<boolean>(false);
    const [currentEmail, setCurrentEmail] = useState<Email | null>(null);
    const [hasFetchedEmails, setHasFetchedEmails] = useState<boolean>(false);

    const handleAuthClick = () => {
        gapi.auth2.getAuthInstance().signIn({
            prompt: 'select_account'
        }).then(() => {
            setIsSignedIn(true);
            if (!hasFetchedEmails) {
                listMessages();
                setHasFetchedEmails(true);
            }
        });
    };

    const handleSignOutClick = () => {
        gapi.auth2.getAuthInstance().signOut().then(() => {
            setIsSignedIn(false);
            setEmails([]);
            setHasFetchedEmails(false);
        });
    };

    const initClient = () => {
        gapi.client.init({
            apiKey: import.meta.env.VITE_GAPI_KEY,
            clientId: import.meta.env.VITE_GAPI_CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
            scope: 'https://mail.google.com/'
        }).then(() => {
            const authInstance = gapi.auth2.getAuthInstance();
            authInstance.isSignedIn.listen((isSignedIn: boolean) => {
                setIsSignedIn(isSignedIn);
                if (isSignedIn && !hasFetchedEmails) {
                    listMessages();
                    setHasFetchedEmails(true);
                }
            });
            if (authInstance.isSignedIn.get() && !hasFetchedEmails) {
                listMessages();
                setHasFetchedEmails(true);
            }
        });
    };

    useEffect(() => {
        gapi.load('client:auth2', initClient);

        socket.on('progress', async (result) => {
            setProcessedLinks((prev) => {
                if (!prev[result.link]) {
                    const updated = { ...prev, [result.link]: true };
                    setEmails((prevEmails) =>
                        prevEmails.map((email) =>
                            email.unsubscribeLink === result.link
                                ? { ...email, status: result.success ? 'unsubscribed' : 'error' }
                                : email
                        )
                    );
                    setProgress((prevProgress) => prevProgress + 1);

                    if (result.success && deleteAfterUnsubscribe) {
                        const email = emails.find(e => e.unsubscribeLink === result.link);
                        if (email) {
                            deleteEmail(email.id).then(() => {
                                setEmails((prevEmails) =>
                                    prevEmails.map((e) =>
                                        e.id === email.id ? { ...e, deleted: true } : e
                                    )
                                );
                            });
                        }
                    }

                    return updated;
                }
                return prev;
            });
        });
    }, [deleteAfterUnsubscribe, emails]);

    const listMessages = () => {
        setLoading(true);
        gapi.client.gmail.users.messages.list({
            'userId': 'me',
            'q': 'unsubscribe'
        }).then((response: any) => {
            const messages = response.result.messages;
            if (messages && messages.length > 0) {
                const seenLinks = new Set<string>();
                const fetchedEmails: Email[] = [];
                messages.forEach((message: any) => {
                    gapi.client.gmail.users.messages.get({
                        'userId': 'me',
                        'id': message.id
                    }).then((messageResponse: any) => {
                        const headers = messageResponse.result.payload.headers;
                        const fromHeader = headers.find((header: any) => header.name === 'From');
                        const subjectHeader = headers.find((header: any) => header.name === 'Subject');
                        const unsubscribeHeader = headers.find((header: any) => header.name.toLowerCase() === 'list-unsubscribe');
                        const body = messageResponse.result.payload.parts?.find((part: any) => part.mimeType === 'text/html')?.body.data;

                        if (fromHeader && subjectHeader && (unsubscribeHeader || body)) {
                            const unsubscribeLink = findUnsubscribeLink(body) || cleanUnsubscribeLink(unsubscribeHeader?.value);

                            if (unsubscribeLink) {
                                const normalizedLink = normalizeUrl(unsubscribeLink);
                                if (!seenLinks.has(normalizedLink)) {
                                    seenLinks.add(normalizedLink);
                                    const { type, link } = determineUnsubscribeType(unsubscribeLink);
                                    const email: Email = {
                                        id: message.id,
                                        from: fromHeader.value,
                                        subject: subjectHeader.value,
                                        unsubscribeLink: link,
                                        unsubscribeType: type,
                                        selected: false,
                                    };
                                    fetchedEmails.push(email);
                                }
                            }
                        }
                    });
                });
                setEmails(fetchedEmails);
            }
            setLoading(false);
        });
    };

    const handleUnsubscribeClick = (email: Email) => {
        setCurrentEmail(email);
        setConfirmUnsubscribeModalIsOpen(true);
        window.open(email.unsubscribeLink, '_blank');
    };

    const confirmUnsubscribe = () => {
        if (currentEmail) {
            setEmails((prevEmails) =>
                prevEmails.map((email) =>
                    email.id === currentEmail.id ? { ...email, status: 'unsubscribed' } : email
                )
            );
            if (deleteAfterUnsubscribe) {
                deleteEmail(currentEmail.id).then(() => {
                    setEmails((prevEmails) =>
                        prevEmails.map((e) =>
                            e.id === currentEmail.id ? { ...e, deleted: true } : e
                        )
                    );
                });
            }
        }
        setConfirmUnsubscribeModalIsOpen(false);
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setEmails(emails.map(email => ({ ...email, selected: isChecked })));
    };

    const handleSelectEmail = (id: string) => {
        setEmails(emails.map(email => email.id === id ? { ...email, selected: !email.selected } : email));
    };

    const handleBulkAction = () => {
        const selectedEmails = emails.filter(email => email.selected);
        const unprocessedEmails = selectedEmails.filter(email => !email.status);
        const links = unprocessedEmails.map(email => email.unsubscribeLink);

        if (links.length === 0) {
            setNoMessagesModalIsOpen(true);
            return;
        }

        setConfirmModalIsOpen(true);
    };

    const confirmBulkAction = () => {
        setConfirmModalIsOpen(false);
        const selectedEmails = emails.filter(email => email.selected);
        const unprocessedEmails = selectedEmails.filter(email => !email.status);
        const links = unprocessedEmails.map(email => email.unsubscribeLink);

        setProgress(0);
        setTotalLinks(links.length);
        setProcessedLinks({});
        setModalIsOpen(true);

        socket.emit('unsubscribe', links);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const closeNoMessagesModal = () => {
        setNoMessagesModalIsOpen(false);
    };

    const closeConfirmModal = () => {
        setConfirmModalIsOpen(false);
    };

    const closeConfirmUnsubscribeModal = () => {
        setConfirmUnsubscribeModalIsOpen(false);
    };

    const handleDeleteAfterUnsubscribeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDeleteAfterUnsubscribe(event.target.checked);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <header className="mb-8">
                <img src="/logo.webp" alt="UnsubscribeMate" className="mx-auto" width={100} />
                <h1 className="text-3xl font-bold text-center mt-3">UnsubscribeMate</h1>
                <p className="text-center mt-2 text-gray-600">Analyze your GMAIL inbox for subscription emails and unsubscribe easily.</p>
            </header>
            <div className="flex justify-center">
                {!isSignedIn ? (
                    <SignInButton onClick={handleAuthClick} />
                ) : (
                    <div className="w-full max-w-5xl">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <SignOutButton onClick={handleSignOutClick} />
                                <button onClick={handleBulkAction} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                    Bulk Action
                                </button>
                            </div>
                            {emails.length > 0 && (
                                <FilterSelect filter={filter} onFilterChange={handleFilterChange} />
                            )}
                        </div>
                        {loading ? (
                            <div className="flex justify-center">
                                <div className="loader"></div>
                            </div>
                        ) : (
                            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                <EmailTable
                                    emails={emails}
                                    onSelectEmail={handleSelectEmail}
                                    onSelectAll={handleSelectAll}
                                    filter={filter}
                                    handleUnsubscribeClick={handleUnsubscribeClick}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
            <ProgressModal isOpen={modalIsOpen} onRequestClose={closeModal} progress={progress} totalLinks={totalLinks} />
            <NoMessagesModal isOpen={noMessagesModalIsOpen} onRequestClose={closeNoMessagesModal} />
            <ConfirmModal
                isOpen={confirmModalIsOpen}
                onRequestClose={closeConfirmModal}
                onConfirm={confirmBulkAction}
                deleteAfterUnsubscribe={deleteAfterUnsubscribe}
                onDeleteAfterUnsubscribeChange={handleDeleteAfterUnsubscribeChange}
            />
            <ConfirmUnsubscribeModal
                isOpen={confirmUnsubscribeModalIsOpen}
                onClose={closeConfirmUnsubscribeModal}
                onConfirm={confirmUnsubscribe}
                onDeleteChange={handleDeleteAfterUnsubscribeChange}
                deleteAfterUnsubscribe={deleteAfterUnsubscribe}
            />
        </div>
    );
};

export default App;
