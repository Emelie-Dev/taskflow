import React, { useState, useRef } from 'react';
import styles from '../styles/CalendarPage.module.css';
import { SiKashflow, SiSimpleanalytics } from 'react-icons/si';
import { Link } from 'react-router-dom';

import { IoChatbubblesSharp, IoSettingsOutline } from 'react-icons/io5';
import { IoIosSearch, IoMdClose, IoIosNotifications } from 'react-icons/io';

import {
  MdOutlineDashboard,
  MdOutlineSegment,
  MdArrowForwardIos,
  MdArrowBackIosNew,
} from 'react-icons/md';
import { FaTasks, FaCalendarAlt, FaSearch, FaCircle } from 'react-icons/fa';
import { GoProjectTemplate } from 'react-icons/go';

const CalendarPage = () => {
  const [searchText, setSearchText] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const searchRef = useRef();
  const navRef = useRef();
  const calenderRef = useRef();

  const hideNav = (e) => {
    if (e.target === navRef.current) {
      setShowNav(false);
    }
  };

  const handleSearchText = (e) => {
    setSearchText(e.target.value);
  };
  const clearSearchText = () => {
    setSearchText('');
    searchRef.current.focus();
  };

  const maxDays = (currentMonth) => {
    const month = currentMonth;
    const arr30 = [4, 6, 9, 11];
    let days = 0;

    if (month === 2) {
      if (currentYear % 4 === 0) {
        days = 29;
      } else {
        days = 28;
      }
    } else if (arr30.includes(month)) {
      days = 30;
    } else {
      days = 31;
    }
    return days;
  };

  const maxRows = () => {
    const maxNumber = maxDays(currentMonth);
    const firstDay = new Date(`${currentYear}-${currentMonth}-1`).getDay();
    let rows = 4;

    if (maxNumber === 30) {
      if (firstDay === 0) {
        rows = 5;
      }
    } else if (maxNumber === 31) {
      if (firstDay === 0 || firstDay === 6) {
        rows = 5;
      }
    }

    return rows;
  };

  const tableData = (currentMonth, currentYear) => {
    const currentDate = new Date().getDate();
    const currentDay = new Date(`${currentYear}-${currentMonth}-1`).getDay();
    const maxNumber = maxDays(currentMonth);
    const prevMonthNumber = maxDays(currentMonth - 1);
    const rows = maxRows();

    let dataArray = [];

    let value = 0;

    for (let i = 0; i <= rows; i++) {
      let data = [];
      if (i === 0) {
        let num = prevMonthNumber - (currentDay - 1);
        let row1Num = prevMonthNumber - 6;
        for (let j = 0; j <= 6; j++) {
          if (currentDay === 0) {
            value = 1;
            let input = value;

            let current = input === currentDate;

            if (`${input}`.length < 2) {
              input = `0${input}`;
            }

            if (j === 6) {
              data.push({ input, current, member: true });
            } else {
              row1Num++;
              input = row1Num;
              data.push({ input, current: false, member: false });
            }
          } else if (j >= currentDay - 1) {
            value++;
            let input = value;

            let current = input === currentDate;

            if (`${input}`.length < 2) {
              input = `0${input}`;
            }

            data.push({ input, current, member: true });
          } else {
            num++;
            let input = num;
            data.push({ input, current: false, member: false });
          }
        }
      } else {
        let nextMonthNumber = 0;
        for (let j = 0; j <= 6; j++) {
          value++;
          let input = value;

          let current = input === currentDate;

          let member = true;

          if (`${input}`.length < 2) {
            input = `0${input}`;
          } else if (input > maxNumber) {
            nextMonthNumber++;
            member = false;
            input = `0${nextMonthNumber}`;
          }

          data.push({ input, current, member });
        }
      }
      dataArray.push(data);
    }

    return dataArray;
  };

  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const moveNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }

    calenderRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 400,
      iterations: 1,
    });
  };

  const movePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
    calenderRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 400,
      iterations: 1,
    });
  };

  const moveToToday = () => {
    setCurrentMonth(new Date().getMonth() + 1);
    setCurrentYear(new Date().getFullYear());
    calenderRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 400,
      iterations: 1,
    });
  };

  const enableTodayBtn = () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    return year === currentYear && month === currentMonth;
  };

  
  const checkCurrentDate = (current) => {
    return (
      current &&
      currentYear === new Date().getFullYear() &&
      currentMonth === new Date().getMonth() + 1
    );
  };


  return (
    <main className={styles.div}>
      <nav
        ref={navRef}
        className={`${styles['responsive-nav']} ${
          showNav ? styles['show-nav'] : ''
        }`}
        onClick={hideNav}
      >
        <section className={styles['responsive-section']}>
          <div className={styles['responsive-head']}>
            <span className={styles['icon-box']}>
              <Link to={'/'}>
                <SiKashflow className={styles.icon} />
              </Link>
            </span>

            <span className={styles['head-text']}>TaskFlow</span>
          </div>
          <ul className={styles['responsive-side-nav']}>
            <li className={styles['side-nav-item']}>
              <Link to={'/dashboard'} className={styles['side-nav-link']}>
                <MdOutlineDashboard className={styles['side-nav-icon']} />{' '}
                Dashboard
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/projects'} className={styles['side-nav-link']}>
                <GoProjectTemplate className={styles['side-nav-icon']} />{' '}
                Projects
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/tasks'} className={styles['side-nav-link']}>
                <FaTasks className={styles['side-nav-icon']} /> Tasks
              </Link>
            </li>
            <li className={`${styles['side-nav-item']}  ${styles.calendar}`}>
              <Link
                to={'/calendar'}
                className={`${styles['side-nav-link']}  ${styles['calendar-link']}`}
              >
                <FaCalendarAlt
                  className={`${styles['side-nav-icon']} ${styles['calendar-icon']}`}
                />{' '}
                Calendar
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/projects'} className={styles['side-nav-link']}>
                <IoChatbubblesSharp className={styles['side-nav-icon']} /> Chat
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/projects'} className={styles['side-nav-link']}>
                <SiSimpleanalytics className={styles['side-nav-icon']} />{' '}
                Analytics
              </Link>
            </li>
            <li
              className={`${styles['side-nav-item']} ${styles.notifications}`}
            >
              <Link to={'/projects'} className={styles['side-nav-link']}>
                <IoIosNotifications className={styles['side-nav-icon']} />{' '}
                Notifications
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/projects'} className={styles['side-nav-link']}>
                <IoSettingsOutline className={styles['side-nav-icon']} />{' '}
                Settings
              </Link>
            </li>
          </ul>
        </section>
      </nav>

      <nav className={styles.nav}>
        {' '}
        <div className={styles.head}>
          <span className={styles['icon-box']}>
            <Link to={'/'}>
              <SiKashflow className={styles.icon} />
            </Link>
          </span>

          <span className={styles['head-text']}>TaskFlow</span>
        </div>
        <ul className={styles['side-nav']}>
          <li className={styles['side-nav-item']}>
            <Link to={'/dashboard'} className={styles['side-nav-link']}>
              <MdOutlineDashboard className={styles['side-nav-icon']} />{' '}
              Dashboard
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/projects'} className={styles['side-nav-link']}>
              <GoProjectTemplate className={styles['side-nav-icon']} /> Projects
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/tasks'} className={styles['side-nav-link']}>
              <FaTasks className={styles['side-nav-icon']} /> Tasks
            </Link>
          </li>
          <li className={`${styles['side-nav-item']}  ${styles.calendar}`}>
            <Link
              to={'/calendar'}
              className={`${styles['side-nav-link']} ${styles['calendar-link']} `}
            >
              <FaCalendarAlt
                className={`${styles['side-nav-icon']} ${styles['calendar-link']} `}
              />{' '}
              Calendar
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/projects'} className={styles['side-nav-link']}>
              <IoChatbubblesSharp className={styles['side-nav-icon']} /> Chat
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/projects'} className={styles['side-nav-link']}>
              <SiSimpleanalytics className={styles['side-nav-icon']} />{' '}
              Analytics
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/projects'} className={styles['side-nav-link']}>
              <IoSettingsOutline className={styles['side-nav-icon']} /> Settings
            </Link>
          </li>
        </ul>
      </nav>

      <section className={styles.section}>
        <header className={styles.header}>
          <b className={styles['menu-icon-box']}>
            <MdOutlineSegment
              className={styles['menu-icon']}
              onClick={() => setShowNav(true)}
            />
          </b>

          <h1 className={styles['page']}>Calendar</h1>

          <span className={styles['search-box']}>
            <IoIosSearch className={styles['search-icon']} />
            <input
              type="text"
              className={styles.search}
              value={searchText}
              ref={searchRef}
              placeholder="Search..."
              onChange={handleSearchText}
            />
            <IoMdClose
              className={`${styles['cancel-icon']} ${
                searchText.length !== 0 ? styles['show-cancel-icon'] : ''
              }`}
              onClick={clearSearchText}
            />
          </span>
          <div className={styles['icon-div']}>
            <span className={styles['icon-container']}>
              <IoIosNotifications className={styles['notification-icon']} />
            </span>
            <span className={styles['icon-container']}>
              <IoChatbubblesSharp className={styles['chat-icon']} />
            </span>
          </div>

          <div className={styles['profile-div']}>
            <div className={styles['profile-box']}>
              <span className={styles['profile-name']}>Ofoka Vincent</span>
              <span className={styles['profile-title']}>Web developer</span>
            </div>

            <span className={styles['alternate-search-box']}>
              <FaSearch className={styles['alternate-search-icon']} />
            </span>

            <figure className={styles['profile-picture-box']}>
              <img
                className={styles['profile-picture']}
                src="../../assets/images/download.jpeg"
              />
            </figure>
          </div>
        </header>

        <section className={styles['section-content']}>

          <section className={styles['calendar-section']}>
            <div className={styles['calendar-section-head']}>
              <div className={styles['calendar-details']}>
                <h1 className={styles['current-month']}>
                  {month[currentMonth - 1]} {currentYear}
                </h1>
                <p className={styles['calendar-text']}>
                  This displays task deadlines with color-coded priorities: red
                  for high, yellow for medium, and green for low.
                </p>
              </div>
              <div className={styles['today-btn-div']}>
                <button
                  className={`${styles['today-btn']} ${
                    enableTodayBtn() ? styles['disabled-btn'] : ''
                  }`}
                  onClick={moveToToday}
                >
                  Today
                </button>
              </div>
            </div>

            <div className={styles['table-container']}>
              <span
                className={styles['prev-arrow-box']}
                title="Previous Month"
                onClick={movePreviousMonth}
              >
                <MdArrowBackIosNew className={styles['arrow-icon']} />
              </span>

              <div className={styles['table-box']}>
                <table className={styles.table} ref={calenderRef}>
                  <thead className={styles.thead}>
                    <tr>
                      <th className={styles['table-head']}>mon</th>
                      <th className={styles['table-head']}>tue</th>
                      <th className={styles['table-head']}>wed</th>
                      <th className={styles['table-head']}>thu</th>
                      <th className={styles['table-head']}>fri</th>
                      <th className={styles['table-head']}>sat</th>
                      <th className={styles['table-head']}>Sun</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tableData(currentMonth, currentYear).map((data, index) => (
                      <tr key={index}>
                        {data.map(({ input, current, member }, index) => (
                          <td
                            key={index}
                            className={`${styles['table-data']} ${
                              member ? '' : styles['prev-month']
                            } ${checkCurrentDate(current) ? styles['current-date'] : ''}`}
                          >
                            <div className={styles['data-box']}>
                              <span>{input}</span>

                              {member && (
                                <div className={styles['priority-div']}>
                                  <span
                                    className={`${styles['priority-box']} `}
                                  >
                                    <FaCircle
                                      className={`${styles['priority-icon']} ${styles['high-priority']}`}
                                    />
                                    5 tasks
                                  </span>
                                  <span className={`${styles['priority-box']}`}>
                                    <FaCircle
                                      className={`${styles['priority-icon']}  ${styles['mid-priority']} `}
                                    />
                                    2 tasks
                                  </span>
                                  <span className={`${styles['priority-box']}`}>
                                    <FaCircle
                                      className={`${styles['priority-icon']}  ${styles['low-priority']}`}
                                    />
                                    3 tasks
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <span
                className={styles['next-arrow-box']}
                title="Next Month"
                onClick={moveNextMonth}
              >
                <MdArrowForwardIos className={styles['arrow-icon']} />
              </span>
            </div>
          </section>

        <section className={styles['tasks-section']}>
            Tasks section
        </section>

        </section>
      </section>
    </main>
  );
};

export default CalendarPage;
