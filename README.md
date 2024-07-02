

<div style="text-align:center; margin-top: 50px">
   <img src="public/logo.png" width="200">
   <h1 style="margin-top: 0">UnsubscribeMate Frontend</h1>
   <h5>Backend repo => https://github.com/jtejederabit/unsubscribemate_be</h5>
</div>

UnsubscribeMate is a Vite + React + TailwindCSS application designed to help users easily manage and unsubscribe from unwanted email subscriptions directly from their Gmail inbox. The application utilizes the Gmail API to list emails containing unsubscribe links and provides a user-friendly interface to bulk unsubscribe and optionally delete emails after unsubscribing.


https://github.com/jtejederabit/unsubscribemate/assets/130762129/c1fcf933-14d1-4efb-bf43-40d694a57d42


## Features

- **Google Authentication**: Sign in with your Google account to access your Gmail inbox.
- **Email Listing**: Fetch and list emails containing unsubscribe links.
- **Bulk Unsubscribe**: Select multiple emails and unsubscribe from them in bulk.
- **Individual Unsubscribe**: Unsubscribe from individual emails with confirmation.
- **Delete Emails**: Optionally delete emails after successfully unsubscribing.
- **Progress Tracking**: Track the progress of bulk unsubscribe actions with a progress bar.
- **Filtering**: Filter emails by their unsubscribe status (all, unsubscribed, error, pending).

## Installation

To run the application locally, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/jtejederabit/unsubscribemate.git
    cd unsubscribemate
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
    - Create a `.env` file in the root directory.
    - Add your Gmail API key, client ID, and other necessary environment variables:
        ```env
        VITE_GAPI_KEY=your_google_api_key
        VITE_GAPI_CLIENT_ID=your_google_client_id
        VITE_API_URL=http://localhost:3000
        ```

4. **Run the application**:
    ```sh
    npm run dev
    ```

## Backend (¡Pending!)

The application requires a backend server to handle the unsubscribe requests. The backend server should be set up separately. Please refer to the backend repository for detailed instructions on setting up and running the server.

## Usage

1. **Sign in with Google**: Click the "Sign in with Google" button to authenticate with your Google account.
2. **List Emails**: The application will fetch and display emails containing unsubscribe links.
3. **Select Emails**: Select individual emails or use the "Select All" checkbox to select multiple emails.
4. **Bulk Action**: Click the "Bulk Action" button to open a modal for confirmation. Optionally choose to delete emails after unsubscribing.
5. **Track Progress**: Monitor the progress of the bulk unsubscribe action through the progress modal.
6. **Individual Unsubscribe**: Click the "Unsubscribe" button for individual emails, confirm the action in the modal, and optionally delete the email.

## Components

- **App**: Main component managing state and rendering other components.
- **SignInButton**: Button component for Google authentication.
- **SignOutButton**: Button component to sign out from Google.
- **EmailTable**: Table component displaying the list of emails.
- **EmailRow**: Component representing a single row in the email table.
- **FilterSelect**: Dropdown component for filtering emails by status.
- **ProgressModal**: Modal component displaying the progress of bulk actions.
- **NoMessagesModal**: Modal component displayed when there are no messages to process.
- **ConfirmModal**: Modal component for confirming bulk actions.
- **ConfirmUnsubscribeModal**: Modal component for confirming individual unsubscribe actions.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [React](https://reactjs.org/)
- [Gmail API](https://developers.google.com/gmail/api)
- [Socket.io](https://socket.io/)
- [React Modal](https://github.com/reactjs/react-modal)
- [Tailwind CSS](https://tailwindcss.com/)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

---

Developed with ❤️ by [JTEJEDERABIT](https://github.com/jtejederabit)
