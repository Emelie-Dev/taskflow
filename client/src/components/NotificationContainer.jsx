import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/Notifications.module.css';
import {
  MdPersonAdd,
  MdPersonAddDisabled,
  MdSecurity,
  MdDeleteSweep,
} from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { months, generateName } from '../pages/Dashboard';
import {
  GoCheckCircleFill,
  GoXCircleFill,
  GoProjectSymlink,
} from 'react-icons/go';
import { BsEnvelopeOpenFill } from 'react-icons/bs';
import { IoPersonRemove } from 'react-icons/io5';
import { apiClient } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import { SiKashflow } from 'react-icons/si';

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const NotificationContainer = ({
  date,
  group,
  setGroups,
  deleteMode,
  setDeleteMode,
  deleteList,
  setDeleteList,
  setDeleteCount,
}) => {
  const [showData, setShowData] = useState(true);
  const [containerHeight, setContainerHeight] = useState(null);
  const [deleteArray, setDeleteArray] = useState([]);
  const [isProcessing, setIsProcessing] = useState(null);

  const containerRef = useRef();
  const headerRef = useRef();
  const checkBoxRef = useRef([]);

  useEffect(() => {
    if (deleteMode.value) setDeleteList({ ...deleteList, [date]: deleteArray });
  }, [deleteArray]);

  useEffect(() => {
    if (!deleteMode.value) {
      checkBoxRef.current.forEach((element) => (element.checked = false));
      setDeleteArray([]);
    } else {
      if (deleteMode.all) {
        checkBoxRef.current.forEach((element) => (element.checked = true));
        setDeleteArray(group.map((element) => element._id));
      } else if (deleteMode.all === false) {
        checkBoxRef.current.forEach((element) => (element.checked = false));
        setDeleteArray([]);
      }
    }
  }, [deleteMode]);

  // Tasks
  // - if user is assigned tasks ✔
  // if the user is deassigned ✔

  // Projects
  // if a user accepts or denies invitaion request for the project owner ✔

  // Team members project activities
  // If they delete a file ✔
  // If they send a file ✔
  // If they leave the project team whether by deleting of account or leaving on purpose.✔

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

            <div
              className={`${styles['select-box']} ${
                deleteMode.value ? styles['show-select-box'] : ''
              }`}
            >
              <input
                type="checkbox"
                className={styles.checkbox}
                onChange={handleCheckBox(notification._id)}
                ref={addToRef(checkBoxRef)}
              />{' '}
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

            <div
              className={`${styles['select-box']} ${
                deleteMode.value ? styles['show-select-box'] : ''
              }`}
            >
              <input
                type="checkbox"
                className={styles.checkbox}
                onChange={handleCheckBox(notification._id)}
                ref={addToRef(checkBoxRef)}
              />{' '}
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

          <div
            className={`${styles['select-box']} ${
              deleteMode.value ? styles['show-select-box'] : ''
            }`}
          >
            <input
              type="checkbox"
              className={styles.checkbox}
              onChange={handleCheckBox(notification._id)}
              ref={addToRef(checkBoxRef)}
            />
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
              <button
                className={`${styles['accept-btn']} ${
                  isProcessing ? styles['disable-delete-btn'] : ''
                }`}
                onClick={respondToInvitation(notification._id, 'confirm')}
              >
                {isProcessing === 'confirm' ? (
                  <>
                    <SiKashflow className={styles['deleting-icon']} />
                    Processing....
                  </>
                ) : (
                  'Accept'
                )}
              </button>
              <button
                className={`${styles['decline-btn']} ${
                  isProcessing ? styles['disable-delete-btn'] : ''
                }`}
                onClick={respondToInvitation(notification._id, 'decline')}
              >
                {isProcessing === 'decline' ? (
                  <>
                    <SiKashflow className={styles['deleting-icon']} />
                    Processing....
                  </>
                ) : (
                  'Decline'
                )}
              </button>
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

          <div
            className={`${styles['select-box']} ${
              deleteMode.value ? styles['show-select-box'] : ''
            }`}
          >
            <input
              type="checkbox"
              className={styles.checkbox}
              onChange={handleCheckBox(notification._id)}
              ref={addToRef(checkBoxRef)}
            />
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

          <div
            className={`${styles['select-box']} ${
              deleteMode.value ? styles['show-select-box'] : ''
            }`}
          >
            <input
              type="checkbox"
              className={styles.checkbox}
              onChange={handleCheckBox(notification._id)}
              ref={addToRef(checkBoxRef)}
            />
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

          <div
            className={`${styles['select-box']} ${
              deleteMode.value ? styles['show-select-box'] : ''
            }`}
          >
            <input
              type="checkbox"
              className={styles.checkbox}
              onChange={handleCheckBox(notification._id)}
              ref={addToRef(checkBoxRef)}
            />
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

          <div
            className={`${styles['select-box']} ${
              deleteMode.value ? styles['show-select-box'] : ''
            }`}
          >
            <input
              type="checkbox"
              className={styles.checkbox}
              onChange={handleCheckBox(notification._id)}
              ref={addToRef(checkBoxRef)}
            />
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

            <div
              className={`${styles['select-box']} ${
                deleteMode.value ? styles['show-select-box'] : ''
              }`}
            >
              <input
                type="checkbox"
                className={styles.checkbox}
                onChange={handleCheckBox(notification._id)}
                ref={addToRef(checkBoxRef)}
              />
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

            <div
              className={`${styles['select-box']} ${
                deleteMode.value ? styles['show-select-box'] : ''
              }`}
            >
              <input
                type="checkbox"
                className={styles.checkbox}
                onChange={handleCheckBox(notification._id)}
                ref={addToRef(checkBoxRef)}
              />
            </div>
          </article>
        );
      } else if (
        notification.action === 'exit' &&
        notification.type.includes('project')
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
                </a>{' '}
                left the {''}
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

            <div
              className={`${styles['select-box']} ${
                deleteMode.value ? styles['show-select-box'] : ''
              }`}
            >
              <input
                type="checkbox"
                className={styles.checkbox}
                onChange={handleCheckBox(notification._id)}
                ref={addToRef(checkBoxRef)}
              />
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

          <div
            className={`${styles['select-box']} ${
              deleteMode.value ? styles['show-select-box'] : ''
            }`}
          >
            <input
              type="checkbox"
              className={styles.checkbox}
              onChange={handleCheckBox(notification._id)}
              ref={addToRef(checkBoxRef)}
            />
          </div>
        </article>
      );
    }
  };

  const addToRef = (ref) => (el) => {
    if (el && !ref.current.includes(el)) {
      ref.current.push(el);
    }
  };

  const hideNotifications = () => {
    const elemHeight = containerRef.current.offsetHeight;

    const headerHeight = headerRef.current.offsetHeight;

    containerRef.current.animate(
      {
        height: [`${elemHeight}px`, `${headerHeight}px`],
      },
      {
        duration: 200,
        iterations: 1,
        fill: 'both',
      }
    );

    setContainerHeight(elemHeight);
    setShowData(false);
  };

  const showNotifications = () => {
    const elemHeight = containerRef.current.offsetHeight;

    containerRef.current.animate(
      {
        height: [`${elemHeight}px`, `${containerHeight}px`],
      },
      {
        duration: 200,
        iterations: 1,
        fill: 'both',
      }
    );

    setContainerHeight(null);
    setShowData(true);
  };

  const handleCheckBox = (id) => (e) => {
    if (!deleteMode.value) {
      setDeleteMode({ value: true, all: null });
      setDeleteArray([id]);
    } else {
      const list = new Set(deleteArray);

      if (e.target.checked) {
        list.add(id);
      } else {
        list.delete(id);
      }

      setDeleteArray([...list]);
    }
  };

  const handleGroup = () => {
    const uncheckedElement = checkBoxRef.current.find(
      (element) => !element.checked
    );

    if (uncheckedElement) {
      checkBoxRef.current.forEach((element) => (element.checked = true));
      setDeleteArray(group.map((element) => element._id));
    } else {
      checkBoxRef.current.forEach((element) => (element.checked = false));
      setDeleteArray([]);
    }
  };

  const respondToInvitation = (id, response) => async () => {
    setIsProcessing(response);

    try {
      await apiClient.patch(`/api/v1/projects/${id}/reply-invitation`, {
        response,
      });
      setIsProcessing(null);
      setDeleteCount((prevCount) => prevCount + 1);
      setGroups((groups) => {
        const newGroups = { ...groups };
        newGroups[date] = newGroups[date].filter((elem) => elem._id !== id);

        if (newGroups[date].length === 0) delete newGroups[date];
        return newGroups;
      });
    } catch (err) {
      setIsProcessing(null);

      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occurred while sending your response.', {
          toastId: 'toast-id1',
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id1',
        });
      }
    }
  };

  return (
    <div className={styles['article-container']} ref={containerRef}>
      <ToastContainer autoClose={2000} />

      <h1 className={styles.head} ref={headerRef}>
        {showData ? (
          <IoIosArrowDown
            className={styles.arrow}
            onClick={hideNotifications}
          />
        ) : (
          <IoIosArrowUp className={styles.arrow} onClick={showNotifications} />
        )}
        <span className={styles['date-length']}>
          {group.length > 1_000_000 ? '1,000,000+' : group.length}
        </span>{' '}
        {days[new Date(date).getDay()]}, {months[new Date(date).getMonth()]}{' '}
        {new Date(date).getDate()}, {new Date(date).getFullYear()}
        {deleteMode.value && (
          <input
            className={styles['container-checkbox']}
            type="checkbox"
            checked={deleteArray.length === group.length}
            onChange={handleGroup}
          />
        )}
      </h1>

      {group.map((notification) => generateMessage(notification))}
    </div>
  );
};

export default NotificationContainer;
