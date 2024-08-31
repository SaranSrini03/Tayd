// app/page.js
import Link from 'next/link';
import styles from './styles/HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>Welcome to TAYD.</h1>
        <h2 className={styles.subheading}>Tell About Your Day</h2>

        <Link href="/auth" passHref>
          <span className={styles.link}>Get Started</span>
        </Link>
        <h2 className={styles.subheading}>Made by NearCult</h2>
      </div>
    </div>
  );
}
