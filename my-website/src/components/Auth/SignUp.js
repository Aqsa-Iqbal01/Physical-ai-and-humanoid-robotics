import React, { useState } from 'react';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [softwareBackground, setSoftwareBackground] = useState('');
    const [hardwareBackground, setHardwareBackground] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:8000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    software_background: softwareBackground,
                    hardware_background: hardwareBackground,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to sign up');
            }

            const data = await response.json();
            setMessage(`Successfully signed up as ${data.email}! You can now sign in.`);
            
            // Clear form
            setEmail('');
            setPassword('');
            setSoftwareBackground('');
            setHardwareBackground('');

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Software Background:</label>
                    <textarea
                        value={softwareBackground}
                        onChange={(e) => setSoftwareBackground(e.target.value)}
                        placeholder="e.g., Python, JavaScript, C++"
                        style={{ width: '100%', padding: '8px', height: '80px' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>Hardware Background:</label>
                    <textarea
                        value={hardwareBackground}
                        onChange={(e) => setHardwareBackground(e.target.value)}
                        placeholder="e.g., Arduino, Raspberry Pi, FPGAs"
                        style={{ width: '100%', padding: '8px', height: '80px' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Sign Up
                </button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
        </div>
    );
};

export default SignUp;
