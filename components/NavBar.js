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
  const navToHome = () => {
    router.push('/');
  };

  return (
    <nav style={navStyle}>
      <div style={navContainerStyle}>
        <h2 style={logoStyle} onClick={navToHome}>TAYD</h2>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const navStyle = {
  transform: 'translateX(50%)',
  width: '50%',
  backgroundColor: '#0070f3',
  padding: '10px 20px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  margin:'20px 0px 0px 0px'
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
  cursor:'pointer'
};

const logoutButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#fff',
  color: '#0070f3',
  border: 'none',
  borderRadius: '15px',
  cursor: 'pointer',
};
