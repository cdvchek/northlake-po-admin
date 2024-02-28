import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Assuming you have a separate CSS file for the sidebar

function Sidebar({ page }) {
    return (
        <div className="sidebar">
            <h1>{page}</h1>
            <nav>
                <ul>
                    <li><Link to="/expenses">Expenses</Link></li>
                    <li><Link to="/expense-numbers">Expense Numbers</Link></li>
                    <li><Link to="/employees">Employees</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;