import React from 'react';
import Layout from '@theme/Layout';
import Login from '../components/Login';

function LoginPage() {
  return (
    <Layout title="Login">
      <main>
        <Login />
      </main>
    </Layout>
  );
}

export default LoginPage;