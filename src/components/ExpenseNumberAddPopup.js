// EmployeeSearchPopup.js
import React, { useEffect, useRef } from 'react';

function ExpenseNumberAddPopup({ newExpenseNumber, setNewExpenseNumber, newDescription, setNewDescription, showPopup, setShowPopup, onAdd }) {
    const popupRef = useRef(null);

    // Click outside handler for popups
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showPopup]);

    if (!showPopup) return null;

    return (
        <div ref={popupRef} className="add-expense-popup">
            <input
                type="text"
                placeholder="Expense Number"
                value={newExpenseNumber}
                onChange={(e) => setNewExpenseNumber(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
            />
            <button onClick={onAdd}>Add</button>
        </div>
    );
}

export default ExpenseNumberAddPopup;
