import React from 'react';
import Layout from '@theme/Layout';
import SignIn from '@site/src/components/Auth/SignIn';
import { useAuth } from '@site/src/context/AuthContext';
import { Redirect } from '@docusaurus/router';

function LoginPage() {
  const { user } = useAuth();

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <Layout title="Login">
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <SignIn />
      </main>
    </Layout>
  );
}

export default LoginPage;