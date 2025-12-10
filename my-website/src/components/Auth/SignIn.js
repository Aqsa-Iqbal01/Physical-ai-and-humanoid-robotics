import React, { useState } from 'react';
import { useAuth } from '@site/src/context/AuthContext'; // NEW IMPORT

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { login } = useAuth(); // Get login from context

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            // Replaced internal fetch logic and localStorage handling with call to AuthContext's login
            await login(email, password);
            
            setMessage('Successfully signed in!');
            
            // Clear form
            setEmail('');
            setPassword('');

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #555', borderRadius: '5px' , backgroundColor: '#282c34', color: 'white' }}>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{color: 'white'}}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px',  backgroundColor: '#eee9e9ff' }}
                    />
                </div>
                <div style={{ marginBottom: '20px'}}>
                    <label style={{color: 'white'}}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', backgroundColor: '#eee9e9ff' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2f77c4ff', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Sign In
                </button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
        </div>
    );
};

export default SignIn;
