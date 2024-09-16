import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Settings.module.css';
import { SiKashflow, SiSimpleanalytics } from 'react-icons/si';
import { Link } from 'react-router-dom';

import { IoChatbubblesSharp, IoSettingsOutline } from 'react-icons/io5';
import { IoIosSearch, IoMdClose, IoIosNotifications } from 'react-icons/io';

import {
  MdOutlineDashboard,
  MdOutlineSegment,
  MdModeEditOutline,
  MdOutlineSecurity,
} from 'react-icons/md';
import { FaTasks, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { GoProjectTemplate } from 'react-icons/go';
import { CgProfile } from 'react-icons/cg';
import { IoColorPaletteSharp } from 'react-icons/io5';
import GeneralInfo from '../components/GeneralInfo';
import NotificationSettings from '../components/NotificationSettings';
import Personalization from '../components/Personalization';
import Security from '../components/Security';
import { AiOutlineMenuFold } from 'react-icons/ai';
import { FaRegCircleUser } from 'react-icons/fa6';
import ProfilePictureCropper from '../components/ProfilePictureCropper';

const Settings = () => {
  const [searchText, setSearchText] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [category, setCategory] = useState('general');
  const [displayCategory, setDisplayCategory] = useState(false);
  const [image, setImage] = useState(null);
  const [cropData, setCropData] = useState('#');

  const searchRef = useRef();
  const navRef = useRef();
  const fileRef = useRef();

  useEffect(() => {
    if (fileRef.current) {
      if (!image) {
        fileRef.current.files = new DataTransfer().files;
      }
    }
  }, [image]);

  const hideNav = (e) => {
    if (e.target === navRef.current) {
      setShowNav(false);
    }
  };

  const handleSearchText = (e) => {
    setSearchText(e.target.value);
  };

  const clearSearchText = () => {
    setSearchText('');
    searchRef.current.focus();
  };

  const hideResponsiveSettings = (e) => {
    e.target === e.currentTarget && setDisplayCategory(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className={styles.main}>
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
                className={styles['profile-pics']}
                src="../../assets/images/download.jpeg"
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

      <nav
        ref={navRef}
        className={`${styles['responsive-nav']} ${
          showNav ? styles['show-nav'] : ''
        }`}
        onClick={hideNav}
      >
        <section className={styles['responsive-section']}>
          <div className={styles['responsive-head']}>
            <span className={styles['icon-box']}>
              <Link to={'/'}>
                <SiKashflow className={styles.icon} />
              </Link>
            </span>

            <span className={styles['head-text']}>TaskFlow</span>
          </div>
          <ul className={styles['responsive-side-nav']}>
            <li className={styles['side-nav-item']}>
              <Link to={'/dashboard'} className={styles['side-nav-link']}>
                <MdOutlineDashboard className={styles['side-nav-icon']} />{' '}
                Dashboard
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/projects'} className={styles['side-nav-link']}>
                <GoProjectTemplate className={styles['side-nav-icon']} />{' '}
                Projects
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/tasks'} className={styles['side-nav-link']}>
                <FaTasks className={styles['side-nav-icon']} /> Tasks
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/calendar'} className={styles['side-nav-link']}>
                <FaCalendarAlt className={styles['side-nav-icon']} /> Calendar
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/chats'} className={styles['side-nav-link']}>
                <IoChatbubblesSharp className={styles['side-nav-icon']} /> Chats
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/analytics'} className={styles['side-nav-link']}>
                <SiSimpleanalytics className={styles['side-nav-icon']} />{' '}
                Analytics
              </Link>
            </li>
            <li
              className={`${styles['side-nav-item']} ${styles.notifications}`}
            >
              <Link to={'/notifications'} className={styles['side-nav-link']}>
                <IoIosNotifications className={styles['side-nav-icon']} />{' '}
                Notifications
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/profile'} className={styles['side-nav-link']}>
                <FaRegCircleUser className={styles['side-nav-icon']} /> Profile
              </Link>
            </li>
            <li className={`${styles['side-nav-item']} ${styles.settings}`}>
              <Link
                to={'/settings'}
                className={`${styles['side-nav-link']}  ${styles['settings-link']}`}
              >
                <IoSettingsOutline
                  className={`${styles['side-nav-icon']}  ${styles['settings-icon']} `}
                />{' '}
                Settings
              </Link>
            </li>
          </ul>
        </section>
      </nav>

      <nav className={styles.nav}>
        {' '}
        <div className={styles.head}>
          <span className={styles['icon-box']}>
            <Link to={'/'}>
              <SiKashflow className={styles.icon} />
            </Link>
          </span>

          <span className={styles['head-text']}>TaskFlow</span>
        </div>
        <ul className={styles['side-nav']}>
          <li className={styles['side-nav-item']}>
            <Link to={'/dashboard'} className={styles['side-nav-link']}>
              <MdOutlineDashboard className={styles['side-nav-icon']} />{' '}
              Dashboard
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/projects'} className={styles['side-nav-link']}>
              <GoProjectTemplate className={styles['side-nav-icon']} /> Projects
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/tasks'} className={styles['side-nav-link']}>
              <FaTasks className={styles['side-nav-icon']} /> Tasks
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/calendar'} className={styles['side-nav-link']}>
              <FaCalendarAlt className={styles['side-nav-icon']} /> Calendar
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/chats'} className={styles['side-nav-link']}>
              <IoChatbubblesSharp className={styles['side-nav-icon']} /> Chats
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/analytics'} className={styles['side-nav-link']}>
              <SiSimpleanalytics className={styles['side-nav-icon']} />{' '}
              Analytics
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/profile'} className={styles['side-nav-link']}>
              <FaRegCircleUser className={styles['side-nav-icon']} /> Profile
            </Link>
          </li>
          <li className={`${styles['side-nav-item']}  ${styles.settings}`}>
            <Link
              to={'/settings'}
              className={`${styles['side-nav-link']}  ${styles['settings-link']}`}
            >
              <IoSettingsOutline
                className={`${styles['side-nav-icon']} ${styles['settings-icon']}`}
              />{' '}
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      <section className={styles.section}>
        <header className={styles.header}>
          <b className={styles['menu-icon-box']}>
            <MdOutlineSegment
              className={styles['menu-icon']}
              onClick={() => setShowNav(true)}
            />
          </b>

          <h1 className={styles['page']}>Settings</h1>

          <span className={styles['search-box']}>
            <IoIosSearch className={styles['search-icon']} />
            <input
              type="text"
              className={styles.search}
              value={searchText}
              ref={searchRef}
              placeholder="Search..."
              onChange={handleSearchText}
            />
            <IoMdClose
              className={`${styles['cancel-icon']} ${
                searchText.length !== 0 ? styles['show-cancel-icon'] : ''
              }`}
              onClick={clearSearchText}
            />
          </span>
          <div className={styles['icon-div']}>
            <Link className={styles['icon-container']} to={'/notifications'}>
              <IoIosNotifications className={styles['notification-icon']} />
            </Link>
            <span className={styles['icon-container']}>
              <IoChatbubblesSharp className={styles['chat-icon']} />
            </span>
          </div>

          <div className={styles['profile-div']}>
            <div className={styles['profile-box']}>
              <span className={styles['profile-name']}>Ofoka Vincent</span>
              <span className={styles['profile-title']}>Web developer</span>
            </div>

            <span className={styles['alternate-search-box']}>
              <FaSearch className={styles['alternate-search-icon']} />
            </span>

            <figure className={styles['profile-picture-box']}>
              <img
                className={styles['profile-picture']}
                src="../../assets/images/download.jpeg"
              />
            </figure>
          </div>
        </header>

        {image && (
          <ProfilePictureCropper
            image={image}
            setImage={setImage}
            cropData={cropData}
            setCropData={setCropData}
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
                  className={styles['profile-pics']}
                  src="../../assets/images/download.jpeg"
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
