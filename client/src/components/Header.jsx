import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from '../styles/Header.module.css';
import { MdOutlineSegment } from 'react-icons/md';
import { IoIosSearch, IoMdClose, IoIosNotifications } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { IoChatbubblesSharp } from 'react-icons/io5';
import { FaSearch } from 'react-icons/fa';
import { FaRegCircleUser } from 'react-icons/fa6';
import { HiOutlineLogout } from 'react-icons/hi';
import { AuthContext } from '../App';
import { generateName } from '../pages/Dashboard';

const Header = ({ page, setShowNav }) => {
  const { userData, setUserData } = useContext(AuthContext);
  const [searchText, setSearchText] = useState('');
  const [showUserBox, setShowUserBox] = useState(false);

  const searchRef = useRef();
  const imgRef = useRef();
  const userBoxRef = useRef();

  // For log out box
  useEffect(() => {
    const handleUserBox = (e) => {
      if (showUserBox) {
        if (
          e.target === imgRef.current ||
          e.target === userBoxRef.current ||
          userBoxRef.current.contains(e.target)
        ) {
          return;
        } else {
          setShowUserBox(false);
        }
      }
    };

    window.addEventListener('click', handleUserBox);

    return () => {
      window.removeEventListener('click', handleUserBox);
    };
  }, [showUserBox]);

  const handleSearchText = (e) => {
    setSearchText(e.target.value);
  };

  const clearSearchText = () => {
    setSearchText('');
    searchRef.current.focus();
  };

  console.log(userData);

  return (
    <header className={styles.header}>
      <b className={styles['menu-icon-box']}>
        <MdOutlineSegment
          className={styles['menu-icon']}
          onClick={() => setShowNav(true)}
        />
      </b>

      <h1 className={styles['page']}>{page}</h1>
      {/* 
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
      </span> */}

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
          <span className={styles['profile-name']}>
            {generateName(
              userData.firstName,
              userData.lastName,
              userData.username
            )}
          </span>
          <span className={styles['profile-title']}>Web developer</span>
        </div>

        <span className={styles['alternate-search-box']}>
          <FaSearch className={styles['alternate-search-icon']} />
        </span>

        <figure className={styles['profile-picture-box']}>
          <img
            className={styles['profile-picture']}
            src="../../assets/images/download.jpeg"
            ref={imgRef}
            onClick={() => setShowUserBox(true)}
          />

          <ul
            className={`${styles['user-profile-box']} ${
              showUserBox ? styles['show-user-box'] : ''
            }`}
            ref={userBoxRef}
          >
            <li>
              <Link className={styles['profile-link-box']} to={'/profile'}>
                <FaRegCircleUser className={styles['user-profile-icon']} />
                My Profile
              </Link>
            </li>
            <li className={styles['user-profile-item']}>
              <HiOutlineLogout className={styles['user-profile-icon']} />
              Log out
            </li>
          </ul>
        </figure>
      </div>
    </header>
  );
};

export default Header;
