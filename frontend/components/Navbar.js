'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/components.module.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        TeamPM
      </Link>
      <div className={styles.navLinks}>
        {isAuthenticated ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/tasks">Tasks</Link>
            <Link href="/teams">Teams</Link>
            <Link href="/profile">Profile</Link>
            <span>{user?.name}</span>
            <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
