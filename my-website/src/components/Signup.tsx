// my-website/src/components/Signup.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Signup.module.css'; // Assuming a separate CSS module for styling
import { useHistory } from 'react-router-dom';
import Link from '@docusaurus/Link'; // Import Docusaurus Link component

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [programmingLanguages, setProgrammingLanguages] = useState('');
  const [aiExperience, setAiExperience] = useState('');
  const [gpuAvailability, setGpuAvailability] = useState('');
  const [electronicsKnowledge, setElectronicsKnowledge] = useState('');
  const [microcontrollerExperience, setMicrocontrollerExperience] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const software_background = {
        experience_level: experienceLevel,
        programming_languages: programmingLanguages.split(',').map(lang => lang.trim()),
        ai_experience: aiExperience,
      };

      const hardware_background = {
        gpu_availability: gpuAvailability,
        electronics_knowledge: electronicsKnowledge,
        microcontroller_experience: microcontrollerExperience.split(',').map(exp => exp.trim()),
      };

      const response = await fetch('http://127.0.0.1:8000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          software_background,
          hardware_background,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to sign up');
      }

      const data = await response.json();
      // Assuming successful signup means a user is created.
      // The backend /auth/signup returns the created User object.
      // After signup, we should ideally log the user in to get a token.
      // For simplicity here, we assume the backend might return a token, or
      // we'd need to make a subsequent login call.
      // For now, let's just navigate to login or home page.
      // A more complete flow would be to immediately log them in.

      // If the signup endpoint returns a token, we could call auth.login(token)
      // Otherwise, we navigate to the login page.
      if (data.access_token) { // If signup directly returns an access_token
        await auth.login(data.access_token);
        history.push('/');
      } else {
        // If signup only creates the user, navigate to login page
        history.push('/login');
      }

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h2 className={styles.title}>Sign Up</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.formSection}>
          <h3>Account Details</h3>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Software Background</h3>
          <div className={styles.formGroup}>
            <label htmlFor="experienceLevel" className={styles.label}>Experience Level:</label>
            <select
              id="experienceLevel"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              required
              className={styles.input}
            >
              <option value="">Select an option</option>
              <option value="none">None</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="programmingLanguages" className={styles.label}>Programming Languages (comma-separated):</label>
            <input
              type="text"
              id="programmingLanguages"
              value={programmingLanguages}
              onChange={(e) => setProgrammingLanguages(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="aiExperience" className={styles.label}>AI Experience:</label>
            <textarea
              id="aiExperience"
              value={aiExperience}
              onChange={(e) => setAiExperience(e.target.value)}
              className={styles.input}
              rows={3}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Hardware Background</h3>
          <div className={styles.formGroup}>
            <label htmlFor="gpuAvailability" className={styles.label}>GPU Availability:</label>
            <input
              type="text"
              id="gpuAvailability"
              value={gpuAvailability}
              onChange={(e) => setGpuAvailability(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="electronicsKnowledge" className={styles.label}>Electronics Knowledge:</label>
            <textarea
              id="electronicsKnowledge"
              value={electronicsKnowledge}
              onChange={(e) => setElectronicsKnowledge(e.target.value)}
              className={styles.input}
              rows={3}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="microcontrollerExperience" className={styles.label}>Microcontroller Experience (comma-separated):</label>
            <input
              type="text"
              id="microcontrollerExperience"
              value={microcontrollerExperience}
              onChange={(e) => setMicrocontrollerExperience(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <p className={styles.loginText}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;