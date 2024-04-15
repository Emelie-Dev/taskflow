import React, { useRef, useState } from 'react';
import styles from '../styles/Notifications.module.css';
import { SiKashflow, SiSimpleanalytics } from 'react-icons/si';
import { Link } from 'react-router-dom';

import { IoChatbubblesSharp, IoSettingsOutline } from 'react-icons/io5';
import { IoIosSearch, IoMdClose, IoIosNotifications } from 'react-icons/io';

import { FaRegCircleUser } from 'react-icons/fa6';
import { MdOutlineDashboard } from 'react-icons/md';
import { FaTasks, FaCalendarAlt } from 'react-icons/fa';
import { GoProjectTemplate } from 'react-icons/go';
import { MdOutlineSegment } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa';
import NotificationBox from '../components/NotificationBox';

const data = [
  {
    date: 1,
    action: 'transition',
    state1: 'active',
    state2: 'inactive',
    user: 'Jon snow',
    project: 'Fitness App',
    id: Math.random(),
    count: 2,
  },
  {
    date: 1,
    action: 'task',
    user: 'Anita',
    project: 'Fitness App',
    id: Math.random(),
  },
  {
    date: 2,
    action: 'task',
    user: 'Sansa',
    project: 'Media Player',
    id: Math.random(),
    count: 3,
  },
  {
    date: 2,
    action: 'security',
    device: 'Redmi note 10',
    location: 'Netherlands',
  },
  {
    date: 2,
    action: 'request',
    group: 'Boolean Autocrats',
  },
];

const Notifications = () => {
  const [searchText, setSearchText] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [category, setCategory] = useState('unread');
  const searchRef = useRef();
  const navRef = useRef();

  const handleSearchText = (e) => {
    setSearchText(e.target.value);
  };

  const clearSearchText = () => {
    setSearchText('');
    searchRef.current.focus();
  };

  const hideNav = (e) => {
    if (e.target === navRef.current) {
      setShowNav(false);
    }
  };

  return (
    <main className={styles.div}>
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
              className={`${styles['side-nav-item']} ${styles.notify} ${styles.notifications}`}
            >
              <Link
                to={'/notifications'}
                className={`${styles['side-nav-link']}  ${styles['notify-link']}`}
              >
                <IoIosNotifications
                  className={`${styles['side-nav-icon']}  ${styles['notify-icon']}`}
                />{' '}
                Notifications
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/profile'} className={styles['side-nav-link']}>
                <FaRegCircleUser className={styles['side-nav-icon']} /> Profile
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/settings'} className={styles['side-nav-link']}>
                <IoSettingsOutline className={styles['side-nav-icon']} />{' '}
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
          <li className={`${styles['side-nav-item']} ${styles.notify}`}>
            <Link
              to={'/notifications'}
              className={`${styles['side-nav-link']}  ${styles['notify-link']}`}
            >
              <IoIosNotifications
                className={`${styles['side-nav-icon']}  ${styles['notify-icon']}`}
              />{' '}
              Notifications
            </Link>
          </li>
          <li className={`${styles['side-nav-item']}  ${styles.profile}`}>
            <Link
              to={'/profile'}
              className={`${styles['side-nav-link']}  ${styles['profile-link']}`}
            >
              <FaRegCircleUser
                className={`${styles['side-nav-icon']}   ${styles['profile-icon']}`}
              />{' '}
              Profile
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/settings'} className={styles['side-nav-link']}>
              <IoSettingsOutline className={styles['side-nav-icon']} /> Settings
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

          <h1 className={styles['page']}>Notifications</h1>

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
            <span className={styles['icon-container']}>
              <IoIosNotifications className={styles['notification-icon']} />
            </span>
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

        <section className={styles['section-content']}>
          <div className={styles['notification-container']}>
            {data.map((item, index, array) => {
              if (index === 0) {
                return <NotificationBox data={item} date={item.date} />;
              } else if (item.date === array[index - 1].date) {
                return <NotificationBox data={item} />;
              } else {
                return <NotificationBox data={item} date={item.date} />;
              }
            })}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Notifications;
