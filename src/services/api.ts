import { gapi } from 'gapi-script';

export const deleteEmail = (emailId: string): Promise<void> => {
    return gapi.client.gmail.users.messages.delete({
        'userId': 'me',
        'id': emailId
    }).then(() => {
        console.log(`Email with id ${emailId} deleted`);
    }).catch((error: any) => {
        console.error(`Failed to delete email with id ${emailId}`, error);
    });
};
