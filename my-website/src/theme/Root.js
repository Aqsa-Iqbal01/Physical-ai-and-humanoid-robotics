// src/theme/Root.js
import React from 'react';
import ChatWidget from '@site/src/components/ChatWidget';
import { AuthProvider } from '@site/src/context/AuthContext'; // Import AuthProvider

// This component wraps the entire Docusaurus app
export default function Root({ children }) {
  return (
    <AuthProvider>
      {children}
     <ChatWidget/>
    </AuthProvider>
  );
}