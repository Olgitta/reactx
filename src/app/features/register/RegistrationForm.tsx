import React, { useState } from 'react';
import {register, selectRegister} from "./registerSlice.ts";
import {useAppDispatch, useAppSelector} from "../../appHooks.ts";

export const RegistrationForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const dispatch = useAppDispatch();
    const {guid, error, loading} = useAppSelector(selectRegister);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(register({ email, password, username }))
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                </div>
                <div className="form-group">
                    <label>Username:</label>
                    <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                </div>
                <button className="btn btn-primary" type="submit" disabled={loading}>Register</button>
            </form>

            {guid && (
                <div className="alert alert-success" style={{ marginTop: '15px' }}>
                    <strong>Registered:</strong><br />
                    Email: {email}<br />
                    Username: {username}<br />
                    GUID: {guid}
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
