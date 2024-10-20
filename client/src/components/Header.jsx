import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  forwardRef,
} from 'react';
import styles from '../styles/Header.module.css';
import { MdOutlineSegment } from 'react-icons/md';
import { IoIosSearch, IoMdClose, IoIosNotifications } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { IoChatbubblesSharp, IoSettingsOutline } from 'react-icons/io5';
import { FaSearch } from 'react-icons/fa';
import { FaRegCircleUser } from 'react-icons/fa6';
import { HiOutlineLogout } from 'react-icons/hi';
import { AuthContext, apiClient } from '../App';
import { generateName } from '../pages/Dashboard';
import { toast } from 'react-toastify';

const Header = ({ page, setShowNav, setHeaderHeight }) => {
  const { userData, serverUrl, mode } = useContext(AuthContext);
  const [searchText, setSearchText] = useState('');
  const [showUserBox, setShowUserBox] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const searchRef = useRef();
  const imgRef = useRef();
  const userBoxRef = useRef();
  const headerRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const resizeHandler = () => {
      setHeaderHeight(headerRef.current.offsetHeight);
    };

    if (page === 'Notifications') {
      resizeHandler();

      window.addEventListener('resize', resizeHandler);
    }

    return () => {
      if (page === 'Notifications')
        window.removeEventListener('resize', resizeHandler);
    };
  }, []);

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

  const logout = async () => {
    setIsProcessing(true);

    try {
      await apiClient('/api/v1/auth/logout');

      setIsProcessing(false);
      navigate('/login');
    } catch (err) {
      setIsProcessing(false);
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occurred while logging out.', {
          toastId: 'toast-id1',
          theme: mode,
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id1',
          theme: mode,
        });
      }
    }
  };

  return (
    <header
      className={`${styles.header} ${
        mode === 'dark' ? styles['dark-theme'] : ''
      }`}
      ref={headerRef}
    >
      <b className={styles['menu-icon-box']}>
        <MdOutlineSegment
          className={`${styles['menu-icon']} ${
            mode === 'dark' ? styles['dark-icon'] : ''
          }`}
          onClick={() => setShowNav(true)}
        />
      </b>

      <h1
        className={`${styles['page']} ${
          page === 'Notifications' ? styles['page2'] : ''
        }`}
      >
        {page}
      </h1>

      <span className={styles['search-box']}>
        <IoIosSearch className={styles['search-icon']} />
        <input
          type="text"
          className={`${styles.search} ${
            mode === 'dark' ? styles['dark-search'] : ''
          }`}
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
        <Link
          className={`${styles['icon-container']}  ${
            mode === 'dark' ? styles['dark-icon-box'] : ''
          }`}
          to={'/notifications'}
        >
          <IoIosNotifications
            className={`${styles['notification-icon']}  ${
              mode === 'dark' ? styles['dark-icon'] : ''
            }`}
          />
        </Link>

        <Link
          className={`${styles['icon-container']}  ${
            mode === 'dark' ? styles['dark-icon-box'] : ''
          }`}
          to={'/chats'}
        >
          <IoChatbubblesSharp
            className={`${styles['chat-icon']}  ${
              mode === 'dark' ? styles['dark-icon'] : ''
            }`}
          />
        </Link>
      </div>

      <div className={styles['profile-div']}>
        <div className={styles['profile-box']}>
          <span
            className={`${styles['profile-name']}  ${
              mode === 'dark' ? styles['dark-text'] : ''
            }`}
          >
            {generateName(
              userData.firstName,
              userData.lastName,
              userData.username
            )}
          </span>
          <span
            className={`${styles['profile-title']}  ${
              mode === 'dark' ? styles['dark-title'] : ''
            }`}
          >
            {userData.occupation}
          </span>
        </div>

        <span
          className={`${styles['alternate-search-box']} ${
            mode === 'dark' ? styles['dark-icon-box'] : ''
          }`}
        >
          <FaSearch
            className={`${styles['alternate-search-icon']}  ${
              mode === 'dark' ? styles['dark-icon'] : ''
            }`}
          />
        </span>

        <figure className={styles['profile-picture-box']}>
          <img
            className={`${styles['profile-picture']}  ${
              mode === 'dark' ? styles['dark-pics'] : ''
            }`}
            src={getProfilePhoto(userData, serverUrl)}
            ref={imgRef}
            onClick={() => setShowUserBox(true)}
          />

          <ul
            className={`${styles['user-profile-box']} ${
              showUserBox ? styles['show-user-box'] : ''
            } ${mode === 'dark' ? styles['dark-profile-box'] : ''}`}
            ref={userBoxRef}
          >
            <li>
              <Link
                className={`${styles['profile-link-box']}  ${
                  mode === 'dark' ? styles['dark-link-box'] : ''
                }`}
                to={'/profile'}
              >
                <FaRegCircleUser className={styles['user-profile-icon']} />
                My Profile
              </Link>
            </li>
            <li>
              <Link
                className={`${styles['profile-link-box2']}  ${
                  mode === 'dark' ? styles['dark-link-box'] : ''
                }`}
                to={'/settings'}
              >
                <IoSettingsOutline className={styles['user-profile-icon']} />
                Settings
              </Link>
            </li>
            <li
              className={`${styles['user-profile-item']} ${
                isProcessing ? styles['disable-item'] : ''
              }  ${mode === 'dark' ? styles['dark-profile-item'] : ''}`}
              onClick={logout}
            >
              {isProcessing ? (
                <div
                  className={`${styles['searching-loader']} ${
                    mode === 'dark' ? styles['dark-loader'] : ''
                  }`}
                ></div>
              ) : (
                <HiOutlineLogout className={styles['user-profile-icon']} />
              )}
              Log out
            </li>
          </ul>
        </figure>
      </div>
    </header>
  );
};

export const getProfilePhoto = (user, serverUrl) => {
  const photo = user.photo || user.leaderPhoto;

  if (user.isGoogleAuth) {
    if (photo.startsWith('user-') || photo === 'default.jpeg') {
      return `${serverUrl}/users/${photo}`;
    }

    return `${photo}`;
  } else {
    return `${serverUrl}/users/${photo}`;
  }
};

export default Header;
