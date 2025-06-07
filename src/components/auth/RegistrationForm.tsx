import React, { useState } from 'react';
import {usePopup} from "../../contexts/PopupContext.tsx";

interface RegistrationResponse {
    email: string;
    username: string;
    guid: string;
}

export const RegistrationForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [result, setResult] = useState<RegistrationResponse | null>(null);
    const { showPopup } = usePopup();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { email, password, username };

        try{
            const res = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json();
                setResult(data);
            } else {
                showPopup('Registration failed', 'error');
            }
        } catch (error) {
            showPopup(`Registration failed: ${error}`, 'error');
        }

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
                <button className="btn btn-primary" type="submit">Register</button>
            </form>

            {result && (
                <div className="alert alert-success" style={{ marginTop: '15px' }}>
                    <strong>Registered:</strong><br />
                    Email: {result.email}<br />
                    Username: {result.username}<br />
                    GUID: {result.guid}
                </div>
            )}
        </div>
    );
};
