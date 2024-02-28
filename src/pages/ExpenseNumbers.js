import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import EmployeeSearchPopup from '../components/EmployeeSearchPopup';
import ExpenseNumberAddPopup from '../components/ExpenseNumberAddPopup';
import ConfirmPopup from '../components/ConfirmPopup';
import { createExpenseNumber, getAllExpenseNumbers, editDetailExpenseNumber, deleteExpenseNumber } from '../API/expenseNumberAPI';
import './ExpenseNumbers.css';
import SearchBar from '../components/SearchBar';
import ListTable from '../components/ListTable';

function ExpenseNumbers({ user, accessToken, refreshToken }) {
    const navigate = useNavigate();

    // State declarations
    const [newExpenseNumber, setNewExpenseNumber] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [showAddPopup, setShowAddPopup] = useState(false);
    
    const [filteredExpenseNumbers, setFilteredExpenseNumbers] = useState([]);
    const [expenseNumbers, setExpenseNumbers] = useState([]);
    
    // Effect for checking login status
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [navigate, user]);

    // On Load Effect
    useEffect(() => {
        const getExpenseNumbers = async () => {
            try {
                const expenseNumbersRaw = await getAllExpenseNumbers(accessToken);

                const expenseNumbersData = expenseNumbersRaw.data.map((expenseNumber) => {
                    expenseNumber.name = expenseNumber.User ? `${expenseNumber.User.first_name} ${expenseNumber.User.last_name}` : "-----";
                    return expenseNumber;
                });

                setExpenseNumbers(expenseNumbersData);
                setFilteredExpenseNumbers(expenseNumbersData);
            } catch (error) {
                console.error('Error fetching expense numbers:', error);
            }
        }
        getExpenseNumbers();
    }, []);

    // Confirm Handler Functions
    const handleAddExpense = async () => {
        const newExpense = {
            number: newExpenseNumber,
            description: newDescription,
        };
        // Add new expense to the list (consider using API call if data is fetched from server)
        const response = await createExpenseNumber(newExpense, accessToken);
        response.data.name = "-----";
        setExpenseNumbers(prevExpenses => [response.data, ...prevExpenses]);
        setShowAddPopup(false); // Close the popup after adding
    };

    const onEditExpenseNumber = async (id, newValue) => {
        expenseNumbers.forEach(expenseNumber => {
            if (expenseNumber.number == newValue) return 0;
        });
        await editDetailExpenseNumber(id, { number: newValue });
        setExpenseNumbers(expenseNumbers.map(expenseNumber => {
            if (expenseNumber.id == id) return { ...expenseNumber, number: newValue };
            return expenseNumber;
        }));
        return 1;
    }

    const onEditDescription = async (id, newValue) => {
        if (newValue == "") return 0;
        await editDetailExpenseNumber(id, { description: newValue });
        setExpenseNumbers(expenseNumbers.map(expenseNumber => {
            if (expenseNumber.id == id) return { ...expenseNumber, description: newValue };
            return expenseNumber;
        }));
        return 1;
    }

    const onConfirm = async (expenseNumber) => {
        await deleteExpenseNumber(expenseNumber.id);
        setExpenseNumbers(expenses => expenses.filter(expense => expense.id !== expenseNumber.id));
    }


    const itemsConfig = [
        {
            type: "info",
            key: "number",
            header: "Expense No.",
            onEdit: onEditExpenseNumber,
            space: '25%',
        },
        {
            type: "info",
            key: "description",
            header: "Description",
            onEdit: onEditDescription,
            space: '45%',
        },
        {
            type: "button",
            key: "name",
            header: "Employee",
            staticName: false,
            onHover: "Click to change employee",
            popup: EmployeeSearchPopup,
            popupProps: {
                setExpenseNumbers,
            },
            space: '25%',
        },
        {
            type: "button",
            key: "dl_button",
            staticName: true,
            name: "D",
            onHover: "Click to Delete Expense Number",
            popup: ConfirmPopup,
            popupProps: {
                text: "Are you sure you want to delete this expense number?",
                onConfirm,
            },
            space: "5%"
        }
    ]

    // Render function
    return (
        <div className="wrapper">
            <Sidebar page="Expense Numbers" />
            <div className="expensenumbers-container">
                <SearchBar setFilteredItems={setFilteredExpenseNumbers} items={expenseNumbers} itemsToSearch="Expense Numbers" />
                <ListTable items={filteredExpenseNumbers} itemsConfig={itemsConfig} />
                <div className='add-expense-button'>
                    <button onClick={() => setShowAddPopup(true)}>Add</button>
                </div>
                <ExpenseNumberAddPopup
                    newExpenseNumber={newExpenseNumber}
                    setNewExpenseNumber={setNewExpenseNumber}
                    newDescription={newDescription}
                    setNewDescription={setNewDescription}
                    showPopup={showAddPopup}
                    setShowPopup={setShowAddPopup}
                    onAdd={handleAddExpense}
                />
            </div>
        </div>
    );
}

export default ExpenseNumbers;
