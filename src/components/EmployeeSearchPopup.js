// EmployeeSearchPopup.js
import React, { useState, useEffect, useRef } from 'react';
import { getAllUsers } from '../API/userAPI';
import { editExpenseNumber } from '../API/expenseNumberAPI';

function EmployeeSearchPopup({ position, setShowPopup, item, setExpenseNumbers }) {
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [employees, setEmployees] = useState([]);
    const EMPLOYEES_PER_POPUP = 6;
    const popupRef = useRef(null);

    // Click outside handler for popups
    useEffect(() => {
        const getUsers = async () => {
            const users = await getAllUsers();
            setEmployees(users.data);
        }
        getUsers();

        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    useEffect(() => {
        const filtered = employees
            .filter(e => e.name.toLowerCase().includes(employeeSearch.toLowerCase()))
            .slice(0, EMPLOYEES_PER_POPUP);
        setFilteredEmployees(filtered);
    }, [employeeSearch, employees]);

    const onEmployeeSelect = async (employee) => {
        await editExpenseNumber(item.id, { userid: employee.id });
        const employeeName = employee.name.split(" ");
        setExpenseNumbers(expenses => 
            expenses.map(expense => 
                expense.id === item.id 
                    ? { ...expense, User: { first_name: employeeName[0], last_name: employeeName[1], id: employee.id }, name: employee.name}
                    : expense
            )
        );
        setShowPopup();
    }

    return (
        <div ref={popupRef} className="employee-popup" style={{ top: `${position.top}px`, left: `${position.left}px` }}>
            <input
                type="text"
                placeholder="Search employees..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
            />
            <ul>
                {filteredEmployees.map((employee, index) => (
                    <li key={index} onClick={() => onEmployeeSelect(employee)}>
                        {employee.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default EmployeeSearchPopup;
