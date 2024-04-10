import React, { useEffect, useState } from 'react';
import styles from '../styles/NotificationSettings.module.css';

const initialData = {
  assignment: true,
  tActivity: true,
  deadline: true,
  pActivity: true,
  email: true,
};

const NotificationSettings = () => {
  const [data, setData] = useState({
    assignment: true,
    tActivity: true,
    deadline: true,
    pActivity: true,
    email: true,
  });

  const [enableBtn, setEnableBtn] = useState(false);

  useEffect(() => {
    let count = 0;

    for (let prop in data) {
      data[prop] === initialData[prop] && count++;
    }

    count !== 5 ? setEnableBtn(true) : setEnableBtn(false);
  }, [data]);

  const changeHandler = (e, prop) => {
    const newObj = { ...data, [prop]: e.target.checked };
    setData(newObj);
  };

  const resetData = () => {
    setData(initialData);
  };

  const { assignment, tActivity, deadline, pActivity, email } = data;

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
          <input
            type="checkbox"
            className={styles['item-checkbox']}
            checked={assignment}
            onChange={() => changeHandler(event, 'assignment')}
          />
        </li>

        <li className={styles['list-item']}>
          <span className={styles['item-details']}>
            <span className={styles['item-head']}>Task Activity</span>
            <span className={styles['item-text']}>
              Allow you to stay updated by receiving notifications regarding
              various actions related to tasks.
            </span>
          </span>
          <input
            type="checkbox"
            className={styles['item-checkbox']}
            checked={tActivity}
            onChange={() => changeHandler(event, 'tActivity')}
          />
        </li>

        <li className={styles['list-item']}>
          <span className={styles['item-details']}>
            <span className={styles['item-head']}>Deadline and reminder</span>
            <span className={styles['item-text']}>
              Keep you informed by sending notifications prior to and following
              the deadline of tasks.
            </span>
          </span>
          <input
            type="checkbox"
            className={styles['item-checkbox']}
            checked={deadline}
            onChange={() => changeHandler(event, 'deadline')}
          />
        </li>

        <li className={styles['list-item']}>
          <span className={styles['item-details']}>
            <span className={styles['item-head']}>Project Activity</span>
            <span className={styles['item-text']}>
              Enable you to receive notifications about actions concerning
              projects.
            </span>
          </span>
          <input
            type="checkbox"
            className={styles['item-checkbox']}
            checked={pActivity}
            onChange={() => changeHandler(event, 'pActivity')}
          />
        </li>

        <li className={styles['list-item']}>
          <span className={styles['item-details']}>
            <span className={styles['item-head']}>Email notifications</span>
            <span className={styles['item-text']}>
              Important notifications will be sent to your email address.
            </span>
          </span>
          <input
            type="checkbox"
            className={styles['item-checkbox']}
            checked={email}
            onChange={() => changeHandler(event, 'email')}
          />
        </li>
      </ul>

      <button
        className={`${styles['save-btn']} ${
          enableBtn ? styles['enable-btn'] : ''
        }`}
      >
        Save Changes
      </button>
      <button
        className={`${styles['reset-btn']} ${
          enableBtn ? styles['enable-btn'] : ''
        }`}
        onClick={resetData}
      >
        Reset
      </button>
    </section>
  );
};

export default NotificationSettings;
