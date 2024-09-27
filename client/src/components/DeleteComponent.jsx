import React, { useEffect, useState } from 'react';
import styles from '../styles/DeleteComponent.module.css';
import { IoCloseSharp } from 'react-icons/io5';
import { apiClient } from '../App';
import { SiKashflow } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

const DeleteComponent = ({
  toast,
  type,
  typeData,
  setDeleteModal,
  setProject,
  setSelectMode,
  setDeleteCount,
  setTasks,
  projectsPage,
  setProjects,
  setDeleteMode,
  setGroups,
  setDeleteLength,
}) => {
  const [isNameValid, setIsNameValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusInput, setFocusInput] = useState(false);
  const [token, setToken] = useState('');
  const [tokenMode, setTokenMode] = useState(false);
  const [tokenCounter, setTokenCounter] = useState(60);
  const [fetching, setFetching] = useState(false);
  const [showCounter, setShowCounter] = useState(true);

  const navigate = useNavigate();

  // Update token counter
  useEffect(() => {
    if (tokenMode && (fetching !== null || !fetching)) {
      setTokenCounter(60);

      const interval = setInterval(
        () => setTokenCounter((prevCount) => prevCount - 1),
        1000
      );

      return () => {
        clearInterval(interval);
      };
    }
  }, [tokenMode, fetching]);

  useEffect(() => {
    if (tokenCounter === 0) setShowCounter(false);
  }, [tokenCounter]);

  // Checks if project name is correct
  useEffect(() => {
    if (String(name) !== String(typeData.name)) {
      setIsNameValid(false);
    } else {
      setIsNameValid(true);
    }
  }, [name]);

  const hideDisplayModal = (e) => {
    e.target === e.currentTarget &&
      setDeleteModal({ value: false, type: null });
  };

  const deleteProject = async () => {
    if (!isNameValid) {
      return toast('Type in the correct project name to delete the project.', {
        toastId: 'toast-id1',
      });
    }

    setIsProcessing(true);

    try {
      await apiClient.delete(`/api/v1/projects/${typeData.id}`);
      setIsProcessing(false);

      if (projectsPage) {
        setProjects((projects) => {
          return {
            grid: [...projects.grid].filter(
              (project) => project._id !== typeData.id
            ),
            table: (() => {
              const table = [...projects.table];

              let pageNumber = null;

              table.forEach((page, index, array) => {
                if (pageNumber === null) {
                  const deletedIndex = page.findIndex(
                    (project) => project._id === typeData.id
                  );

                  if (deletedIndex !== -1) pageNumber = index;

                  page.splice(deletedIndex, 1);

                  if (array[index + 1]) page.push(array[index + 1][0]);
                } else {
                  if (array[index + 1]) {
                    page.push(array[index + 1][0]);
                    array[index + 1].unshift();
                  }
                }
              });

              return table;
            })(),
          };
        });

        setDeleteCount((prevCount) => prevCount + 1);
        setDeleteModal({ value: false, type: null });
      } else navigate('/projects');
    } catch (err) {
      setIsProcessing(false);

      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occurred while deleting project.', {
          toastId: 'toast-id1',
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id1',
        });
      }
    }
  };

  const deleteFiles = async () => {
    setIsProcessing(true);

    try {
      const { data } = await apiClient.patch(
        `/api/v1/projects/${typeData.id}/files`,
        { files: typeData.files }
      );

      setIsProcessing(false);
      setProject(data.data.project);
      setDeleteModal({ value: false, type: null });
      setSelectMode({ value: false, index: null });

      if (data.data.message !== '') {
        toast(data.data.message, {
          toastId: 'toast-id2',
        });
      }
    } catch (err) {
      setIsProcessing(false);
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast(
          `An error occurred while deleting ${
            typeData.files.length === 1 ? 'file' : 'files'
          }.`,
          {
            toastId: 'toast-id2',
          }
        );
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id2',
        });
      }
    }
  };

  const deleteActivities = async () => {
    setIsProcessing(true);

    try {
      const { data } = await apiClient.patch(
        `/api/v1/projects/${typeData.id}/activities`,
        {
          activities: typeData.activities,
        }
      );

      setIsProcessing(false);
      setProject(data.data.project);
      setDeleteModal({ value: false, type: null });
      setSelectMode({ value: false, index: null });
    } catch (err) {
      setIsProcessing(false);
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast(
          `An error occurred while deleting ${
            typeData.activities.length !== 1 ? 'activities' : 'activity'
          }.`,
          {
            toastId: 'toast-id3',
            autoClose: 2000,
          }
        );
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id3',
          autoClose: 2000,
        });
      }
    }
  };

  const deleteTask = async () => {
    setIsProcessing(true);

    try {
      let data;
      await apiClient.delete(`/api/v1/tasks/${typeData.task}`);

      try {
        data = await apiClient(`/api/v1/projects/${typeData.id}`);
      } catch (err) {
        throw new Error();
      }

      setIsProcessing(false);
      setProject(data.data.data.project);
      setTasks((tasks) => tasks.filter((task) => task._id !== typeData.task));
      setDeleteCount((prevCount) => prevCount + 1);
      setDeleteModal({ value: false, type: null });
    } catch (err) {
      setIsProcessing(false);
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occurred while deleting task.', {
          toastId: 'toast-id4',
          autoClose: 2000,
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id4',
          autoClose: 2000,
        });
      }
    }
  };

  const deactivateAccount = async () => {
    setIsProcessing(true);

    try {
      await apiClient.post(`/api/v1/users/${typeData.id}/deactivate`, {
        password,
      });

      setIsProcessing(false);
      navigate('/');
    } catch (err) {
      setIsProcessing(false);
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occurred while deactivating account.', {
          toastId: 'toast-id5',
          autoClose: 2000,
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id5',
          autoClose: 2000,
        });
      }
    }
  };

  const getDeleteToken = (type) => async () => {
    if (type === 'link') setFetching(true);
    else setIsProcessing(true);

    try {
      await apiClient.post(`/api/v1/users/${typeData.id}/delete_token`, {
        password,
      });

      if (type === 'link') {
        setFetching(false);
        setShowCounter(true);
      } else {
        setIsProcessing(false);
        setTokenMode(true);
      }
    } catch (err) {
      if (type === 'link') setFetching(null);
      else setIsProcessing(false);

      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occurred while sending verification code.', {
          toastId: 'toast-id6',
          autoClose: 2000,
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id6',
          autoClose: 2000,
        });
      }
    }
  };

  const deleteAccount = async () => {
    setIsProcessing(true);

    try {
      await apiClient.delete(`/api/v1/users/${typeData.id}/${token}`);
      setIsProcessing(false);

      navigate('/');
    } catch (err) {
      setIsProcessing(false);

      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occurred while deleting account.', {
          toastId: 'toast-id7',
          autoClose: 2000,
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id7',
          autoClose: 2000,
        });
      }
    }
  };

  const exitProject = async () => {
    setIsProcessing(true);

    try {
      await apiClient.delete(`/api/v1/projects/${typeData.id}/team`);
      setIsProcessing(false);

      navigate('/projects');
    } catch (err) {
      setIsProcessing(false);

      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occurred while exiting the project.', {
          toastId: 'toast-id8',
          autoClose: 2000,
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id8',
          autoClose: 2000,
        });
      }
    }
  };

  const deleteUserNotifications = async () => {
    setIsProcessing(true);

    const notifications = Array.from(
      Object.entries(typeData.deleteList).reduce(
        (accumulator, [key, value]) => {
          value.forEach((id) => accumulator.add(id));
          return accumulator;
        },
        new Set()
      )
    );

    try {
      await apiClient.patch(`/api/v1/notifications`, { notifications });
      setDeleteCount((prevCount) => prevCount + typeData.deleteLength);
      setGroups((groups) => {
        const newGroups = { ...groups };
        for (const prop in newGroups) {
          if (typeData.deleteList[prop]) {
            newGroups[prop] = newGroups[prop].filter(
              (elem) => !typeData.deleteList[prop].includes(elem._id)
            );

            if (newGroups[prop].length === 0) delete newGroups[prop];
          }
        }

        return newGroups;
      });
      setDeleteLength(0);
      setIsProcessing(false);
      setDeleteModal({ value: false, type: null });
      setDeleteMode({ value: false, all: null });
    } catch (err) {
      setIsProcessing(false);

      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast(
          `An error occurred while deleting the ${
            typeData.deleteLength === 1 ? 'notification' : 'notifications'
          }.`,
          {
            toastId: 'toast-id9',
            autoClose: 2000,
          }
        );
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id9',
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <section className={styles.section} onClick={hideDisplayModal}>
      <div className={styles['modal-container']}>
        <span
          className={styles['close-modal']}
          onClick={() => setDeleteModal({ value: false, type: null })}
        >
          <IoCloseSharp className={styles['close-modal-icon']} />
        </span>

        <h1 className={styles['modal-head']}>
          {' '}
          {type === 'deactivate'
            ? 'Deactivate Account'
            : type === 'Team'
            ? 'Exit Project'
            : type === 'Notifications'
            ? typeData.deleteLength === 1
              ? 'Delete Notification'
              : 'Delete Notifications'
            : `Delete ${type}`}{' '}
        </h1>

        <div className={styles['delete-content']}>
          {type === 'Project' ? (
            <>
              <span className={styles['delete-text']}>
                Deleting this project will permanently remove all associated
                tasks and files. This action cannot be undone. Type the project
                name <b>{typeData.name}</b> to continue.
              </span>

              <input
                className={styles['delete-input']}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </>
          ) : type.startsWith('File') ? (
            <span className={styles['delete-text']}>
              Deleting {typeData.files.length !== 1 ? 'these' : 'this'} file
              {typeData.files.length !== 1 ? 's' : ''} is permanent and cannot
              be undone.
            </span>
          ) : type.startsWith('Activit') ? (
            <span className={styles['delete-text']}>
              Are you sure you want to delete{' '}
              {typeData.activities.length !== 1
                ? 'these activities'
                : 'this activity'}
              ?
            </span>
          ) : type === 'Task' ? (
            'Are you sure you want to delete this task?'
          ) : type === 'deactivate' ? (
            <div className={styles['deactivate-content']}>
              <span className={styles['deactivate-header']}>
                If you deactivate your account:
              </span>

              <ul className={styles['deactivate-list']}>
                <li className={styles['deactivate-item']}>
                  Your account and content will no longer be visible to anyone.
                </li>
                <li className={styles['deactivate-item']}>
                  TaskFlow will keep your data so you can easily recover it when
                  you reactivate your account.
                </li>
                <li className={styles['deactivate-item']}>
                  You can log back in anytime to reactivate your account and
                  restore all your content.
                </li>
              </ul>

              <span className={styles['pswd-text']}>
                Enter your password to deactivate your account.
              </span>

              <span
                className={`${styles['pswd-box']} ${
                  focusInput ? styles['focus-input'] : ''
                }`}
              >
                <input
                  className={styles['pswd']}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusInput(true)}
                  onBlur={() => setFocusInput(false)}
                />

                {showPassword ? (
                  <IoMdEye
                    className={styles['show-icon']}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <IoMdEyeOff
                    className={styles['show-icon']}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </span>
            </div>
          ) : type === 'Account' ? (
            <div className={styles['deactivate-content']}>
              <span className={styles['deactivate-header']}>
                If you delete your account:
              </span>

              <ul className={styles['deactivate-list']}>
                <li className={styles['deactivate-item']}>
                  You will not be able to log in or access any TaskFlow services
                  with this account.
                </li>
                <li className={styles['deactivate-item']}>
                  All your projects, tasks, files, and other data will be
                  permanently deleted.
                </li>
                <li className={styles['deactivate-item']}>
                  Account deletion is permanent and cannot be undone, so please
                  proceed with caution.
                </li>
              </ul>

              {tokenMode ? (
                <>
                  <span className={styles['pswd-text']}>
                    Enter the verification code sent to your email address to
                    delete your account.
                  </span>

                  <span
                    className={`${styles['pswd-box']} ${
                      styles['pswd-token-box']
                    } ${focusInput ? styles['focus-token-input'] : ''}`}
                  >
                    <input
                      className={`${styles['pswd']} ${styles['pswd-token']}`}
                      type="number"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      onFocus={() => setFocusInput(true)}
                      onBlur={() => setFocusInput(false)}
                    />
                  </span>
                </>
              ) : (
                <>
                  <span className={styles['pswd-text']}>
                    Enter your password to continue.
                  </span>

                  <span
                    className={`${styles['pswd-box']} ${
                      focusInput ? styles['focus-input'] : ''
                    }`}
                  >
                    <input
                      className={styles['pswd']}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusInput(true)}
                      onBlur={() => setFocusInput(false)}
                    />

                    {showPassword ? (
                      <IoMdEye
                        className={styles['show-icon']}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <IoMdEyeOff
                        className={styles['show-icon']}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                  </span>
                </>
              )}
            </div>
          ) : type === 'Team' ? (
            <div className={styles['deactivate-content']}>
              <span className={styles['deactivate-header']}>
                If you exit this project:
              </span>

              <ul className={styles['deactivate-list']}>
                <li className={styles['deactivate-item']}>
                  You will be removed from all tasks you were assigned under
                  this project.
                </li>
                <li className={styles['deactivate-item']}>
                  You will no longer have access to this project or its content.
                </li>
              </ul>
            </div>
          ) : type === 'Notifications' ? (
            <>
              Are you sure you want to delete
              {typeData.deleteLength !== 1
                ? ' these notifications'
                : ' this notification'}
              ?
            </>
          ) : (
            ''
          )}
        </div>

        <div className={styles['btn-div']}>
          {tokenMode ? (
            <span className={styles['resend-token-box']}>
              <span
                className={`${styles['resend-token-txt']} ${
                  fetching ? styles['fetching-token'] : ''
                } ${showCounter ? styles['fetching-token'] : ''}`}
                onClick={getDeleteToken('link')}
              >
                Resend code
              </span>{' '}
              {fetching ? (
                <div className={styles['searching-loader']}></div>
              ) : (
                ''
              )}
              {showCounter ? (
                <span className={`${styles['resend-token-timer']}`}>
                  {tokenCounter}s
                </span>
              ) : (
                ''
              )}
            </span>
          ) : (
            ''
          )}
          <button
            className={`${styles['delete-btn']} ${
              type === 'Project'
                ? !isNameValid
                  ? styles['disable-btn']
                  : ''
                : ''
            } ${
              type === 'deactivate' || type === 'Account'
                ? password.length === 0
                  ? styles['disable-btn']
                  : ''
                : ''
            } ${
              type === 'Account' && tokenMode
                ? String(token).length < 6
                  ? styles['disable-btn']
                  : ''
                : ''
            } ${isProcessing ? styles['processing-button'] : ''} `}
            onClick={
              type === 'Project'
                ? deleteProject
                : type.startsWith('File')
                ? deleteFiles
                : type.startsWith('Activit')
                ? deleteActivities
                : type === 'Task'
                ? deleteTask
                : type === 'deactivate'
                ? deactivateAccount
                : type === 'Account'
                ? tokenMode
                  ? deleteAccount
                  : getDeleteToken()
                : type === 'Team'
                ? exitProject
                : type === 'Notifications'
                ? deleteUserNotifications
                : null
            }
          >
            {isProcessing ? (
              <>
                <SiKashflow className={styles['deleting-icon']} />
                {type === 'deactivate'
                  ? 'Deactivating....'
                  : (type === 'Account' && !tokenMode) || type === 'Team'
                  ? 'Processing....'
                  : 'Deleting....'}
              </>
            ) : (
              `${
                type === 'deactivate'
                  ? 'Deactivate'
                  : type === 'Account' && !tokenMode
                  ? 'Continue'
                  : type === 'Team'
                  ? 'Exit'
                  : 'Delete'
              }`
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default DeleteComponent;
