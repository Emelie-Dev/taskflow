import React, { useEffect, useState } from 'react';
import styles from '../styles/GeneralInfo.module.css';
import { ToastContainer, toast } from 'react-toastify';

const initialValue = {
  first: 'Ofoka',
  last: 'Vincent',
  user: 'Godfather',
  job: 'Web Developer',
  email: 'abc@gmail.com',
  number: '00000000012',
  country: 'Nigeria',
  lang: 'English',
};

const GeneralInfo = () => {
  const [inputValue, setInputValue] = useState({
    first: 'Ofoka',
    last: 'Vincent',
    user: 'Godfather',
    job: 'Web Developer',
    email: 'abc@gmail.com',
    number: '00000000012',
    country: 'Nigeria',
    lang: 'English',
  });
  const [enableBtn, setEnableBtn] = useState(false);

  useEffect(() => {
    let count = 0;

    for (let prop in inputValue) {
      inputValue[prop] === initialValue[prop] && count++;
    }

    count !== 8 ? setEnableBtn(true) : setEnableBtn(false);
  }, [inputValue]);

  const { first, last, user, job, email, number, country, lang } = inputValue;

  const changeHandler = (e, input) => {
    setInputValue({
      ...inputValue,
      [input]: e.target.value,
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setInputValue(initialValue);
  };

  const customId = 'toast-id';

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user.length === 0) {
      toast('Username field cannot be empty.', {
        toastId: customId,
      });
      return;
    } else if (user.length > 30) {
      toast('Username cannot exceed 30 characters.', {
        toastId: customId,
      });
      return;
    } else if (user.match(/\W/)) {
      toast(
        'Username must consist of letters, numbers, and underscores only.',
        {
          toastId: customId,
        }
      );
      return;
    }
  };

  return (
    <section className={styles['section']}>
      <ToastContainer autoClose={2500} />
      <h1 className={styles['section-head']}>General Information</h1>

      <form className={styles['form']}>
        <div className={styles['form-box']}>
          <div className={styles['input-box']}>
            <label className={styles['input-label']}>First Name:</label>
            <input
              className={styles['form-input']}
              value={first}
              onChange={() => changeHandler(event, 'first')}
            />
          </div>

          <div className={styles['input-box']}>
            <label className={styles['input-label']}>Last Name:</label>
            <input
              className={styles['form-input']}
              value={last}
              onChange={() => changeHandler(event, 'last')}
            />
          </div>
        </div>

        <div className={styles['form-box']}>
          <div className={styles['input-box']}>
            <label className={styles['input-label']}>Username:</label>
            <input
              className={styles['form-input']}
              value={user}
              onChange={() => changeHandler(event, 'user')}
            />
          </div>

          <div className={styles['input-box']}>
            <label className={styles['input-label']}>Occupation:</label>
            <input
              className={styles['form-input']}
              value={job}
              onChange={() => changeHandler(event, 'job')}
            />
          </div>
        </div>

        <div className={styles['form-box']}>
          <div className={styles['input-box']}>
            <label className={styles['input-label']}>Email:</label>
            <input
              className={styles['form-input']}
              value={email}
              onChange={() => changeHandler(event, 'email')}
            />
          </div>

          <div className={styles['input-box']}>
            <label className={styles['input-label']}>Phone Number:</label>
            <input
              className={styles['form-input']}
              value={number}
              onChange={() => changeHandler(event, 'number')}
            />
          </div>
        </div>

        <div className={styles['form-box']}>
          <div className={styles['input-box']}>
            <label className={styles['input-label']}>Country:</label>
            <input
              className={styles['form-input']}
              value={country}
              onChange={() => changeHandler(event, 'country')}
            />
          </div>

          <div className={styles['input-box']}>
            <label className={styles['input-label']}>Language:</label>
            <input
              className={styles['form-input']}
              value={lang}
              onChange={() => changeHandler(event, 'lang')}
            />
          </div>
        </div>

        <input
          type="submit"
          className={`${styles['submit-btn']} ${
            enableBtn ? styles['enable-btn'] : ''
          }`}
          value={'Update Info'}
          onClick={handleSubmit}
        />
        <input
          type="reset"
          className={`${styles['reset-btn']} ${
            enableBtn ? styles['enable-btn'] : ''
          }`}
          value={'Cancel'}
          onClick={handleReset}
        />
      </form>
    </section>
  );
};

export default GeneralInfo;
