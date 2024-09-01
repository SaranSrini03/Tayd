"use client";

import { SignIn } from '@clerk/nextjs';

export default function AuthPage() {
  return (
    <div style={styles.container}>
      <SignIn routing="hash" />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0', // Optional: adds a background color for better visual appeal
  },
};
