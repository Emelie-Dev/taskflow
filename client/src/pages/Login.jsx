import React, { useEffect, useState } from 'react';
import styles from '../styles/Login.module.css';
import { SiKashflow } from 'react-icons/si';
import { MdOutlineMail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { GrGoogle } from 'react-icons/gr';
import { FaFacebookF } from 'react-icons/fa6';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { apiClient } from '../App';

const Login = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const query = new URLSearchParams(useLocation().search);

  useEffect(() => {
    document.title = 'TaskFlow - Login';
    document.documentElement.style.setProperty(
      '--toastify-color-progress-light',
      'orange'
    );
    document.body.classList.remove('dark-theme');

    const checkAuth = async () => {
      const error = query.get('error');
      const code = parseInt(query.get('statusCode'));

      if (error) {
        if (code === 404) {
          return toast('There’s no account linked to this Google login.', {});
        } else if (code === 400) {
          return toast(
            'You did not sign up with Google. Please log in with your email and password.',
            {}
          );
        } else {
          return toast('An error occurred while logging in with Google.', {});
        }
      }

      try {
        const { data } = await apiClient('/api/v1/auth/auth-check');

        if (data.status === 'success') {
          navigate('/dashboard');
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handlePasswordVisiblity = () => {
    setShowPassword(!showPassword);
  };

  const customId = 'toast-id';

  const navigate = useNavigate();

  const submitForm = async () => {
    if (email.length === 0) {
      return toast('Email field cannot be empty.', {
        toastId: customId,
      });
    } else if (password.length === 0) {
      return toast('Password field cannot be empty.', {
        toastId: customId,
      });
    }

    setIsProcessing(true);

    // Makes an api login to account
    try {
      const { data } = await apiClient({
        method: 'POST',
        url: '/api/v1/auth/login',
        data: {
          email,
          password,
        },
      });

      if (data.status === 'success') {
        if (data.message) {
          toast(data.message, {
            toastId: customId,
            autoClose: 3000,
          });
        } else {
          navigate('/dashboard');
        }
      }

      return setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occured while logging in.', {
          toastId: customId,
        });
      }

      return toast(err.response.data.message, {
        toastId: customId,
        autoClose: 2500,
      });
    }
  };

  const googleAuth = async () => {
    try {
      const { data } = await apiClient.post('/api/v1/auth/google');

      window.location.href = data.url;
    } catch {
      return toast('An error occurred while logging in with Google.', {
        toastId: customId,
      });
    }

    // window.location.href = data.url;
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

          <h1 className={styles.head}>User Login</h1>

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
                  onClick={handlePasswordVisiblity}
                />
              ) : (
                <IoMdEyeOff
                  className={styles['show-icon']}
                  onClick={handlePasswordVisiblity}
                />
              )}
            </span>
          </div>

          <div className={styles['btn-div']}>
            <button
              className={`${styles.button} ${
                isProcessing ? styles['disable-btn'] : ''
              }`}
              onClick={submitForm}
            >
              <SiKashflow
                className={`${styles['process-icon']} ${
                  isProcessing ? styles['show-process-icon'] : ''
                }`}
              />
              Login
            </button>
          </div>

          <div className={styles['options-div']}>
            <span className={styles.text}>
              {' '}
              <Link to="/forgot_password">Forgot password </Link>
            </span>
            <span className={styles.text}>
              <Link to="/signup">Sign up</Link>
            </span>
          </div>

          <span className={styles['login-text']}>- or login with -</span>

          <div className={styles['alternate-method-div']}>
            <button
              className={styles['alternate-btn']}
              onClick={() => googleAuth()}
            >
              <span className={styles['alternate-icon-box']}>
                <GrGoogle className={styles['alternate-icon']} />
              </span>
              Google
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
