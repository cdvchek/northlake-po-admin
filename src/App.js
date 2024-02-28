import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Expenses from './pages/Expenses';
import ExpenseDetail from './pages/ExpenseDetail';
import ExpenseNumbers from './pages/ExpenseNumbers';
import Users from './pages/Users';

function App() {
    const [user, setUser] = useState();
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login setUser={setUser} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} setRefreshToken={setRefreshToken} />} />
                <Route path="/expenses" element={<Expenses user={user} accessToken={accessToken} refreshToken={refreshToken} />} />
                <Route path="/expense-detail" element={<ExpenseDetail user={user} />} />
                <Route path="/expense-numbers" element={<ExpenseNumbers user={user} accessToken={accessToken} refreshToken={refreshToken} />} />
                <Route path="/employees" element={<Users user={user} />} />
                
                {/* <Route path="/settings" element={<Settings />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
