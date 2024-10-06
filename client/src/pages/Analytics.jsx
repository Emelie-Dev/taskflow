import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Analytics.module.css';

import { MdOutlineSignalWifiOff } from 'react-icons/md';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { AiOutlineRise } from 'react-icons/ai';
import { GoDotFill } from 'react-icons/go';
import useDebounce from '../hooks/useDebounce';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../components/Loader';
import { apiClient } from '../App';

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
  plugins,
} from 'chart.js';
import Header from '../components/Header';
import NavBar from '../components/NavBar';

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

// Continue from view and show button

const Analytics = () => {
  const [showNav, setShowNav] = useState(false);
  const [projectOption, setProjectOption] = useState({
    value: '',
    view: false,
  });
  const [taskOption, setTaskOption] = useState({
    value: '',
    view: false,
  });
  const [statusOption, setStatusOption] = useState('');

  const [graphWidth, setGraphWidth] = useState(0);
  const [displayGraph, setDisplayGraph] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [pieRequestData, setPieRequestData] = useState({ range: '1y' });
  const [pieInputData, setPieInputData] = useState({ type: null, value: '' });
  const [isPieInputValid, setIsPieInputValid] = useState(false);

  const [barChartData, setBarChartData] = useState(null);
  const [barRequestData, setBarRequestData] = useState({
    range: '1y',
    view: 0,
  });
  const [barInputData, setBarInputData] = useState({ type: null, value: '' });
  const [isBarInputValid, setIsBarInputValid] = useState(false);

  const [lineChartData, setLineChartData] = useState(null);
  const [lineRequestData, setLineRequestData] = useState({
    range: '1y',
    view: 0,
  });
  const [lineInputData, setLineInputData] = useState({ type: null, value: '' });
  const [isLineInputValid, setIsLineInputValid] = useState(false);

  const mainNavRef = useRef();
  const projectViewRef = useRef();
  const taskViewRef = useRef();

  useEffect(() => {
    const resizeHandler = () => {
      const wideScreen = window.matchMedia('(min-width: 1100px)');

      const mediumScreen = window.matchMedia('(min-width: 700px)');

      const deviceWidth = window.innerWidth;

      let width;

      setDisplayGraph(false);

      if (wideScreen.matches) {
        const navWidth = mainNavRef.current.offsetWidth;
        width = deviceWidth * (510 / 121) + navWidth * (-2450 / 121);
      } else if (mediumScreen.matches) {
        width = deviceWidth * (400 / 399) + -3520 / 57;
      } else {
        width = 650;
      }

      setGraphWidth(width);

      setTimeout(() => setDisplayGraph(true), 0);
    };

    resizeHandler();

    const debouncedResizeHandler = useDebounce(resizeHandler, 200);

    window.addEventListener('resize', debouncedResizeHandler);

    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
    };
  }, []);

  // For user stats
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const { data } = await apiClient.get('/api/v1/analytics');

        setUserStats(data.data);
      } catch {
        setUserStats(false);
        return toast('An error occured while fetching user stats.', {
          toastId: 'toast-id1',
        });
      }
    };

    fetchUserStats();
  }, []);

  // For the pie chart
  useEffect(() => {
    const getPieData = async () => {
      const { year, month, range } = pieRequestData;

      try {
        let request;

        if (range) {
          request = await apiClient(
            `/api/v1/analytics?tasks=true&range=${range}`
          );
        } else {
          request = await apiClient(
            `/api/v1/analytics?tasks=true&year=${year}&month=${month}`
          );
        }

        setPieChartData(request.data.data.tasksStats);
      } catch {
        setPieChartData(false);
        return toast('An error occured while fetching pie chart data.', {
          toastId: 'toast-id2',
        });
      }
    };

    getPieData();
  }, [pieRequestData]);

  useEffect(() => {
    if (pieInputData.type === 'year') {
      const year = parseInt(pieInputData.value);

      if (!year || year < 1 || String(year).match(/\D/)) {
        setIsPieInputValid(false);
      } else {
        setIsPieInputValid(true);
      }
    } else if (pieInputData.type === 'month') {
      const month = String(pieInputData.value).split('-');

      if (month.length !== 2) {
        setIsPieInputValid(false);
      } else {
        setIsPieInputValid(true);

        const [year, month, day] = String(pieInputData.value).split('-');

        setPieChartData(null);
        setPieRequestData({
          year: parseInt(year),
          month: month ? parseInt(month) : 0,
        });
      }
    }
  }, [pieInputData]);

  // For the bar chart
  useEffect(() => {
    const getBarData = async () => {
      const { year, month, range, day, view } = barRequestData;

      try {
        let request;

        if (range) {
          request = await apiClient(
            `/api/v1/projects/my_projects?range=${range}&view=${view}`
          );
        } else {
          request = await apiClient(
            `/api/v1/projects/my_projects?year=${year}&month=${month}&day=${day}&view=${view}`
          );
        }

        setBarChartData(request.data.data.graph);
      } catch {
        setBarChartData(false);
        return toast('An error occured while fetching bar chart data.', {
          toastId: 'toast-id3',
        });
      }
    };

    getBarData();
  }, [barRequestData]);

  useEffect(() => {
    if (barInputData.type === 'year') {
      const year = parseInt(barInputData.value);

      if (!year || year < 1 || String(year).match(/\D/)) {
        setIsBarInputValid(false);
      } else {
        setIsBarInputValid(true);
      }
    } else if (barInputData.type === 'month') {
      const month = String(barInputData.value).split('-');

      if (month.length !== 2) {
        setIsBarInputValid(false);
      } else {
        setIsBarInputValid(true);

        const [year, month, day] = String(barInputData.value).split('-');

        setBarChartData(null);
        setBarRequestData({
          year: parseInt(year),
          month: month ? parseInt(month) : 0,
          day: day ? parseInt(day) : 0,
          view: 0,
        });

        if (projectViewRef.current) projectViewRef.current.value = 0;
      }
    } else if (barInputData.type === 'date') {
      const date = String(barInputData.value).split('-');

      if (date.length !== 3) {
        setIsBarInputValid(false);
      } else {
        setIsBarInputValid(true);

        const [year, month, day] = String(barInputData.value).split('-');

        setBarChartData(null);
        setBarRequestData({
          year: parseInt(year),
          month: month ? parseInt(month) : 0,
          day: day ? parseInt(day) : 0,
          view: 0,
        });

        if (projectViewRef.current) projectViewRef.current.value = 0;
      }
    }
  }, [barInputData]);

  // For the line chart
  useEffect(() => {
    const getLineData = async () => {
      const { year, month, range, day, view } = lineRequestData;

      try {
        let request;

        if (range) {
          request = await apiClient(
            `/api/v1/tasks/my_tasks?range=${range}&view=${view}`
          );
        } else {
          request = await apiClient(
            `/api/v1/tasks/my_tasks?year=${year}&month=${month}&day=${day}&view=${view}`
          );
        }

        setLineChartData(request.data.data.graph);
      } catch {
        setLineChartData(false);
        return toast('An error occured while fetching line chart data.', {
          toastId: 'toast-id4',
        });
      }
    };

    getLineData();
  }, [lineRequestData]);

  useEffect(() => {
    if (lineInputData.type === 'year') {
      const year = parseInt(lineInputData.value);

      if (!year || year < 1 || String(year).match(/\D/)) {
        setIsLineInputValid(false);
      } else {
        setIsLineInputValid(true);
      }
    } else if (lineInputData.type === 'month') {
      const month = String(lineInputData.value).split('-');

      if (month.length !== 2) {
        setIsLineInputValid(false);
      } else {
        setIsLineInputValid(true);

        const [year, month, day] = String(lineInputData.value).split('-');

        setLineChartData(null);
        setLineRequestData({
          year: parseInt(year),
          month: month ? parseInt(month) : 0,
          day: day ? parseInt(day) : 0,
          view: 0,
        });

        if (taskViewRef.current) taskViewRef.current.value = 0;
      }
    } else if (lineInputData.type === 'date') {
      const date = String(lineInputData.value).split('-');

      if (date.length !== 3) {
        setIsLineInputValid(false);
      } else {
        setIsLineInputValid(true);

        const [year, month, day] = String(lineInputData.value).split('-');

        setLineChartData(null);
        setLineRequestData({
          year: parseInt(year),
          month: month ? parseInt(month) : 0,
          day: day ? parseInt(day) : 0,
          view: 0,
        });

        if (taskViewRef.current) taskViewRef.current.value = 0;
      }
    }
  }, [lineInputData]);

  const handleChartOptions = (type) => (e) => {
    const value = `${e.target.value}`;
    if (type === 'project') {
      if (value === 'year') {
        setProjectOption({
          value: 'year',
          view: false,
        });
        setBarInputData({ type: 'year', value: '' });
      } else if (value === 'month') {
        setProjectOption({
          value: 'month',
          view: true,
          all: true,
        });
        setBarInputData({ type: 'month', value: '' });
      } else if (value === 'date') {
        setProjectOption({
          value: 'date',
          view: true,
        });
        setBarInputData({ type: 'date', value: '' });
      } else {
        setIsBarInputValid(true);
        if (value === '1d') {
          setProjectOption({
            value: null,
            view: true,
          });
        } else if (value === '1m') {
          setProjectOption({
            value: null,
            view: true,
            all: true,
          });
        } else {
          setProjectOption({
            value: '',
            view: false,
          });
        }

        setBarChartData(null);
        setBarRequestData({ range: value, view: 0 });
      }

      if (projectViewRef.current) projectViewRef.current.value = 0;
    } else if (type === 'task') {
      if (value === 'year') {
        setTaskOption({
          value: 'year',
          view: false,
        });
        setLineInputData({ type: 'year', value: '' });
      } else if (value === 'month') {
        setTaskOption({
          value: 'month',
          view: true,
          all: true,
        });
        setLineInputData({ type: 'month', value: '' });
      } else if (value === 'date') {
        setTaskOption({
          value: 'date',
          view: true,
        });
        setLineInputData({ type: 'date', value: '' });
      } else {
        setIsLineInputValid(true);
        if (value === '1d') {
          setTaskOption({
            value: null,
            view: true,
          });
        } else if (value === '1m') {
          setTaskOption({
            value: null,
            view: true,
            all: true,
          });
        } else {
          setTaskOption({
            value: '',
            view: false,
          });
        }

        setLineChartData(null);
        setLineRequestData({ range: value, view: 0 });
      }

      if (taskViewRef.current) taskViewRef.current.value = 0;
    } else {
      if (value === 'year') {
        setStatusOption('year');
        setPieInputData({ type: 'year', value: '' });
      } else if (value === 'month') {
        setStatusOption('month');
        setPieInputData({ type: 'month', value: '' });
      } else {
        setStatusOption('');

        setPieChartData(null);
        setPieRequestData({ range: value });
      }
    }
  };

  const changeChartView = (type) => (e) => {
    const view = parseInt(e.target.value);
    if (type === 'project') {
      setBarChartData(null);
      setBarRequestData({ ...barRequestData, view });
    } else if (type === 'task') {
      setLineChartData(null);
      setLineRequestData({ ...lineRequestData, view });
    }
  };

  const loadChart = (type) => () => {
    if (type === 'project') {
      if (isBarInputValid) {
        const year = parseInt(barInputData.value);

        if (
          !barRequestData.month &&
          !barRequestData.day &&
          year === barRequestData.year
        )
          return;

        setBarChartData(null);
        setBarRequestData({
          year,
          month: 0,
          day: 0,
          view: 0,
        });
      }
    } else if (type === 'task') {
      if (isLineInputValid) {
        const year = parseInt(lineInputData.value);

        if (
          !lineRequestData.month &&
          !lineRequestData.day &&
          year === lineRequestData.year
        )
          return;

        setLineChartData(null);
        setLineRequestData({
          year,
          month: 0,
          day: 0,
          view: 0,
        });
      }
    } else {
      if (isPieInputValid) {
        const year = parseInt(pieInputData.value);

        if (!pieRequestData.month && year === pieRequestData.year) return;

        setPieChartData(null);
        setPieRequestData({
          year,
          month: 0,
        });
      }
    }
  };

  const lineData = {
    labels: barChartData ? barChartData.labels.labelsText : [],
    datasets: [
      {
        label: 'Created',
        data: barChartData ? barChartData.values.created : [],
        backgroundColor: 'rgba(255,165,0,1)',
        borderColor: 'rgba(255, 165, 0, 1)',
        borderWidth: 1,
        barThickness: 15,
        borderRadius: 5,
      },
      {
        label: 'Completed',
        data: barChartData ? barChartData.values.completed : [],
        backgroundColor: 'red',
        borderColor: 'rgba(255, 165, 0, 1)',
        borderWidth: 1,
        barThickness: 15,
        borderRadius: 5,
      },
    ],
  };

  const lineOptions = {
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
    responsive: false,
  };

  const areaData = {
    labels: lineChartData ? lineChartData.labels.labelsText : [],
    datasets: [
      {
        label: 'Created',
        data: lineChartData ? lineChartData.values.created : [],
        fill: 'rgba(255, 165, 0, 1)',
        backgroundColor: 'orange',
        borderColor: 'orange',
        borderWidth: 3,
        pointRadius: 3,
        tension: 0.4,
      },
      {
        label: 'Completed',
        data: lineChartData ? lineChartData.values.completed : [],
        fill: 'red',
        backgroundColor: 'red',
        borderColor: 'red',
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
    responsive: false,
  };

  const pieData = {
    labels: ['Open', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Tasks Category',
        data: pieChartData
          ? [pieChartData.open, pieChartData.progress, pieChartData.completed]
          : [], // Data values for each segment
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

  return (
    <main className={styles.main}>
      <ToastContainer autoClose={2000} />

      <NavBar
        ref={mainNavRef}
        page={'Analytics'}
        showNav={showNav}
        setShowNav={setShowNav}
      />

      <section className={styles.section}>
        <Header page={'Analytics'} setShowNav={setShowNav} />

        <section className={styles['section-content']}>
          <section className={styles['top-section']}>
            {userStats === null ? (
              <div className={styles['loader-box']}>
                <Loader
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                  }}
                />
              </div>
            ) : userStats ? (
              <div className={styles['category-div']}>
                <article className={styles['category']}>
                  <div className={styles['category-details']}>
                    <h1 className={styles['category-head']}>Total Projects</h1>
                    <div className={styles['category-number']}>
                      {userStats.projects}
                    </div>
                    <span className={styles['category-text']}>
                      <span
                        className={
                          userStats.dataPercent.projects.created >= 0
                            ? styles['category-rate']
                            : styles['category-rate2']
                        }
                      >
                        {userStats.projects === 0
                          ? ''
                          : userStats.dataPercent.projects.created === 0
                          ? '0% '
                          : userStats.dataPercent.projects.created < 0
                          ? `${String(
                              userStats.dataPercent.projects.created
                            ).replace('-', '')}% `
                          : `${userStats.dataPercent.projects.created}% `}
                      </span>
                      {userStats.projects === 0
                        ? ''
                        : userStats.dataPercent.projects.created < 0
                        ? 'fewer than last month'
                        : 'more than last month'}
                    </span>
                  </div>

                  {userStats.projects !== 0 && (
                    <span className={styles['rate-icon-box']}>
                      <AiOutlineRise
                        className={
                          userStats.dataPercent.projects.created >= 0
                            ? styles['rate-icon']
                            : styles['rate-icon-inverse']
                        }
                      />
                    </span>
                  )}
                </article>

                <article className={styles['category']}>
                  <div className={styles['category-details']}>
                    <h1 className={styles['category-head']}>Total Tasks</h1>
                    <div className={styles['category-number']}>
                      {userStats.tasks}
                    </div>
                    <span className={styles['category-text']}>
                      <span
                        className={
                          userStats.dataPercent.tasks.created >= 0
                            ? styles['category-rate']
                            : styles['category-rate2']
                        }
                      >
                        {userStats.tasks === 0
                          ? ''
                          : userStats.dataPercent.tasks.created === 0
                          ? '0% '
                          : userStats.dataPercent.tasks.created < 0
                          ? `${String(
                              userStats.dataPercent.tasks.created
                            ).replace('-', '')}% `
                          : `${userStats.dataPercent.tasks.created}% `}
                      </span>
                      {userStats.tasks === 0
                        ? ''
                        : userStats.dataPercent.tasks.created < 0
                        ? 'fewer than last month'
                        : 'more than last month'}
                    </span>
                  </div>

                  {userStats.tasks !== 0 && (
                    <span className={styles['rate-icon-box']}>
                      <AiOutlineRise
                        className={
                          userStats.dataPercent.tasks.created >= 0
                            ? styles['rate-icon']
                            : styles['rate-icon-inverse']
                        }
                      />
                    </span>
                  )}
                </article>

                <article className={styles['category']}>
                  <div className={styles['category-details']}>
                    <h1 className={styles['category-head']}>
                      Completed Projects
                    </h1>
                    <div className={styles['category-number']}>
                      {userStats.completedProjects}
                    </div>
                    <span className={styles['category-text']}>
                      <span
                        className={
                          userStats.dataPercent.projects.completed >= 0
                            ? styles['category-rate']
                            : styles['category-rate2']
                        }
                      >
                        {userStats.completedProjects === 0
                          ? ''
                          : userStats.dataPercent.projects.completed === 0
                          ? '0% '
                          : userStats.dataPercent.projects.completed < 0
                          ? `${String(
                              userStats.dataPercent.projects.completed
                            ).replace('-', '')}% `
                          : `${userStats.dataPercent.projects.completed}% `}
                      </span>
                      {userStats.completedProjects === 0
                        ? ''
                        : userStats.dataPercent.projects.completed < 0
                        ? 'fewer than last month'
                        : 'more than last month'}
                    </span>
                  </div>
                  {userStats.completedProjects !== 0 && (
                    <span className={styles['rate-icon-box']}>
                      <AiOutlineRise
                        className={
                          userStats.dataPercent.projects.completed >= 0
                            ? styles['rate-icon']
                            : styles['rate-icon-inverse']
                        }
                      />
                    </span>
                  )}
                </article>

                <article className={styles['category']}>
                  <div className={styles['category-details']}>
                    <h1 className={styles['category-head']}>Completed Tasks</h1>
                    <div className={styles['category-number']}>
                      {userStats.completedTasks}
                    </div>
                    <span className={styles['category-text']}>
                      <span
                        className={
                          userStats.dataPercent.tasks.completed >= 0
                            ? styles['category-rate']
                            : styles['category-rate2']
                        }
                      >
                        {userStats.completedTasks === 0
                          ? ''
                          : userStats.dataPercent.tasks.completed === 0
                          ? '0% '
                          : userStats.dataPercent.tasks.completed < 0
                          ? `${String(
                              userStats.dataPercent.tasks.completed
                            ).replace('-', '')}% `
                          : `${userStats.dataPercent.tasks.completed}% `}
                      </span>
                      {userStats.completedTasks === 0
                        ? ''
                        : userStats.dataPercent.tasks.completed < 0
                        ? 'fewer than last month'
                        : 'more than last month'}
                    </span>
                  </div>

                  {userStats.completedTasks !== 0 && (
                    <span className={styles['rate-icon-box']}>
                      <AiOutlineRise
                        className={
                          userStats.dataPercent.tasks.completed >= 0
                            ? styles['rate-icon']
                            : styles['rate-icon-inverse']
                        }
                      />
                    </span>
                  )}
                </article>
              </div>
            ) : (
              <div className={styles['category-div']}>
                <article className={styles['category']}>
                  <div className={styles['category-details']}>
                    <h1 className={styles['category-head']}>Total Projects</h1>

                    <span className={styles['article-fail-text']}>
                      <MdOutlineSignalWifiOff
                        className={styles['network-icon']}
                      />{' '}
                      Unable to retrieve data
                    </span>
                  </div>
                </article>

                <article className={styles['category']}>
                  <div className={styles['category-details']}>
                    <h1 className={styles['category-head']}>Total Tasks</h1>

                    <span className={styles['article-fail-text']}>
                      <MdOutlineSignalWifiOff
                        className={styles['network-icon']}
                      />{' '}
                      Unable to retrieve data
                    </span>
                  </div>
                </article>

                <article className={styles['category']}>
                  <div className={styles['category-details']}>
                    <h1 className={styles['category-head']}>
                      Completed Projects
                    </h1>

                    <span className={styles['article-fail-text']}>
                      <MdOutlineSignalWifiOff
                        className={styles['network-icon']}
                      />{' '}
                      Unable to retrieve data
                    </span>
                  </div>
                </article>

                <article className={styles['category']}>
                  <div className={styles['category-details']}>
                    <h1 className={styles['category-head']}>Completed Tasks</h1>

                    <span className={styles['article-fail-text']}>
                      <MdOutlineSignalWifiOff
                        className={styles['network-icon']}
                      />{' '}
                      Unable to retrieve data
                    </span>
                  </div>
                </article>
              </div>
            )}

            <div className={styles['pie-chart-container']}>
              <div className={styles['graph-head-box']}>
                <span className={styles['graph-head']}>Tasks by Status</span>
                <div
                  className={`${styles['graph-head-container']} ${
                    window.matchMedia('(min-width: 900px)').matches
                      ? styles['task-head-container']
                      : ''
                  }`}
                >
                  <select
                    className={styles['graph-select']}
                    onChange={handleChartOptions()}
                  >
                    <option value={'1y'}>1y</option>
                    <option value={'1m'}>1m</option>
                    <option value={'1w'}>1w</option>
                    <option value={'1d'}>1d</option>
                    <option value={'year'}>Select Year</option>
                    <option value={'month'}>Select Month</option>
                  </select>

                  {statusOption !== '' && (
                    <div
                      className={`${styles['input-container']} ${
                        window.matchMedia('(min-width: 900px)').matches
                          ? styles['task-input-container']
                          : ''
                      }`}
                    >
                      <input
                        type={`${
                          statusOption === 'year' ? 'number' : statusOption
                        }`}
                        className={`${styles['request-input']} ${
                          statusOption === 'year' ? styles['year-input'] : ''
                        }`}
                        value={pieInputData.value}
                        onChange={(e) => {
                          setPieInputData({
                            ...pieInputData,
                            value: e.target.value,
                          });
                        }}
                      />

                      {statusOption === 'year' && (
                        <button
                          className={`${styles['load-chart']} ${
                            !isPieInputValid ? styles['disable-chart-load'] : ''
                          }`}
                          onClick={loadChart()}
                        >
                          Show Chart
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`${styles['pie-chart-div']} ${
                  pieChartData === false ? styles['pie-error'] : ''
                }`}
              >
                <ul
                  className={`${styles['task-category-list']} ${
                    !pieChartData ? styles['hide-pie-chart'] : ''
                  }`}
                >
                  <li className={styles['task-category-item']}>
                    <GoDotFill className={styles['task-icon1']} />
                    <div className={styles['task-item-details']}>
                      <span className={styles['task-item-type']}>
                        Open ({pieChartData ? pieChartData.openPercent : ''}%)
                      </span>
                      <span className={styles['task-item-number']}>
                        {pieChartData
                          ? pieChartData.open === 1
                            ? '1 task'
                            : `${pieChartData.open} tasks`
                          : ''}
                      </span>
                    </div>
                  </li>

                  <li className={styles['task-category-item']}>
                    <GoDotFill className={styles['task-icon2']} />
                    <div className={styles['task-item-details']}>
                      <span className={styles['task-item-type']}>
                        {' '}
                        In Progress (
                        {pieChartData ? pieChartData.progressPercent : ''}%)
                      </span>
                      <span className={styles['task-item-number']}>
                        {pieChartData
                          ? pieChartData.progress === 1
                            ? '1 task'
                            : `${pieChartData.progress} tasks`
                          : ''}
                      </span>
                    </div>
                  </li>

                  <li className={styles['task-category-item']}>
                    <GoDotFill className={styles['task-icon3']} />
                    <div className={styles['task-item-details']}>
                      <span className={styles['task-item-type']}>
                        Completed (
                        {pieChartData ? pieChartData.completedPercent : ''}%)
                      </span>
                      <span className={styles['task-item-number']}>
                        {pieChartData
                          ? pieChartData.completed === 1
                            ? '1 task'
                            : `${pieChartData.completed} tasks`
                          : ''}
                      </span>
                    </div>
                  </li>
                </ul>

                {pieChartData === null ? (
                  <div className={styles['pie-loader-box']}>
                    <Loader
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                      }}
                    />
                  </div>
                ) : !pieChartData ? (
                  <div className={styles['pie-fail-text']}>
                    <MdOutlineSignalWifiOff
                      className={styles['network-icon']}
                    />{' '}
                    Unable to retrieve data
                  </div>
                ) : (
                  ''
                )}

                <div
                  className={`${styles['pie-chart-box']} ${
                    !pieChartData ? styles['hide-pie-chart'] : ''
                  }`}
                >
                  <Doughnut data={pieData} options={pieOptions} />
                </div>
              </div>
            </div>
          </section>

          <section className={styles['bottom-section']}>
            <div className={styles['project-graph-box']}>
              <div className={styles['graph-head-box']}>
                <span className={styles['graph-head']}>Projects</span>

                <div className={styles['graph-head-container']}>
                  <select
                    className={styles['graph-select']}
                    onChange={handleChartOptions('project')}
                  >
                    <option value={'1y'}>1y</option>
                    <option value={'1m'}>1m</option>
                    <option value={'1w'}>1w</option>
                    <option value={'1d'}>1d</option>
                    <option value={'year'}>Select Year</option>
                    <option value={'month'}>Select Month</option>
                    <option value={'date'}>Select Date</option>
                  </select>

                  {projectOption.value !== '' && (
                    <div className={styles['input-container']}>
                      {projectOption.value !== null && (
                        <input
                          type={`${
                            projectOption.value === 'year'
                              ? 'number'
                              : projectOption.value
                          }`}
                          className={`${styles['request-input']} ${
                            projectOption.value === 'year'
                              ? styles['year-input']
                              : ''
                          }`}
                          value={barInputData.value}
                          onChange={(e) => {
                            setBarInputData({
                              ...barInputData,
                              value: e.target.value,
                            });
                          }}
                        />
                      )}

                      {projectOption.view && (
                        <div className={styles['view-box']}>
                          <span className={styles['view-text']}>View:</span>
                          <select
                            className={`${styles['graph-select']} ${
                              !isBarInputValid
                                ? styles['disable-chart-load']
                                : ''
                            }`}
                            ref={projectViewRef}
                            onChange={changeChartView('project')}
                          >
                            <option value={0}>1st</option>
                            <option value={1}>2nd</option>

                            {projectOption.all && (
                              <option value={2}>3rd</option>
                            )}
                          </select>
                        </div>
                      )}

                      {projectOption.value === 'year' && (
                        <button
                          className={`${styles['load-chart']} ${
                            !isBarInputValid ? styles['disable-chart-load'] : ''
                          }`}
                          onClick={loadChart('project')}
                        >
                          Show Chart
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {barChartData === null ? (
                <div className={styles['chart-loader-box']}>
                  <Loader
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                    }}
                  />
                </div>
              ) : barChartData ? (
                <div className={styles['project-graph-div']}>
                  <div className={styles['project-graph-container']}>
                    {displayGraph && (
                      <Bar
                        data={lineData}
                        options={lineOptions}
                        width={graphWidth}
                        height={350}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className={styles['chart-fail-text']}>
                  <MdOutlineSignalWifiOff
                    className={`${styles['network-icon']} ${styles['chart-network-icon']}`}
                  />{' '}
                  Unable to retrieve data
                </div>
              )}
            </div>

            <div className={styles['tasks-area-box']}>
              <div className={styles['graph-head-box']}>
                <span className={styles['graph-head']}>Tasks</span>

                <div className={styles['graph-head-container']}>
                  <select
                    className={styles['graph-select']}
                    onChange={handleChartOptions('task')}
                  >
                    <option value={'1y'}>1y</option>
                    <option value={'1m'}>1m</option>
                    <option value={'1w'}>1w</option>
                    <option value={'1d'}>1d</option>
                    <option value={'year'}>Select Year</option>
                    <option value={'month'}>Select Month</option>
                    <option value={'date'}>Select Date</option>
                  </select>

                  {taskOption.value !== '' && (
                    <div className={styles['input-container']}>
                      {taskOption.value !== null && (
                        <input
                          type={`${
                            taskOption.value === 'year'
                              ? 'number'
                              : taskOption.value
                          }`}
                          className={`${styles['request-input']} ${
                            taskOption.value === 'year'
                              ? styles['year-input']
                              : ''
                          }`}
                          value={lineInputData.value}
                          onChange={(e) => {
                            setLineInputData({
                              ...lineInputData,
                              value: e.target.value,
                            });
                          }}
                        />
                      )}

                      {taskOption.view && (
                        <div className={styles['view-box']}>
                          <span className={styles['view-text']}>View:</span>
                          <select
                            className={`${styles['graph-select']} ${
                              !isLineInputValid
                                ? styles['disable-chart-load']
                                : ''
                            }`}
                            ref={taskViewRef}
                            onChange={changeChartView('task')}
                          >
                            <option value={0}>1st</option>
                            <option value={1}>2nd</option>

                            {taskOption.all && <option value={2}>3rd</option>}
                          </select>
                        </div>
                      )}

                      {taskOption.value === 'year' && (
                        <button
                          className={`${styles['load-chart']} ${
                            !isLineInputValid
                              ? styles['disable-chart-load']
                              : ''
                          }`}
                          onClick={loadChart('task')}
                        >
                          Show Chart
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {lineChartData === null ? (
                <div className={styles['chart-loader-box']}>
                  <Loader
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                    }}
                  />
                </div>
              ) : lineChartData ? (
                <div className={styles['task-area-div']}>
                  <div className={styles['task-area-container']}>
                    {displayGraph && (
                      <Line
                        className={styles['tasks-area-graph']}
                        data={areaData}
                        options={areaOptions}
                        width={graphWidth}
                        height={350}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className={styles['chart-fail-text']}>
                  <MdOutlineSignalWifiOff
                    className={`${styles['network-icon']} ${styles['chart-network-icon']}`}
                  />{' '}
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

export default Analytics;
