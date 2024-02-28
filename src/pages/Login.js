import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file
import { login } from '../API/userAPI';

function Login({ setUser, accessToken, setAccessToken, refreshToken, setRefreshToken }) {
    const navigate = useNavigate();

    useEffect(() => {
        setUser(null);
    }, [])

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        try {
            event.preventDefault();
            const responseObjRaw = await login({ email: email, password: password });
    
            if (responseObjRaw.status === 200) {
                const responseObj = responseObjRaw.data;
                setUser(responseObj.user);
                await setAccessToken(responseObj.accessToken);
                await setRefreshToken(responseObj.refreshToken);
                localStorage.setItem('accessToken', responseObj.accessToken);
                navigate("/expenses");
            } else {
                // show something bad happened
            }
        } catch (error) {
            console.error(error);
        }
    };

    const checkInputs = () => {
        if (email && password) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
}

export default Login;
