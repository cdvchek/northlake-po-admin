// EmployeeSearchPopup.js
import React, { useEffect, useRef } from 'react';

function ConfirmPopup({ position, setShowPopup, item, text, onConfirm }) {
    const popupRef = useRef(null);

    // Click outside handler for popups
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const onAccept = async () => {
        await onConfirm(item);
        setShowPopup();
    }

    return (
        <div ref={popupRef} className="delete-confirmation-popup" style={{ top: `${position.top}px`, left: `${position.left}px` }}>
            <p>{text}</p>
            <div>
                <button className="cancel" onClick={() => setShowPopup()}>Cancel</button>
                <button className="delete" onClick={() => onAccept()}>OK</button>
            </div>
        </div>
    );
}

export default ConfirmPopup;
