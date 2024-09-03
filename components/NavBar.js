// components/NavBar.js

"use client";

import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav style={navStyle}>
      <div style={navContainerStyle}>
        <h2 style={logoStyle}>TAYD</h2>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const navStyle = {
  width: '100%',
  backgroundColor: '#0070f3',
  padding: '10px 20px',
};

const navContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle = {
  color: '#fff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: 0,
};

const logoutButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#fff',
  color: '#0070f3',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};
