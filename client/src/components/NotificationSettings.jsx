import React, { useEffect, useState, useContext } from 'react';
import styles from '../styles/NotificationSettings.module.css';
import { AuthContext, apiClient } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import { SiKashflow } from 'react-icons/si';

const NotificationSettings = () => {
  const { userData, setUserData } = useContext(AuthContext);
  const [initialData, setInitialData] = useState({
    taskAssignment: userData.notificationSettings.taskAssignment,
    reminder: userData.notificationSettings.reminder,
    projectActivity: userData.notificationSettings.projectActivity,
    email: userData.notificationSettings.email,
  });
  const [data, setData] = useState(initialData);
  const [enableBtn, setEnableBtn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let count = 0;

    for (let prop in data) {
      data[prop] === initialData[prop] && count++;
    }

    count !== 4 ? setEnableBtn(true) : setEnableBtn(false);
  }, [data]);

  const changeHandler = (prop) => (e) => {
    const newObj = { ...data, [prop]: e.target.checked };
    setData(newObj);
  };

  const resetData = () => {
    setData(initialData);
  };

  const submitData = async (e) => {
    setIsProcessing(true);

    try {
      const response = await apiClient.patch(
        `/api/v1/users/notifications`,
        data
      );

      const { taskAssignment, reminder, projectActivity, email } =
        response.data.data.userData.notificationSettings;

      setIsProcessing(false);
      setUserData(response.data.data.userData);
      setInitialData({
        taskAssignment,
        reminder,
        projectActivity,
        email,
      });
      setEnableBtn(false);
    } catch (err) {
      setIsProcessing(false);
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occured while saving data.', {
          toastId: 'toast-id1',
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id1',
        });
      }
    }
  };

  const { taskAssignment, reminder, projectActivity, email } = data;

  return (
    <section className={styles.section}>
      <ToastContainer autoClose={2000} />

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
            checked={taskAssignment}
            onChange={changeHandler('taskAssignment')}
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
            checked={reminder}
            onChange={changeHandler('reminder')}
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
            checked={projectActivity}
            onChange={changeHandler('projectActivity')}
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
            onChange={changeHandler('email')}
          />
        </li>
      </ul>

      <button
        className={`${styles['save-btn']} ${
          enableBtn ? styles['enable-btn'] : ''
        } ${isProcessing ? styles['disable-btn'] : ''}`}
        onClick={submitData}
      >
        {isProcessing ? (
          <>
            <SiKashflow className={styles['saving-icon']} />
            Saving....
          </>
        ) : (
          'Save'
        )}
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
