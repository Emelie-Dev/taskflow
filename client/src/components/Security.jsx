import React, { useEffect, useState, useContext } from 'react';
import styles from '../styles/Security.module.css';
import { ToastContainer, toast } from 'react-toastify';
import { apiClient, AuthContext } from '../App';
import { SiKashflow } from 'react-icons/si';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import DeleteComponent from './DeleteComponent';

const Security = () => {
  const { userData, setUserData, mode } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [enableBtn, setEnableBtn] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [initialData, setInitialData] = useState({
    firstName: userData.dataVisibility.firstName,
    lastName: userData.dataVisibility.lastName,
    language: userData.dataVisibility.language,
    mobileNumber: userData.dataVisibility.mobileNumber,
    country: userData.dataVisibility.country,
    dob: userData.dataVisibility.dob,
  });
  const [dataVisibility, setDataVisibility] = useState(initialData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusInput, setFocusInput] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ value: false, type: null });
  const navigate = useNavigate();

  useEffect(() => {
    let dataCount = 0;

    for (let prop in dataVisibility) {
      dataVisibility[prop] === initialData[prop] && dataCount++;
    }

    if (oldPassword !== '' || newPassword !== '' || dataCount !== 6) {
      setEnableBtn(true);
    } else {
      setEnableBtn(false);
    }
  }, [oldPassword, newPassword, dataVisibility]);

  const { firstName, lastName, language, mobileNumber, country, dob } =
    dataVisibility;

  const handleChange = (prop) => (e) => {
    setDataVisibility({ ...dataVisibility, [prop]: e.target.checked });
  };

  const resetData = () => {
    setOldPassword('');
    setNewPassword('');
    setDataVisibility(initialData);
  };

  const submitData = async () => {
    let password = newPassword;
    let changePassword = false;

    if (oldPassword.length !== 0 || password.length !== 0) {
      changePassword = true;

      if (userData.hasPassword) {
        if (oldPassword.length === 0 || password.length === 0) {
          return toast(
            `Please provide a value for the ${
              oldPassword.length === 0 ? 'current' : 'new'
            } password.`,
            {
              toastId: 'toast-id1',
            }
          );
        } else if (
          !(
            password.match(/[A-z]/) &&
            password.match(/[0-9]/) &&
            password.match(/\W/)
          )
        ) {
          return toast(
            'The new password must consist of a letter, digit, and special character.',
            {
              toastId: 'toast-id1',
              autoClose: 2500,
            }
          );
        } else if (password.length < 8) {
          return toast('The new password must be more than 8 characters.', {
            toastId: 'toast-id1',
          });
        }
      } else {
        if (oldPassword.length === 0 || password.length === 0) {
          return toast(
            `Please provide a value for the ${
              oldPassword.length === 0 ? 'password' : 'confirm password'
            }.`,
            {
              toastId: 'toast-id1',
            }
          );
        } else if (
          !(
            oldPassword.match(/[A-z]/) &&
            oldPassword.match(/[0-9]/) &&
            oldPassword.match(/\W/)
          )
        ) {
          return toast(
            'Password must consist of a letter, digit, and special character.',
            {
              toastId: 'toast-id1',
              autoClose: 2500,
            }
          );
        } else if (oldPassword.length < 8) {
          return toast('Password must be more than 8 characters.', {
            toastId: 'toast-id1',
          });
        } else if (oldPassword !== password) {
          return toast('Password and confirm password do not match.', {
            toastId: 'toast-id1',
          });
        }
      }
    }

    const body = changePassword
      ? { dataVisibility, password: { oldPassword, newPassword } }
      : { dataVisibility };

    setIsProcessing(true);

    try {
      const { data } = await apiClient.patch('/api/v1/users/security', body);

      const { firstName, lastName, language, mobileNumber, country, dob } =
        data.data.userData.userData.dataVisibility;

      setIsProcessing(false);
      setUserData(data.data.userData.userData);
      setInitialData({
        firstName,
        lastName,
        language,
        mobileNumber,
        country,
        dob,
      });
      setEnableBtn(false);

      if (data.data.userData.passwordMessage) {
        return toast(data.data.userData.passwordMessage, {
          toastId: 'toast-id1',
        });
      }

      if (changePassword) {
        if (!userData.isGoogleAuth) navigate('/login');
        else if (userData.hasPassword) {
          setOldPassword('');
          setNewPassword('');
          setShowNewPassword(false);
          setShowOldPassword(false);
        } else {
          setOldPassword('');
          setNewPassword('');
          setShowNewPassword(false);
          setShowOldPassword(false);

          return toast('Your password has been set successfully.', {
            toastId: 'toast-id1',
          });
        }
      }
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

  return (
    <section className={styles.section}>
      <ToastContainer autoClose={2000} />

      {deleteModal.value && (
        <DeleteComponent
          toast={toast}
          type={deleteModal.type}
          typeData={{ id: userData._id }}
          setDeleteModal={setDeleteModal}
        />
      )}

      <h1
        className={`${styles['section-head']} ${
          mode === 'dark' ? styles['dark-text'] : ''
        }`}
      >
        Security
      </h1>

      <div
        className={`${styles['content-container']} ${
          mode === 'dark' ? styles['dark-container'] : ''
        }`}
      >
        <p
          className={`${styles['password-head']} ${
            mode === 'dark' ? styles['dark-text'] : ''
          }`}
        >
          Password
        </p>

        <div className={styles['password-box']}>
          <div className={styles['input-box']}>
            <label
              className={`${styles.label}  ${
                mode === 'dark' ? styles['dark-word'] : ''
              }`}
              htmlFor="settings-password"
            >
              {' '}
              {userData.hasPassword ? 'Current ' : ''}
              Password:
            </label>
            <span
              className={`${styles['password-input-box']} ${
                focusInput === 'old' ? styles['focus-input'] : ''
              } ${mode === 'dark' ? styles['dark-input-box'] : ''}`}
            >
              <input
                type={showOldPassword ? 'text' : 'password'}
                className={`${styles['password-input']} ${
                  mode === 'dark' ? styles['dark-input'] : ''
                }`}
                id="settings-password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                onFocus={() => setFocusInput('old')}
                onBlur={() => setFocusInput(null)}
              />

              {showOldPassword ? (
                <IoMdEye
                  className={`${styles['show-icon']} ${
                    mode === 'dark' ? styles['dark-text'] : ''
                  }`}
                  onClick={() => setShowOldPassword(!showOldPassword)}
                />
              ) : (
                <IoMdEyeOff
                  className={`${styles['show-icon']} ${
                    mode === 'dark' ? styles['dark-text'] : ''
                  }`}
                  onClick={() => setShowOldPassword(!showOldPassword)}
                />
              )}
            </span>
          </div>

          <div className={styles['input-box']}>
            <label
              className={`${styles.label}  ${
                mode === 'dark' ? styles['dark-word'] : ''
              }`}
              htmlFor="settings-password2"
            >
              {' '}
              {userData.hasPassword ? 'New ' : 'Confirm '} Password:
            </label>
            <span
              className={`${styles['password-input-box']} ${
                focusInput === 'new' ? styles['focus-input'] : ''
              } ${mode === 'dark' ? styles['dark-input-box'] : ''}`}
            >
              <input
                type={showNewPassword ? 'text' : 'password'}
                className={`${styles['password-input']} ${
                  mode === 'dark' ? styles['dark-input'] : ''
                }`}
                id="settings-password2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setFocusInput('new')}
                onBlur={() => setFocusInput(null)}
              />

              {showNewPassword ? (
                <IoMdEye
                  className={`${styles['show-icon']} ${
                    mode === 'dark' ? styles['dark-text'] : ''
                  }`}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                />
              ) : (
                <IoMdEyeOff
                  className={`${styles['show-icon']} ${
                    mode === 'dark' ? styles['dark-text'] : ''
                  }`}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                />
              )}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`${styles['content-container']} ${
          mode === 'dark' ? styles['dark-container'] : ''
        }`}
      >
        <p
          className={`${styles['data-head']} ${
            mode === 'dark' ? styles['dark-text'] : ''
          }`}
        >
          Data visibility
        </p>

        <span
          className={`${styles['data-text']} ${
            mode === 'dark' ? styles['dark-word'] : ''
          }`}
        >
          Select which details will be viewable by other users.
        </span>

        <div className={styles['data-container']}>
          <span className={styles['data-box']}>
            <input
              type="checkbox"
              className={styles['data-checkbox']}
              id="security-first"
              checked={firstName}
              onChange={handleChange('firstName')}
            />
            <label
              className={`${styles['data-label']} ${
                mode === 'dark' ? styles['dark-text'] : ''
              }`}
              htmlFor="security-first"
            >
              First name
            </label>
          </span>
          <span className={styles['data-box']}>
            <input
              type="checkbox"
              className={styles['data-checkbox']}
              id="security-last"
              checked={lastName}
              onChange={handleChange('lastName')}
            />
            <label
              className={`${styles['data-label']} ${
                mode === 'dark' ? styles['dark-text'] : ''
              }`}
              htmlFor="security-last"
            >
              Last name
            </label>
          </span>
          <span className={styles['data-box']}>
            <input
              type="checkbox"
              className={styles['data-checkbox']}
              id="security-number"
              checked={mobileNumber}
              onChange={handleChange('mobileNumber')}
            />
            <label
              className={`${styles['data-label']} ${
                mode === 'dark' ? styles['dark-text'] : ''
              }`}
              htmlFor="security-number"
            >
              Phone Number
            </label>
          </span>
          <span className={styles['data-box']}>
            <input
              type="checkbox"
              className={styles['data-checkbox']}
              id="security-country"
              checked={country}
              onChange={handleChange('country')}
            />
            <label
              className={`${styles['data-label']} ${
                mode === 'dark' ? styles['dark-text'] : ''
              }`}
              htmlFor="security-country"
            >
              Country
            </label>
          </span>{' '}
          <span className={styles['data-box']}>
            <input
              type="checkbox"
              className={styles['data-checkbox']}
              id="security-language"
              checked={language}
              onChange={handleChange('language')}
            />
            <label
              className={`${styles['data-label']} ${
                mode === 'dark' ? styles['dark-text'] : ''
              }`}
              htmlFor="security-language"
            >
              Language
            </label>
          </span>
          <span className={styles['data-box']}>
            <input
              type="checkbox"
              className={styles['data-checkbox']}
              id="security-dob"
              checked={dob}
              onChange={handleChange('dob')}
            />
            <label
              className={`${styles['data-label']} ${styles['data-label2']} ${
                mode === 'dark' ? styles['dark-text'] : ''
              }`}
              htmlFor="security-dob"
            >
              Date of Birth
            </label>
          </span>
        </div>
      </div>

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

      <div className={styles['btn-div']}>
        <button
          className={`${styles['deactivate-btn']} ${
            mode === 'dark' ? styles['dark-btn'] : ''
          }`}
          onClick={() => setDeleteModal({ value: true, type: 'deactivate' })}
        >
          Deactivate Account
        </button>
        <button
          className={`${styles['delete-btn']}  ${
            mode === 'dark' ? styles['dark-btn'] : ''
          }`}
          onClick={() => setDeleteModal({ value: true, type: 'Account' })}
        >
          Delete Account
        </button>
      </div>
    </section>
  );
};

export default Security;
