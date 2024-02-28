import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from "../components/Sidebar";
import SearchBar from '../components/SearchBar';
import ListTable from '../components/ListTable';
import './Expenses.css';

import { getAllExpensesData, } from '../API/expenseAPI';

function Expenses({ user }) {
    const navigate = useNavigate();

    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [expenses, setExpenses] = useState([]);

    // Check if the user is logged in. If not, redirect to the home page
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        const getExpenses = async () => {
            try {
                const expensesRaw = await getAllExpensesData();
                const expenses = expensesRaw.data.map(expense => {
                    const dateArr = expense.date_expense.substring(0,9).split('-');
                    const date = `${dateArr[1]} / ${dateArr[2]} / ${dateArr[0]}`;
                    return {
                        date,
                        name: `${expense.User.first_name} ${expense.User.last_name}`,
                        ...expense
                    }
                });
                setExpenses(expenses);
                setFilteredExpenses(expenses);
            } catch (error) {
                console.error('Error fetching expense IDs:', error);
            }
        }
        getExpenses();
    }, []);    

    // Function to navigate to expense detail on item click
    const handleItemClick = (expense) => {
        navigate('/expense-detail', { state: { expense } });
    };

    const itemsConfig = [
        {
            type: "info",
            key: "id",
            header: "ID",
            space: '5%',
        },
        {
            type: "info",
            key: "date",
            header: "Date",
            space: '25%',
        },
        {
            type: "info",
            key: "vendor",
            header: "Vendor",
            space: '25%',
        },
        {
            type: "info",
            key: "amount",
            header: "Amount",
            space: '10%',
        },
        {
            type: "info",
            key: "name",
            header: "Employee",
            space: '35%',
        },
    ];

    return (
        <div className="wrapper">
            <Sidebar page="Expenses" />
            <div className="expenses-container">
                <SearchBar setFilteredItems={setFilteredExpenses} items={expenses} itemsToSearch="Expenses" />
                <ListTable items={filteredExpenses} itemsConfig={itemsConfig} itemclick={handleItemClick} />
            </div>
        </div>
    );
}

export default Expenses;
