import React from 'react';
import Layout from '@theme/Layout';
import SignUp from '@site/src/components/Auth/SignUp';
import { useAuth } from '@site/src/context/AuthContext';
import { Redirect } from '@docusaurus/router';

function SignupPage() {
  const { user } = useAuth();

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <Layout title="Sign Up">
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <SignUp />
      </main>
    </Layout>
  );
}

export default SignupPage;