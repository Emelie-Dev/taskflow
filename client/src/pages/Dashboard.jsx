import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { MdOutlineSegment, MdOutlineSignalWifiOff } from 'react-icons/md';
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
import NewTask from '../components/NewTask';
import { AuthContext } from '../App';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../components/Loader';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const months = [
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

let currentHour = null;

const Dashboard = () => {
  const [searchText, setSearchText] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showNav, setShowNav] = useState(false);
  const [showUserBox, setShowUserBox] = useState(false);
  const [addTask, setAddTask] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const { userData } = useContext(AuthContext);
  const [chartDetails, setChartDetails] = useState({ view: 0, option: '1m' });
  const [chartData, setChartData] = useState(null);
  const [taskCategory, setTaskCategory] = useState('recent');
  const [userTasks, setUserTasks] = useState(null);
  const [scheduledTasks, setScheduledTasks] = useState(null);
  const [scheduleDetails, setScheduleDetails] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    page: 1,
  });
  const [scheduleData, setScheduleData] = useState({
    loading: true,
    lastPage: true,
    error: false,
    pageError: false,
  });
  const searchRef = useRef();
  const calenderRef = useRef();
  const navRef = useRef();
  const taskBoxRef = useRef();
  const userBoxRef = useRef();
  const imgRef = useRef();

  // For log out box
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

  // For user stats
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const { data } = await axios.get('/api/v1/analytics?dashboard=true');
        setUserStats(data);
      } catch {
        setUserStats(false);
        return toast('An error occured while fetching user stats.', {
          toastId: 'toast-id1',
        });
      }
    };

    fetchUserStats();
  }, []);

  // For the Chart
  useEffect(() => {
    const getChartData = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/tasks/my_tasks?range=${chartDetails.option}&view=${chartDetails.view}`
        );
        setChartData(data.data.graph);
      } catch {
        setChartData(false);
        return toast('An error occured while fetching chart data.', {
          toastId: 'toast-id2',
        });
      }
    };

    getChartData();
  }, [chartDetails]);

  // For user tasks category
  useEffect(() => {
    const getUserTasks = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/tasks/my_tasks?filter=${taskCategory}&fields=name&sort=-lastModified&limit=4`
        );
        setUserTasks(data.data.tasks);
      } catch {
        setUserTasks(false);
        return toast('An error occured while fetching user tasks.', {
          toastId: 'toast-id3',
        });
      }
    };

    getUserTasks();
  }, [taskCategory]);

  // For user scheduled tasks
  useEffect(() => {
    const getScheduledTasks = async () => {
      const { year, month, day, page } = scheduleDetails;
      try {
        const { data } = await axios.get(
          `/api/v1/tasks/my_tasks?sort=deadline&fields=name,deadline,status,priority,assigned,leader,project,user&calendar=true&page=${page}&limit=10&year=${year}&month=${month}&day=${day}`
        );

        setScheduleData({
          loading: false,
          lastPage: data.data.tasks.length < 10,
          error: false,
          pageError: false,
        });

        if (page !== 1) {
          setScheduledTasks([...scheduledTasks, ...data.data.tasks]);
        } else {
          setScheduledTasks(data.data.tasks);
        }
      } catch {
        if (page !== 1) {
          setScheduleData({
            loading: false,
            lastPage: false,
            error: false,
            pageError: true,
          });
        } else {
          setScheduleData({
            loading: false,
            lastPage: true,
            error: true,
            pageError: false,
          });
        }

        return toast('An error occured while fetching scheduled tasks.', {
          toastId: 'toast-id4',
        });
      }
    };

    getScheduledTasks();
  }, [scheduleDetails]);

  const handleSearchText = (e) => {
    setSearchText(e.target.value);
  };

  const clearSearchText = () => {
    setSearchText('');
    searchRef.current.focus();
  };

  const data = {
    labels: chartData ? chartData.labels.labelsText : [],
    datasets: [
      {
        label: 'Tasks Completed',
        data: chartData ? chartData.values.completed : [],
        fill: false,
        borderColor: 'orange',
        tension: 0.5,
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

    const { year, month, day } = scheduleDetails;

    if (
      year === currentYear &&
      month === currentMonth &&
      day === new Date().getDate()
    )
      return;

    setScheduleDetails({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      page: 1,
    });
    setScheduledTasks(null);
    setScheduleData({ loading: true, lastPage: true, error: false });

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

  const timeOfTheDay = () => {
    const hour = new Date().getHours();

    if (hour <= 11) {
      return 'Good Morning,';
    } else if (hour <= 16) {
      return 'Good Afternoon,';
    } else if (hour <= 19) {
      return 'Good Evening,';
    } else {
      return 'Welcome';
    }
  };

  const updateChartOption = (e, option) => {
    if (option === chartDetails.option) return;

    setChartDetails({ view: 0, option });
    setChartData(null);
  };

  const updateTaskCategory = (e, category) => {
    if (category === taskCategory) return;

    setTaskCategory(category);
    setUserTasks(null);
  };

  const scheduledTaskMessage = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();

    const currentDate = new Date(`${year}-${month}-${day}`);

    const scheduledDate = new Date(
      `${scheduleDetails.year}-${scheduleDetails.month}-${scheduleDetails.day}`
    );

    return Date.parse(scheduledDate) === Date.parse(currentDate)
      ? 'No tasks are due today'
      : scheduledDate > currentDate
      ? 'No tasks are due on this date'
      : 'No tasks were due on this date';
  };

  const nextPage = () => {
    const { year, month, day, page } = scheduleDetails;

    if (scheduleData.pageError) {
      setScheduleDetails({
        year,
        month,
        day,
        page,
      });
    } else {
      setScheduleDetails({
        year,
        month,
        day,
        page: page + 1,
      });
    }

    setScheduleData({ loading: true, lastPage: true, error: false });
  };

  return (
    <main className={styles.div}>
      <ToastContainer autoClose={2000} />

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
              <Link to={'/notifications'} className={styles['side-nav-link']}>
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

      {addTask && <NewTask addTask={addTask} setAddTask={setAddTask} />}

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
            <Link className={styles['icon-container']} to={'/notifications'}>
              <IoIosNotifications className={styles['notification-icon']} />
            </Link>

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
              <span className={styles.username}>
                {timeOfTheDay()} {userData.username}
              </span>

              <span className={styles['user-text']}>
                {userStats
                  ? `You have got ${userStats.data.todayTasks} ${
                      userStats.data.todayTasks === 1 ? 'task' : 'tasks'
                    } today`
                  : ''}
              </span>
            </div>

            <figure className={styles['task-image-box']}>
              <img
                src="../../assets/images/task.jpg"
                className={styles['task-image']}
              />
            </figure>
          </div>

          <div
            className={`${styles['article-box']} ${
              userStats === null ? styles['loading-article-box'] : ''
            }`}
          >
            {userStats === null ? (
              <Loader
                style={{ width: '2.5rem', height: '2.5rem', marginTop: '1rem' }}
              />
            ) : userStats ? (
              <>
                {' '}
                <article className={styles.article}>
                  <span
                    className={`${styles['article-icon-box']} ${styles['border-green']}`}
                  >
                    <HiMiniArrowTrendingUp
                      className={`${styles['article-icon']} ${styles.green}`}
                    />
                  </span>

                  <div className={styles['article-details']}>
                    <span className={styles['article-name']}>
                      Tasks Created
                    </span>
                    <span className={styles['article-size']}>
                      {userStats.data.tasks > 500
                        ? '500+'
                        : userStats.data.tasks}{' '}
                    </span>
                    <span className={styles['article-increase']}>
                      <span
                        className={`${styles['article-increase-rate']} ${styles.green}`}
                      >
                        {userStats.data.dataPercent.tasks.created === 0
                          ? 0
                          : userStats.data.dataPercent.tasks.created < 0
                          ? userStats.data.dataPercent.tasks.created
                          : `+${userStats.data.dataPercent.tasks.created}`}
                        %{' '}
                      </span>
                      {userStats.data.dataPercent.tasks.created < 0
                        ? 'fewer'
                        : 'more'}{' '}
                      than last month.
                    </span>{' '}
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
                    <span className={styles['article-name']}>
                      Current Project
                    </span>
                    <span className={styles['article-size']}>
                      {userStats.data.currentProject.completedTasks}
                      <span className={styles['projects-size']}>
                        / {userStats.data.currentProject.tasks}
                      </span>
                    </span>
                    <span className={styles['article-increase']}>
                      Completed over{' '}
                      <span
                        className={`${styles['article-increase-rate']} ${styles.red}`}
                      >
                        {userStats.data.currentProject.percent}%{' '}
                      </span>
                      tasks.
                    </span>
                  </div>
                </article>
              </>
            ) : (
              <>
                {' '}
                <article className={styles.article}>
                  <span
                    className={`${styles['article-icon-box']} ${styles['border-green']}`}
                  >
                    <HiMiniArrowTrendingUp
                      className={`${styles['article-icon']} ${styles.green}`}
                    />
                  </span>

                  <div className={styles['article-details']}>
                    <span className={styles['article-name']}>
                      Tasks Created
                    </span>
                    <span className={styles['article-fail-text']}>
                      <MdOutlineSignalWifiOff
                        className={styles['network-icon']}
                      />{' '}
                      Unable to retrieve data
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
                    <span className={styles['article-name']}>
                      Current Project
                    </span>
                    <span className={styles['article-fail-text']}>
                      <MdOutlineSignalWifiOff
                        className={styles['network-icon']}
                      />{' '}
                      Unable to retrieve data
                    </span>
                  </div>
                </article>
              </>
            )}
          </div>

          <div className={styles['chart-box']}>
            <div className={styles['chart-head']}>
              <h2 className={styles['chart-head-text']}>Tasks completed</h2>
              <ul className={styles['chart-head-list']}>
                <li
                  className={`${styles['chart-head-item']} ${
                    chartDetails.option === '1d'
                      ? styles['chart-head-current-item']
                      : ''
                  }`}
                  onClick={(e) => updateChartOption(e, '1d')}
                >
                  1d
                </li>
                <li
                  className={`${styles['chart-head-item']} ${
                    chartDetails.option === '1w'
                      ? styles['chart-head-current-item']
                      : ''
                  }`}
                  onClick={(e) => updateChartOption(e, '1w')}
                >
                  1w
                </li>
                <li
                  className={`${styles['chart-head-item']} ${
                    chartDetails.option === '1m'
                      ? styles['chart-head-current-item']
                      : ''
                  }`}
                  onClick={(e) => updateChartOption(e, '1m')}
                >
                  1m
                </li>
                {/* <li className={styles['chart-head-item']}>6m</li> */}
                <li
                  className={`${styles['chart-head-item']} ${
                    chartDetails.option === '1y'
                      ? styles['chart-head-current-item']
                      : ''
                  }`}
                  onClick={(e) => updateChartOption(e, '1y')}
                >
                  1y
                </li>
              </ul>
            </div>

            {(chartDetails.option === '1m' || chartDetails.option === '1d') && (
              <div className={styles['chart-view']}>
                <span className={styles['chart-view-text']}>View:</span>
                <select
                  className={styles['chart-view-select']}
                  value={chartDetails.view}
                  onChange={(e) => {
                    setChartDetails({
                      view: e.target.value,
                      option: chartDetails.option,
                    });
                    setChartData(null);
                  }}
                >
                  <option value={0}>1st</option>
                  <option value={1}>2nd</option>
                  {chartDetails.option === '1m' && (
                    <option value={2}>3rd</option>
                  )}
                </select>
              </div>
            )}

            {chartData === null ? (
              <div className={styles['loader-div']}>
                {' '}
                <Loader
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    margin: '3rem 0',
                  }}
                />{' '}
              </div>
            ) : chartData ? (
              <Line
                className={styles['chart-container']}
                data={data}
                options={options}
              />
            ) : (
              <div className={styles['chart-error-msg']}>
                Unable to retrieve data
              </div>
            )}
          </div>

          <div className={styles['tasks-box']}>
            <h1 className={styles['task-box-head']}>Tasks</h1>

            <ul className={styles['task-category']}>
              <li
                className={`${styles['task-category-item']} ${
                  taskCategory === 'recent'
                    ? styles['task-current-category']
                    : ''
                }`}
                onClick={(e) => updateTaskCategory(e, 'recent')}
              >
                Recent
              </li>
              <li
                className={`${styles['task-category-item']} ${
                  taskCategory === 'urgent'
                    ? styles['task-current-category']
                    : ''
                }`}
                onClick={(e) => updateTaskCategory(e, 'urgent')}
              >
                Urgent
              </li>
              <li
                className={`${styles['task-category-item']} ${
                  taskCategory === 'assigned'
                    ? styles['task-current-category']
                    : ''
                }`}
                onClick={(e) => updateTaskCategory(e, 'assigned')}
              >
                Assigned
              </li>
              <li
                className={`${styles['task-category-item']} ${
                  taskCategory === 'later'
                    ? styles['task-current-category']
                    : ''
                }`}
                onClick={(e) => updateTaskCategory(e, 'later')}
              >
                Later
              </li>
            </ul>

            <div
              className={`${styles['task-container']} ${
                !userTasks || userTasks.length === 0
                  ? styles['loading-tasks']
                  : ''
              }`}
              ref={taskBoxRef}
            >
              {userTasks === null ? (
                <div className={styles['tasks-loader-div']}>
                  <Loader
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      margin: '3rem 0',
                    }}
                  />
                </div>
              ) : userTasks.length === 0 ? (
                <div className={styles['user-tasks-text']}>
                  No task available
                </div>
              ) : userTasks ? (
                userTasks.map((task) => {
                  return (
                    <article key={task._id} className={styles['task-item']}>
                      <h1 className={styles['task-item-head']}>
                        <a href="#">{task.project.name}</a>
                      </h1>
                      <p className={styles['task-item-details']}>{task.name}</p>

                      {taskCategory !== 'assigned' && (
                        <div
                          className={`${styles['task-group-pics-box']} ${
                            task.project.team.length === 0
                              ? styles['no-team-box']
                              : ''
                          }`}
                        >
                          {task.project.team.length === 0 ? (
                            <i>No team members</i>
                          ) : task.project.team.length > 5 ? (
                            <>
                              {' '}
                              {task.project.team.slice(0, 4).map((member) => (
                                <img
                                  key={member._id}
                                  className={styles['task-group-pic']}
                                  src={`../../assets/images/users/${member.photo}`}
                                />
                              ))}
                              <span className={styles['team-icon-box']}>
                                <span className={styles['plus-sign']}>+</span>
                                {task.project.team.length - 4}
                              </span>
                            </>
                          ) : (
                            task.project.team.map((member) => (
                              <span
                                key={member._id}
                                className={styles['task-tooltip-box']}
                              >
                                <a href="#">
                                  <img
                                    key={member._id}
                                    className={styles['task-group-pic']}
                                    src={`../../assets/images/users/${member.photo}`}
                                  />
                                </a>
                                <span
                                  className={`${styles['task-tooltip-text']} ${styles['tooltip2']}`}
                                >
                                  {generateName(
                                    member.firstName,
                                    member.lastName,
                                    member.username
                                  )}
                                </span>
                              </span>
                            ))
                          )}
                        </div>
                      )}

                      {taskCategory === 'assigned' && (
                        <div className={styles['task-item-assigned-box']}>
                          <span className={styles['task-item-assigned-text']}>
                            Project Leader:
                          </span>
                          <span className={styles['task-tooltip-box']}>
                            <a href="#">
                              <img
                                className={styles['task-item-assigned-img']}
                                src={`../../assets/images/users/${task.leader.photo}`}
                              />
                            </a>
                            <span className={styles['task-tooltip-text']}>
                              {generateName(
                                task.leader.firstName,
                                task.leader.lastName,
                                task.leader.username
                              )}
                            </span>
                          </span>
                        </div>
                      )}

                      <div className={styles['task-progress-div']}>
                        <div className={styles['task-progress-box']}>
                          <span className={styles['task-progress-text']}>
                            Progress
                          </span>
                          <span className={styles['task-progress-value']}>
                            {task.project.details.projectProgress}%
                          </span>
                        </div>

                        <span className={styles['task-progress']}>
                          <span
                            className={styles['task-progress-bar']}
                            style={{
                              width: `${task.project.details.projectProgress}%`,
                            }}
                          >
                            &nbsp;
                          </span>
                        </span>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className={styles['user-tasks-text']}>
                  Unable to retrieve data
                </div>
              )}
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
                {months[new Date().getMonth()]} {new Date().getDate()},{' '}
                {new Date().getFullYear()}
              </span>
            </div>

            <button
              className={styles['add-task-button']}
              onClick={() => setAddTask(true)}
            >
              <HiPlus className={styles['add-task-icon']} />
              Add Task
            </button>
          </header>

          <Calendar
            ref={calenderRef}
            currentMonth={currentMonth}
            currentYear={currentYear}
            setCurrentMonth={setCurrentMonth}
            setCurrentYear={setCurrentYear}
            setScheduledTasks={setScheduledTasks}
            scheduleDetails={scheduleDetails}
            setScheduleDetails={setScheduleDetails}
            setScheduleData={setScheduleData}
          />

          <div
            className={`${styles['scheduled-tasks-div']} ${
              scheduleData.lastPage ? styles['add-padding'] : ''
            }`}
          >
            {scheduledTasks === null ? (
              ''
            ) : scheduledTasks.length === 0 ? (
              <div className={styles['scheduled-tasks-text']}>
                {scheduledTaskMessage()}
              </div>
            ) : scheduledTasks ? (
              scheduledTasks.map((task, index) => {
                const hour = new Date(task.deadline).getHours();
                let showTime = false;
                if (currentHour !== hour) {
                  currentHour = hour;
                  showTime = true;
                }

                if (index === scheduledTasks.length - 1) currentHour = null;

                return (
                  <article
                    key={task._id}
                    className={`${styles['scheduled-task']} `}
                  >
                    <time
                      className={`${styles['scheduled-time']} ${
                        !showTime ? styles['hide-time'] : ''
                      }`}
                    >
                      {String(hour).length === 1 ? `0${String(hour)}` : hour}:00
                    </time>
                    <div
                      className={`${styles['scheduled-task-content']} ${
                        styles[`scheduled-task-${task.priority}`]
                      }`}
                    >
                      <div className={styles['scheduled-task-box']}>
                        <span className={styles['scheduled-task-name']}>
                          {task.name}
                        </span>

                        <span className={styles['scheduled-task-property-box']}>
                          <span
                            className={styles['scheduled-task-property-name']}
                          >
                            Project:
                          </span>
                          <a
                            href="#"
                            className={styles['scheduled-task-project-name']}
                          >
                            {task.project.name}
                          </a>
                        </span>

                        <span className={styles['scheduled-task-property-box']}>
                          <span
                            className={styles['scheduled-task-property-name']}
                          >
                            Status:
                          </span>
                          <span>{task.status}</span>
                        </span>
                      </div>

                      <div className={styles['scheduled-task-pics-box']}>
                        {task.assigned ? (
                          <span className={styles['task-tooltip-box']}>
                            <a href="#">
                              <img
                                className={styles['scheduled-task-pics']}
                                src={`../../assets/images/users/${task.leader.photo}`}
                              />
                            </a>
                            <span className={styles['task-tooltip-text']}>
                              {generateName(
                                task.leader.firstName,
                                task.leader.lastName,
                                task.leader.username
                              )}
                            </span>
                          </span>
                        ) : (
                          <span className={styles['task-tooltip-box']}>
                            <a href="#">
                              <img
                                className={styles['scheduled-task-pics']}
                                src={`../../assets/images/users/${task.user.photo}`}
                              />
                            </a>
                            <span className={styles['task-tooltip-text']}>
                              {generateName(
                                task.user.firstName,
                                task.user.lastName,
                                task.user.username
                              )}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              ''
            )}

            {scheduleData.error === true && (
              <div className={styles['scheduled-tasks-text']}>
                Unable to retrieve data
              </div>
            )}

            {scheduleData.loading && (
              <div className={styles['tasks-loader-div']}>
                <Loader
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    margin: '3rem 0',
                  }}
                />
              </div>
            )}

            {!scheduleData.lastPage && (
              <div className={styles['more-btn-box']}>
                <button className={styles['more-task-btn']} onClick={nextPage}>
                  Show More
                </button>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

export const generateName = (firstName, lastName, username) => {
  if (!firstName && !lastName) {
    return `@${username}`;
  } else {
    firstName = firstName || '';
    lastName = lastName || '';

    return `${firstName} ${lastName}`;
  }
};

export default Dashboard;
