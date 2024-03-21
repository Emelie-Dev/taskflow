import React, { useEffect, useState } from 'react';
import styles from '../styles/Login.module.css';
import { SiKashflow } from 'react-icons/si';
import { MdOutlineMail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { GrGoogle } from 'react-icons/gr';
import { FaFacebookF } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisiblity = () => {
    setShowPassword(!showPassword);
  };

  const customId = 'toast-id';

  const navigate = useNavigate();

  const validate = () => {
    if (email.length === 0) {
      toast('Email field cannot be empty.', {
        toastId: customId,
      });
      return;
    } else if (password.length === 0) {
      toast('Password field cannot be empty.', {
        toastId: customId,
      });
      return;
    }

    navigate('/dashboard');
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
            <button className={styles.button} onClick={validate}>
              Login
            </button>
          </div>

          <div className={styles['options-div']}>
            <span className={styles.text}>Forgot password</span>
            <span className={styles.text}>
              <Link to="/signup">Sign up</Link>
            </span>
          </div>

          <span className={styles['login-text']}>- or login with -</span>

          <div className={styles['alternate-method-div']}>
            <button className={styles['alternate-btn']}>
              <span className={styles['alternate-icon-box']}>
                <GrGoogle className={styles['alternate-icon']} />
              </span>
              Google
            </button>
            <button className={styles['alternate-btn']}>
              <span className={styles['alternate-icon-box']}>
                <FaFacebookF className={styles['alternate-icon']} />
              </span>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
