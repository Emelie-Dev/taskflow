import React, { useState, useContext, useEffect } from 'react';
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
import { AuthContext } from '../App';

const Chat = () => {
  const { mode } = useContext(AuthContext);
  const [showNav, setShowNav] = useState(false);
  const [chatMode, setChatMode] = useState('private');
  const [emptyMode, setEmptyMode] = useState({ private: true, group: true });
  const [hideContacts, setHideContacts] = useState(false);
  const [showChats, setShowChats] = useState(false);

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
                className={`${
                  mode === 'dark' ? styles['dark-head'] : styles['private-head']
                } ${
                  chatMode === 'private'
                    ? mode === 'dark'
                      ? styles['dark-current-head']
                      : styles['current-contact-head']
                    : ''
                }`}
                onClick={() => setChatMode('private')}
              >
                <MdChat className={styles['contacts-head-icon']} /> Private
              </span>
              <span
                className={`${
                  mode === 'dark' ? styles['dark-head'] : styles['groups-head']
                } ${
                  chatMode === 'group'
                    ? mode === 'dark'
                      ? styles['dark-current-head']
                      : styles['current-contact-head']
                    : ''
                }  `}
                onClick={() => setChatMode('group')}
              >
                <FaUserGroup className={styles['contacts-head-icon']} />
                Groups
              </span>
            </h1>

            {chatMode === 'private' && (
              <ul className={styles['contacts-list']}>
                <li
                  className={`${styles['contacts-box']} ${
                    mode === 'dark' ? styles['dark-contacts-box'] : ''
                  }`}
                  onClick={handlePrivateChat}
                >
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={styles['contacts-img']}
                      src="../../assets/images/profile3.jpeg"
                    />
                  </span>
                  <div className={styles['contact-details']}>
                    <span
                      className={`${styles['contact-name']}  ${
                        mode === 'dark' ? styles['dark-text'] : ''
                      }`}
                    >
                      John Snow
                    </span>
                    <span
                      className={`${styles['last-message']} ${
                        mode === 'dark' ? styles['dark-msg'] : ''
                      }`}
                    >
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

                <li
                  className={`${styles['contacts-box']} ${
                    mode === 'dark' ? styles['dark-contacts-box'] : ''
                  }`}
                >
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={styles['contacts-img']}
                      src="../../assets/images/profile3.jpeg"
                    />
                  </span>
                  <div className={styles['contact-details']}>
                    <span
                      className={`${styles['contact-name']} ${
                        mode === 'dark' ? styles['dark-text'] : ''
                      }`}
                    >
                      John Snow
                    </span>
                    <span
                      className={`${styles['last-message']} ${
                        mode === 'dark' ? styles['dark-msg'] : ''
                      }`}
                    >
                      <BsClock className={styles['message-status-icon2']} /> I
                      completed the tasks yesterday
                    </span>
                  </div>
                  <div className={styles['contact-extra']}>
                    <span
                      className={`${styles['message-time']} ${
                        mode === 'dark' ? styles['dark-msg'] : ''
                      }`}
                    >
                      {' '}
                      5:30 PM
                    </span>
                    {/* <span className={styles['message-number']}></span> */}
                  </div>
                </li>

                <li
                  className={`${styles['contacts-box']} ${
                    mode === 'dark' ? styles['dark-contacts-box'] : ''
                  }`}
                >
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={`${styles['contacts-img']} ${styles.online}`}
                      src="../../assets/images/profile3.jpeg"
                    />
                    {/* <RiRadioButtonLine className={styles['online-icon']} /> */}
                  </span>
                  <div className={styles['contact-details']}>
                    <span
                      className={`${styles['contact-name']} ${
                        mode === 'dark' ? styles['dark-text'] : ''
                      }`}
                    >
                      John Snow
                    </span>
                    <span
                      className={`${styles['last-message']} ${
                        mode === 'dark' ? styles['dark-msg'] : ''
                      }`}
                    >
                      <IoCheckmarkDoneSharp
                        className={`${styles['message-status-icon']} ${styles['message-status-icon3']}`}
                      />{' '}
                      I completed the tasks yesterday
                    </span>
                  </div>
                  <div className={styles['contact-extra']}>
                    <span
                      className={`${styles['message-time']} ${
                        mode === 'dark' ? styles['dark-msg'] : ''
                      }`}
                    >
                      {' '}
                      3:47 PM
                    </span>
                    {/* <span className={styles['message-number']}>
                    <span className={styles['message-length']}>5</span>
                  </span> */}
                  </div>
                </li>

                <li
                  className={`${styles['contacts-box']} ${
                    mode === 'dark' ? styles['dark-contacts-box'] : ''
                  }`}
                >
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={styles['contacts-img']}
                      src="../../assets/images/profile3.jpeg"
                    />
                  </span>
                  <div className={styles['contact-details']}>
                    <span
                      className={`${styles['contact-name']} ${
                        mode === 'dark' ? styles['dark-text'] : ''
                      }`}
                    >
                      John Snow
                    </span>
                    <span
                      className={`${styles['last-message']} ${
                        mode === 'dark' ? styles['dark-msg'] : ''
                      }`}
                    >
                      <IoCheckmarkDoneSharp
                        className={`${styles['message-status-icon']} ${styles['message-status-icon3']}`}
                      />{' '}
                      I completed the tasks yesterday
                    </span>
                  </div>
                  <div className={styles['contact-extra']}>
                    <span
                      className={`${styles['message-time']} ${
                        mode === 'dark' ? styles['dark-msg'] : ''
                      }`}
                    >
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
                  className={`${styles['contacts-box']} ${
                    mode === 'dark' ? styles['dark-contacts-box'] : ''
                  }`}
                  onClick={handleGroupChat}
                >
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={styles['contacts-img']}
                      src="../../assets/images/profile3.jpeg"
                    />
                  </span>
                  <div className={styles['contact-details']}>
                    <span
                      className={`${styles['contact-name']}  ${
                        mode === 'dark' ? styles['dark-text'] : ''
                      }`}
                    >
                      Boolean Autocrats
                    </span>
                    <span
                      className={`${styles['last-message']} ${
                        mode === 'dark' ? styles['dark-msg'] : ''
                      }`}
                    >
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

                <li
                  className={`${styles['contacts-box']} ${
                    mode === 'dark' ? styles['dark-contacts-box'] : ''
                  }`}
                >
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={styles['contacts-img']}
                      src="../../assets/images/profile3.jpeg"
                    />
                  </span>
                  <div className={styles['contact-details']}>
                    <span
                      className={`${styles['contact-name']}  ${
                        mode === 'dark' ? styles['dark-text'] : ''
                      }`}
                    >
                      House of Dragon
                    </span>
                    <span
                      className={`${styles['last-message']} ${
                        mode === 'dark' ? styles['dark-msg'] : ''
                      }`}
                    >
                      <BsClock className={styles['message-status-icon2']} /> I
                      completed the tasks yesterday
                    </span>
                  </div>
                  <div className={styles['contact-extra']}>
                    <span
                      className={`${styles['message-time']} ${
                        mode === 'dark' ? styles['dark-msg'] : ''
                      }`}
                    >
                      {' '}
                      5:30 PM
                    </span>
                    {/* <span className={styles['message-number']}></span> */}
                  </div>
                </li>

                <li
                  className={`${styles['contacts-box']} ${
                    mode === 'dark' ? styles['dark-contacts-box'] : ''
                  }`}
                >
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={`${styles['contacts-img']}`}
                      src="../../assets/images/profile3.jpeg"
                    />
                  </span>
                  <div className={styles['contact-details']}>
                    <span
                      className={`${styles['contact-name']}  ${
                        mode === 'dark' ? styles['dark-text'] : ''
                      }`}
                    >
                      NACOS 2K26
                    </span>
                    <span
                      className={`${styles['last-message']} ${
                        mode === 'dark' ? styles['dark-msg'] : ''
                      }`}
                    >
                      <IoCheckmarkDoneSharp
                        className={`${styles['message-status-icon']} `}
                      />{' '}
                      I completed the tasks yesterday
                    </span>
                  </div>
                  <div className={styles['contact-extra']}>
                    <span
                      className={`${styles['message-time']} ${
                        mode === 'dark' ? styles['dark-msg'] : ''
                      }`}
                    >
                      {' '}
                      3:47 PM
                    </span>
                    {/* <span className={styles['message-number']}>
                    <span className={styles['message-length']}>5</span>
                  </span> */}
                  </div>
                </li>

                <li
                  className={`${styles['contacts-box']} ${
                    mode === 'dark' ? styles['dark-contacts-box'] : ''
                  }`}
                >
                  <span className={styles['contacts-img-box']}>
                    <img
                      className={styles['contacts-img']}
                      src="../../assets/images/profile3.jpeg"
                    />
                  </span>
                  <div className={styles['contact-details']}>
                    <span
                      className={`${styles['contact-name']}  ${
                        mode === 'dark' ? styles['dark-text'] : ''
                      }`}
                    >
                      CODM Players
                    </span>
                    <span
                      className={`${styles['last-message']} ${
                        mode === 'dark' ? styles['dark-msg'] : ''
                      }`}
                    >
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
                    <span
                      className={`${styles['message-time']} ${
                        mode === 'dark' ? styles['dark-msg'] : ''
                      }`}
                    >
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
              } ${mode === 'dark' ? styles['dark-msg'] : ''}`}
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
