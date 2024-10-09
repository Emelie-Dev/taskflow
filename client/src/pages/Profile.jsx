import React, { useRef, useState, useContext } from 'react';
import styles from '../styles/Profile.module.css';
import { AuthContext } from '../App';
import { months } from './Dashboard';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import { getProfilePhoto } from '../components/Header';

const Profile = () => {
  const { userData, serverUrl } = useContext(AuthContext);
  const [showNav, setShowNav] = useState(false);

  const getValue = (property) => {
    if (property === 'dob') {
      if (!userData.dob) return <i style={{ color: 'gray' }}>Not specified</i>;

      const date = new Date(userData.dob);

      return `${
        months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`;
    } else {
      return userData[property] ? (
        userData[property]
      ) : (
        <i style={{ color: 'gray' }}>Not specified</i>
      );
    }
  };

  return (
    <main className={styles.div}>
      <NavBar page={'Profile'} showNav={showNav} setShowNav={setShowNav} />

      <section className={styles.section}>
        <Header page={'Profile'} setShowNav={setShowNav} />

        <section className={styles['section-content']}>
          <div className={styles['profile-container']}>
            {/* <Link
              to={'/settings'}
              className={styles['edit-profile-link']}
              title="Edit Profile"
            >
              <MdEdit className={styles['edit-profile-icon']} />
            </Link> */}

            <div className={styles['left-section']}>
              <figure className={styles['profile-pics-box']}>
                <img
                  src={getProfilePhoto(userData, serverUrl)}
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
                <button className={styles['message-btn']}>Send message</button>
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
        </section>
      </section>
    </main>
  );
};

export default Profile;
