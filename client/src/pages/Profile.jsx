import React, { useRef, useState, useContext } from 'react';
import styles from '../styles/Profile.module.css';
import { SiKashflow, SiSimpleanalytics } from 'react-icons/si';
import { Link } from 'react-router-dom';

import { IoChatbubblesSharp, IoSettingsOutline } from 'react-icons/io5';
import { IoIosSearch, IoMdClose, IoIosNotifications } from 'react-icons/io';

import { FaRegCircleUser } from 'react-icons/fa6';
import { MdOutlineDashboard } from 'react-icons/md';
import { FaTasks, FaCalendarAlt } from 'react-icons/fa';
import { GoProjectTemplate } from 'react-icons/go';
import { MdOutlineSegment, MdEdit } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa';
import { AuthContext } from '../App';
import { months } from './Dashboard';

const Profile = () => {
  const { userData } = useContext(AuthContext);
  const [searchText, setSearchText] = useState('');
  const [showNav, setShowNav] = useState(false);
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

  console.log(userData);

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
              className={`${styles['side-nav-item']} ${styles.notifications}`}
            >
              <Link to={'/notifications'} className={styles['side-nav-link']}>
                <IoIosNotifications className={styles['side-nav-icon']} />{' '}
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

          <h1 className={styles['page']}>Profile</h1>

          <span className={styles['search-box']}>
            <IoIosSearch className={styles['search-icon']} />
            <input
              type="text"
              className={styles.search}
              value={searchText}
              ref={searchRef}
              placeholder="Search for users"
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
                  src={`../../assets/images/users/${userData.photo}`}
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
              <div className={styles['property-box']}>
                <span className={styles['property-name']}>Gender:</span>
                <span className={styles['property-value']}>
                  {getValue('gender') === 'nil' ? (
                    <i style={{ color: 'gray' }}>Not specified</i>
                  ) : (
                    getValue('gender')
                  )}
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
