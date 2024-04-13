import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/Dashboard.module.css';
import { SiKashflow, SiSimpleanalytics } from 'react-icons/si';
import { Link } from 'react-router-dom';

import { IoChatbubblesSharp, IoSettingsOutline } from 'react-icons/io5';
import {
  IoIosSearch,
  IoMdClose,
  IoIosArrowForward,
  IoIosArrowBack,
  IoIosNotifications,
} from 'react-icons/io';

import { HiPlus, HiOutlineLogout } from 'react-icons/hi';
import { HiMiniArrowTrendingUp } from 'react-icons/hi2';
import { ImBrightnessContrast } from 'react-icons/im';
import { Line } from 'react-chartjs-2';

import { FaRegClock, FaRegCircleUser } from 'react-icons/fa6';
import { MdOutlineDashboard } from 'react-icons/md';
import { FaTasks, FaCalendarAlt } from 'react-icons/fa';
import { GoProjectTemplate } from 'react-icons/go';
import Calendar from '../components/Calendar';
import { MdOutlineSegment } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [searchText, setSearchText] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showNav, setShowNav] = useState(false);
  const [showUserBox, setShowUserBox] = useState(false);
  const searchRef = useRef();
  const calenderRef = useRef();
  const navRef = useRef();
  const userBoxRef = useRef();
  const imgRef = useRef();

  useEffect(() => {
    const handleUserBox = (e) => {
      if (showUserBox) {
        if (
          e.target === imgRef.current ||
          e.target === userBoxRef.current ||
          userBoxRef.current.contains(e.target)
        ) {
          return;
        } else {
          setShowUserBox(false);
        }
      }
    };

    window.addEventListener('click', handleUserBox);

    return () => {
      window.removeEventListener('click', handleUserBox);
    };
  }, [showUserBox]);

  const handleSearchText = (e) => {
    setSearchText(e.target.value);
  };

  const clearSearchText = () => {
    setSearchText('');
    searchRef.current.focus();
  };

  const data = {
    labels: ['8th Feb', '16th Feb', '24th Feb', '3rd Mar', '8th Mar'],
    datasets: [
      {
        label: 'Tasks Done',
        data: [50, 37, 73, 29, 58],
        fill: false,
        borderColor: 'orange',
        tension: 0.4,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 15,
        },
      },
      y: {
        grid: {
          borderDash: [5, 5],
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 10,
          padding: 15,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'white',
        titleColor: 'orange',
        bodyColor: 'black',
        borderColor: 'orange',
        borderWidth: 2,
        padding: 10,
        // More tooltip options...
      },
    },
  };

  const moveToCurrentDate = () => {
    setCurrentMonth(new Date().getMonth() + 1);
    setCurrentYear(new Date().getFullYear());

    calenderRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 400,
      iterations: 1,
    });
  };

  const hideNav = (e) => {
    if (e.target === navRef.current) {
      setShowNav(false);
    }
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
            <li className={`${styles['side-nav-item']} ${styles.dashboard}`}>
              <Link
                to={'/dashboard'}
                className={`${styles['side-nav-link']}  ${styles['dashboard-link']}`}
              >
                <MdOutlineDashboard
                  className={`${styles['side-nav-icon']}  ${styles['dashboard-icon']}`}
                />{' '}
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
            <li className={styles['side-nav-item']}>
              <Link to={'/calendar'} className={styles['side-nav-link']}>
                <FaCalendarAlt className={styles['side-nav-icon']} /> Calendar
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/chats'} className={styles['side-nav-link']}>
                <IoChatbubblesSharp className={styles['side-nav-icon']} /> Chats
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/analytics'} className={styles['side-nav-link']}>
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
              <Link to={'/profile'} className={styles['side-nav-link']}>
                <FaRegCircleUser className={styles['side-nav-icon']} /> Profile
              </Link>
            </li>
            <li className={styles['side-nav-item']}>
              <Link to={'/settings'} className={styles['side-nav-link']}>
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
          <li className={`${styles['side-nav-item']} ${styles.dashboard}`}>
            <Link
              to={'/dashboard'}
              className={`${styles['side-nav-link']}  ${styles['dashboard-link']}`}
            >
              <MdOutlineDashboard
                className={`${styles['side-nav-icon']} ${styles['dashboard-icon']}`}
              />{' '}
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
          <li className={styles['side-nav-item']}>
            <Link to={'/calendar'} className={styles['side-nav-link']}>
              <FaCalendarAlt className={styles['side-nav-icon']} /> Calendar
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/chats'} className={styles['side-nav-link']}>
              <IoChatbubblesSharp className={styles['side-nav-icon']} /> Chats
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/analytics'} className={styles['side-nav-link']}>
              <SiSimpleanalytics className={styles['side-nav-icon']} />{' '}
              Analytics
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/profile'} className={styles['side-nav-link']}>
              <FaRegCircleUser className={styles['side-nav-icon']} /> Profile
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/settings'} className={styles['side-nav-link']}>
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

          <h1 className={styles['page']}>Dashboard</h1>

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
                ref={imgRef}
                onClick={() => setShowUserBox(true)}
              />

              <ul
                className={`${styles['user-profile-box']} ${
                  showUserBox ? styles['show-user-box'] : ''
                }`}
                ref={userBoxRef}
              >
                <li className={styles['user-profile-item']}>
                  {' '}
                  <FaRegCircleUser className={styles['user-profile-icon']} />
                  My Profile
                </li>
                <li className={styles['user-profile-item']}>
                  <HiOutlineLogout className={styles['user-profile-icon']} />
                  Log out
                </li>
              </ul>
            </figure>
          </div>
        </header>

        <section className={styles['left-section']}>
          <div className={styles['left-section-head']}>
            <div className={styles['username-box']}>
              <span className={styles.username}>Good Evening, Vincent</span>
              <span className={styles['user-text']}>
                You have got 6 tasks today
              </span>
            </div>

            <figure className={styles['task-image-box']}>
              <img
                src="../../assets/images/task.jpg"
                className={styles['task-image']}
              />
            </figure>
          </div>

          <div className={styles['article-box']}>
            <article className={styles.article}>
              <span
                className={`${styles['article-icon-box']} ${styles['border-green']}`}
              >
                <HiMiniArrowTrendingUp
                  className={`${styles['article-icon']} ${styles.green}`}
                />
              </span>

              <div className={styles['article-details']}>
                <span className={styles['article-name']}>Tasks</span>
                <span className={styles['article-size']}>200+</span>
                <span className={styles['article-increase']}>
                  <span
                    className={`${styles['article-increase-rate']} ${styles.green}`}
                  >
                    +20%{' '}
                  </span>
                  more than last month.
                </span>
              </div>
            </article>

            <article className={styles.article}>
              <span
                className={`${styles['article-icon-box']} ${styles['border-red']}`}
              >
                <ImBrightnessContrast
                  className={`${styles['article-icon']} ${styles.red}`}
                />
              </span>

              <div className={styles['article-details']}>
                <span className={styles['article-name']}>Current project</span>
                <span className={styles['article-size']}>
                  55<span className={styles['projects-size']}>/120</span>
                </span>
                <span className={styles['article-increase']}>
                  Completed over{' '}
                  <span
                    className={`${styles['article-increase-rate']} ${styles.red}`}
                  >
                    57%{' '}
                  </span>
                  tasks.
                </span>
              </div>
            </article>
          </div>

          <div className={styles['chart-box']}>
            <div className={styles['chart-head']}>
              <h2 className={styles['chart-head-text']}>Tasks done</h2>
              <ul className={styles['chart-head-list']}>
                <li className={styles['chart-head-item']}>1d</li>
                <li className={styles['chart-head-item']}>1w</li>
                <li
                  className={`${styles['chart-head-item']} ${styles['chart-head-current-item']}`}
                >
                  1m
                </li>
                <li className={styles['chart-head-item']}>6m</li>
                <li className={styles['chart-head-item']}>1y</li>
              </ul>
            </div>

            <Line
              className={styles['chart-container']}
              data={data}
              options={options}
            />
          </div>

          <div className={styles['tasks-box']}>
            <h1 className={styles['task-box-head']}>Tasks</h1>

            <ul className={styles['task-category']}>
              <li
                className={`${styles['task-category-item']} ${styles['task-current-category']}`}
              >
                Recent
              </li>
              <li className={styles['task-category-item']}>Urgent</li>
              <li className={styles['task-category-item']}>Assigned</li>
              <li className={styles['task-category-item']}>Later</li>
            </ul>

            <div className={styles['task-container']}>
              <article className={styles['task-item']}>
                <h1 className={styles['task-item-head']}>Fitness app</h1>

                <p className={styles['task-item-details']}>
                  Make a single landing page and dashboard.
                </p>

                <div className={styles['task-group-pics-box']}>
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile1.webp"
                  />
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile2webp.webp"
                  />
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile3.jpeg"
                  />
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile4.jpeg"
                  />
                </div>

                <div className={styles['task-progress-div']}>
                  <div className={styles['task-progress-box']}>
                    <span className={styles['task-progress-text']}>
                      Progress
                    </span>
                    <span className={styles['task-progress-value']}>75%</span>
                  </div>

                  <span className={styles['task-progress']}>&nbsp;</span>
                </div>
              </article>

              <article className={styles['task-item']}>
                <h1 className={styles['task-item-head']}>Fitness app</h1>

                <p className={styles['task-item-details']}>
                  Make a single landing page and dashboard.
                </p>

                <div className={styles['task-group-pics-box']}>
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile1.webp"
                  />
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile2webp.webp"
                  />
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile3.jpeg"
                  />
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile4.jpeg"
                  />
                </div>

                <div className={styles['task-progress-div']}>
                  <div className={styles['task-progress-box']}>
                    <span className={styles['task-progress-text']}>
                      Progress
                    </span>
                    <span className={styles['task-progress-value']}>75%</span>
                  </div>

                  <span className={styles['task-progress']}>&nbsp;</span>
                </div>
              </article>

              <article className={styles['task-item']}>
                <h1 className={styles['task-item-head']}>Fitness app</h1>

                <p className={styles['task-item-details']}>
                  Make a single landing page and dashboard.
                </p>

                <div className={styles['task-group-pics-box']}>
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile1.webp"
                  />
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile2webp.webp"
                  />
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile3.jpeg"
                  />
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile4.jpeg"
                  />
                </div>

                <div className={styles['task-progress-div']}>
                  <div className={styles['task-progress-box']}>
                    <span className={styles['task-progress-text']}>
                      Progress
                    </span>
                    <span className={styles['task-progress-value']}>75%</span>
                  </div>

                  <span className={styles['task-progress']}>&nbsp;</span>
                </div>
              </article>

              <article className={styles['task-item']}>
                <h1 className={styles['task-item-head']}>Fitness app</h1>

                <p className={styles['task-item-details']}>
                  Make a single landing page and dashboard.
                </p>

                <div className={styles['task-group-pics-box']}>
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile1.webp"
                  />
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile2webp.webp"
                  />
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile3.jpeg"
                  />
                  <img
                    className={styles['task-group-pic']}
                    src="../../assets/images/profile4.jpeg"
                  />
                </div>

                <div className={styles['task-progress-div']}>
                  <div className={styles['task-progress-box']}>
                    <span className={styles['task-progress-text']}>
                      Progress
                    </span>
                    <span className={styles['task-progress-value']}>75%</span>
                  </div>

                  <span className={styles['task-progress']}>&nbsp;</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className={styles['right-section']}>
          <header className={styles['right-section-header']}>
            <div className={styles['right-section-head']}>
              <span
                className={styles['right-section-text']}
                onClick={moveToCurrentDate}
              >
                Today
              </span>
              <span className={styles['right-section-date']}>
                March 9, 2023
              </span>
            </div>

            <button className={styles['add-task-button']}>
              <HiPlus className={styles['add-task-icon']} />
              Add Task
            </button>
          </header>

          <Calendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            setCurrentMonth={setCurrentMonth}
            setCurrentYear={setCurrentYear}
            calenderRef={calenderRef}
          />

          <div className={styles['scheduled-tasks-div']}>
            <article className={`${styles['scheduled-task']} `}>
              <time className={styles['scheduled-time']}>00:00</time>
              <div
                className={`${styles['scheduled-task-content']} ${styles['scheduled-task-green']}`}
              >
                <div className={styles['scheduled-task-box']}>
                  <span className={styles['scheduled-task-name']}>
                    Design Meeting
                  </span>
                  <span className={styles['scheduled-task-time-box']}>
                    <FaRegClock className={styles['scheduled-task-icon']} />
                    <span className={styles['scheduled-task-time']}>
                      2 hours
                    </span>
                  </span>
                </div>

                <div className={styles['scheduled-task-pics-box']}>
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile1.webp"
                  />
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile2webp.webp"
                  />
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile3.jpeg"
                  />
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile4.jpeg"
                  />
                </div>
              </div>
            </article>

            <article className={`${styles['scheduled-task']}`}>
              <time className={styles['scheduled-time']}>00:00</time>
              <div
                className={`${styles['scheduled-task-content']}  ${styles['scheduled-task-red']}`}
              >
                <div className={styles['scheduled-task-box']}>
                  <span className={styles['scheduled-task-name']}>
                    Design Meeting
                  </span>
                  <span className={styles['scheduled-task-time-box']}>
                    <FaRegClock className={styles['scheduled-task-icon']} />
                    <span className={styles['scheduled-task-time']}>
                      2 hours
                    </span>
                  </span>
                </div>

                <div className={styles['scheduled-task-pics-box']}>
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile1.webp"
                  />
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile2webp.webp"
                  />
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile3.jpeg"
                  />
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile4.jpeg"
                  />
                </div>
              </div>
            </article>

            <article className={`${styles['scheduled-task']} `}>
              <time className={styles['scheduled-time']}>00:00</time>
              <div
                className={`${styles['scheduled-task-content']} ${styles['scheduled-task-yellow']}`}
              >
                <div className={styles['scheduled-task-box']}>
                  <span className={styles['scheduled-task-name']}>
                    Design Meeting
                  </span>
                  <span className={styles['scheduled-task-time-box']}>
                    <FaRegClock className={styles['scheduled-task-icon']} />
                    <span className={styles['scheduled-task-time']}>
                      2 hours
                    </span>
                  </span>
                </div>

                <div className={styles['scheduled-task-pics-box']}>
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile1.webp"
                  />
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile2webp.webp"
                  />
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile3.jpeg"
                  />
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile4.jpeg"
                  />
                </div>
              </div>
            </article>

            <article className={`${styles['scheduled-task']}`}>
              <time className={styles['scheduled-time']}>00:00</time>
              <div
                className={`${styles['scheduled-task-content']}  ${styles['scheduled-task-red']}`}
              >
                <div className={styles['scheduled-task-box']}>
                  <span className={styles['scheduled-task-name']}>
                    Design Meeting
                  </span>
                  <span className={styles['scheduled-task-time-box']}>
                    <FaRegClock className={styles['scheduled-task-icon']} />
                    <span className={styles['scheduled-task-time']}>
                      2 hours
                    </span>
                  </span>
                </div>

                <div className={styles['scheduled-task-pics-box']}>
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile1.webp"
                  />
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile2webp.webp"
                  />
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile3.jpeg"
                  />
                  <img
                    className={styles['scheduled-task-pics']}
                    src="../../assets/images/profile4.jpeg"
                  />
                </div>
              </div>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
