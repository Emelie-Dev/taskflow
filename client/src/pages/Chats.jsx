import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Chats.module.css';
import { SiKashflow } from 'react-icons/si';
import { MdChat } from 'react-icons/md';
import { FaUserGroup } from 'react-icons/fa6';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { BsClock } from 'react-icons/bs';
import PrivateChatContainer from '../components/PrivateChatContainer';
import GroupChatContainer from '../components/GroupChatContainer';
import Header from '../components/Header';
import NavBar from '../components/NavBar';

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
      <NavBar page={'Chats'} showNav={showNav} setShowNav={setShowNav} />

      <section className={styles.section}>
        <Header page={'Chats'} setShowNav={setShowNav} />

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
