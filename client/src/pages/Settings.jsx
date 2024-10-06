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

const Settings = () => {
  const { userData, setUserData, serverUrl } = useContext(AuthContext);
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
        <div className={styles['responsive-settings-category']}>
          <span
            className={styles['close-responsive-settings']}
            onClick={() => setDisplayCategory(false)}
          >
            <IoMdClose className={styles['close-responsive-icon']} />
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
                src={`${serverUrl}/users/${userData.photo}`}
                onClick={() => {
                  setMode('view');
                  setDisplayCategory(false);
                }}
              />
            </span>

            <figcaption className={styles['profile-img-caption']}>
              <span className={styles['username']}>Ofoka Vincent</span>
              <span className={styles['user-title']}>Web Developer</span>
            </figcaption>
          </figure>

          <ul className={styles['category-list']}>
            <li
              className={`${styles['category-item']} ${
                category === 'general' ? styles['current-category-item'] : ''
              }`}
              onClick={() => {
                setCategory('general');
                setDisplayCategory(false);
              }}
            >
              <CgProfile className={styles['category-icon']} /> Profile
            </li>

            <li
              className={`${styles['category-item']} ${
                category === 'notifications'
                  ? styles['current-category-item']
                  : ''
              }`}
              onClick={() => {
                setCategory('notifications');
                setDisplayCategory(false);
              }}
            >
              <IoIosNotifications className={styles['category-icon']} />{' '}
              Notifications
            </li>
            <li
              className={`${styles['category-item']} ${
                category === 'personalization'
                  ? styles['current-category-item']
                  : ''
              }`}
              onClick={() => {
                setCategory('personalization');
                setDisplayCategory(false);
              }}
            >
              <IoColorPaletteSharp className={styles['category-icon']} />{' '}
              Personalization
            </li>
            <li
              className={`${styles['category-item']} ${
                category === 'security' ? styles['current-category-item'] : ''
              }`}
              onClick={() => {
                setCategory('security');
                setDisplayCategory(false);
              }}
            >
              <MdOutlineSecurity className={styles['category-icon']} /> Security
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
                  src={`${serverUrl}/users/${userData.photo}`}
                  onClick={() => {
                    setMode('view');
                    setDisplayCategory(false);
                  }}
                />
              </span>

              <figcaption className={styles['profile-img-caption']}>
                <span className={styles['username']}>Ofoka Vincent</span>
                <span className={styles['user-title']}>Web Developer</span>
              </figcaption>
            </figure>

            <ul className={styles['category-list']}>
              <li
                className={`${styles['category-item']} ${
                  category === 'general' ? styles['current-category-item'] : ''
                }`}
                onClick={() => setCategory('general')}
              >
                <CgProfile className={styles['category-icon']} /> Profile
              </li>

              <li
                className={`${styles['category-item']} ${
                  category === 'notifications'
                    ? styles['current-category-item']
                    : ''
                }`}
                onClick={() => setCategory('notifications')}
              >
                <IoIosNotifications className={styles['category-icon']} />{' '}
                Notifications
              </li>
              <li
                className={`${styles['category-item']} ${
                  category === 'personalization'
                    ? styles['current-category-item']
                    : ''
                }`}
                onClick={() => setCategory('personalization')}
              >
                <IoColorPaletteSharp className={styles['category-icon']} />{' '}
                Personalization
              </li>
              <li
                className={`${styles['category-item']} ${
                  category === 'security' ? styles['current-category-item'] : ''
                }`}
                onClick={() => setCategory('security')}
              >
                <MdOutlineSecurity className={styles['category-icon']} />{' '}
                Security
              </li>
            </ul>
          </div>

          <AiOutlineMenuFold
            className={styles['settings-menu-icon']}
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
