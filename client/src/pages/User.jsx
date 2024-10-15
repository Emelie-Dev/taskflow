import React, { useState, useContext, useEffect } from 'react';
import styles from '../styles/Profile.module.css';
import { months } from './Dashboard';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { apiClient, AuthContext } from '../App';
import Loader from '../components/Loader';
import { MdOutlineSignalWifiOff } from 'react-icons/md';
import { getProfilePhoto } from '../components/Header';

const User = () => {
  const { username } = useParams();
  const { serverUrl, mode } = useContext(AuthContext);
  const [userData, setUserData] = useState('loading');
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await apiClient(`/api/v1/users/${username}`);

        setUserData(data.data.user);
      } catch (err) {
        if (
          !err.response ||
          !err.response.data ||
          err.response.status === 500
        ) {
          setUserData(false);
          return toast('An error occured while searching for user.', {
            toastId: 'toast-id',
          });
        } else {
          if (err.response.status === 404) {
            setUserData(null);
          } else {
            setUserData(false);
          }
          return toast(err.response.data.message, {
            toastId: 'toast-id',
          });
        }
      }
    };

    getUser();
  }, []);

  const getValue = (property) => {
    if (property === 'dob') {
      if (!userData.dob)
        return (
          <i
            className={`${styles['gray-text']} ${
              mode === 'dark' ? styles['dark-word'] : ''
            }`}
          >
            Not available
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
          Not available
        </i>
      );
    }
  };

  return (
    <main className={styles.div}>
      <ToastContainer autoClose={2000} />

      <NavBar page={'Users'} showNav={showNav} setShowNav={setShowNav} />

      <section className={styles.section}>
        <Header page={'Users'} setShowNav={setShowNav} />

        <section className={styles['section-content']}>
          {userData === 'loading' ? (
            <div className={styles['loader-div']}>
              <Loader
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                }}
              />
            </div>
          ) : userData === null ? (
            <div
              className={`${styles['error-text']} ${
                mode === 'dark' ? styles['dark-word'] : ''
              }`}
            >
              This user does not exist
            </div>
          ) : userData ? (
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
                  <button className={styles['message-btn']}>
                    Send message
                  </button>
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
          ) : (
            <div className={styles['error-text']}>
              <MdOutlineSignalWifiOff className={styles['network-icon']} />
              Unable to retrieve user data
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default User;
