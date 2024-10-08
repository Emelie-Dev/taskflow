import React, { useContext, useEffect, useState } from 'react';
import styles from '../styles/Signup.module.css';
import { SiKashflow } from 'react-icons/si';
import { MdOutlineMail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { GrGoogle } from 'react-icons/gr';
import { FaFacebookF } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { IoPersonCircleSharp } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { apiClient } from '../App';

const AccountAccess = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const query = new URLSearchParams(useLocation().search);

  useEffect(() => {
    document.title = 'TaskFlow - Signup';

    const checkAuth = async () => {
      const error = query.get('error');
      const isOperational = query.get('isOperational');

      if (error) {
        if (isOperational.toLowerCase() === 'true') {
          return toast('This email already exists.');
        } else {
          return toast('An error occurred while signing up with Google');
        }
      }

      try {
        const { data } = await apiClient('/api/v1/auth/auth-check');

        if (data.status === 'success') {
          navigate('/dashboard');
        }
      } catch (err) {}
    };

    checkAuth();
  }, []);

  const handlePasswordVisiblity = () => {
    setShowPassword(!showPassword);
  };

  const customId = 'toast-id';

  const navigate = useNavigate();

  const submitForm = async () => {
    // For Username
    if (username.length === 0) {
      return toast('Username field cannot be empty.', {
        toastId: customId,
      });
    } else if (username.length > 30) {
      return toast('Username cannot exceed 30 characters.', {
        toastId: customId,
      });
    } else if (username.match(/\W/)) {
      return toast(
        'Username must consist of letters, numbers, and underscores only.',
        {
          toastId: customId,
          autoClose: 2500,
        }
      );
    }

    // For Email
    if (email.length === 0) {
      return toast('Email field cannot be empty.', {
        toastId: customId,
      });
    }

    // For Password
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
        autoClose: 2500,
      });
    }

    setIsProcessing(true);

    // Makes an api call to create a new account
    try {
      const { data } = await apiClient({
        method: 'POST',
        url: '/api/v1/auth/signup',
        data: {
          username,
          email,
          password,
        },
      });

      if (data.status === 'success') {
        toast(data.message, {
          toastId: customId,
          autoClose: 3000,
        });

        setTimeout(() => navigate('/login'), 3500);
      }

      return setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);

      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occured while creating account.', {
          toastId: customId,
        });
      }

      toast(err.response.data.message, {
        toastId: customId,
        autoClose: 3000,
      });

      if (err.response.data.isSignup) {
        setTimeout(() => navigate('/login'), 3500);
      }
    }
  };

  const googleAuth = async () => {
    try {
      const { data } = await apiClient.post('/api/v1/auth/google?signup=true');

      window.location.href = data.url;
    } catch {
      return toast('An error occurred while signing up with Google.', {
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

          <h1 className={styles.head}>Create Account</h1>

          <div className={styles['input-div']}>
            <span className={styles['input-box']}>
              <IoPersonCircleSharp className={styles['username-icon']} />

              <input
                type="text"
                className={styles.username}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </span>

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
              Sign up
            </button>
          </div>

          <p className={styles['login-paragraph']}>
            Already have an account?&nbsp; &nbsp;
            <Link className={styles['login-link']} to={'/login'}>
              Login
            </Link>
          </p>

          <span className={styles['login-text']}>- or sign up with -</span>

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
            {/* <button className={styles['alternate-btn']}>
              <span className={styles['alternate-icon-box']}>
                <FaFacebookF className={styles['alternate-icon']} />
              </span>
              Facebook
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountAccess;
