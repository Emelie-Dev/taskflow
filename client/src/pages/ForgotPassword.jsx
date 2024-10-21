import React, { useEffect, useState, useContext } from 'react';
import styles from '../styles/Login.module.css';
import { SiKashflow } from 'react-icons/si';
import { MdOutlineMail } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { apiClient, AuthContext } from '../App';

const ForgotPassword = () => {
  const { mode } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'TaskFlow - Forgot Password';
    document.documentElement.style.setProperty(
      '--toastify-color-progress-light',
      'orange'
    );
    document.body.classList.remove('dark-theme');

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

  const getPassordResetMail = async () => {
    if (email.length === 0) {
      return toast('Email field cannot be empty.', {
        toastId: customId,
      });
    }

    setIsProcessing(true);

    try {
      const { data } = await apiClient.post(`/api/v1/auth/forgot_password`, {
        email,
      });

      setIsProcessing(false);
      return toast(data.message, {
        toastId: customId,
      });
    } catch (err) {
      setIsProcessing(false);
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast(
          'There was an error sending the password reset email. Please try again later.',
          {
            toastId: customId,
          }
        );
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

      <ToastContainer autoClose={2000} />

      <div className={styles['section-content']}>
        <div className={styles['login-div']}>
          <span className={styles['icon-box']}>
            <Link to={'/'}>
              <SiKashflow className={styles.icon} />
            </Link>
          </span>

          <h1 className={styles.head}>Forgot Password</h1>

          <div className={styles['input-div']}>
            <span className={styles['input-box']}>
              <MdOutlineMail className={styles['email-icon']} />

              <input
                type="email"
                className={styles.email}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </span>
          </div>

          <div className={`${styles['btn-div']} ${styles['reset-btn-div']}`}>
            <button
              className={`${styles.button} ${
                isProcessing ? styles['disable-btn'] : ''
              }`}
              onClick={getPassordResetMail}
            >
              <SiKashflow
                className={`${styles['process-icon']} ${
                  isProcessing ? styles['show-process-icon'] : ''
                }`}
              />
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
