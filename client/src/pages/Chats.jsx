import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Chats.module.css';
import { SiKashflow, SiSimpleanalytics } from 'react-icons/si';
import { Link } from 'react-router-dom';

import { IoChatbubblesSharp, IoSettingsOutline } from 'react-icons/io5';
import { IoIosSearch, IoMdClose, IoIosNotifications } from 'react-icons/io';

import { MdOutlineDashboard, MdOutlineSegment } from 'react-icons/md';
import { FaTasks, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { GoProjectTemplate } from 'react-icons/go';
import { MdChat } from 'react-icons/md';
import { FaUserGroup } from 'react-icons/fa6';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { BsClock } from 'react-icons/bs';
import PrivateChatContainer from '../components/PrivateChatContainer';
import GroupChatContainer from '../components/GroupChatContainer';

const Chat = () => {
  const [searchText, setSearchText] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [chatMode, setChatMode] = useState('private');
  const [emptyMode, setEmptyMode] = useState({ private: true, group: true });
  const [hideContacts, setHideContacts] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const searchRef = useRef();
  const navRef = useRef();

  useEffect(() => {
    const resizeHandler = () => {
      if (window.matchMedia('(min-width: 800px)').matches) {
        setHideContacts(false);
        setShowChats(false);
      }
    };

    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

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

  const handlePrivateChat = () => {
    setEmptyMode({ ...emptyMode, private: false });
    if (window.matchMedia('(max-width: 799px)').matches) {
      setHideContacts(true);
      setShowChats(true);
    }
  };

  const handleGroupChat = () => {
    setEmptyMode({ ...emptyMode, group: false });
    if (window.matchMedia('(max-width: 799px)').matches) {
      setHideContacts(true);
      setShowChats(true);
    }
  };

  const goBack = () => {
    setHideContacts(false);
    setShowChats(false);
  };

  return (
    <main className={styles.main}>
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
            <li className={`${styles['side-nav-item']}  ${styles.chats}`}>
              <Link
                to={'/chats'}
                className={`${styles['side-nav-link']}  ${styles['chats-link']}`}
              >
                <IoChatbubblesSharp
                  className={`${styles['side-nav-icon']} ${styles['chats-icon']}`}
                />{' '}
                Chats
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
              <Link to={'/projects'} className={styles['side-nav-link']}>
                <IoIosNotifications className={styles['side-nav-icon']} />{' '}
                Notifications
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/projects'} className={styles['side-nav-link']}>
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
          <li className={`${styles['side-nav-item']}  ${styles.chats}`}>
            <Link
              to={'/projects'}
              className={`${styles['side-nav-link']}  ${styles['chats-link']} `}
            >
              <IoChatbubblesSharp
                className={`${styles['side-nav-icon']}  ${styles['chats-icon']} `}
              />{' '}
              Chats
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/analytics'} className={styles['side-nav-link']}>
              <SiSimpleanalytics className={styles['side-nav-icon']} />{' '}
              Analytics
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/projects'} className={styles['side-nav-link']}>
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

          <h1 className={styles['page']}>Chats</h1>

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
          <section
            className={`${styles['contacts-section']} ${
              hideContacts ? styles['hide-contacts-section'] : ''
            }`}
          >
            <h1 className={styles['contacts-section-head']}>
              <span
                className={`${styles['private-head']} ${
                  chatMode === 'private' ? styles['current-contact-head'] : ''
                }`}
                onClick={() => setChatMode('private')}
              >
                <MdChat className={styles['contacts-head-icon']} /> Private
              </span>
              <span
                className={`${styles['groups-head']} ${
                  chatMode === 'group' ? styles['current-contact-head'] : ''
                }`}
                onClick={() => setChatMode('group')}
              >
                <FaUserGroup className={styles['contacts-head-icon']} />
                Groups
              </span>
            </h1>

            {chatMode === 'private' && (
              <ul className={styles['contacts-list']}>
                <li
                  className={styles['contacts-box']}
                  onClick={handlePrivateChat}
                >
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={styles['contacts-img']}
                      src="../../assets/images/profile3.jpeg"
                    />
                  </span>
                  <div className={styles['contact-details']}>
                    <span className={styles['contact-name']}>John Snow</span>
                    <span className={styles['last-message']}>
                      {/* <IoCheckmarkDoneSharp
                      className={styles['message-status-icon']}
                    />{' '} */}
                      I completed the tasks yesterday
                    </span>
                  </div>
                  <div className={styles['contact-extra']}>
                    <span
                      className={`${styles['message-time']}  ${styles['unread-message-time']}`}
                    >
                      {' '}
                      2:20 AM
                    </span>
                    <span className={styles['message-number']}>
                      <span className={styles['message-length']}>5</span>
                    </span>
                  </div>
                </li>

                <li className={styles['contacts-box']}>
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={styles['contacts-img']}
                      src="../../assets/images/profile3.jpeg"
                    />
                  </span>
                  <div className={styles['contact-details']}>
                    <span className={styles['contact-name']}>John Snow</span>
                    <span className={styles['last-message']}>
                      <BsClock className={styles['message-status-icon2']} /> I
                      completed the tasks yesterday
                    </span>
                  </div>
                  <div className={styles['contact-extra']}>
                    <span className={`${styles['message-time']}`}>
                      {' '}
                      5:30 PM
                    </span>
                    {/* <span className={styles['message-number']}></span> */}
                  </div>
                </li>

                <li className={styles['contacts-box']}>
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={`${styles['contacts-img']} ${styles.online}`}
                      src="../../assets/images/profile3.jpeg"
                    />
                    {/* <RiRadioButtonLine className={styles['online-icon']} /> */}
                  </span>
                  <div className={styles['contact-details']}>
                    <span className={styles['contact-name']}>John Snow</span>
                    <span className={styles['last-message']}>
                      <IoCheckmarkDoneSharp
                        className={`${styles['message-status-icon']} ${styles['message-status-icon3']}`}
                      />{' '}
                      I completed the tasks yesterday
                    </span>
                  </div>
                  <div className={styles['contact-extra']}>
                    <span className={`${styles['message-time']}`}>
                      {' '}
                      3:47 PM
                    </span>
                    {/* <span className={styles['message-number']}>
                    <span className={styles['message-length']}>5</span>
                  </span> */}
                  </div>
                </li>

                <li className={styles['contacts-box']}>
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={styles['contacts-img']}
                      src="../../assets/images/profile3.jpeg"
                    />
                  </span>
                  <div className={styles['contact-details']}>
                    <span className={styles['contact-name']}>John Snow</span>
                    <span className={styles['last-message']}>
                      <IoCheckmarkDoneSharp
                        className={`${styles['message-status-icon']} ${styles['message-status-icon3']}`}
                      />{' '}
                      I completed the tasks yesterday
                    </span>
                  </div>
                  <div className={styles['contact-extra']}>
                    <span className={`${styles['message-time']}`}>
                      {' '}
                      12/03/2024
                    </span>
                    {/* <span className={styles['message-number']}>
                    <span className={styles['message-length']}>5</span>
                  </span> */}
                  </div>
                </li>
              </ul>
            )}

            {chatMode === 'group' && (
              <ul className={styles['contacts-list']}>
                <li
                  className={styles['contacts-box']}
                  onClick={handleGroupChat}
                >
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={styles['contacts-img']}
                      src="../../assets/images/profile3.jpeg"
                    />
                  </span>
                  <div className={styles['contact-details']}>
                    <span className={styles['contact-name']}>
                      Boolean Autocrats
                    </span>
                    <span className={styles['last-message']}>
                      {/* <IoCheckmarkDoneSharp
                      className={styles['message-status-icon']}
                    />{' '} */}
                      <span className={styles['last-group-message']}>
                        Godfather:&nbsp;
                      </span>
                      I completed the tasks yesterday
                    </span>
                  </div>
                  <div className={styles['contact-extra']}>
                    <span
                      className={`${styles['message-time']}  ${styles['unread-message-time']}`}
                    >
                      {' '}
                      2:20 AM
                    </span>
                    <span className={styles['message-number']}>
                      <span className={styles['message-length']}>5</span>
                    </span>
                  </div>
                </li>

                <li className={styles['contacts-box']}>
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={styles['contacts-img']}
                      src="../../assets/images/profile3.jpeg"
                    />
                  </span>
                  <div className={styles['contact-details']}>
                    <span className={styles['contact-name']}>
                      House of Dragon
                    </span>
                    <span className={styles['last-message']}>
                      <BsClock className={styles['message-status-icon2']} /> I
                      completed the tasks yesterday
                    </span>
                  </div>
                  <div className={styles['contact-extra']}>
                    <span className={`${styles['message-time']}`}>
                      {' '}
                      5:30 PM
                    </span>
                    {/* <span className={styles['message-number']}></span> */}
                  </div>
                </li>

                <li className={styles['contacts-box']}>
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={`${styles['contacts-img']}`}
                      src="../../assets/images/profile3.jpeg"
                    />
                  </span>
                  <div className={styles['contact-details']}>
                    <span className={styles['contact-name']}>NACOS 2K26</span>
                    <span className={styles['last-message']}>
                      <IoCheckmarkDoneSharp
                        className={`${styles['message-status-icon']} `}
                      />{' '}
                      I completed the tasks yesterday
                    </span>
                  </div>
                  <div className={styles['contact-extra']}>
                    <span className={`${styles['message-time']}`}>
                      {' '}
                      3:47 PM
                    </span>
                    {/* <span className={styles['message-number']}>
                    <span className={styles['message-length']}>5</span>
                  </span> */}
                  </div>
                </li>

                <li className={styles['contacts-box']}>
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={styles['contacts-img']}
                      src="../../assets/images/profile3.jpeg"
                    />
                  </span>
                  <div className={styles['contact-details']}>
                    <span className={styles['contact-name']}>CODM Players</span>
                    <span className={styles['last-message']}>
                      {/* <IoCheckmarkDoneSharp
                        className={`${styles['message-status-icon']}`}
                      />{' '} */}
                      <span className={styles['last-group-message']}>
                        Ramsay:&nbsp;
                      </span>{' '}
                      I completed the tasks yesterday
                    </span>
                  </div>
                  <div className={styles['contact-extra']}>
                    <span className={`${styles['message-time']}`}>
                      {' '}
                      12/03/2024
                    </span>
                    {/* <span className={styles['message-number']}>
                    <span className={styles['message-length']}>5</span>
                  </span> */}
                  </div>
                </li>
              </ul>
            )}
          </section>

          <section
            className={`${styles['chats-section']} ${
              showChats ? styles['show-chats'] : ''
            }`}
          >
            <p
              className={`${styles['empty-chat-box']} ${
                emptyMode[chatMode] === false ? styles['hide-empty-text'] : ''
              }`}
            >
              <SiKashflow className={styles['empty-chat-logo']} />
              Select a {chatMode === 'private' ? 'contact' : 'group'} to open
              and view the chat conversation.
            </p>

            <PrivateChatContainer
              chatMode={chatMode}
              emptyMode={emptyMode}
              goBack={goBack}
            />

            <GroupChatContainer
              chatMode={chatMode}
              emptyMode={emptyMode}
              goBack={goBack}
            />
          </section>
        </section>
      </section>
    </main>
  );
};

export default Chat;
