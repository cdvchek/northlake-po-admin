import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Adjust the path if necessary
import PDFGenerator from '../components/PDFGenerator';
import './ExpenseDetail.css'; // Assuming you have a separate CSS file

import { getImageUrl } from '../API/expenseAPI';

function ExpenseDetail({ user }) {
    const navigate = useNavigate();
    const location = useLocation();
    const expense = location.state.expense;

    const [imageUrl, setImageUrl] = useState('');

    // Check if the user is logged in. If not, redirect to the home page
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        const gettingImageUrl = async () => {
            const url = (await getImageUrl(expense.id)).data;
            setImageUrl(url.url);
        }
        gettingImageUrl();
    },[])

    const handleBackClick = () => {
        navigate('/expenses');  // Navigates back to the Manage page
    };
    
    return (
        <div className="wrapper">
            <Sidebar page="Manage" />
            <div className="expense-detail-container">
                <div className="expense-content-container">
                    <div>
                        <h2>Expense Detail</h2>
                        <p><strong>Employee:</strong> {expense.name}</p>
                        <p><strong>Type:</strong> {expense.expense_type}</p>
                        <p><strong>Date:</strong> {expense.date}</p>
                        <p><strong>Vendor:</strong> {expense.vendor}</p>
                        <p><strong>Amount:</strong> ${expense.amount}</p>
                        {expense.ExpenseDefiners.map((expenseDef, index) => {
                            return (
                                <div key={index}>
                                    <p key={`${index}-expnum`}><strong>({index + 1}) Exp. Number:</strong> {expenseDef.expense_number}</p>
                                    <p key={`${index}-subamt`}><strong>({index + 1}) Sub Amount:</strong> ${expenseDef.amount}</p>
                                    <p key={`${index}-buspurp`}><strong>({index + 1}) Business Purpose:</strong> {expenseDef.business_purpose}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div className='image-container'>
                        <img src={imageUrl} alt="Receipt Image" className="receipt-image" />
                    </div>
                </div>
                <button onClick={handleBackClick}>Back to Expenses</button>
                <PDFGenerator imageUrl={imageUrl} data={expense} />
            </div>
        </div>
    );
}

export default ExpenseDetail;
