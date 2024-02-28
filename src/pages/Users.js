import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from "../components/Sidebar";
import SearchBar from '../components/SearchBar';
import ListTable from '../components/ListTable';
import ConfirmPopup from '../components/ConfirmPopup';
import "./Users.css";

import { getAllUsersEmail, editUser, deleteUser } from '../API/userAPI';
import ChangePasswordPopup from '../components/ChangePasswordPopup';

function Users({ user }) {
    const navigate = useNavigate();

    const [filteredEmployees, setFilteredEmployees] = useState([]); // Handled by the searchbar
    const [employees, setEmployees] = useState([]);


    // Check if the user is logged in. If not, redirect to the home page
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]); 
    
    // Getting all the employees
    useEffect(() => {
        const getEmployees = async () => {
            const employeesDataRaw = await getAllUsersEmail();
            const employeesData = employeesDataRaw.data;
            setEmployees(employeesData);
            setFilteredEmployees(employeesData);
        }
        getEmployees();
    }, []);

    function isValidEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    const attemptEditUser = async (id, attempt) => {
        const update = {};
        if (attempt.name) {
            const nameSplit = attempt.name.trim().split(" ");
            if (nameSplit.length !== 2) {
                return { error: "Name must only be two words separated by a space." };
            }
            update.first_name = nameSplit[0];
            update.last_name = nameSplit[1];
        }

        if (attempt.email) {
            if (!isValidEmail(attempt.email)) {
                return { error: "Invalid email." };
            }
            update.email = attempt.email;
        }

        const response = await editUser(id, update);
        if (response.status === 200) {
            return 1;
        } else {
            return 0;
        }
    }

    // Must return a value of 0 or 1 depending on if the edit was successful
    // 0 for fail, 1 for success

    const onEditName = async (id, newValue) => {
        if (await attemptEditUser(id, { name: newValue }) === 1) {
            setEmployees(employees.map(emp => {
                if (emp.id === id) {
                    return { ...emp, name: newValue };
                }
                return emp;
            }));
            return 1;
        } else {
            return 0;
        }
    }
    
    const onEditEmail = async (id, newValue) => {
        if (await attemptEditUser(id, { email: newValue }) === 1) {
            setEmployees(employees.map(emp => {
                if (emp.id === id) {
                    return { ...emp, email: newValue };
                }
                return emp;
            }));
            return 1;
        } else {
            return 0;
        }
    }

    const onConfirmDelete = async (item) => {
        if (item.id != user.id) {
            const response = await deleteUser(item.id);
            if (response.statusText === "OK") {
                setEmployees(employees.filter(emp => emp.id != item.id));
            }  
        }
    }

    const itemsConfig = [
        {
            type: "info",
            key: "name",
            header: "Name",
            onEdit: onEditName,
            space: '30%',
        },
        {
            type: "info",
            key: "email",
            header: "Email",
            onEdit: onEditEmail,
            space: '60%',
        },
        {
            type: "button",
            key: "cp_button",
            staticName: true,
            name: "CP",
            onHover: "Change Password",
            popup: ChangePasswordPopup,
            popupProps: {

            },
            space: '5%',
        },
        {
            type: "button",
            key: "d_button",
            staticName: true,
            name: "D",
            onHover: "Delete User",
            popup: ConfirmPopup,
            popupProps: {
                text: "Are you sure you want to delete this user?",
                onConfirm: onConfirmDelete
            },
            space: '5%',
        }
    ]

    return (
        <div className="wrapper">
            <Sidebar page="Employees" />
            <div className="users-container">
                <SearchBar setFilteredItems={setFilteredEmployees} items={employees} itemsToSearch="Employees" />
                <ListTable items={filteredEmployees} itemsConfig={itemsConfig} />
            </div>
        </div>
    );
}

export default Users;