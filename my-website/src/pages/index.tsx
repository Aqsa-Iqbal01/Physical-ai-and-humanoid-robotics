import React, { useState } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageChapters from '@site/src/components/HomepageChapters';
import Heading from '@theme/Heading';

import styles from './index.module.css';

import { useAuth } from '@site/src/context/AuthContext';


function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <div className="hero hero--primary">Loading authentication...</div>;
  }

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <p>Welcome, {user.email}!</p>
              <button onClick={logout} className="button button--secondary button--lg">
                Logout
              </button>
              {user.software_background && <p>Software: {user.software_background}</p>}
              {user.hardware_background && <p>Hardware: {user.hardware_background}</p>}
            </div>
          ) : (
            <Link
              className="button button--secondary button--lg"
              to="/signup">
              Get Started →
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const { user, loading } = useAuth();

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        {user ? (
          <>
            <HomepageFeatures />
            <HomepageChapters />
          </>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Please sign in or sign up to access the full content and personalized experience.</p>
            <p>Click on "Login" or "Sign Up" in the navigation bar.</p>
          </div>
        )}
      </main>
    </Layout>
  );
}
