import React, { useRef, useState, useContext, useEffect } from 'react';
import styles from '../styles/Profile.module.css';
import { months } from './Dashboard';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { apiClient, AuthContext } from '../App';
import Loader from '../components/Loader';

const User = () => {
  const { username } = useParams();
  const { serverUrl } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await apiClient(`/api/v1/users/${username}`);

        setUserData(data.data.user);
      } catch (err) {
        setUserData(false);
        if (
          !err.response ||
          !err.response.data ||
          err.response.status === 500
        ) {
          return toast('An error occured while searching for user.', {
            toastId: 'toast-id',
          });
        } else {
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
      if (!userData.dob) return <i style={{ color: 'gray' }}>Not available</i>;

      const date = new Date(userData.dob);

      return `${
        months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`;
    } else {
      return userData[property] ? (
        userData[property]
      ) : (
        <i style={{ color: 'gray' }}>Not available</i>
      );
    }
  };

  return (
    <main className={styles.div}>
      <ToastContainer autoClose={2000} />

      <NavBar page={'Profile'} showNav={showNav} setShowNav={setShowNav} />

      <section className={styles.section}>
        <Header page={'Profile'} setShowNav={setShowNav} />

        <section className={styles['section-content']}>
          {userData === null ? (
            <div className={styles['loader-div']}>
              <Loader
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                }}
              />
            </div>
          ) : userData ? (
            <div className={styles['profile-container']}>
              <div className={styles['left-section']}>
                <figure className={styles['profile-pics-box']}>
                  <img
                    src={`${serverUrl}/users/${userData.photo}`}
                    className={styles['profile-pics']}
                  />
                </figure>

                <span className={styles['username']}>
                  {userData.firstName} {userData.lastName}
                </span>

                <span className={styles['user-title']}>
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
                  <span className={styles['property-name']}>Username:</span>
                  <span className={styles['property-value']}>
                    {getValue('username')}
                  </span>
                </div>
                <div className={styles['property-box']}>
                  <span className={styles['property-name']}>Phone Number:</span>
                  <span className={styles['property-value']}>
                    {getValue('mobileNumber')}
                  </span>
                </div>
                <div className={styles['property-box']}>
                  <span className={styles['property-name']}>Birthday:</span>
                  <span className={styles['property-value']}>
                    {' '}
                    {getValue('dob')}
                  </span>
                </div>
                <div className={styles['property-box']}>
                  <span className={styles['property-name']}>Email:</span>
                  <span className={styles['property-value']}>
                    {getValue('email')}
                  </span>
                </div>
                <div className={styles['property-box']}>
                  <span className={styles['property-name']}>Country:</span>
                  <span className={styles['property-value']}>
                    {getValue('country')}
                  </span>
                </div>
                <div className={styles['property-box']}>
                  <span className={styles['property-name']}>Language:</span>
                  <span className={styles['property-value']}>
                    {getValue('language')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </section>
      </section>
    </main>
  );
};

export default User;
