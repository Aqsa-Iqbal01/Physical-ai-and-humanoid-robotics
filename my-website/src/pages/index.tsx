import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageChapters from '@site/src/components/HomepageChapters';
import Heading from '@theme/Heading';


import styles from './index.module.css';

import { AuthProvider, useAuth } from '@site/src/context/AuthContext';


function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const { user, logout } = useAuth(); // Use the useAuth hook and destructure logout

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        {user && user.email && ( // Conditionally render welcome message
          <p className="hero__subtitle">Welcome, {user.email}</p>
        )}
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          {user ? (
            <button
              className="button button--secondary button--lg"
              onClick={() => { if (logout) logout(); }} // Defensive check
            >
              Logout
            </button>
          ) : (
            <Link
              className="button button--secondary button--lg"
              to="/login">
               Get Started →
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <AuthProvider>
      <Layout
        title={`Hello from ${siteConfig.title}`}
        description="Description will go into a meta tag in <head />">
        <HomepageHeader />
        <main>
          <HomepageFeatures />
          <HomepageChapters />
        </main>
      </Layout>
    </AuthProvider>
  );
}