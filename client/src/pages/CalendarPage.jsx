import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import styles from '../styles/CalendarPage.module.css';
import { SiKashflow, SiSimpleanalytics } from 'react-icons/si';
import { Link } from 'react-router-dom';

import { IoChatbubblesSharp, IoSettingsOutline } from 'react-icons/io5';
import { IoIosSearch, IoMdClose, IoIosNotifications } from 'react-icons/io';

import { MdOutlineDashboard, MdOutlineSegment } from 'react-icons/md';
import { FaTasks, FaCalendarAlt, FaSearch, FaCircle } from 'react-icons/fa';
import { GoProjectTemplate } from 'react-icons/go';
import { GrStatusGood } from 'react-icons/gr';
import BigCalendar from '../components/BigCalendar';
import { FaRegCircleUser } from 'react-icons/fa6';
import colorNames from 'css-color-names';
import axios from 'axios';
import Loader from '../components/Loader';
import { AuthContext } from '../App';

const CalendarPage = () => {
  const { userData } = useContext(AuthContext);
  const [searchText, setSearchText] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState({ status: true, error: false });
  const [tasksData, setTasksData] = useState(null);

  const searchRef = useRef();
  const navRef = useRef();
  const calenderRef = useRef();

  const priorityColors = userData.personalization.priorityColors;

  const priorityColorsName = useMemo(() => {
    const colors = { ...priorityColors };

    const values = Object.values(colorNames);
    const keys = Object.keys(colorNames);

    for (const prop in priorityColors) {
      if (values.indexOf(priorityColors[prop]) !== -1) {
        colors[prop] = keys[values.indexOf(priorityColors[prop])];
      }
    }

    return colors;
  }, []);

  useEffect(() => {
    const getCalendarDetails = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/tasks/calendar?year=${currentYear}&month=${currentMonth}`
        );

        setLoading({ status: false, error: false });
        console.log(data.data.tasksData);
        setTasksData(data.data.tasksData);
      } catch (err) {
        setLoading({ status: false, error: true });
        setTasksData(null);

        if (!err.response.data) {
          return toast('An error occured while fetching calendar details.', {
            toastId: 'toast-id1',
          });
        }

        return toast(err.response.data.message, {
          toastId: 'toast-id1',
        });
      }
    };

    getCalendarDetails();
  }, [currentYear, currentMonth]);

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

  const moveToToday = () => {
    setCurrentMonth(new Date().getMonth() + 1);
    setCurrentYear(new Date().getFullYear());

    setLoading({ status: true, error: false });

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
                  <button
                    className={`${styles['alt-today-btn']} ${
                      enableTodayBtn() ? styles['disabled-btn'] : ''
                    }`}
                    onClick={moveToToday}
                  >
                    Today
                  </button>
                </h1>
                <p className={styles['calendar-text']}>
                  This displays task deadlines with color-coded priorities:{' '}
                  {priorityColorsName.high} for{' '}
                  <span
                    style={{
                      color: priorityColors.high,
                    }}
                  >
                    high
                  </span>
                  , {priorityColorsName.medium} for{' '}
                  <span
                    style={{
                      color: priorityColors.medium,
                    }}
                  >
                    medium
                  </span>
                  , and {priorityColorsName.low} for{' '}
                  <span
                    style={{
                      color: priorityColors.low,
                    }}
                  >
                    low
                  </span>
                  .
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

            {loading.status ? (
              <div className={styles['loading-box']}>
                {' '}
                <Loader
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                  }}
                />
              </div>
            ) : (
              <BigCalendar
                currentMonth={currentMonth}
                currentYear={currentYear}
                setCurrentMonth={setCurrentMonth}
                setCurrentYear={setCurrentYear}
                calenderRef={calenderRef}
                tasksData={tasksData}
                setLoading={setLoading}
                priorityColors={priorityColors}
              />
            )}
          </section>

          <section className={styles['tasks-section']}>
            <h1 className={styles['task-section-head']}>Tasks</h1>

            <div className={styles['task-container']}>
              <article className={styles.article}>
                <div className={styles['task-time']}>12:00</div>
                <div className={styles['task-box']}>
                  <div className={styles['task-item']}>
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboards
                    </span>
                    <div className={styles['task-details']}>
                      <span className={styles['task-priority-box']}>
                        Priority:
                        <span className={styles['task-priority-value']}>
                          High
                        </span>
                      </span>
                      <span className={styles['task-status-box']}>
                        Status:{' '}
                        <span className={styles['task-status-value']}>
                          <GrStatusGood
                            className={styles['task-status-icon']}
                          />
                          Completed
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className={styles['task-item']}>
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <div className={styles['task-details']}>
                      <span className={styles['task-priority-box']}>
                        Priority:
                        <span className={styles['task-priority-value']}>
                          High
                        </span>
                      </span>
                      <span className={styles['task-status-box']}>
                        Status:{' '}
                        <span className={styles['task-status-value']}>
                          <GrStatusGood
                            className={styles['task-status-icon']}
                          />
                          Completed
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
              <article className={styles.article}>
                <div className={styles['task-time']}>12:00</div>
                <div className={styles['task-box']}>
                  <div className={styles['task-item']}>
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <div className={styles['task-details']}>
                      <span className={styles['task-priority-box']}>
                        Priority:
                        <span className={styles['task-priority-value']}>
                          High
                        </span>
                      </span>
                      <span className={styles['task-status-box']}>
                        Status:{' '}
                        <span className={styles['task-status-value']}>
                          <GrStatusGood
                            className={styles['task-status-icon']}
                          />
                          Completed
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className={styles['task-item']}>
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <div className={styles['task-details']}>
                      <span className={styles['task-priority-box']}>
                        Priority:
                        <span className={styles['task-priority-value']}>
                          High
                        </span>
                      </span>
                      <span className={styles['task-status-box']}>
                        Status:{' '}
                        <span className={styles['task-status-value']}>
                          <GrStatusGood
                            className={styles['task-status-icon']}
                          />
                          Completed
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
              <article className={styles.article}>
                <div className={styles['task-time']}>12:00</div>
                <div className={styles['task-box']}>
                  <div className={styles['task-item']}>
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <div className={styles['task-details']}>
                      <span className={styles['task-priority-box']}>
                        Priority:
                        <span className={styles['task-priority-value']}>
                          High
                        </span>
                      </span>
                      <span className={styles['task-status-box']}>
                        Status:{' '}
                        <span className={styles['task-status-value']}>
                          <GrStatusGood
                            className={styles['task-status-icon']}
                          />
                          Completed
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className={styles['task-item']}>
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <div className={styles['task-details']}>
                      <span className={styles['task-priority-box']}>
                        Priority:
                        <span className={styles['task-priority-value']}>
                          High
                        </span>
                      </span>
                      <span className={styles['task-status-box']}>
                        Status:{' '}
                        <span className={styles['task-status-value']}>
                          <GrStatusGood
                            className={styles['task-status-icon']}
                          />
                          Completed
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
              <article className={styles.article}>
                <div className={styles['task-time']}>12:00</div>
                <div className={styles['task-box']}>
                  <div className={styles['task-item']}>
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <div className={styles['task-details']}>
                      <span className={styles['task-priority-box']}>
                        Priority:
                        <span className={styles['task-priority-value']}>
                          High
                        </span>
                      </span>
                      <span className={styles['task-status-box']}>
                        Status:{' '}
                        <span className={styles['task-status-value']}>
                          <GrStatusGood
                            className={styles['task-status-icon']}
                          />
                          Completed
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className={styles['task-item']}>
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <div className={styles['task-details']}>
                      <span className={styles['task-priority-box']}>
                        Priority:
                        <span className={styles['task-priority-value']}>
                          High
                        </span>
                      </span>
                      <span className={styles['task-status-box']}>
                        Status:{' '}
                        <span className={styles['task-status-value']}>
                          <GrStatusGood
                            className={styles['task-status-icon']}
                          />
                          Completed
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
              <article className={styles.article}>
                <div className={styles['task-time']}>12:00</div>
                <div className={styles['task-box']}>
                  <div className={styles['task-item']}>
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <div className={styles['task-details']}>
                      <span className={styles['task-priority-box']}>
                        Priority:
                        <span className={styles['task-priority-value']}>
                          High
                        </span>
                      </span>
                      <span className={styles['task-status-box']}>
                        Status:{' '}
                        <span className={styles['task-status-value']}>
                          <GrStatusGood
                            className={styles['task-status-icon']}
                          />
                          Completed
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className={styles['task-item']}>
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <div className={styles['task-details']}>
                      <span className={styles['task-priority-box']}>
                        Priority:
                        <span className={styles['task-priority-value']}>
                          High
                        </span>
                      </span>
                      <span className={styles['task-status-box']}>
                        Status:{' '}
                        <span className={styles['task-status-value']}>
                          <GrStatusGood
                            className={styles['task-status-icon']}
                          />
                          Completed
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
};

export default CalendarPage;
