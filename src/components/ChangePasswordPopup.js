import React, { useEffect, useRef, useState } from 'react';
import './ChangePasswordPopup.css';
import { editUser } from '../API/userAPI';

function ChangePasswordPopup({ position, setShowPopup, item }) {
    // Use the passed position for styling or default to a fallback position
    position = position || { top: 0, left: 0 };

    const popupRef = useRef(null);

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [value, setValue] = useState('');

    // Click outside handler for popups
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(); // Simply call setShowPopup to hide the popup by setting content to null in the parent
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowPopup]); // Dependency on setShowPopup is stable, assuming it doesn't change

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
        console.log(item);
    };

    const testPassword = async () => {
        // this is where you would make sure the password fits the requirements

        const response = await editUser(item.id, { password: value });
        if (response && (response.statusText == 'OK')) {
            setShowPopup();
        }
    }

    // Always render the popup content
    return (
        <div ref={popupRef} className="change-password-popup" style={{ top: `${position.top}px`, left: `${position.left}px` }}>
            <div className='input-container'>
                <input
                    type={passwordVisible ? 'text' : 'password'}
                    value={value}
                    placeholder='Enter the new password'
                    autoComplete='off'
                    onChange={(e) => setValue(e.target.value)}
                    />
                <button 
                    className='toggle-visibility'
                    onClick={togglePasswordVisibility} 
                >
                    {passwordVisible ? 'Hide' : 'Show'}
                </button>
            </div>
            <button className="cancel" onClick={() => setShowPopup()}>Cancel</button>
            <button className="delete" onClick={() => testPassword()}>OK</button>
        </div>
    );
}

export default ChangePasswordPopup;