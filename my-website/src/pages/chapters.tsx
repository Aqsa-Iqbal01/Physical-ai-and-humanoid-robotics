import React, { useEffect, useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '@site/src/context/AuthContext';
import { useHistory, useLocation } from 'react-router-dom';
import Markdown from 'react-markdown'; // For rendering markdown content

function Chapters() {
  const { user, token, loading } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const [chapterContent, setChapterContent] = useState<string | null>(null);
  const [currentChapterTitle, setCurrentChapterTitle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chapterLoading, setChapterLoading] = useState<boolean>(false);

  // Hardcoded list of chapters for now.
  // In a real application, you might fetch this list from a backend endpoint.
  const chapterList = [
    { filename: 'Chapter 01 Introduction to physical ai and humanoid robotics', title: 'Chapter 1: Introduction to Physical AI and Humanoid Robotics' },
    { filename: 'Chapter 02 Historical context and evolution', title: 'Chapter 2: Historical Context and Evolution' },
    { filename: 'Chapter 03 Kinematics and dynamics', title: 'Chapter 3: Kinematics and Dynamics' },
    { filename: 'Chapter 04 Control systems and actuation', title: 'Chapter 4: Control Systems and Actuation' },
    { filename: 'Chapter 05 Leading humanoid robot platforms', title: 'Chapter 5: Leading Humanoid Robot Platforms' },
    { filename: 'Chapter 06 Perception systems', title: 'Chapter 6: Perception Systems' },
    { filename: 'Chapter 07 Real world applications', title: 'Chapter 7: Real World Applications' },
    { filename: 'Chapter 08 Robot learning and adaptation', title: 'Chapter 8: Robot Learning and Adaptation' },
    { filename: 'Chapter 09 Ethical considerations', title: 'Chapter 9: Ethical Considerations' },
    { filename: 'Chapter 10 AI for decision making', title: 'Chapter 10: AI for Decision Making' },
    { filename: 'Chapter 11 Future trends and research', title: 'Chapter 11: Future Trends and Research' },
  ];

  const fetchChapter = useCallback(async (filename: string) => {
    if (!token) {
      setError('No authentication token found. Please log in.');
      history.push(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      console.log('fetchChapter: No token found, redirecting to login.');
      return;
    }

    setChapterLoading(true);
    setError(null);
    setChapterContent(null);
    console.log(`fetchChapter: Attempting to fetch chapter: ${filename} with token.`);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/chapters/${filename}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`fetchChapter: Response status: ${response.status}, ok: ${response.ok}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('fetchChapter: Backend error response:', errorData);
        throw new Error(errorData.detail || 'Failed to fetch chapter');
      }

      const data = await response.json();
      console.log('fetchChapter: Successfully fetched data:', data);
      setChapterContent(data.content);
      setCurrentChapterTitle(data.title);
    } catch (err: any) {
      console.error('fetchChapter: Error during fetch:', err);
      setError(err.message || 'An unknown error occurred while fetching chapter.');
      if (err.message.includes('authentication')) {
        history.push(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      }
    } finally {
      setChapterLoading(false);
    }
  }, [token, history, location]);

  useEffect(() => {
    console.log('Chapters useEffect: user, token, loading:', { user, token, loading });
    if (!loading && (!user && !token)) {
      console.log('Chapters useEffect: Not authenticated, redirecting to login.');
      history.push(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
    }
  }, [user, token, loading, history, location]);

  if (loading) {
    return (
      <Layout title="Chapters" description="Protected Chapters">
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Loading...</h1>
          <p>Checking authentication status.</p>
        </main>
      </Layout>
    );
  }

  if (user || token) {
    return (
      <Layout title="Chapters" description="Protected Chapters">
        <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--ifm-navbar-height) - var(--ifm-footer-height))' }}>
          <aside style={{ width: '250px', padding: '1rem', borderRight: '1px solid var(--ifm-toc-border-color)' }}>
            <h2 style={{ marginBottom: '1rem' }}>Chapters</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {chapterList.map((chapter) => (
                <li key={chapter.filename} style={{ marginBottom: '0.5rem' }}>
                  <button
                    onClick={() => fetchChapter(chapter.filename)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--ifm-link-color)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: 0,
                      textDecoration: 'underline',
                      fontSize: '1rem',
                    }}
                  >
                    {chapter.title}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <main style={{ flexGrow: 1, padding: '2rem' }}>
            <h1>Welcome to the Protected Chapters!</h1>
            <p>You are logged in as {user?.email}.</p>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {chapterLoading && <p>Loading chapter...</p>}
            {chapterContent && (
              <div className="markdown-body"> {/* Use a class for markdown styling */}
                <h2>{currentChapterTitle}</h2>
                <Markdown>{chapterContent}</Markdown>
              </div>
            )}
            {!chapterContent && !chapterLoading && !error && (
              <p>Please select a chapter from the left to start reading.</p>
            )}
          </main>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Chapters" description="Protected Chapters">
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Access Denied</h1>
        <p>Please log in to view the chapters.</p>
        <button onClick={() => history.push(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`)} className="button button--primary button--lg">
          Go to Login
        </button>
      </main>
    </Layout>
  );
}

export default Chapters;

