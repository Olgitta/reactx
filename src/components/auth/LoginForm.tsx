import React, { useState } from 'react';

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('1234567');
    const [tokens, setTokens] = useState<LoginResponse | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { email, password };

        const res = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            const data = await res.json();
            setTokens(data);
        } else {
            alert('Login failed');
        }
    };

    return (
        <div className="container" style={{ marginTop: '30px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                </div>
                <button className="btn btn-success" type="submit">Login</button>
            </form>

            {tokens && (
                <div className="alert alert-info" style={{ marginTop: '15px' }}>
                    <strong>Tokens received:</strong><br />
                    Access Token: {tokens.accessToken}<br />
                    Refresh Token: {tokens.refreshToken}
                </div>
            )}
        </div>
    );
};
