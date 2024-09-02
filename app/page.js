"use client";

import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import styles from './styles/HomePage.module.css';

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const syncUserData = async () => {
      if (isSignedIn && user) {
        try {
          const response = await fetch('/api', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              email: user.emailAddresses[0]?.emailAddress,
              password: user.password
            }),
          });
          
          const data = await response.json();
          
          if (data.success) {
            router.push('/explore');
          } else {
            console.error('Failed to sync user data:', data.message);
          }
        } catch (error) {
          console.error('Error syncing user data:', error);
        }
      }
    };

    syncUserData();
  }, [isSignedIn, user, router]);

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>Welcome to TAYD.</h1>
        <h2 className={styles.subheading}>Tell About Your Day</h2>

        <button
          onClick={() => {
            if (isSignedIn) {
              router.push('/explore');
            } else {
              router.push('/auth');
            }
          }}
          className={styles.link}
        >
          Get Started
        </button>

        <h5 className={styles.credits}>Made by Nearcult</h5>
      </div>
    </div>
  );
}
