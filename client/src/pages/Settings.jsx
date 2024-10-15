import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from '../styles/Settings.module.css';
import { IoMdClose, IoIosNotifications } from 'react-icons/io';

import { MdModeEditOutline, MdOutlineSecurity } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { IoColorPaletteSharp } from 'react-icons/io5';
import GeneralInfo from '../components/GeneralInfo';
import NotificationSettings from '../components/NotificationSettings';
import Personalization from '../components/Personalization';
import Security from '../components/Security';
import { AiOutlineMenuFold } from 'react-icons/ai';
import ProfilePictureCropper from '../components/ProfilePictureCropper';
import { AuthContext } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import { getProfilePhoto } from '../components/Header';

const Settings = () => {
  const { userData, serverUrl, mode: theme } = useContext(AuthContext);
  const [showNav, setShowNav] = useState(false);
  const [category, setCategory] = useState('general');
  const [displayCategory, setDisplayCategory] = useState(false);
  const [image, setImage] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [mode, setMode] = useState(null);

  const fileRef = useRef();

  useEffect(() => {
    if (fileRef.current) {
      if (!image) {
        fileRef.current.files = new DataTransfer().files;
      }
    }
  }, [image]);

  const hideResponsiveSettings = (e) => {
    e.target === e.currentTarget && setDisplayCategory(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
      setMode('edit');
      setDisplayCategory(false);
    }
  };

  return (
    <main className={styles.main}>
      <ToastContainer autoClose={2000} />

      <section
        className={`${styles['responsive-settings']} ${
          displayCategory ? styles['show-responsive-settings'] : ''
        }`}
        onClick={hideResponsiveSettings}
      >
        <div
          className={`${styles['responsive-settings-category']} ${
            theme === 'dark' ? styles['dark-settings-category'] : ''
          }`}
        >
          <span
            className={`${styles['close-responsive-settings']}  ${
              theme === 'dark' ? styles['dark-responsive-settings'] : ''
            }`}
            onClick={() => setDisplayCategory(false)}
          >
            <IoMdClose
              className={`${styles['close-responsive-icon']}  ${
                theme === 'dark' ? styles['dark-responsive-icon'] : ''
              }`}
            />
          </span>

          <figure className={styles['profile-img-box']}>
            <input type="file" ref={fileRef} className={styles['file-btn']} />

            <span className={styles['img-box']}>
              <span
                className={styles['change-img-box']}
                onClick={() => fileRef.current.click()}
              >
                <MdModeEditOutline className={styles['change-img-icon']} />
              </span>
              <img
                className={`${styles['profile-pics']} ${
                  userData.photo === 'default.jpeg' ? styles['default-pic'] : ''
                }`}
                src={getProfilePhoto(userData, serverUrl)}
                onClick={() => {
                  setMode('view');
                  setDisplayCategory(false);
                }}
              />
            </span>

            <figcaption className={styles['profile-img-caption']}>
              <span
                className={`${styles['username']} ${
                  theme === 'dark' ? styles['dark-text'] : ''
                }`}
              >
                {userData.firstName} {userData.lastName}
              </span>
              <span
                className={`${styles['user-title']} ${
                  theme === 'dark' ? styles['dark-word'] : ''
                }`}
              >
                {' '}
                {userData.occupation}
              </span>
            </figcaption>
          </figure>

          <ul className={styles['category-list']}>
            <li
              className={`${styles['category-item']} ${
                category === 'general'
                  ? theme === 'dark'
                    ? styles['dark-current-category']
                    : styles['current-category-item']
                  : ''
              } ${theme === 'dark' ? styles['dark-category-item'] : ''}`}
            >
              <span
                className={`${styles['category-box']} ${
                  category === 'general' ? styles['current-category-box'] : ''
                }`}
                onClick={() => setCategory('general')}
              >
                <CgProfile className={styles['category-icon']} /> Profile
              </span>
            </li>

            <li
              className={`${styles['category-item']} ${
                category === 'notifications'
                  ? theme === 'dark'
                    ? styles['dark-current-category']
                    : styles['current-category-item']
                  : ''
              } ${theme === 'dark' ? styles['dark-category-item'] : ''}`}
            >
              <span
                className={`${styles['category-box']} ${
                  category === 'notifications'
                    ? styles['current-category-box']
                    : ''
                }`}
                onClick={() => setCategory('notifications')}
              >
                <IoIosNotifications className={styles['category-icon']} />{' '}
                Notifications
              </span>
            </li>
            <li
              className={`${styles['category-item']} ${
                category === 'personalization'
                  ? theme === 'dark'
                    ? styles['dark-current-category']
                    : styles['current-category-item']
                  : ''
              } ${theme === 'dark' ? styles['dark-category-item'] : ''}`}
            >
              {' '}
              <span
                className={`${styles['category-box']} ${
                  category === 'personalization'
                    ? styles['current-category-box']
                    : ''
                }`}
                onClick={() => setCategory('personalization')}
              >
                <IoColorPaletteSharp className={styles['category-icon']} />{' '}
                Personalization
              </span>
            </li>
            <li
              className={`${styles['category-item']} ${
                category === 'security'
                  ? theme === 'dark'
                    ? styles['dark-current-category']
                    : styles['current-category-item']
                  : ''
              } ${theme === 'dark' ? styles['dark-category-item'] : ''}`}
            >
              <span
                className={`${styles['category-box']} ${
                  category === 'security' ? styles['current-category-box'] : ''
                }`}
                onClick={() => setCategory('security')}
              >
                <MdOutlineSecurity className={styles['category-icon']} />{' '}
                Security
              </span>
            </li>
          </ul>
        </div>
      </section>

      <NavBar page={'Settings'} showNav={showNav} setShowNav={setShowNav} />

      <section className={styles.section}>
        <Header page={'Settings'} setShowNav={setShowNav} />

        {mode && (
          <ProfilePictureCropper
            mode={mode}
            setMode={setMode}
            image={image}
            setImage={setImage}
            cropData={cropData}
            setCropData={setCropData}
            fileRef={fileRef}
            userId={userData._id}
            toast={toast}
          />
        )}

        <section className={styles['section-content']}>
          <div className={styles['settings-category']}>
            <figure className={styles['profile-img-box']}>
              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                className={styles['file-btn']}
                onChange={handleFileChange}
              />

              <span className={styles['img-box']}>
                <span
                  className={styles['change-img-box']}
                  onClick={() => fileRef.current.click()}
                >
                  <MdModeEditOutline className={styles['change-img-icon']} />
                </span>
                <img
                  className={`${styles['profile-pics']} ${
                    userData.photo === 'default.jpeg'
                      ? styles['default-pic']
                      : ''
                  }`}
                  src={getProfilePhoto(userData, serverUrl)}
                  onClick={() => {
                    setMode('view');
                    setDisplayCategory(false);
                  }}
                />
              </span>

              <figcaption className={styles['profile-img-caption']}>
                <span
                  className={`${styles['username']} ${
                    theme === 'dark' ? styles['dark-text'] : ''
                  }`}
                >
                  {userData.firstName} {userData.lastName}
                </span>
                <span
                  className={`${styles['user-title']} ${
                    theme === 'dark' ? styles['dark-word'] : ''
                  }`}
                >
                  {' '}
                  {userData.occupation}
                </span>
              </figcaption>
            </figure>

            <ul className={styles['category-list']}>
              <li
                className={`${styles['category-item']} ${
                  category === 'general'
                    ? theme === 'dark'
                      ? styles['dark-current-category']
                      : styles['current-category-item']
                    : ''
                } ${theme === 'dark' ? styles['dark-category-item'] : ''}`}
              >
                <span
                  className={`${styles['category-box']} ${
                    category === 'general' ? styles['current-category-box'] : ''
                  }`}
                  onClick={() => setCategory('general')}
                >
                  <CgProfile className={styles['category-icon']} /> Profile
                </span>
              </li>

              <li
                className={`${styles['category-item']} ${
                  category === 'notifications'
                    ? theme === 'dark'
                      ? styles['dark-current-category']
                      : styles['current-category-item']
                    : ''
                } ${theme === 'dark' ? styles['dark-category-item'] : ''}`}
              >
                <span
                  className={`${styles['category-box']} ${
                    category === 'notifications'
                      ? styles['current-category-box']
                      : ''
                  }`}
                  onClick={() => setCategory('notifications')}
                >
                  <IoIosNotifications className={styles['category-icon']} />{' '}
                  Notifications
                </span>
              </li>
              <li
                className={`${styles['category-item']} ${
                  category === 'personalization'
                    ? theme === 'dark'
                      ? styles['dark-current-category']
                      : styles['current-category-item']
                    : ''
                } ${theme === 'dark' ? styles['dark-category-item'] : ''}`}
              >
                {' '}
                <span
                  className={`${styles['category-box']} ${
                    category === 'personalization'
                      ? styles['current-category-box']
                      : ''
                  }`}
                  onClick={() => setCategory('personalization')}
                >
                  <IoColorPaletteSharp className={styles['category-icon']} />{' '}
                  Personalization
                </span>
              </li>
              <li
                className={`${styles['category-item']} ${
                  category === 'security'
                    ? theme === 'dark'
                      ? styles['dark-current-category']
                      : styles['current-category-item']
                    : ''
                } ${theme === 'dark' ? styles['dark-category-item'] : ''}`}
              >
                <span
                  className={`${styles['category-box']} ${
                    category === 'security'
                      ? styles['current-category-box']
                      : ''
                  }`}
                  onClick={() => setCategory('security')}
                >
                  <MdOutlineSecurity className={styles['category-icon']} />{' '}
                  Security
                </span>
              </li>
            </ul>
          </div>

          <AiOutlineMenuFold
            className={`${styles['settings-menu-icon']}  ${
              theme === 'dark' ? styles['dark-menu-icon'] : ''
            }`}
            onClick={() => setDisplayCategory(true)}
          />

          {category === 'general' && <GeneralInfo />}

          {category === 'notifications' && <NotificationSettings />}

          {category === 'personalization' && <Personalization />}

          {category === 'security' && <Security />}
        </section>
      </section>
    </main>
  );
};

export default Settings;
