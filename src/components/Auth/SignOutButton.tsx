import React from 'react';

interface SignOutButtonProps {
    onClick: () => void;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ onClick }) => (
    <button onClick={onClick} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">
        Sign out
    </button>
);

export default SignOutButton;
