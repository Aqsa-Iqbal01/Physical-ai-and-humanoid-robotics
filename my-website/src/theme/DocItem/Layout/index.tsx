import React from 'react';
import DocItem from '@theme-original/DocItem/Layout';
import { useAuth } from '@site/src/context/AuthContext';
import { Redirect } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function DocItemWrapper(props) {
  const { user, loading } = useAuth();
  const { siteConfig } = useDocusaurusContext(); // To get site title for layout

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading authentication...
      </div>
    );
  }

  if (!user) {
    // Redirect to signup page if not authenticated
    return <Redirect to="/signup" />;
  }

  // If authenticated, render the original DocItem layout
  return (
    <DocItem {...props} />
  );
}
