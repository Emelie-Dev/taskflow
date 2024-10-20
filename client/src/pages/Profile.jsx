import React, { useRef, useState, useContext, useEffect } from 'react';
import styles from '../styles/Profile.module.css';
import { AuthContext } from '../App';
import { months } from './Dashboard';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import { getProfilePhoto } from '../components/Header';

const Profile = () => {
  const { userData, serverUrl, mode } = useContext(AuthContext);
  const [showNav, setShowNav] = useState(false);

  const getValue = (property) => {
    if (property === 'dob') {
      if (!userData.dob)
        return (
          <i
            className={`${styles['gray-text']} ${
              mode === 'dark' ? styles['dark-word'] : ''
            }`}
          >
            Not specified
          </i>
        );

      const date = new Date(userData.dob);

      return `${
        months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`;
    } else {
      return userData[property] ? (
        userData[property]
      ) : (
        <i
          className={`${styles['gray-text']} ${
            mode === 'dark' ? styles['dark-word'] : ''
          }`}
        >
          Not specified
        </i>
      );
    }
  };

  return (
    <main className={styles.div}>
      <NavBar page={'Profile'} showNav={showNav} setShowNav={setShowNav} />

      <section className={styles.section}>
        <Header page={'Profile'} setShowNav={setShowNav} />

        <section className={styles['section-content']}>
          <div
            className={`${styles['profile-container']} ${
              mode === 'dark' ? styles['dark-container'] : ''
            }`}
          >
            <div className={styles['left-section']}>
              <figure className={styles['profile-pics-box']}>
                <img
                  src={getProfilePhoto(userData, serverUrl)}
                  className={styles['profile-pics']}
                />
              </figure>

              <span
                className={`${styles['username']} ${
                  mode === 'dark' ? styles['dark-text'] : ''
                }`}
              >
                {userData.firstName} {userData.lastName}
              </span>

              <span
                className={`${styles['user-title']} ${
                  mode === 'dark' ? styles['dark-word'] : ''
                }`}
              >
                {userData.occupation}
              </span>

              <div className={styles['profile-btn-div']}>
                <button className={styles['message-btn']}>Send message</button>
                <button className={styles['group-btn']}>Add to group</button>
              </div>
            </div>

            <div className={styles['right-section']}>
              <div className={styles['property-box']}>
                <span
                  className={`${styles['property-name']} ${
                    mode === 'dark' ? styles['dark-word'] : ''
                  }`}
                >
                  Username:
                </span>
                <span
                  className={`${styles['property-value']} ${
                    mode === 'dark' ? styles['dark-text'] : ''
                  }`}
                >
                  {getValue('username')}
                </span>
              </div>
              <div className={styles['property-box']}>
                <span
                  className={`${styles['property-name']} ${
                    mode === 'dark' ? styles['dark-word'] : ''
                  }`}
                >
                  Phone Number:
                </span>
                <span
                  className={`${styles['property-value']} ${
                    mode === 'dark' ? styles['dark-text'] : ''
                  }`}
                >
                  {getValue('mobileNumber')}
                </span>
              </div>
              <div className={styles['property-box']}>
                <span
                  className={`${styles['property-name']} ${
                    mode === 'dark' ? styles['dark-word'] : ''
                  }`}
                >
                  Birthday:
                </span>
                <span
                  className={`${styles['property-value']} ${
                    mode === 'dark' ? styles['dark-text'] : ''
                  }`}
                >
                  {' '}
                  {getValue('dob')}
                </span>
              </div>
              <div className={styles['property-box']}>
                <span
                  className={`${styles['property-name']} ${
                    mode === 'dark' ? styles['dark-word'] : ''
                  }`}
                >
                  Email:
                </span>
                <span
                  className={`${styles['property-value']} ${
                    mode === 'dark' ? styles['dark-text'] : ''
                  }`}
                >
                  {getValue('email')}
                </span>
              </div>
              <div className={styles['property-box']}>
                <span
                  className={`${styles['property-name']} ${
                    mode === 'dark' ? styles['dark-word'] : ''
                  }`}
                >
                  Country:
                </span>
                <span
                  className={`${styles['property-value']} ${
                    mode === 'dark' ? styles['dark-text'] : ''
                  }`}
                >
                  {getValue('country')}
                </span>
              </div>
              <div className={styles['property-box']}>
                <span
                  className={`${styles['property-name']} ${
                    mode === 'dark' ? styles['dark-word'] : ''
                  }`}
                >
                  Language:
                </span>
                <span
                  className={`${styles['property-value']} ${
                    mode === 'dark' ? styles['dark-text'] : ''
                  }`}
                >
                  {getValue('language')}
                </span>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Profile;
