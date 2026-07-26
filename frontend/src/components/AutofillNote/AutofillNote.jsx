import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import './AutofillNote.css';

const AutofillNote = () => {
    return (
        <div className="autofill-note">
            <FaInfoCircle className="note-icon" />
            <p>
                If you are a registered and logged-in user, this form will be auto-filled for you. 
                Otherwise, you will need to fill it manually.
            </p>
        </div>
    );
};

export default AutofillNote;
