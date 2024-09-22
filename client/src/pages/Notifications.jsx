import React, { useEffect, useState, useContext } from 'react';
import styles from '../styles/Notifications.module.css';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import { apiClient, AuthContext } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import {
  MdAssignmentTurnedIn,
  MdPersonAdd,
  MdPersonAddDisabled,
  MdSecurity,
  MdDeleteSweep,
} from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { months, generateName } from './Dashboard';
import {
  GoCheckCircleFill,
  GoXCircleFill,
  GoProjectSymlink,
} from 'react-icons/go';
import { BsEnvelopeOpenFill } from 'react-icons/bs';
import { IoPersonRemove } from 'react-icons/io5';
import { GrProjects } from 'react-icons/gr';

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const Notifications = () => {
  const { userData, setUserData } = useContext(AuthContext);
  const [showNav, setShowNav] = useState(false);
  const [category, setCategory] = useState('unread');
  const [notifications, setNotifications] = useState(null);
  const [groups, setGroups] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const { data } = await apiClient(
          `/api/v1/notifications/${userData._id}`
        );

        setNotifications(data.data.notifications);
      } catch {
        if (
          !err.response ||
          !err.response.data ||
          err.response.status === 500
        ) {
          return toast('An error occured while getting notifications.', {
            toastId: 'toast-id1',
          });
        } else {
          return toast(err.response.data.message, {
            toastId: 'toast-id1',
          });
        }
      }
    };

    getNotifications();
  }, []);

  useEffect(() => {
    if (notifications) {
      const notificationGroups = notifications.reduce(
        (accumulator, notification) => {
          let date = new Date(notification.time);
          date.setHours(0, 0, 0, 0);
          date = date.toISOString();

          if (!accumulator[date]) accumulator[date] = [];

          accumulator[date].push(notification);

          return accumulator;
        },
        {}
      );

      setGroups(notificationGroups);
    }
  }, [notifications]);

  // Tasks
  // - if user is assigned tasks ✔
  // if the user is deassigned ✔

  // Projects
  // if a user accepts or denies invitaion request for the project owner ✔

  // Team members project activities
  // If they delete a file ✔
  // If they send a file ✔
  // If they leave the project team whether by deleting of account or leaving on purpose.

  // User activities
  //  if user is sent a project team invitation request ✔
  // if the user is removed from a team ✔
  // deadline notifications
  // password change or reset ✔
  // Account reactivation ✔
  // if a project was deleted by the owner ✔

  const generateMessage = (notification) => {
    if (notification.action === 'task') {
      if (notification.type.includes('assignedTask')) {
        return (
          <article key={notification._id} className={styles.article}>
            <span className={styles['icon-box']}>
              <MdPersonAdd className={styles.icon} />
            </span>

            <div className={styles['message-box']}>
              <span className={styles.message}>
                <a className={styles['link-text']} href="#">
                  {generateName(
                    notification.performer.firstName,
                    notification.performer.lastName,
                    notification.performer.username
                  )}
                </a>{' '}
                added you to the assignees of a task in the{' '}
                <a
                  className={styles['link-text']}
                  href={`/project/${notification.performer.projectId}`}
                >
                  {notification.performer.project}
                </a>{' '}
                project.
              </span>

              <time className={styles.time}>
                {' '}
                {new Date(notification.time).getHours() === 0 ||
                new Date(notification.time).getHours() === 12
                  ? 12
                  : new Date(notification.time).getHours() > 12
                  ? String(
                      new Date(notification.time).getHours() - 12
                    ).padStart(2, '0')
                  : String(new Date(notification.time).getHours()).padStart(
                      2,
                      '0'
                    )}
                :
                {String(new Date(notification.time).getMinutes()).padStart(
                  2,
                  '0'
                )}{' '}
                {new Date(notification.time).getHours() >= 12 ? 'PM' : 'AM'}
              </time>
            </div>

            <div className={styles['menu-box']}>
              <BsThreeDotsVertical className={styles['menu-icon']} />

              <ul className={styles['action-list']}>
                <li>
                  <a className={styles['view-link']} href="/tasks">
                    View
                  </a>
                </li>
                <li className={styles['action-item']}>Select</li>
              </ul>
            </div>
          </article>
        );
      } else if (notification.type.includes('assignee')) {
        return (
          <article key={notification._id} className={styles.article}>
            <span className={styles['icon-box']}>
              <MdPersonAddDisabled className={styles.icon} />
            </span>

            <div className={styles['message-box']}>
              <span className={styles.message}>
                <a className={styles['link-text']} href="#">
                  {generateName(
                    notification.performer.firstName,
                    notification.performer.lastName,
                    notification.performer.username
                  )}
                </a>{' '}
                removed you from the assignees of a task in the{' '}
                <a
                  className={styles['link-text']}
                  href={`/project/${notification.performer.projectId}`}
                >
                  {notification.performer.project}
                </a>{' '}
                project.
              </span>

              <time className={styles.time}>
                {' '}
                {new Date(notification.time).getHours() === 0 ||
                new Date(notification.time).getHours() === 12
                  ? 12
                  : new Date(notification.time).getHours() > 12
                  ? String(
                      new Date(notification.time).getHours() - 12
                    ).padStart(2, '0')
                  : String(new Date(notification.time).getHours()).padStart(
                      2,
                      '0'
                    )}
                :
                {String(new Date(notification.time).getMinutes()).padStart(
                  2,
                  '0'
                )}{' '}
                {new Date(notification.time).getHours() >= 12 ? 'PM' : 'AM'}
              </time>
            </div>

            <div className={styles['select-box']}>
              <input type="checkbox" className={styles.checkbox} />{' '}
            </div>
          </article>
        );
      }
    } else if (
      notification.action === 'response' &&
      notification.type.includes('team')
    ) {
      return (
        <article key={notification._id} className={styles.article}>
          <span className={styles['icon-box']}>
            {notification.state.response === 'confirm' ? (
              <GoCheckCircleFill className={styles.icon} />
            ) : (
              <GoXCircleFill className={styles.icon} />
            )}
          </span>

          <div className={styles['message-box']}>
            <span className={styles.message}>
              <a className={styles['link-text']} href="#">
                {generateName(
                  notification.performer.firstName,
                  notification.performer.lastName,
                  notification.performer.username
                )}
              </a>{' '}
              {notification.state.response === 'confirm'
                ? 'accepted'
                : 'declined'}{' '}
              the invitation to join the team for your project,{' '}
              <a
                className={styles['link-text']}
                href={`/project/${notification.performer.projectId}`}
              >
                {notification.performer.project}
              </a>
              .
            </span>

            <time className={styles.time}>
              {' '}
              {new Date(notification.time).getHours() === 0 ||
              new Date(notification.time).getHours() === 12
                ? 12
                : new Date(notification.time).getHours() > 12
                ? String(new Date(notification.time).getHours() - 12).padStart(
                    2,
                    '0'
                  )
                : String(new Date(notification.time).getHours()).padStart(
                    2,
                    '0'
                  )}
              :
              {String(new Date(notification.time).getMinutes()).padStart(
                2,
                '0'
              )}{' '}
              {new Date(notification.time).getHours() >= 12 ? 'PM' : 'AM'}
            </time>
          </div>

          <div className={styles['select-box']}>
            <input type="checkbox" className={styles.checkbox} />
          </div>
        </article>
      );
    } else if (
      notification.action === 'invitation' &&
      notification.type.includes('team')
    ) {
      return (
        <article key={notification._id} className={styles.article}>
          <span className={styles['icon-box']}>
            <BsEnvelopeOpenFill className={styles.icon} />
          </span>
          <div className={styles['message-box']}>
            <span className={styles.message}>
              <a className={styles['link-text']} href="#">
                {generateName(
                  notification.performer.firstName,
                  notification.performer.lastName,
                  notification.performer.username
                )}
              </a>{' '}
              sent you an invitation to join the project team for{' '}
              <span className={styles['bold-text']}>
                {notification.performer.project}
              </span>
              .
            </span>

            <span className={styles['btn-box']}>
              <button className={styles['accept-btn']}>Accept</button>
              <button className={styles['decline-btn']}>Decline</button>
            </span>

            <time className={styles.time}>
              {' '}
              {new Date(notification.time).getHours() === 0 ||
              new Date(notification.time).getHours() === 12
                ? 12
                : new Date(notification.time).getHours() > 12
                ? String(new Date(notification.time).getHours() - 12).padStart(
                    2,
                    '0'
                  )
                : String(new Date(notification.time).getHours()).padStart(
                    2,
                    '0'
                  )}
              :
              {String(new Date(notification.time).getMinutes()).padStart(
                2,
                '0'
              )}{' '}
              {new Date(notification.time).getHours() >= 12 ? 'PM' : 'AM'}
            </time>
          </div>

          <div className={styles['select-box']}>
            <input type="checkbox" className={styles.checkbox} />
          </div>
        </article>
      );
    } else if (
      notification.action === 'removal' &&
      notification.type.includes('team')
    ) {
      return (
        <article key={notification._id} className={styles.article}>
          <span className={styles['icon-box']}>
            <IoPersonRemove className={styles.icon} />
          </span>
          <div className={styles['message-box']}>
            <span className={styles.message}>
              <a className={styles['link-text']} href="#">
                {generateName(
                  notification.performer.firstName,
                  notification.performer.lastName,
                  notification.performer.username
                )}
              </a>{' '}
              removed you from the project team for{' '}
              <span className={styles['bold-text']}>
                {notification.performer.project}
              </span>
              .
            </span>

            <time className={styles.time}>
              {' '}
              {new Date(notification.time).getHours() === 0 ||
              new Date(notification.time).getHours() === 12
                ? 12
                : new Date(notification.time).getHours() > 12
                ? String(new Date(notification.time).getHours() - 12).padStart(
                    2,
                    '0'
                  )
                : String(new Date(notification.time).getHours()).padStart(
                    2,
                    '0'
                  )}
              :
              {String(new Date(notification.time).getMinutes()).padStart(
                2,
                '0'
              )}{' '}
              {new Date(notification.time).getHours() >= 12 ? 'PM' : 'AM'}
            </time>
          </div>

          <div className={styles['select-box']}>
            <input type="checkbox" className={styles.checkbox} />
          </div>
        </article>
      );
    } else if (
      notification.action === 'update' &&
      notification.type.includes('security')
    ) {
      return (
        <article key={notification._id} className={styles.article}>
          <span className={styles['icon-box']}>
            <MdSecurity className={styles.icon} />
          </span>
          <div className={styles['message-box']}>
            <span className={styles.message}>
              {notification.state.reset
                ? 'Your password reset was successful.'
                : 'Your password was changed successfully.'}
            </span>

            <time className={styles.time}>
              {' '}
              {new Date(notification.time).getHours() === 0 ||
              new Date(notification.time).getHours() === 12
                ? 12
                : new Date(notification.time).getHours() > 12
                ? String(new Date(notification.time).getHours() - 12).padStart(
                    2,
                    '0'
                  )
                : String(new Date(notification.time).getHours()).padStart(
                    2,
                    '0'
                  )}
              :
              {String(new Date(notification.time).getMinutes()).padStart(
                2,
                '0'
              )}{' '}
              {new Date(notification.time).getHours() >= 12 ? 'PM' : 'AM'}
            </time>
          </div>

          <div className={styles['select-box']}>
            <input type="checkbox" className={styles.checkbox} />
          </div>
        </article>
      );
    } else if (
      notification.action === 'activation' &&
      notification.type.includes('security')
    ) {
      return (
        <article key={notification._id} className={styles.article}>
          <span className={styles['icon-box']}>
            <MdSecurity className={styles.icon} />
          </span>
          <div className={styles['message-box']}>
            <span className={styles.message}>
              Your account was reactivated successfully. You will regain access
              to all your content.
            </span>

            <time className={styles.time}>
              {' '}
              {new Date(notification.time).getHours() === 0 ||
              new Date(notification.time).getHours() === 12
                ? 12
                : new Date(notification.time).getHours() > 12
                ? String(new Date(notification.time).getHours() - 12).padStart(
                    2,
                    '0'
                  )
                : String(new Date(notification.time).getHours()).padStart(
                    2,
                    '0'
                  )}
              :
              {String(new Date(notification.time).getMinutes()).padStart(
                2,
                '0'
              )}{' '}
              {new Date(notification.time).getHours() >= 12 ? 'PM' : 'AM'}
            </time>
          </div>

          <div className={styles['select-box']}>
            <input type="checkbox" className={styles.checkbox} />
          </div>
        </article>
      );
    } else if (notification.projectActivity) {
      if (
        notification.action === 'addition' ||
        (notification.action === 'deletion' &&
          !notification.type.includes('account'))
      ) {
        return (
          <article key={notification._id} className={styles.article}>
            <span className={styles['icon-box']}>
              <GoProjectSymlink className={styles.icon} />
            </span>
            <div className={styles['message-box']}>
              <span className={styles.message}>
                <a className={styles['link-text']} href="#">
                  {generateName(
                    notification.performer.firstName,
                    notification.performer.lastName,
                    notification.performer.username
                  )}
                </a>
                {notification.action === 'addition' ? ' added' : ' deleted'}
                {notification.performer.filesLength === 1
                  ? ' a file'
                  : ` ${notification.performer.filesLength} files`}
                {notification.action === 'addition' ? ' to ' : ' from '} the{' '}
                <a
                  className={styles['link-text']}
                  href={`/project/${notification.project}`}
                >
                  {notification.performer.project}
                </a>{' '}
                project.
              </span>

              <time className={styles.time}>
                {' '}
                {new Date(notification.time).getHours() === 0 ||
                new Date(notification.time).getHours() === 12
                  ? 12
                  : new Date(notification.time).getHours() > 12
                  ? String(
                      new Date(notification.time).getHours() - 12
                    ).padStart(2, '0')
                  : String(new Date(notification.time).getHours()).padStart(
                      2,
                      '0'
                    )}
                :
                {String(new Date(notification.time).getMinutes()).padStart(
                  2,
                  '0'
                )}{' '}
                {new Date(notification.time).getHours() >= 12 ? 'PM' : 'AM'}
              </time>
            </div>

            <div className={styles['select-box']}>
              <input type="checkbox" className={styles.checkbox} />
            </div>
          </article>
        );
      } else if (
        notification.action === 'deletion' &&
        notification.type.includes('account')
      ) {
        return (
          <article key={notification._id} className={styles.article}>
            <span className={styles['icon-box']}>
              <GoProjectSymlink className={styles.icon} />
            </span>
            <div className={styles['message-box']}>
              <span className={styles.message}>
                <span className={styles['bold-text']}>
                  {generateName(
                    notification.performer.firstName,
                    notification.performer.lastName,
                    notification.performer.username
                  )}
                </span>{' '}
                was no longer available and was subsequently removed from the
                project team for{' '}
                <a
                  className={styles['link-text']}
                  href={`/project/${notification.project}`}
                >
                  {notification.performer.project}
                </a>
                .
              </span>

              <time className={styles.time}>
                {' '}
                {new Date(notification.time).getHours() === 0 ||
                new Date(notification.time).getHours() === 12
                  ? 12
                  : new Date(notification.time).getHours() > 12
                  ? String(
                      new Date(notification.time).getHours() - 12
                    ).padStart(2, '0')
                  : String(new Date(notification.time).getHours()).padStart(
                      2,
                      '0'
                    )}
                :
                {String(new Date(notification.time).getMinutes()).padStart(
                  2,
                  '0'
                )}{' '}
                {new Date(notification.time).getHours() >= 12 ? 'PM' : 'AM'}
              </time>
            </div>

            <div className={styles['select-box']}>
              <input type="checkbox" className={styles.checkbox} />
            </div>
          </article>
        );
      }
    } else if (
      notification.action === 'deletion' &&
      notification.type.includes('project')
    ) {
      return (
        <article key={notification._id} className={styles.article}>
          <span className={styles['icon-box']}>
            <MdDeleteSweep className={styles.icon} />
          </span>
          <div className={styles['message-box']}>
            <span className={styles.message}>
              <a className={styles['link-text']} href="#">
                {generateName(
                  notification.performer.firstName,
                  notification.performer.lastName,
                  notification.performer.username
                )}
              </a>{' '}
              deleted the{' '}
              <span className={styles['bold-text']}>
                {notification.performer.project}
              </span>{' '}
              project.
            </span>

            <time className={styles.time}>
              {' '}
              {new Date(notification.time).getHours() === 0 ||
              new Date(notification.time).getHours() === 12
                ? 12
                : new Date(notification.time).getHours() > 12
                ? String(new Date(notification.time).getHours() - 12).padStart(
                    2,
                    '0'
                  )
                : String(new Date(notification.time).getHours()).padStart(
                    2,
                    '0'
                  )}
              :
              {String(new Date(notification.time).getMinutes()).padStart(
                2,
                '0'
              )}{' '}
              {new Date(notification.time).getHours() >= 12 ? 'PM' : 'AM'}
            </time>
          </div>

          <div className={styles['select-box']}>
            <input type="checkbox" className={styles.checkbox} />
          </div>
        </article>
      );
    }
  };

  return (
    <main className={styles.div}>
      <ToastContainer autoClose={2000} />
      <NavBar
        page={'Notifications'}
        showNav={showNav}
        setShowNav={setShowNav}
      />

      <section className={styles.section}>
        <Header page={'Notifications'} setShowNav={setShowNav} />
        {/* //Fix empty notifications // Loading notifications and error */}

        <section className={styles['section-content']}>
          <div className={styles['notification-container']}>
            {groups
              ? Object.entries(groups).map(([key, value], index) => (
                  <div
                    key={key}
                    className={`${styles['article-container']} ${
                      index === currentGroup ? styles['slide-up'] : ''
                    }`}
                  >
                    <h1 className={styles.head}>
                      <IoIosArrowDown
                        className={styles.arrow}
                        onClick={() => setCurrentGroup(index)}
                      />
                      <span className={styles['date-length']}>
                        {value.length > 1_000_000 ? '1,000,000+' : value.length}
                      </span>{' '}
                      {days[new Date(key).getDay()]},{' '}
                      {months[new Date(key).getMonth()]}{' '}
                      {new Date(key).getDate()}, {new Date(key).getFullYear()}
                    </h1>

                    {value.map((notification) => generateMessage(notification))}
                  </div>
                ))
              : ''}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Notifications;
