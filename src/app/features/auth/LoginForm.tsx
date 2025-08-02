import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../appHooks.ts'; // or use useDispatch/useSelector with types
import { login, selectAuth } from './loginSlice.ts';

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('1234567');
    const dispatch = useAppDispatch();
    const { accessToken, refreshToken, loading, error } = useAppSelector(selectAuth);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="container" style={{ marginTop: '30px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        className="form-control"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>
                <button className="btn btn-success" type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {accessToken && refreshToken && (
                <div className="alert alert-info" style={{ marginTop: '15px' }}>
                    <strong>Tokens received:</strong><br />
                    Access Token: {accessToken}<br />
                    Refresh Token: {refreshToken}
                </div>
            )}

            {error && (
                <div className="alert alert-danger" style={{ marginTop: '15px' }}>
                    {error}
                </div>
            )}
        </div>
    );
};
