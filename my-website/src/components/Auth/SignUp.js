import React, { useState } from 'react';
import { useAuth } from '@site/src/context/AuthContext'; // NEW IMPORT
import { themes } from 'prism-react-renderer';

const PROGRAMMING_LANGUAGES = ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust", "Other"];
const MICROCONTROLLERS = ["Arduino", "Raspberry Pi", "ESP32", "None", "Other"];

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // State for software background
    const [experienceLevel, setExperienceLevel] = useState('Beginner');
    const [languages, setLanguages] = useState([]);
    const [aiExperience, setAiExperience] = useState('None');

    // State for hardware background
    const [gpuAvailability, setGpuAvailability] = useState('No');
    const [electronicsKnowledge, setElectronicsKnowledge] = useState('None');
    const [microcontrollerExperience, setMicrocontrollerExperience] = useState([]);

    const { signup } = useAuth(); // Get signup from context

    const handleMultiSelectChange = (setter, value) => {
        setter(prev =>
            prev.includes(value)
                ? prev.filter(item => item !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const softwareBackgroundData = {
            experience_level: experienceLevel,
            programming_languages: languages,
            ai_experience: aiExperience,
        };

        const hardwareBackgroundData = {
            gpu_availability: gpuAvailability,
            electronics_knowledge: electronicsKnowledge,
            microcontroller_experience: microcontrollerExperience,
        };

        try {
            // Replaced internal fetch logic with call to AuthContext's signup
            const data = await signup(email, password, softwareBackgroundData, hardwareBackgroundData);
            setMessage(`Successfully signed up as ${data.email}! You can now Login.`);

            // Clear form
            setEmail('');
            setPassword('');
            setExperienceLevel('Beginner');
            setLanguages([]);
            setAiExperience('None');
            setGpuAvailability('No');
            setElectronicsKnowledge('None');
            setMicrocontrollerExperience([]);

        } catch (err) {
            setError(err.message);
        }
    };
    const formStyle = { maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px',color:'#eee9e9ff', backgroundColor: '#2b2d55ff' };
    const fieldsetSyle = { border: '1px solid #ddd', padding: '15px', borderRadius: '5px', marginBottom: '20px', color:'#eee9e9ff' };
    const legendStyle = { fontWeight: 'bold', padding: '0 10px', color:'#eee9e9ff' };
    const groupStyle = { marginBottom: '15px' };
    const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '500', color: 'white',  };
    const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box', color: '#0f0f0fff', backgroundColor: '#eee9e9ff' };
    const checkboxGroupStyle = { display: 'flex', flexWrap: 'wrap', gap: '10px' };
    const checkboxLabelStyle = { display: 'flex', alignItems: 'center', gap: '5px', color: 'white' , type:'#eee9e9ff' };
    

    return (
        <div style={formStyle}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <fieldset style={fieldsetSyle}>
                    <legend style={legendStyle}>Account</legend>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                    </div>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
                    </div>
                </fieldset>

                <fieldset style={fieldsetSyle}>
                    <legend style={legendStyle}>Software Background</legend>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Experience Level:</label>
                        <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} style={inputStyle}>
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Expert</option>
                        </select>
                    </div>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Programming Languages:</label>
                        <div style={checkboxGroupStyle}>
                            {PROGRAMMING_LANGUAGES.map(lang => (
                                <label key={lang} style={checkboxLabelStyle}>
                                    <input type="checkbox" value={lang} checked={languages.includes(lang)} onChange={() => handleMultiSelectChange(setLanguages, lang)} /> {lang}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div style={groupStyle}>
                        <label style={labelStyle}>AI/ML Experience:</label>
                        <select value={aiExperience} onChange={(e) => setAiExperience(e.target.value)} style={inputStyle}>
                            <option>None</option>
                            <option>Some</option>
                            <option>Proficient</option>
                        </select>
                    </div>
                </fieldset>

                <fieldset style={fieldsetSyle}>
                    <legend style={legendStyle}>Hardware Background</legend>
                    <div style={groupStyle}>
                        <label style={labelStyle}>GPU Availability:</label>
                        <div style={checkboxGroupStyle}>
                            <label style={checkboxLabelStyle}><input type="radio" name="gpu" value="Yes" checked={gpuAvailability === 'Yes'} onChange={(e) => setGpuAvailability(e.target.value)} /> Yes</label>
                            <label style={checkboxLabelStyle}><input type="radio" name="gpu" value="No" checked={gpuAvailability === 'No'} onChange={(e) => setGpuAvailability(e.target.value)} /> No</label>
                        </div>
                    </div>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Electronics/Robotics Knowledge:</label>
                        <select value={electronicsKnowledge} onChange={(e) => setElectronicsKnowledge(e.target.value)} style={inputStyle}>
                            <option>None</option>
                            <option>Some</option>
                            <option>Proficient</option>
                        </select>
                    </div>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Microcontroller Experience:</label>
                        <div style={checkboxGroupStyle}>
                            {MICROCONTROLLERS.map(mc => (
                                <label key={mc} style={checkboxLabelStyle}>
                                    <input type="checkbox" value={mc} checked={microcontrollerExperience.includes(mc)} onChange={() => handleMultiSelectChange(setMicrocontrollerExperience, mc)} /> {mc}
                                </label>
                            ))}
                        </div>
                    </div>
                </fieldset>
                
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2f77c4ff',color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px' }}>
                    Sign Up
                </button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
        </div>
    );
};

export default SignUp;