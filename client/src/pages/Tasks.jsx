import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from '../styles/Tasks.module.css';
import { SiKashflow, SiSimpleanalytics } from 'react-icons/si';
import { Link } from 'react-router-dom';

import { IoChatbubblesSharp, IoSettingsOutline } from 'react-icons/io5';
import { IoIosSearch, IoMdClose, IoIosNotifications } from 'react-icons/io';

import {
  MdOutlineDashboard,
  MdOutlineSegment,
  MdKeyboardDoubleArrowDown,
  MdOutlineSignalWifiOff,
} from 'react-icons/md';
import { FaTasks, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { GoProjectTemplate } from 'react-icons/go';
import { BsThreeDotsVertical } from 'react-icons/bs';
import TaskBox from '../components/TaskBox';
import TaskBox2 from '../components/TaskBox2';
import { HiPlus } from 'react-icons/hi';
import { FaRegCircleUser } from 'react-icons/fa6';
import NewTask from '../components/NewTask';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../components/Loader';
import { AuthContext } from '../App';
import { generateName } from './Dashboard';

const Tasks = () => {
  // Enable show more projects feature(include responsive)
  const { userData } = useContext(AuthContext);
  const [searchText, setSearchText] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [taskType, setTaskType] = useState('personal');
  const [addTask, setAddTask] = useState(false);
  const [personalProjects, setPersonalProjects] = useState(null);
  const [personalProjectsDetails, setPersonalProjectsDetails] = useState({
    loading: true,
    lastPage: true,
    error: false,
  });
  const [assignedProjects, setAssignedProjects] = useState(null);
  const [assignedProjectsDetails, setAssignedProjectsDetails] = useState({
    loading: true,
    lastPage: true,
    error: false,
  });
  const [projectsPage, setProjectsPage] = useState({
    personal: { current: true, value: 1 },
    assigned: { current: true, value: 1 },
  });
  const [currentProject, setCurrentProject] = useState({
    tasks: null,
  });
  const [currentProjectData, setCurrentProjectData] = useState({
    id: null,
    page: 1,
    index: null,
  });
  const [currentProjectDetails, setCurrentProjectDetails] = useState({
    loading: true,
    lastPage: true,
    error: false,
  });
  const searchRef = useRef();
  const navRef = useRef();

  // For personal tasks
  useEffect(() => {
    const getPersonalProjects = async () => {
      if (projectsPage.personal.current) {
        const page = projectsPage.personal.value;

        try {
          const { data } = await axios.get(
            `/api/v1/projects/my_projects?page=${page}`
          );

          setPersonalProjectsDetails({
            loading: false,
            lastPage: data.data.projects.length < 30,
            error: false,
          });

          if (page !== 1) {
            setPersonalProjects([...personalProjects, ...data.data.projects]);
          } else {
            setPersonalProjects(data.data.projects);

            if (data.data.projects.length !== 0) {
              setCurrentProjectData({
                id: data.data.projects[0]._id,
                page: 1,
                index: 0,
              });
            } else {
              setCurrentProjectData({ id: false });
            }
          }
        } catch {
          if (page !== 1) {
            setPersonalProjectsDetails({
              loading: false,
              lastPage: false,
              error: true,
            });
          } else {
            setPersonalProjectsDetails({
              loading: false,
              lastPage: true,
              error: true,
            });

            setCurrentProjectDetails({
              loading: false,
              lastPage: true,
              error: true,
            });
          }

          return toast('An error occured while fetching personal projects.', {
            toastId: 'toast-id1',
          });
        }
      }
    };

    getPersonalProjects();
  }, [projectsPage]);

  // For assigned tasks
  useEffect(() => {
    const getAssignedProjects = async () => {
      if (projectsPage.assigned.current) {
        const page = projectsPage.assigned.value;

        try {
          const { data } = await axios.get(
            `/api/v1/projects/assigned?page=${page}`
          );

          setAssignedProjectsDetails({
            loading: false,
            lastPage: data.data.assignedProjects.length < 30,
            error: false,
          });

          if (page !== 1) {
            setAssignedProjects([
              ...assignedProjects,
              ...data.data.assignedProjects,
            ]);
          } else {
            setAssignedProjects(data.data.assignedProjects);
          }
        } catch {
          if (page !== 1) {
            setAssignedProjectsDetails({
              loading: false,
              lastPage: false,
              error: true,
            });
          } else {
            setAssignedProjectsDetails({
              loading: false,
              lastPage: true,
              error: true,
            });
          }

          return toast('An error occured while fetching assigned projects.', {
            toastId: 'toast-id2',
          });
        }
      }
    };

    getAssignedProjects();
  }, [projectsPage]);

  useEffect(() => {
    const getProjectTasks = async () => {
      const { id, page } = currentProjectData;

      if (id === false) {
        return setCurrentProject({ tasks: false });
      } else if (id) {
        try {
          const { data } = await axios.get(
            `/api/v1/projects/${id}/tasks${
              taskType === 'assigned' ? '/assigned' : ''
            }?page=${page}`
          );

          setCurrentProjectDetails({
            loading: false,
            lastPage: data.data.tasks.length < 30,
            error: false,
          });

          if (page !== 1) {
            setCurrentProject({
              tasks: [...currentProject.tasks, ...data.data.tasks],
            });
          } else {
            setCurrentProject({ tasks: data.data.tasks });
          }

          console.log(data.data.tasks);
        } catch {
          if (page !== 1) {
            setCurrentProjectDetails({
              loading: false,
              lastPage: false,
              error: true,
            });
          } else {
            setCurrentProjectDetails({
              loading: false,
              lastPage: true,
              error: true,
            });
          }

          return toast('An error occured while fetching tasks.', {
            toastId: 'toast-id3',
          });
        }
      }
    };

    getProjectTasks();
  }, [currentProjectData]);

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

  const handleProjects = () => {
    setShowProjects(!showProjects);
  };

  const changeProject = (type, id, page, index) => {
    if (id === currentProjectData.id) return;

    if (type === 'personal') {
      setTaskType('personal');
    } else {
      setTaskType('assigned');
    }

    setCurrentProject({
      tasks: null,
    });
    setCurrentProjectData({ id, page, index });
    setCurrentProjectDetails({
      loading: true,
      lastPage: true,
      error: false,
    });
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
            <li className={`${styles['side-nav-item']} ${styles.tasks}`}>
              <Link
                to={'/tasks'}
                className={`${styles['side-nav-link']} ${styles['tasks-link']}`}
              >
                <FaTasks
                  className={`${styles['side-nav-icon']} ${styles['tasks-icon']}`}
                />{' '}
                Tasks
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
          <li className={`${styles['side-nav-item']} ${styles.tasks}`}>
            <Link
              to={'/tasks'}
              className={`${styles['side-nav-link']} ${styles['tasks-link']} `}
            >
              <FaTasks
                className={`${styles['side-nav-icon']} ${styles['tasks-icon']} `}
              />{' '}
              Tasks
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

      {addTask && (
        <NewTask
          addTask={addTask}
          setAddTask={setAddTask}
          fixedProject={true}
        />
      )}

      <section className={styles.section}>
        <header className={styles.header}>
          <b className={styles['menu-icon-box']}>
            <MdOutlineSegment
              className={styles['menu-icon']}
              onClick={() => setShowNav(true)}
            />
          </b>

          <h1 className={styles['page']}>Tasks</h1>

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
          <section className={`${styles['projects-section']} `}>
            <h1 className={styles['projects-section-head']}>Projects</h1>

            {/* Personal Tasks */}
            <div className={styles['projects-div']}>
              <p className={styles['projects-head']}>Personal</p>

              <div className={styles['projects-box']}>
                <ul className={styles['projects-list']}>
                  {personalProjects === null
                    ? ''
                    : personalProjects.length === 0
                    ? ''
                    : personalProjects
                    ? personalProjects.map((project, index) => (
                        <li
                          key={project._id}
                          className={`${styles['projects-list-item']} ${
                            currentProjectData.id === project._id
                              ? styles['current-project-list-item']
                              : ''
                          }`}
                          onClick={() =>
                            changeProject('personal', project._id, 1, index)
                          }
                        >
                          <img
                            src={`../../assets/images/users/${userData.photo}`}
                            className={styles['projects-item-img']}
                          />
                          <span
                            className={`${styles['projects-item-details']} ${
                              currentProjectData.id === project._id
                                ? styles['current-projects-item-details']
                                : ''
                            }`}
                          >
                            <span className={styles['projects-item-name']}>
                              {project.name}
                            </span>
                            <span className={styles['projects-item-count']}>
                              {project.details.complete +
                                project.details.open +
                                project.details.progress ===
                              1
                                ? `1 task`
                                : `${
                                    project.details.complete +
                                    project.details.open +
                                    project.details.progress
                                  } tasks`}{' '}
                            </span>
                          </span>
                          <span className={styles['projects-item-action']}>
                            <BsThreeDotsVertical
                              className={`${styles['projects-item-menu']} ${
                                currentProjectData.id === project._id
                                  ? styles['current-projects-item-menu']
                                  : ''
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            />

                            <a href="#" className={styles['']}>
                              <span
                                className={styles['view-project-link']}
                                onClick={(e) => e.stopPropagation()}
                              >
                                View Project
                              </span>
                            </a>
                          </span>
                        </li>
                      ))
                    : ''}
                </ul>

                {personalProjectsDetails.loading && (
                  <div className={styles['loader-box']}>
                    <Loader
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        margin: '2rem 0',
                      }}
                    />
                  </div>
                )}

                {personalProjects !== null && personalProjects.length === 0 && (
                  <div className={styles['no-projects-text']}>
                    You currently don't have any projects yet.
                  </div>
                )}

                {!personalProjectsDetails.lastPage && (
                  <div className={styles['show-more-box']}>
                    <button className={styles['show-more-btn']}>
                      Show More
                    </button>
                  </div>
                )}

                {personalProjectsDetails.error && (
                  <div className={styles['no-projects-text']}>
                    <MdOutlineSignalWifiOff
                      className={styles['network-icon']}
                    />{' '}
                    Unable to retrieve data
                  </div>
                )}
              </div>
            </div>

            <br />

            {/* Assigned Tasks */}
            <div className={styles['projects-div']}>
              <p className={styles['projects-head']}>Assigned</p>
              <div className={styles['projects-box']}>
                <ul className={styles['projects-list']}>
                  {assignedProjects === null
                    ? ''
                    : assignedProjects.length === 0
                    ? ''
                    : assignedProjects
                    ? assignedProjects.map((project, index) => (
                        <li
                          key={project._id}
                          className={`${styles['projects-list-item']}  ${
                            currentProjectData.id === project._id
                              ? styles['current-project-list-item']
                              : ''
                          }`}
                          onClick={() =>
                            changeProject('assigned', project._id, 1, index)
                          }
                        >
                          <span className={styles['leader-box']}>
                            <a href="#">
                              <img
                                src={`../../assets/images/users/${project.leaderPhoto}`}
                                className={styles['projects-item-img']}
                              />
                              <span className={styles['leader-tooltip-text']}>
                                {generateName(
                                  project.firstName,
                                  project.lastName,
                                  project.username
                                )}
                              </span>
                            </a>
                          </span>

                          <span
                            className={`${styles['projects-item-details']} ${
                              currentProjectData.id === project._id
                                ? styles['current-projects-item-details']
                                : ''
                            }`}
                          >
                            <span className={styles['projects-item-name']}>
                              {project.name}
                            </span>
                            <span className={styles['projects-item-count']}>
                              {project.tasks === 1
                                ? '1 task'
                                : `${project.tasks} tasks`}
                            </span>
                          </span>
                          <span className={styles['projects-item-action']}>
                            <BsThreeDotsVertical
                              className={`${styles['projects-item-menu']} ${
                                currentProjectData.id === project._id
                                  ? styles['current-projects-item-menu']
                                  : ''
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            />

                            <a href="#">
                              {' '}
                              <span
                                className={styles['view-project-link']}
                                onClick={(e) => e.stopPropagation()}
                              >
                                View Project
                              </span>
                            </a>
                          </span>
                        </li>
                      ))
                    : ''}
                </ul>

                {assignedProjectsDetails.loading && (
                  <div className={styles['loader-box']}>
                    <Loader
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        margin: '2rem 0',
                      }}
                    />
                  </div>
                )}

                {assignedProjects !== null && assignedProjects.length === 0 && (
                  <div className={styles['no-projects-text']}>
                    You don't have any assigned tasks.
                  </div>
                )}

                {!assignedProjectsDetails.lastPage && (
                  <div className={styles['show-more-box']}>
                    <button className={styles['show-more-btn']}>
                      Show More
                    </button>
                  </div>
                )}

                {assignedProjectsDetails.error && (
                  <div className={styles['no-projects-text']}>
                    <MdOutlineSignalWifiOff
                      className={styles['network-icon']}
                    />{' '}
                    Unable to retrieve data
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className={styles['tasks-section']}>
            <div className={styles['projects-container']}>
              <button
                className={`${styles['select-btn']} ${
                  showProjects ? styles['active-select-btn'] : ''
                }`}
                onClick={handleProjects}
              >
                Select Project{' '}
                <MdKeyboardDoubleArrowDown
                  className={styles['select-btn-icon']}
                />
              </button>

              <div
                className={`${styles['alt-projects-section']} ${
                  showProjects ? styles['show-projects'] : ''
                }`}
              >
                {/* Personal Tasks */}

                <div className={styles['projects-div']}>
                  <p className={styles['projects-head']}>Personal</p>

                  <div className={styles['projects-box']}>
                    <ul className={styles['alt-projects-list']}>
                      {personalProjects === null
                        ? ''
                        : personalProjects.length === 0
                        ? ''
                        : personalProjects
                        ? personalProjects.map((project, index) => (
                            <li
                              key={project._id}
                              className={`${styles['alt-projects-list-item']} ${
                                currentProjectData.id === project._id
                                  ? styles['current-project-list-item']
                                  : ''
                              }`}
                              onClick={() =>
                                changeProject('personal', project._id, 1, index)
                              }
                            >
                              <img
                                src={`../../assets/images/users/${userData.photo}`}
                                className={styles['projects-item-img']}
                              />
                              <span
                                className={`${
                                  styles['projects-item-details']
                                } ${
                                  currentProjectData.id === project._id
                                    ? styles['current-projects-item-details']
                                    : ''
                                }`}
                              >
                                <span className={styles['projects-item-name']}>
                                  {project.name}
                                </span>
                                <span className={styles['projects-item-count']}>
                                  {project.details.complete +
                                    project.details.open +
                                    project.details.progress ===
                                  1
                                    ? `1 task`
                                    : `${
                                        project.details.complete +
                                        project.details.open +
                                        project.details.progress
                                      } tasks`}{' '}
                                </span>
                              </span>
                              <span className={styles['projects-item-action']}>
                                <BsThreeDotsVertical
                                  className={`${styles['projects-item-menu']} ${
                                    currentProjectData.id === project._id
                                      ? styles['current-projects-item-menu']
                                      : ''
                                  }`}
                                  onClick={(e) => e.stopPropagation()}
                                />

                                <a href="#" className={styles['']}>
                                  <span
                                    className={styles['view-project-link']}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    View Project
                                  </span>
                                </a>
                              </span>
                            </li>
                          ))
                        : ''}
                    </ul>

                    {personalProjectsDetails.loading && (
                      <div className={styles['loader-box']}>
                        <Loader
                          style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            margin: '2rem 0',
                          }}
                        />
                      </div>
                    )}

                    {personalProjects !== null &&
                      personalProjects.length === 0 && (
                        <div className={styles['no-projects-text']}>
                          You currently don't have any projects yet.
                        </div>
                      )}

                    {!personalProjectsDetails.lastPage && (
                      <div className={styles['show-more-box']}>
                        <button className={styles['show-more-btn']}>
                          Show More
                        </button>
                      </div>
                    )}

                    {personalProjectsDetails.error && (
                      <div className={styles['no-projects-text']}>
                        <MdOutlineSignalWifiOff
                          className={styles['network-icon']}
                        />{' '}
                        Unable to retrieve data
                      </div>
                    )}
                  </div>
                </div>

                <br />

                {/* Assigned Tasks */}
                <div className={styles['projects-div']}>
                  <p className={styles['projects-head']}>Assigned</p>

                  <div className={styles['projects-box']}>
                    <ul className={styles['alt-projects-list']}>
                      {assignedProjects === null
                        ? ''
                        : assignedProjects.length === 0
                        ? ''
                        : assignedProjects
                        ? assignedProjects.map((project, index) => (
                            <li
                              key={project._id}
                              className={`${
                                styles['alt-projects-list-item']
                              }  ${
                                currentProjectData.id === project._id
                                  ? styles['current-project-list-item']
                                  : ''
                              }`}
                              onClick={() =>
                                changeProject('assigned', project._id, 1, index)
                              }
                            >
                              <span className={styles['leader-box']}>
                                <a href="#">
                                  <img
                                    src={`../../assets/images/users/${project.leaderPhoto}`}
                                    className={styles['projects-item-img']}
                                  />
                                  <span
                                    className={styles['leader-tooltip-text']}
                                  >
                                    {generateName(
                                      project.firstName,
                                      project.lastName,
                                      project.username
                                    )}
                                  </span>
                                </a>
                              </span>

                              <span
                                className={`${
                                  styles['projects-item-details']
                                } ${
                                  currentProjectData.id === project._id
                                    ? styles['current-projects-item-details']
                                    : ''
                                }`}
                              >
                                <span className={styles['projects-item-name']}>
                                  {project.name}
                                </span>
                                <span className={styles['projects-item-count']}>
                                  {project.tasks === 1
                                    ? '1 task'
                                    : `${project.tasks} tasks`}
                                </span>
                              </span>
                              <span className={styles['projects-item-action']}>
                                <BsThreeDotsVertical
                                  className={`${styles['projects-item-menu']} ${
                                    currentProjectData.id === project._id
                                      ? styles['current-projects-item-menu']
                                      : ''
                                  }`}
                                  onClick={(e) => e.stopPropagation()}
                                />

                                <a href="#">
                                  {' '}
                                  <span
                                    className={styles['view-project-link']}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    View Project
                                  </span>
                                </a>
                              </span>
                            </li>
                          ))
                        : ''}
                    </ul>

                    {assignedProjectsDetails.loading && (
                      <div className={styles['loader-box']}>
                        <Loader
                          style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            margin: '2rem 0',
                          }}
                        />
                      </div>
                    )}

                    {assignedProjects !== null &&
                      assignedProjects.length === 0 && (
                        <div className={styles['no-projects-text']}>
                          You don't have any assigned tasks.
                        </div>
                      )}

                    {!assignedProjectsDetails.lastPage && (
                      <div className={styles['show-more-box']}>
                        <button className={styles['show-more-btn']}>
                          Show More
                        </button>
                      </div>
                    )}

                    {assignedProjectsDetails.error && (
                      <div className={styles['no-projects-text']}>
                        <MdOutlineSignalWifiOff
                          className={styles['network-icon']}
                        />{' '}
                        Unable to retrieve data
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <h1 className={styles['tasks-section-head']}>Tasks</h1>

            <div className={styles['add-task-btn-div']}>
              <h1 className={styles['tasks-section-text']}>Tasks</h1>
              <button
                className={`${styles['add-task-btn']} ${
                  taskType === 'assigned' ? styles['hide-add-task'] : ''
                }`}
                onClick={() => setAddTask(true)}
              >
                <HiPlus className={styles['add-task-icon']} />
                Add task
              </button>
            </div>

            <div className={styles['article-box']}>
              {currentProject.tasks === null ? (
                ''
              ) : currentProject.tasks.length === 0 ? (
                <>
                  {taskType === 'personal' && (
                    <div className={styles['no-projects-text']}>
                      You currently don't have any tasks on this project
                    </div>
                  )}

                  {taskType === 'assigned' && (
                    <div className={styles['no-projects-text']}>
                      You were not assigned any tasks on this project
                    </div>
                  )}
                </>
              ) : currentProject.tasks ? (
                currentProject.tasks.map((task) =>
                  taskType === 'personal' ? (
                    <TaskBox
                      key={task._id}
                      task={task}
                      project={personalProjects[currentProjectData.index]}
                    />
                  ) : (
                    <TaskBox2
                      key={task._id}
                      task={task}
                      project={assignedProjects[currentProjectData.index]}
                    />
                  )
                )
              ) : (
                <div className={styles['no-projects-text']}>
                  No tasks available
                </div>
              )}

              {currentProjectDetails.loading && (
                <div className={styles['loader-box']}>
                  <Loader
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      margin: '2rem 0',
                    }}
                  />
                </div>
              )}

              {!currentProjectDetails.lastPage && (
                <div className={styles['show-more-box']}>
                  <button className={styles['show-more-btn']}>Show More</button>
                </div>
              )}

              {currentProjectDetails.error && (
                <div className={styles['no-projects-text']}>
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

export default Tasks;
