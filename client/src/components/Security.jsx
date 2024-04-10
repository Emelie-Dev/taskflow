import React, { useEffect, useState } from 'react';
import styles from '../styles/Security.module.css';

const initialData = {
  first: true,
  last: true,
  language: false,
  number: false,
  country: false,
};

const Security = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enableBtn, setEnableBtn] = useState(false);

  const [visibleData, setVisibleData] = useState(initialData);

  useEffect(() => {
    let dataCount = 0;

    for (let prop in visibleData) {
      visibleData[prop] === initialData[prop] && dataCount++;
    }

    if (password !== '' || confirmPassword !== '' || dataCount !== 5) {
      setEnableBtn(true);
    } else {
      setEnableBtn(false);
    }
  }, [password, confirmPassword, visibleData]);

  const { first, last, language, number, country } = visibleData;

  const handleChange = (e, prop) => {
    setVisibleData({ ...visibleData, [prop]: e.target.checked });
  };

  const resetData = () => {
    setPassword('');
    setConfirmPassword('');
    setVisibleData(initialData);
  };

  return (
    <section className={styles.section}>
      <h1 className={styles['section-head']}>Security</h1>

      <div className={styles['content-container']}>
        <p className={styles['password-head']}>Password</p>

        <div className={styles['password-box']}>
          <div className={styles['input-box']}>
            <label className={styles.label}>New Password:</label>
            <input
              type="text"
              className={styles['password']}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles['input-box']}>
            <label className={styles.label}>Confirm Password:</label>
            <input
              type="text"
              className={styles['password']}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles['content-container']}>
        <p className={styles['data-head']}>Data visibility</p>

        <span className={styles['data-text']}>
          Select which details will be viewable by other users.
        </span>

        <div className={styles['data-container']}>
          <span className={styles['data-box']}>
            <input
              type="checkbox"
              className={styles['data-checkbox']}
              checked={first}
              onChange={() => handleChange(event, 'first')}
            />
            <label className={styles['data-label']}>First name</label>
          </span>
          <span className={styles['data-box']}>
            <input
              type="checkbox"
              className={styles['data-checkbox']}
              checked={last}
              onChange={() => handleChange(event, 'last')}
            />
            <label className={styles['data-label']}>Last name</label>
          </span>
          <span className={styles['data-box']}>
            <input
              type="checkbox"
              className={styles['data-checkbox']}
              checked={number}
              onChange={() => handleChange(event, 'number')}
            />
            <label className={styles['data-label']}>Phone Number</label>
          </span>
          <span className={styles['data-box']}>
            <input
              type="checkbox"
              className={styles['data-checkbox']}
              checked={country}
              onChange={() => handleChange(event, 'country')}
            />
            <label className={styles['data-label']}>Country</label>
          </span>{' '}
          <span className={styles['data-box']}>
            <input
              type="checkbox"
              className={styles['data-checkbox']}
              checked={language}
              onChange={() => handleChange(event, 'language')}
            />
            <label className={styles['data-label']}>Language</label>
          </span>
        </div>
      </div>

      <button
        className={`${styles['save-btn']} ${
          enableBtn ? styles['enable-btn'] : ''
        }`}
      >
        Save
      </button>

      <button
        className={`${styles['reset-btn']} ${
          enableBtn ? styles['enable-btn'] : ''
        }`}
        onClick={resetData}
      >
        Reset
      </button>

      <div className={styles['btn-div']}>
        <button className={styles['delete-btn']}>Delete Account</button>
        <button className={styles['deactivate-btn']}>Deactivate Account</button>
      </div>
    </section>
  );
};

export default Security;
