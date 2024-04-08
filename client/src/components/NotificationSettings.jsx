import React from 'react';
import styles from '../styles/NotificationSettings.module.css';

const NotificationSettings = () => {
  return (
    <section className={styles.section}>
      <h1 className={styles['section-head']}>Notifications</h1>

      <ul className={styles['list']}>
        <li className={styles['list-item']}>
          <span className={styles['item-details']}>
            <span className={styles['item-head']}>Task Assignment</span>
            <span className={styles['item-text']}>
              Enables you to receive notifications when assigned a new task.
            </span>
          </span>
          <input type="checkbox" className={styles['item-checkbox']} />
        </li>

        <li className={styles['list-item']}>
          <span className={styles['item-details']}>
            <span className={styles['item-head']}>Task Activity</span>
            <span className={styles['item-text']}>
              Allow you to stay updated by receiving notifications regarding
              various actions related to tasks.
            </span>
          </span>
          <input type="checkbox" className={styles['item-checkbox']} />
        </li>

        <li className={styles['list-item']}>
          <span className={styles['item-details']}>
            <span className={styles['item-head']}>Deadline and reminder</span>
            <span className={styles['item-text']}>
              Keep you informed by sending notifications prior to and following
              the deadline of tasks.
            </span>
          </span>
          <input type="checkbox" className={styles['item-checkbox']} />
        </li>

        <li className={styles['list-item']}>
          <span className={styles['item-details']}>
            <span className={styles['item-head']}>Project Activity</span>
            <span className={styles['item-text']}>
              Enable you to receive notifications about actions concerning
              projects.
            </span>
          </span>
          <input type="checkbox" className={styles['item-checkbox']} />
        </li>

        <li className={styles['list-item']}>
          <span className={styles['item-details']}>
            <span className={styles['item-head']}>Email notifications</span>
            <span className={styles['item-text']}>
              Important notifications will be sent to your email address.
            </span>
          </span>
          <input type="checkbox" className={styles['item-checkbox']} />
        </li>
      </ul>

      <button className={styles['save-btn']}>Save</button>
    </section>
  );
};

export default NotificationSettings;
