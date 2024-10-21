import React, { useEffect, useState, useContext } from 'react';
import styles from '../styles/Login.module.css';
import { SiKashflow } from 'react-icons/si';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from '../App';

import { apiClient } from '../App';

const ResetPassword = () => {
  const { mode } = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'TaskFlow - Reset Password';
    document.documentElement.style.setProperty(
      '--toastify-color-progress-light',
      'orange'
    );

    const checkAuth = async () => {
      try {
        const { data } = await apiClient('/api/v1/auth/auth-check');

        if (data.status === 'success') {
          navigate('/dashboard');
        }
      } catch {}
    };

    checkAuth();
  }, []);

  const customId = 'toast-id';

  const resetPassword = async () => {
    if (password.length === 0) {
      return toast('Password field cannot be empty.', {
        toastId: customId,
      });
    } else if (
      !(
        password.match(/[A-z]/) &&
        password.match(/[0-9]/) &&
        password.match(/\W/)
      )
    ) {
      return toast(
        'Password must consist of letter, digit, and special character.',
        {
          toastId: customId,
        }
      );
    } else if (password.length < 8) {
      return toast('Password must be above 8 characters.', {
        toastId: customId,
      });
    } else if (confirmPassword.length === 0) {
      return toast('Confirm password field cannot be empty.', {
        toastId: customId,
      });
    } else if (password !== confirmPassword) {
      return toast('Password and confirm password do not match.', {
        toastId: customId,
      });
    }

    setIsProcessing(true);

    try {
      const { data } = await apiClient.patch(
        `/api/v1/auth/reset_password/${token}`,
        {
          password,
          confirmPassword,
        }
      );

      setIsProcessing(false);
      toast(data.message, {
        toastId: customId,
      });

      setTimeout(() => {
        navigate('/login');
      }, 3500);
    } catch (err) {
      setIsProcessing(false);
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occured during password reset.', {
          toastId: customId,
        });
      }

      return toast(err.response.data.message, {
        toastId: customId,
      });
    }
  };

  return (
    <section className={styles.section}>
      <video className={styles.video} muted autoPlay loop>
        <source
          src="../../assets/images/istockphoto-video.mp4"
          type="video/mp4"
        />
        Your browser does not support playing videos.
      </video>

      <ToastContainer autoClose={2500} />

      <div className={styles['section-content']}>
        <div className={styles['login-div']}>
          <span className={styles['icon-box']}>
            <Link to={'/'}>
              <SiKashflow className={styles.icon} />
            </Link>
          </span>

          <h1 className={styles.head}>Reset Password</h1>

          <div className={styles['input-div']}>
            <span className={styles['input-box']}>
              <RiLockPasswordFill className={styles['password-icon']} />

              <input
                type={showPassword ? 'text' : 'password'}
                className={styles.password}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <span className={styles['input-box']}>
              <RiLockPasswordFill className={styles['password-icon']} />

              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={styles.password}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {showConfirmPassword ? (
                <IoMdEye
                  className={styles['show-icon']}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              ) : (
                <IoMdEyeOff
                  className={styles['show-icon']}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}
            </span>
          </div>

          <div className={`${styles['btn-div']} ${styles['reset-btn-div']}`}>
            <button
              className={`${styles.button} ${
                isProcessing ? styles['disable-btn'] : ''
              }`}
              onClick={resetPassword}
            >
              <SiKashflow
                className={`${styles['process-icon']} ${
                  isProcessing ? styles['show-process-icon'] : ''
                }`}
              />
              Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
