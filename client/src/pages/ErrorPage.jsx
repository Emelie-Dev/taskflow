import React from 'react';
import styles from '../styles/ErrorPage.module.css';
import { Link } from 'react-router-dom';
import { SiKashflow } from 'react-icons/si';

// Fallback component
export const ErrorPage = ({ page }) => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div className={styles.head}>
          <SiKashflow className={styles.logo} />
          <h1>TaskFlow</h1>
        </div>
        <Link className={styles['login-link']} to="/login">
          <button className={styles.button}>Log in</button>
        </Link>
      </header>

      {page === '404' ? (
        <div className={styles['error-boundary']}>
          <p className={styles['error-boundary-text']}>
            Sorry, the page you are looking for does not exist.
          </p>
          <a href="/">
            <button className={styles['error-boundary-btn']}>Home Page</button>
          </a>
        </div>
      ) : (
        <div className={styles['error-boundary']}>
          <p className={styles['error-boundary-text']}>Something went wrong</p>
          <button
            className={styles['error-boundary-btn']}
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      )}
    </section>
  );
};

export default ErrorPage;
