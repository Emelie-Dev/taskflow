import React, { useState, useRef } from 'react';
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
import { RiRadioButtonLine } from 'react-icons/ri';
import { MdInsertPhoto } from 'react-icons/md';
import { GrAttachment } from 'react-icons/gr';
import { BsSendFill } from 'react-icons/bs';
import { GoArrowDown } from 'react-icons/go';
import { BiSolidFileDoc } from 'react-icons/bi';
import { BsFillFileEarmarkTextFill } from 'react-icons/bs';
import { TbClock } from 'react-icons/tb';

const Chat = () => {
  const [searchText, setSearchText] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [chatMode, setChatMode] = useState('private');
  const [emptyMode, setEmptyMode] = useState(true);
  const searchRef = useRef();
  const navRef = useRef();

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
              <Link to={'/projects'} className={styles['side-nav-link']}>
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
            <Link to={'/projects'} className={styles['side-nav-link']}>
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
          <section className={styles['contacts-section']}>
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
                  onClick={() => setEmptyMode(false)}
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
                <li className={styles['contacts-box']}>
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

          <section className={styles['chats-section']}>
            {emptyMode && (
              <p className={styles['empty-chat-box']}>
                <SiKashflow className={styles['empty-chat-logo']} />
                Select a {chatMode === 'private' ? 'contact' : 'group'} to open
                and view the chat conversation.
              </p>
            )}

            <div className={`${styles['chat-box']} ${emptyMode ? '' : styles['show-chats']}`}>
              <div className={styles['contact-head']}>
                <figure className={styles['profile-img-box']}>
                  <img
                    src="../../assets/images/profile3.jpeg"
                    className={styles['profile-img']}
                  />
                </figure>

                <div className={styles['name-box']}>
                  <h1 className={styles['chat-name']}>John Snow</h1>
                  <span className={styles['last-time-seen']}>
                    Last seen today at 9:50 AM
                  </span>
                </div>
                <div className={styles['search-div']}>
                  <FaSearch className={styles['chat-search-icon']} />
                </div>
              </div>

              <div className={styles['chat-container']}>
                <span className={styles['move-down-box']}>
                  <GoArrowDown className={styles['move-down-arrow']} />
                </span>

                <article
                  className={`${styles['chat-bubble']} ${styles['owner-chat-bubble']}`}
                >
                  {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Yesterday</span>
                  </div> */}
                  <div className={styles['owner-chat-content']}>
                    <div className={styles['thread-container']}>
                      <span className={styles['thread-box']}>
                        <span className={styles['thread-owner']}>
                          Arya Stark
                        </span>
                        <span className={styles.thread}>
                          When will you come back
                        </span>
                      </span>
                      {/* <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span> */}
                    </div>
                    <span className={styles['chat-response']}>
                      I think next tomorrow.
                    </span>
                    <div className={styles['chat-details']}>
                      <time className={styles['chat-send-time']}>12:30 PM</time>
                      <IoCheckmarkDoneSharp
                        className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
                      />
                    </div>
                  </div>
                </article>

                <article
                  className={`${styles['chat-bubble']} ${styles['others-chat-bubble']} `}
                >
                  <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Yesterday</span>
                  </div>
                  <div className={styles['others-chat-content']}>
                    <div className={styles['thread-container']}>
                      <span className={styles['thread-box']}>
                        <span className={styles['thread-owner']}>You</span>
                        <span className={styles.thread}>
                          I think next tomorrow.
                        </span>
                      </span>
                      {/* <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span> */}
                    </div>
                    <span className={styles['chat-response']}>
                      Ok, no problem
                    </span>
                    <div className={styles['chat-details']}>
                      <time className={styles['chat-send-time']}>03:42 PM</time>
                      {/* <IoCheckmarkDoneSharp
                        className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
                      /> */}
                    </div>
                  </div>
                </article>

                <article
                  className={`${styles['chat-bubble']} ${styles['others-chat-bubble2']}`}
                >
                  {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Yesterday</span>
                  </div> */}
                  <div className={styles['others-chat-content2']}>
                    {/* <div className={styles['thread-container']}>
                      <span className={styles['thread-box']}>
                      <span className={styles['thread-owner']}>You</span>
                      <span className={styles.thread}>
                        I think next tomorrow.
                      </span>
                      </span>
                      <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span>
                    </div> */}
                    <span className={styles['chat-response']}>
                      Please send me a picture of the place you are staying
                      before you come back
                    </span>
                    <div className={styles['chat-details']}>
                      <time className={styles['chat-send-time']}>03:43 PM</time>
                      {/* <IoCheckmarkDoneSharp
                        className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
                      /> */}
                    </div>
                  </div>
                </article>

                <article
                  className={`${styles['chat-bubble']} ${styles['owner-chat-bubble']}`}
                >
                  {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Yesterday</span>
                  </div> */}
                  <div
                    className={`${styles['owner-chat-content']} ${styles['media-chat-content']}`}
                  >
                    <div className={styles['thread-container']}>
                      <span className={styles['thread-box']}>
                        <span className={styles['thread-owner']}>
                          Arya Stark
                        </span>
                        <span className={styles.thread}>
                          Please send me a picture of the place you are staying
                          before you come back
                        </span>
                      </span>
                      {/* <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span> */}
                    </div>
                    <span
                      className={`${styles['chat-response']} ${styles['media-response']}`}
                    >
                      <img
                        src="../../assets/images/pics1.jpg"
                        className={styles['chat-pics']}
                      />
                      <span className={styles['media-caption']}>
                        This is the living room
                      </span>
                    </span>
                    <div className={styles['chat-details']}>
                      <time className={styles['chat-send-time']}>06:27 PM</time>
                      <IoCheckmarkDoneSharp
                        className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
                      />
                    </div>
                  </div>
                </article>

                <article
                  className={`${styles['chat-bubble']} ${styles['others-chat-bubble']} `}
                >
                  {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Yesterday</span>
                  </div> */}
                  <div className={styles['others-chat-content']}>
                    {/* <div className={styles['thread-container']}>
                      <span className={styles['thread-box']}>
                        <span className={styles['thread-owner']}>You</span>
                        <span className={styles.thread}>
                          I think next tomorrow.
                        </span>
                      </span>
                      <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span>
                    </div> */}
                    <span className={styles['chat-response']}>
                      Send more pictures na
                    </span>
                    <div className={styles['chat-details']}>
                      <time className={styles['chat-send-time']}>10:16 PM</time>
                      {/* <IoCheckmarkDoneSharp
                        className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
                      /> */}
                    </div>
                  </div>
                </article>

                <article
                  className={`${styles['chat-bubble']} ${styles['owner-chat-bubble']}`}
                >
                  <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Today</span>
                  </div>
                  <div
                    className={`${styles['owner-chat-content']} ${styles['media-chat-content']}`}
                  >
                    <div className={styles['thread-container']}>
                      <span className={styles['thread-box']}>
                        <span className={styles['thread-owner']}>
                          Arya Stark
                        </span>
                        <span className={styles.thread}>
                          Send more pictures na
                        </span>
                      </span>
                      {/* <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span> */}
                    </div>
                    <span
                      className={`${styles['chat-response']} ${styles['multi-media-response']}`}
                    >
                      <img
                        src="../../assets/images/pics4.jpeg"
                        className={styles['multi-chat-pics']}
                      />
                      <img
                        src="../../assets/images/pics2.jpeg"
                        className={styles['multi-chat-pics']}
                      />
                      <img
                        src="../../assets/images/pics3.jpeg"
                        className={styles['multi-chat-pics']}
                      />
                      <span className={styles['more-media-box']}>+ 2</span>
                    </span>
                    <div className={styles['chat-details']}>
                      <time className={styles['chat-send-time']}>07:35 AM</time>
                      <IoCheckmarkDoneSharp
                        className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
                      />
                    </div>
                  </div>
                </article>

                <article
                  className={`${styles['chat-bubble']} ${styles['others-chat-bubble']} `}
                >
                  {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Yesterday</span>
                  </div> */}
                  <div className={styles['others-chat-content']}>
                    <div className={styles['thread-container']}>
                      <span className={styles['thread-box']}>
                        <span className={styles['thread-owner']}>You</span>
                        <span className={styles.thread}>
                          <MdInsertPhoto
                            className={styles['thread-media-icon']}
                          />{' '}
                          This is the living room
                        </span>
                      </span>
                      <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span>
                    </div>
                    <span className={styles['chat-response']}>Thank you</span>
                    <div className={styles['chat-details']}>
                      <time className={styles['chat-send-time']}>12:34 PM</time>
                      {/* <IoCheckmarkDoneSharp
                        className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
                      /> */}
                    </div>
                  </div>
                </article>

                <article
                  className={`${styles['chat-bubble']} ${styles['owner-chat-bubble']}`}
                >
                  {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Today</span>
                  </div> */}
                  <div
                    className={`${styles['owner-chat-content']} ${styles['media-chat-content']}`}
                  >
                    <div className={styles['thread-container']}>
                      <span className={styles['thread-box']}>
                        <span className={styles['thread-owner']}>
                          Arya Stark
                        </span>
                        <span className={styles.thread}>Thank you</span>
                      </span>
                      {/* <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span> */}
                    </div>
                    <span className={`${styles['chat-response']} `}>
                      You are welcome. Please send me that document you
                      collected from professor
                    </span>
                    <div className={styles['chat-details']}>
                      <time className={styles['chat-send-time']}>12:36 PM</time>
                      <IoCheckmarkDoneSharp
                        className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
                      />
                    </div>
                  </div>
                </article>

                <article
                  className={`${styles['chat-bubble']} ${styles['others-chat-bubble']} `}
                >
                  {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Yesterday</span>
                  </div> */}
                  <div className={styles['others-chat-content']}>
                    {/* <div className={styles['thread-container']}>
                      <span className={styles['thread-box']}>
                        <span className={styles['thread-owner']}>You</span>
                        <span className={styles.thread}>
                          <MdInsertPhoto
                            className={styles['thread-media-icon']}
                          />{' '}
                          This is the living room
                        </span>
                      </span>
                      <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span>
                    </div> */}
                    <div
                      className={`${styles['chat-response']} ${styles['file-response']}`}
                    >
                      <div className={styles['file-container']}>
                        <div className={styles['file-box']}>
                          <BiSolidFileDoc className={styles['file-icon']} />
                          <span className={styles['file-details']}>
                            <span className={styles['file-name']}>
                              Maths 121 complete note.doc
                            </span>
                            <span className={styles['file-size']}>40 KB</span>
                          </span>
                        </div>
                        <button className={styles['file-download-btn']}>
                          Download
                        </button>
                      </div>
                      <span className={styles['file-caption']}>
                        This is only for first semester
                      </span>
                    </div>

                    <div className={styles['chat-details']}>
                      <time className={styles['chat-send-time']}>4:12 PM</time>
                      {/* <IoCheckmarkDoneSharp
                        className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
                      /> */}
                    </div>
                  </div>
                </article>

                <article
                  className={`${styles['chat-bubble']} ${styles['owner-chat-bubble']}`}
                >
                  {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Today</span>
                  </div> */}
                  <div
                    className={`${styles['owner-chat-content']} ${styles['media-chat-content']}`}
                  >
                    <div className={styles['thread-container']}>
                      <span className={styles['thread-box']}>
                        <span className={styles['thread-owner']}>
                          Arya Stark
                        </span>
                        <span className={styles.thread}>
                          <BsFillFileEarmarkTextFill
                            className={styles['thread-files-icon']}
                          />
                          Maths 121 complete note.doc
                        </span>
                      </span>
                      {/* <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span> */}
                    </div>
                    <span className={`${styles['chat-response']} `}>
                      Thanks
                    </span>
                    <div className={styles['chat-details']}>
                      <time className={styles['chat-send-time']}>06:36 PM</time>
                      <IoCheckmarkDoneSharp
                        className={`${styles['chat-status-icon']}`}
                      />
                    </div>
                  </div>
                </article>

                <article
                  className={`${styles['chat-bubble']} ${styles['owner-chat-bubble']}`}
                >
                  {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Today</span>
                  </div> */}
                  <div
                    className={`${styles['owner-chat-content']} ${styles['media-chat-content']}`}
                  >
                    {/* <div className={styles['thread-container']}>
                      <span className={styles['thread-box']}>
                        <span className={styles['thread-owner']}>
                          Arya Stark
                        </span>
                        <span className={styles.thread}>
                          <BsFillFileEarmarkTextFill
                            className={styles['thread-files-icon']}
                          />
                          Maths 121 complete note.doc
                        </span>
                      </span>
                    
                    </div> */}

                    <span className={`${styles['chat-response']} `}>
                      I will see you tomorrow.
                    </span>
                    <div className={styles['chat-details']}>
                      <time className={styles['chat-send-time']}>6:38 PM</time>
                      <TbClock className={`${styles['chat-status-icon']}`} />
                    </div>
                  </div>
                </article>
              </div>

              <div className={styles['chat-input-container']}>
                <GrAttachment className={styles['attachment-icon']} />
                <div className={styles['chat-input-box']}>
                  <textarea
                    className={styles['chat-input']}
                    rows={1}
                  ></textarea>
                  <span className={styles['send-icon-box']}>
                    <BsSendFill className={styles['send-icon']} />
                  </span>
                </div>
              </div>
            </div>

            <div className={styles['group-chat-box']}>
            
            </div>
          </section>
        </section>
      </section>
    </main>
  );
};

export default Chat;
