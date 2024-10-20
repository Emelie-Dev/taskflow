import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import styles from '../styles/CalendarPage.module.css';
import { MdOutlineSignalWifiOff } from 'react-icons/md';
import BigCalendar from '../components/BigCalendar';
import colorNames from 'css-color-names';
import Loader from '../components/Loader';
import { apiClient, AuthContext } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import { generateName } from './Dashboard';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import { getProfilePhoto } from '../components/Header';
import { FaArrowUp } from 'react-icons/fa6';
import useDebounce from '../hooks/useDebounce';

const CalendarPage = () => {
  const { userData, serverUrl, mode, calendarNotified, setCalendarNotified } =
    useContext(AuthContext);
  const [showNav, setShowNav] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState({ status: true, error: false });
  const [tasksData, setTasksData] = useState(null);
  const [requestData, setRequestData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    page: 1,
  });
  const [tasks, setTasks] = useState(null);
  const [tasksDetails, setTasksDetails] = useState({
    loading: true,
    lastPage: true,
    error: false,
    pageError: false,
  });
  const [showScroll, setShowScroll] = useState(false);

  const calenderRef = useRef();
  const bodyRef = useRef();
  const containerRef = useRef();

  const priorityColors = (() => {
    const lightInitialValues = {
      high: '#ff0000',
      medium: '#ffa500',
      low: '#008000',
    };

    const darkInitialValues = {
      high: '#ffb6c1',
      medium: '#ffa500',
      low: '#7cfc00',
    };

    const values = mode === 'dark' ? darkInitialValues : lightInitialValues;

    let num = 0;

    for (const prop in userData.personalization.priorityColors) {
      if (
        userData.personalization.priorityColors[prop] ===
        lightInitialValues[prop]
      )
        num++;
    }

    if (num === 3) {
      return values;
    } else {
      return userData.personalization.priorityColors;
    }
  })();

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
  }, [mode]);

  useEffect(() => {
    const notifyUser = () => {
      if (!calendarNotified) {
        toast(
          'If you select a date, scroll down to view tasks scheduled for that date.',
          {
            autoClose: 5000,
            toastId: 'custom-id',
            theme: mode,
          }
        );
        setCalendarNotified(true);
      }
    };
    notifyUser();

    const scrollHandler = (e) => {
      if (e.target.scrollTop >= containerRef.current.offsetHeight + 10) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    const debouncedScrollHandler = useDebounce(scrollHandler, 200);

    if (bodyRef.current)
      bodyRef.current.addEventListener('scroll', debouncedScrollHandler);

    return () => {
      if (bodyRef.current)
        bodyRef.current.removeEventListener('scroll', debouncedScrollHandler);
    };
  }, []);

  useEffect(() => {
    const getCalendarDetails = async () => {
      try {
        const { data } = await apiClient(
          `/api/v1/tasks/calendar?year=${currentYear}&month=${currentMonth}`
        );

        setLoading({ status: false, error: false });
        setTasksData(data.data.tasksData);
      } catch (err) {
        setLoading({ status: false, error: true });
        setTasksData(null);

        if (
          !err.response ||
          !err.response.data ||
          err.response.status === 500
        ) {
          return toast('An error occured while fetching calendar details.', {
            toastId: 'toast-id1',
            theme: mode,
          });
        }

        return toast(err.response.data.message, {
          toastId: 'toast-id1',
          theme: mode,
        });
      }
    };

    getCalendarDetails();
  }, [currentYear, currentMonth]);

  useEffect(() => {
    const getTasks = async () => {
      const { year, month, day, page } = requestData;

      try {
        const { data } = await apiClient(
          `/api/v1/tasks/my_tasks?sort=deadline&calendar=big&page=${page}&year=${year}&month=${month}&day=${day}`
        );

        setTasksDetails({
          loading: false,
          lastPage: data.data.tasks.length < 30,
          error: false,
          pageError: false,
        });

        if (page === 1) {
          setTasks(data.data.tasks);
        } else {
          const categories = [...data.data.tasks];

          const oldTasks = [...tasks];

          categories.forEach((category) => {
            const index = oldTasks.findIndex(
              (task) => task.hour === category.hour
            );

            if (index === -1) {
              setTasks([...tasks, category]);
            } else {
              oldTasks[index].tasks = [
                ...oldTasks[index].tasks,
                ...category.tasks,
              ];

              setTasks(oldTasks);
            }
          });
        }
      } catch (err) {
        if (page === 1) {
          setTasksDetails({
            loading: false,
            lastPage: true,
            error: true,
            pageError: false,
          });
        } else {
          setTasksDetails({
            loading: false,
            lastPage: false,
            error: false,
            pageError: true,
          });
        }

        return toast('An error occured while fetching tasks.', {
          toastId: 'toast-id1',
          theme: mode,
        });
      }
    };

    getTasks();
  }, [requestData]);

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

  const nextPage = () => {
    if (tasksDetails.pageError) {
      setRequestData({
        ...requestData,
        page: requestData.page,
      });
    } else {
      setRequestData({
        ...requestData,
        page: requestData.page + 1,
      });
    }

    setTasksDetails({
      loading: true,
      lastPage: true,
      error: false,
      pageError: false,
    });
  };

  const scheduledTaskMessage = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();

    const currentDate = new Date(`${year}-${month}-${day}`);

    const scheduledDate = new Date(
      `${requestData.year}-${requestData.month}-${requestData.day}`
    );

    return Date.parse(scheduledDate) === Date.parse(currentDate)
      ? 'No tasks are due today'
      : scheduledDate > currentDate
      ? 'No tasks are due on this date'
      : 'No tasks were due on this date';
  };

  return (
    <main className={styles.div}>
      <ToastContainer autoClose={2000} />

      <NavBar page={'Calendar'} showNav={showNav} setShowNav={setShowNav} />

      <section className={styles.section}>
        <Header page={'Calendar'} setShowNav={setShowNav} toast={toast} />

        <section className={styles['section-content']} ref={bodyRef}>
          {showScroll && (
            <span
              className={styles['down-arrow-box']}
              title="Scroll Up"
              onClick={() => containerRef.current.scrollIntoView()}
            >
              <FaArrowUp className={styles['down-arrow']} />
            </span>
          )}

          <section className={styles['calendar-section']} ref={containerRef}>
            <div className={styles['calendar-section-head']}>
              <div className={styles['calendar-details']}>
                <h1
                  className={`${styles['current-month']} ${
                    mode === 'dark' ? styles['dark-text'] : ''
                  }`}
                >
                  {month[currentMonth - 1]} {currentYear}
                  <button
                    className={`${styles['alt-today-btn']} ${
                      enableTodayBtn() ? styles['disabled-btn'] : ''
                    } ${mode === 'dark' ? styles['dark-today-btn'] : ''}`}
                    onClick={moveToToday}
                  >
                    Today
                  </button>
                </h1>
                <p
                  className={`${styles['calendar-text']} ${
                    mode === 'dark' ? styles['dark-word'] : ''
                  }`}
                >
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
                  } ${mode === 'dark' ? styles['dark-today-btn'] : ''}`}
                  onClick={moveToToday}
                >
                  Today
                </button>
              </div>
            </div>

            {loading.status && (
              <div className={styles['loading-box']}>
                {' '}
                <Loader
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                  }}
                />
              </div>
            )}

            <BigCalendar
              currentMonth={currentMonth}
              currentYear={currentYear}
              setCurrentMonth={setCurrentMonth}
              setCurrentYear={setCurrentYear}
              calenderRef={calenderRef}
              tasksData={tasksData}
              loading={loading}
              setLoading={setLoading}
              priorityColors={priorityColors}
              requestData={requestData}
              setRequestData={setRequestData}
              setTasksDetails={setTasksDetails}
              setTasks={setTasks}
            />
          </section>
          <section className={styles['tasks-section']}>
            <h1
              className={`${styles['task-section-head']} ${
                mode === 'dark' ? styles['dark-text'] : ''
              }`}
            >
              Tasks
            </h1>

            <div className={styles['task-container']}>
              {tasks === null ? (
                ''
              ) : tasks.length === 0 ? (
                <div
                  className={`${styles['scheduled-tasks-text']} ${
                    mode === 'dark' ? styles['dark-word'] : ''
                  }`}
                >
                  {scheduledTaskMessage()}
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.hour} className={styles['hour-category']}>
                    <time
                      className={`${styles['scheduled-time']} ${
                        mode === 'dark' ? styles['dark-word'] : ''
                      }`}
                    >
                      {task.hour}:00
                    </time>

                    <div className={styles['article-box']}>
                      {task.tasks.map((elem) => (
                        <article
                          key={elem._id}
                          className={`${styles['scheduled-task']} `}
                        >
                          <div
                            className={`${styles['scheduled-task-content']} ${
                              mode === 'dark' ? styles['dark-article'] : ''
                            }`}
                            style={{
                              borderTop: `0.185rem solid ${
                                priorityColors[elem.priority]
                              }`,
                            }}
                          >
                            <div className={styles['scheduled-task-box']}>
                              <span
                                className={`${styles['scheduled-task-name']} ${
                                  mode === 'dark' ? styles['dark-text'] : ''
                                }`}
                              >
                                {elem.name}
                              </span>

                              <span
                                className={
                                  styles['scheduled-task-property-box']
                                }
                              >
                                <span
                                  className={`${
                                    styles['scheduled-task-property-name']
                                  } ${
                                    mode === 'dark' ? styles['dark-word'] : ''
                                  }`}
                                >
                                  Project:
                                </span>
                                <a
                                  href={`/project/${elem.project._id}`}
                                  className={`${
                                    styles['scheduled-task-project-name']
                                  } ${
                                    mode === 'dark' ? styles['dark-text'] : ''
                                  }`}
                                >
                                  {elem.project.name}
                                </a>
                              </span>

                              <span
                                className={
                                  styles['scheduled-task-property-box']
                                }
                              >
                                <span
                                  className={`${
                                    styles['scheduled-task-property-name']
                                  } ${
                                    mode === 'dark' ? styles['dark-word'] : ''
                                  }`}
                                >
                                  Status:
                                </span>
                                <span
                                  className={`${
                                    mode === 'dark' ? styles['dark-text'] : ''
                                  }`}
                                >
                                  {' '}
                                  {elem.status === 'open'
                                    ? 'Open'
                                    : task.status === 'progress'
                                    ? 'In progress'
                                    : 'Completed'}
                                </span>
                              </span>
                            </div>

                            <div className={styles['scheduled-task-pics-box']}>
                              {elem.assigned ? (
                                <span className={styles['task-tooltip-box']}>
                                  <a href={`/user/${elem.leader.username}`}>
                                    <img
                                      className={`${
                                        styles['scheduled-task-pics']
                                      } ${
                                        elem.leader.photo === 'default.jpeg'
                                          ? styles['default-pic']
                                          : ''
                                      }`}
                                      src={getProfilePhoto(
                                        elem.leader,
                                        serverUrl
                                      )}
                                    />
                                  </a>
                                  <span className={styles['task-tooltip-text']}>
                                    {generateName(
                                      elem.leader.firstName,
                                      elem.leader.lastName,
                                      elem.leader.username
                                    )}
                                  </span>
                                </span>
                              ) : (
                                <span className={styles['task-tooltip-box']}>
                                  <img
                                    className={`${
                                      styles['scheduled-task-pics']
                                    } ${styles['scheduled-task-pics2']} ${
                                      elem.user.photo === 'default.jpeg'
                                        ? styles['default-pic']
                                        : ''
                                    }`}
                                    src={getProfilePhoto(elem.user, serverUrl)}
                                  />
                                </span>
                              )}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))
              )}

              {tasksDetails.loading && (
                <div className={styles['loading-tasks-box']}>
                  {' '}
                  <Loader
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                    }}
                  />
                </div>
              )}

              {!tasksDetails.lastPage && (
                <div className={styles['show-more-box']}>
                  <button
                    className={styles['show-more-btn']}
                    onClick={nextPage}
                  >
                    Show More
                  </button>
                </div>
              )}

              {tasksDetails.error && (
                <div
                  className={`${styles['no-projects-text']} ${
                    mode === 'dark' ? styles['dark-word'] : ''
                  }`}
                >
                  <MdOutlineSignalWifiOff className={styles['network-icon']} />{' '}
                  Unable to retrieve data
                </div>
              )}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
};

export default CalendarPage;
