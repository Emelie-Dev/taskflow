import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Analytics.module.css';
import { SiKashflow, SiSimpleanalytics } from 'react-icons/si';
import { Link } from 'react-router-dom';

import { IoChatbubblesSharp, IoSettingsOutline } from 'react-icons/io5';
import { IoIosSearch, IoMdClose, IoIosNotifications } from 'react-icons/io';

import { MdOutlineDashboard, MdOutlineSegment } from 'react-icons/md';
import { FaTasks, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { GoProjectTemplate } from 'react-icons/go';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { AiOutlineRise } from 'react-icons/ai';
import { GoDotFill } from 'react-icons/go';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [searchText, setSearchText] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const searchRef = useRef();
  const navRef = useRef();

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

  const lineData = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: '',
        data: [50, 37, 73, 29, 58, 23, 65, 78, 67, 12, 23, 54],
        backgroundColor: 'rgba(255,165,0,1)',
        borderColor: 'rgba(255, 165, 0, 1)',
        borderWidth: 1,
        barThickness: 15,
        borderRadius: 5,
      },
    ],
  };

  const lineOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  const areaData = {
    labels: ['January', 'February', 'March'],
    datasets: [
      {
        label: '',
        data: [15, 39, 30],
        fill: 'rgba(255, 165, 0, 1)',
        backgroundColor: 'orange',
        borderColor: 'orange',
        borderWidth: 3,
        pointRadius: 3,
        tension: 0.4,
      },
    ],
  };

  const areaOptions = {
    scales: {
      beginAtZero: false,
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
  };

  const pieData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'Tasks Category',
        data: [34, 56, 27], // Data values for each segment
        backgroundColor: [
          // Background colors for each segment
          'red',
          'orange',
          'green',
        ],
        hoverOffset: 4,
      },
    ],
  };

  const pieOptions = {
    cutout: '50%', // Adjust the size of the hole in the center of the doughnut
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const selectHandler = (e) => {
    const value = `${e.target.value}`;

    value === 'date' ? setShowDate(true) : setShowDate(false);
  };

  const addPadding = () => {
    return showDate && matchMedia('(max-width: 1250px)').matches;
  };

  return (
    <main className={styles.main}>
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
            <li className={`${styles['side-nav-item']}  ${styles.analytics}`}>
              <Link
                to={'/analytics'}
                className={`${styles['side-nav-link']} ${styles['analytics-link']}`}
              >
                <SiSimpleanalytics
                  className={`${styles['side-nav-icon']}  ${styles['analytics-icon']} `}
                />{' '}
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
          <li className={styles['side-nav-item']}>
            <Link to={'/calendar'} className={styles['side-nav-link']}>
              <FaCalendarAlt className={styles['side-nav-icon']} /> Calendar
            </Link>
          </li>
          <li className={styles['side-nav-item']}>
            <Link to={'/projects'} className={styles['side-nav-link']}>
              <IoChatbubblesSharp className={styles['side-nav-icon']} /> Chats
            </Link>
          </li>
          <li className={`${styles['side-nav-item']}  ${styles.analytics}`}>
            <Link
              to={'/analytics'}
              className={`${styles['side-nav-link']} ${styles['analytics-link']}`}
            >
              <SiSimpleanalytics
                className={`${styles['side-nav-icon']} ${styles['analytics-icon']}`}
              />{' '}
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

          <h1 className={styles['page']}>Analytics</h1>

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
          <section className={styles['top-section']}>
            <div className={styles['category-div']}>
              <article className={styles['category']}>
                <div className={styles['category-details']}>
                  <h1 className={styles['category-head']}>Total Projects</h1>
                  <div className={styles['category-number']}>50</div>
                  <span className={styles['category-text']}>
                    <span className={styles['category-rate']}>+30%&nbsp;</span>
                    over the last month
                  </span>
                </div>
                <span className={styles['rate-icon-box']}>
                  <AiOutlineRise className={styles['rate-icon']} />
                </span>
              </article>
              <article className={styles['category']}>
                <div className={styles['category-details']}>
                  <h1 className={styles['category-head']}>Total Tasks</h1>
                  <div className={styles['category-number']}>122</div>
                  <span className={styles['category-text']}>
                    <span className={styles['category-rate']}>+30%&nbsp;</span>
                    over the last month
                  </span>
                </div>
                <span className={styles['rate-icon-box']}>
                  <AiOutlineRise className={styles['rate-icon']} />
                </span>
              </article>
              <article className={styles['category']}>
                <div className={styles['category-details']}>
                  <h1 className={styles['category-head']}>
                    Completed Projects
                  </h1>
                  <div className={styles['category-number']}>27</div>
                  <span className={styles['category-text']}>
                    <span className={styles['category-rate2']}>-10%&nbsp;</span>
                    over the last month
                  </span>
                </div>
                <span className={styles['rate-icon-box']}>
                  <AiOutlineRise className={styles['rate-icon-inverse']} />
                </span>
              </article>
              <article className={styles['category']}>
                <div className={styles['category-details']}>
                  <h1 className={styles['category-head']}>Completed Tasks</h1>
                  <div className={styles['category-number']}>64</div>
                  <span className={styles['category-text']}>
                    <span className={styles['category-rate2']}>-5%&nbsp;</span>
                    over the last month
                  </span>
                </div>
                <span className={styles['rate-icon-box']}>
                  <AiOutlineRise className={styles['rate-icon-inverse']} />
                </span>
              </article>
            </div>

            <div className={styles['project-graph-box']}>
              <div className={styles['graph-head-box']}>
                <span className={styles['graph-head']}>Projects Done</span>
                <select
                  className={styles['graph-select']}
                  onChange={selectHandler}
                >
                  <option value={'year'}>Last Year</option>
                  <option value={'month'}>Last Month</option>
                  <option value={'week'}>Last Week</option>
                  <option value={'date'}>Select Date</option>
                </select>
                <div
                  className={`${styles['view-project-div']} ${
                    showDate === false ? styles['hide-date-input'] : ''
                  }`}
                >
                  <input
                    className={styles['view-project-input']}
                    type="month"
                  />
                  <button className={styles['view-project-btn']}>View</button>
                </div>
              </div>

              <Bar
                className={`${styles['project-graph']} ${
                  addPadding() ? styles['add-padding'] : ''
                }`}
                data={lineData}
                options={lineOptions}
              />
            </div>
          </section>

          <section className={styles['bottom-section']}>
            <div className={styles['tasks-area-box']}>
              <div className={styles['graph-head-box']}>
                <span className={styles['graph-head']}>Tasks Done</span>
                <select className={styles['graph-select']}>
                  <option value={'year'}>Last Year</option>
                  <option value={'month'}>Last Month</option>
                  <option value={'week'}>Last Week</option>
                  <option value={'yesterday'}>Last 24hrs</option>
                </select>
              </div>
              <Line
                className={styles['tasks-area-graph']}
                data={areaData}
                options={areaOptions}
              />
            </div>

            <div className={styles['pie-chart-container']}>
              <div className={styles['graph-head-box']}>
                <span className={styles['graph-head']}>Tasks by Status</span>
                <select className={styles['graph-select']}>
                  <option value={'year'}>Last Year</option>
                  <option value={'month'}>Last Month</option>
                  <option value={'week'}>Last Week</option>
                  <option value={'yesterday'}>Last 24hrs</option>
                </select>
              </div>

              <div className={styles['pie-chart-div']}>
                <ul className={styles['task-category-list']}>
                  <li className={styles['task-category-item']}>
                    <GoDotFill className={styles['task-icon1']} />
                    <div className={styles['task-item-details']}>
                      <span className={styles['task-item-type']}>
                        Open (30%)
                      </span>
                      <span className={styles['task-item-number']}>
                        34 tasks
                      </span>
                    </div>
                  </li>

                  <li className={styles['task-category-item']}>
                    <GoDotFill className={styles['task-icon2']} />
                    <div className={styles['task-item-details']}>
                      <span className={styles['task-item-type']}>
                        {' '}
                        In Progress (47%)
                      </span>
                      <span className={styles['task-item-number']}>
                        56 tasks
                      </span>
                    </div>
                  </li>

                  <li className={styles['task-category-item']}>
                    <GoDotFill className={styles['task-icon3']} />
                    <div className={styles['task-item-details']}>
                      <span className={styles['task-item-type']}>
                        Completed (23%)
                      </span>
                      <span className={styles['task-item-number']}>
                        27 tasks
                      </span>
                    </div>
                  </li>
                </ul>
                <div className={styles['pie-chart-box']}>
                  <Doughnut data={pieData} options={pieOptions} />
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
};

export default Analytics;
