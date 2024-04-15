import React from 'react';
import styles from '../styles/Notifications.module.css';
import { GoProjectSymlink, GoShieldCheck } from 'react-icons/go';
import { IoChatbubbleEllipsesOutline, IoClose } from 'react-icons/io5';

const NotificationBox = ({ data, date }) => {
  const {
    action,
    state1,
    state2,
    user,
    project,
    count,
    device,
    location,
    group,
  } = data;

  return (
    <article className={styles.article}>
      {date && (
        <h1 className={styles['article-head']}>
          {date === 1 && 'Today'} {date === 2 && 'Yesterday'}{' '}
          <span className={styles['notifications-length']}>{count}</span>
        </h1>
      )}
      {action === 'transition' && (
        <div className={styles['notification-box']}>
          <IoClose className={styles['notification-close-icon']} />
          <GoProjectSymlink className={styles['content-icon']} />

          <img
            src="../../assets/images/profile3.jpeg"
            className={styles['notification-img']}
          />

          <div className={styles['notification-content']}>
            <div className={styles['notification-message']}>
              <span className={styles['notification-text']}>
                <span className={styles['content-name']}>{user}</span> has
                changed the status of{' '}
                <span className={styles['content-name']}>{project}</span> from{' '}
                <span className={styles['important-text']}>{state1}</span> to{' '}
                <span className={styles['important-text']}>{state2}</span>
              </span>

              <span className={styles['btn-box']}>
                <button className={styles['project-btn']}>View project</button>
              </span>
            </div>

            <span className={styles['notification-time']}>2 hours ago</span>
          </div>
        </div>
      )}

      {action === 'task' && (
        <div className={styles['notification-box']}>
          <IoClose className={styles['notification-close-icon']} />
          <GoProjectSymlink className={styles['content-icon']} />

          <img
            src="../../assets/images/profile2webp.webp"
            className={styles['notification-img']}
          />

          <div className={styles['notification-content']}>
            <div className={styles['notification-message']}>
              <span className={styles['notification-text']}>
                <span className={styles['content-name']}>{user}</span> carried
                out an action within the{' '}
                <span className={styles['content-name']}>{project} </span>
                project
              </span>
              <span className={styles['btn-box']}>
                <button className={styles['project-btn']}>View action</button>
              </span>
            </div>
            <span className={styles['notification-time']}>2 hours ago</span>
          </div>
        </div>
      )}

      {action === 'security' && (
        <div className={styles['notification-box']}>
          <IoClose className={styles['notification-close-icon']} />
          <GoShieldCheck className={styles['content-icon']} />

          <div className={styles['notification-content']}>
            <div className={styles['notification-message']}>
              <span className={styles['notification-text']}>
                A new login has been detected on a
                <span className={styles['content-name']}> {device} </span>{' '}
                device from{' '}
                <span className={styles['content-name']}>{location}.</span> If
                you aren't aware of this, click the{' '}
                <span className={styles['content-name']}>block</span> button to
                restrict access from the device.
              </span>
              <span className={styles['btn-box']}>
                <button className={styles['project-btn']}>Block</button>
              </span>
            </div>
            <span className={styles['notification-time']}>2 hours ago</span>
          </div>
        </div>
      )}

      {action === 'request' && (
        <div className={styles['notification-box']}>
          <IoClose className={styles['notification-close-icon']} />
          <IoChatbubbleEllipsesOutline className={styles['content-icon']} />

          <img
            src="../../assets/images/profile4.jpeg"
            className={styles['notification-img']}
          />

          <div className={styles['notification-content']}>
            <div className={styles['notification-message']}>
              <span className={styles['notification-text']}>
                <span className={styles['content-name']}> {group} </span> sent
                you a request to join their group
              </span>
              <span className={styles['btn-box']}>
                <button className={styles['project-btn']}>Accept</button>
                <button className={styles['decline-btn']}>Decline</button>
              </span>
            </div>
            <span className={styles['notification-time']}>2 hours ago</span>
          </div>
        </div>
      )}
    </article>
  );
};

export default NotificationBox;
