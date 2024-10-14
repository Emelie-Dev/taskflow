import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from '../styles/Tasks.module.css';

import {
  MdKeyboardDoubleArrowDown,
  MdOutlineSignalWifiOff,
} from 'react-icons/md';
import TaskBox from '../components/TaskBox';
import { HiPlus } from 'react-icons/hi';
import NewTask from '../components/NewTask';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../components/Loader';
import { apiClient, AuthContext } from '../App';
import { generateName } from './Dashboard';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import { LuExternalLink } from 'react-icons/lu';
import { getProfilePhoto } from '../components/Header';

const Tasks = () => {
  const { userData, serverUrl, mode } = useContext(AuthContext);
  const [showNav, setShowNav] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [taskType, setTaskType] = useState('personal');
  const [addTask, setAddTask] = useState(false);
  const [personalProjects, setPersonalProjects] = useState(null);
  const [personalProjectsDetails, setPersonalProjectsDetails] = useState({
    loading: true,
    lastPage: true,
    error: false,
    pageError: false,
  });
  const [assignedProjects, setAssignedProjects] = useState(null);
  const [assignedProjectsDetails, setAssignedProjectsDetails] = useState({
    loading: true,
    lastPage: true,
    error: false,
    pageError: false,
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
    pageError: false,
  });
  const [deleteCount, setDeleteCount] = useState(0);
  const [createCount, setCreateCount] = useState(0);

  // For personal tasks
  useEffect(() => {
    const getPersonalProjects = async () => {
      if (projectsPage.personal.current) {
        const page = projectsPage.personal.value;

        try {
          const { data } = await apiClient(
            `/api/v1/projects/my_projects?page=${page}`
          );

          setPersonalProjectsDetails({
            loading: false,
            lastPage: data.data.projects.length < 30,
            error: false,
            pageError: false,
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
              error: false,
              pageError: true,
            });
          } else {
            setPersonalProjectsDetails({
              loading: false,
              lastPage: true,
              error: true,
              pageError: false,
            });

            setCurrentProjectDetails({
              loading: false,
              lastPage: true,
              error: true,
              pageError: false,
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
          const { data } = await apiClient(
            `/api/v1/projects/assigned?page=${page}`
          );
          setAssignedProjectsDetails({
            loading: false,
            lastPage: data.data.assignedProjects.length < 30,
            error: false,
            pageError: false,
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
              error: false,
              pageError: true,
            });
          } else {
            setAssignedProjectsDetails({
              loading: false,
              lastPage: true,
              error: true,
              pageError: false,
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
        setCurrentProjectDetails({
          loading: false,
          lastPage: true,
          error: false,
          pageError: false,
        });

        return setCurrentProject({ tasks: false });
      } else if (id) {
        try {
          const { data } = await apiClient(
            `/api/v1/projects/${id}/tasks${
              taskType === 'assigned' ? '/assigned' : ''
            }?page=${page}&deleteCount=${deleteCount}&createCount=${createCount}`
          );

          setCurrentProjectDetails({
            loading: false,
            lastPage: data.data.tasks.length < 30,
            error: false,
            pageError: false,
          });

          if (page !== 1) {
            setCurrentProject({
              tasks: [...currentProject.tasks, ...data.data.tasks],
            });
          } else {
            setCurrentProject({ tasks: data.data.tasks });
          }
        } catch {
          if (page !== 1) {
            setCurrentProjectDetails({
              loading: false,
              lastPage: false,
              error: false,
              pageError: true,
            });
          } else {
            setCurrentProjectDetails({
              loading: false,
              lastPage: true,
              error: true,
              pageError: false,
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

    setDeleteCount(0);
    setCreateCount(0);
    setCurrentProject({
      tasks: null,
    });
    setCurrentProjectData({ id, page, index });
    setCurrentProjectDetails({
      loading: true,
      lastPage: true,
      error: false,
      pageError: false,
    });
  };

  const nextPage = (type) => {
    if (type === 'personal') {
      if (personalProjectsDetails.pageError) {
        setProjectsPage({
          personal: { current: true, value: projectsPage.personal.value },
          assigned: { current: false, value: projectsPage.assigned.value },
        });
      } else {
        setProjectsPage({
          personal: { current: true, value: projectsPage.personal.value + 1 },
          assigned: { current: false, value: projectsPage.assigned.value },
        });
      }

      setPersonalProjectsDetails({
        loading: true,
        lastPage: true,
        error: false,
        pageError: false,
      });
    } else if (type === 'assigned') {
      if (assignedProjectsDetails.pageError) {
        setProjectsPage({
          assigned: { current: true, value: projectsPage.assigned.value },
          personal: { current: false, value: projectsPage.personal.value },
        });
      } else {
        setProjectsPage({
          assigned: { current: true, value: projectsPage.assigned.value + 1 },
          personal: { current: false, value: projectsPage.personal.value },
        });
      }

      setAssignedProjectsDetails({
        loading: true,
        lastPage: true,
        error: false,
        pageError: false,
      });
    } else if (type === 'tasks') {
      const { id, page, index } = currentProjectData;

      if (currentProjectDetails.pageError) {
        setCurrentProjectData({ id, page, index });
      } else {
        setCurrentProjectData({ id, page: page + 1, index });
      }

      setCurrentProjectDetails({
        loading: true,
        lastPage: true,
        error: false,
        pageError: false,
      });
    }
  };

  const taskLength = (project, projectType = 'personal') => {
    let length;

    if (projectType === 'personal') {
      length =
        project.details.complete +
        project.details.open +
        project.details.progress;
    } else {
      length = project.tasks;
    }

    if (project._id === currentProjectData.id) {
      if (currentProject.tasks) {
        length = currentProject.tasks.length;
      }
    }

    return `${length === 1 ? '1 task' : `${length} tasks`}`;
  };

  return (
    <main className={styles.div}>
      <ToastContainer autoClose={2000} />

      <NavBar page={'Tasks'} showNav={showNav} setShowNav={setShowNav} />

      {addTask && (
        <NewTask
          setAddTask={setAddTask}
          fixedProject={true}
          projects={personalProjects}
          currentProjectIndex={currentProjectData.index}
          currentProject={currentProject}
          setCurrentProject={setCurrentProject}
          setCreateCount={setCreateCount}
        />
      )}

      <section className={styles.section}>
        <Header page={'Tasks'} setShowNav={setShowNav} />

        <section className={styles['section-content']}>
          <section className={`${styles['projects-section']} `}>
            <h1
              className={`${styles['projects-section-head']} ${
                mode === 'dark' ? styles['dark-text'] : ''
              }`}
            >
              Projects
            </h1>

            {/* Personal Tasks */}
            <div className={styles['projects-div']}>
              <p
                className={`${styles['projects-head']} ${
                  mode === 'dark' ? styles['dark-word'] : ''
                }`}
              >
                Personal
              </p>

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
                            src={getProfilePhoto(userData, serverUrl)}
                            className={`${styles['projects-item-img']} ${
                              userData.photo === 'default.jpeg'
                                ? styles['default-pic']
                                : ''
                            }`}
                          />

                          <span
                            className={`${styles['projects-item-details']} ${
                              currentProjectData.id === project._id
                                ? styles['current-projects-item-details']
                                : ''
                            } ${mode === 'dark' ? styles['dark-text'] : ''}`}
                          >
                            <span className={styles['projects-item-name']}>
                              {project.name}
                            </span>
                            <span className={styles['projects-item-count']}>
                              {taskLength(project)}
                            </span>
                          </span>

                          <a
                            href={`/project/${project._id}`}
                            className={`${styles['view-project-link']} ${
                              currentProjectData.id === project._id
                                ? styles['current-view-project-link']
                                : ''
                            } ${mode === 'dark' ? styles['dark-text'] : ''}`}
                            onClick={(e) => e.stopPropagation()}
                            title="View Project"
                          >
                            <LuExternalLink
                              className={styles['view-project-icon']}
                            />
                          </a>
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
                  <div
                    className={`${styles['no-projects-text']}  ${
                      mode === 'dark' ? styles['dark-word'] : ''
                    }`}
                  >
                    You currently don't have any projects yet.
                  </div>
                )}

                {!personalProjectsDetails.lastPage && (
                  <div className={styles['show-more-box']}>
                    <button
                      className={styles['show-more-btn']}
                      onClick={() => nextPage('personal')}
                    >
                      Show More
                    </button>
                  </div>
                )}

                {personalProjectsDetails.error && (
                  <div
                    className={`${styles['no-projects-text']}  ${
                      mode === 'dark' ? styles['dark-word'] : ''
                    }`}
                  >
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
              <p
                className={`${styles['projects-head']} ${
                  mode === 'dark' ? styles['dark-word'] : ''
                }`}
              >
                Assigned
              </p>
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
                            <a href={`/user/${project.username}`}>
                              <img
                                src={getProfilePhoto(project, serverUrl)}
                                className={`${styles['projects-item-img']} ${
                                  project.leaderPhoto === 'default.jpeg'
                                    ? styles['default-pic']
                                    : ''
                                }`}
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
                            } ${mode === 'dark' ? styles['dark-text'] : ''}`}
                          >
                            <span className={styles['projects-item-name']}>
                              {project.name}
                            </span>
                            <span className={styles['projects-item-count']}>
                              {taskLength(project, 'assigned')}
                            </span>
                          </span>

                          <a
                            href={`/project/${project._id}`}
                            className={`${styles['view-project-link']} ${
                              currentProjectData.id === project._id
                                ? styles['current-view-project-link']
                                : ''
                            } ${mode === 'dark' ? styles['dark-text'] : ''}`}
                            onClick={(e) => e.stopPropagation()}
                            title="View Project"
                          >
                            <LuExternalLink
                              className={styles['view-project-icon']}
                            />
                          </a>
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
                  <div
                    className={`${styles['no-projects-text']}  ${
                      mode === 'dark' ? styles['dark-word'] : ''
                    }`}
                  >
                    You don't have any assigned tasks.
                  </div>
                )}

                {!assignedProjectsDetails.lastPage && (
                  <div className={styles['show-more-box']}>
                    <button
                      className={styles['show-more-btn']}
                      onClick={() => nextPage('assigned')}
                    >
                      Show More
                    </button>
                  </div>
                )}

                {assignedProjectsDetails.error && (
                  <div
                    className={`${styles['no-projects-text']}  ${
                      mode === 'dark' ? styles['dark-word'] : ''
                    }`}
                  >
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
                } ${mode === 'dark' ? styles['dark-btn'] : ''}`}
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
                } ${mode === 'dark' ? styles['dark-bg'] : ''}`}
              >
                {/* Personal Tasks */}

                <div className={styles['projects-div']}>
                  <p
                    className={`${styles['projects-head']} ${
                      mode === 'dark' ? styles['dark-word'] : ''
                    }`}
                  >
                    Personal
                  </p>

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
                                src={getProfilePhoto(userData, serverUrl)}
                                className={`${styles['projects-item-img']} ${
                                  userData.photo === 'default.jpeg'
                                    ? styles['default-pic']
                                    : ''
                                }`}
                              />

                              <span
                                className={`${
                                  styles['projects-item-details']
                                } ${
                                  currentProjectData.id === project._id
                                    ? styles['current-projects-item-details']
                                    : ''
                                } ${
                                  mode === 'dark' ? styles['dark-text'] : ''
                                }`}
                              >
                                <span className={styles['projects-item-name']}>
                                  {project.name}
                                </span>
                                <span className={styles['projects-item-count']}>
                                  {taskLength(project)}
                                </span>
                              </span>

                              <a
                                href={`/project/${project._id}`}
                                className={`${styles['view-project-link']} ${
                                  currentProjectData.id === project._id
                                    ? styles['current-view-project-link']
                                    : ''
                                } ${
                                  mode === 'dark' ? styles['dark-text'] : ''
                                }`}
                                onClick={(e) => e.stopPropagation()}
                                title="View Project"
                              >
                                <LuExternalLink
                                  className={styles['view-project-icon']}
                                />
                              </a>
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
                        <div
                          className={`${styles['no-projects-text']}  ${
                            mode === 'dark' ? styles['dark-word'] : ''
                          }`}
                        >
                          You currently don't have any projects yet.
                        </div>
                      )}

                    {!personalProjectsDetails.lastPage && (
                      <div className={styles['show-more-box']}>
                        <button
                          className={styles['show-more-btn']}
                          onClick={() => nextPage('personal')}
                        >
                          Show More
                        </button>
                      </div>
                    )}

                    {personalProjectsDetails.error && (
                      <div
                        className={`${styles['no-projects-text']}  ${
                          mode === 'dark' ? styles['dark-word'] : ''
                        }`}
                      >
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
                  <p
                    className={`${styles['projects-head']} ${
                      mode === 'dark' ? styles['dark-word'] : ''
                    }`}
                  >
                    Assigned
                  </p>

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
                                <a href={`/user/${project.username}`}>
                                  <img
                                    src={getProfilePhoto(project, serverUrl)}
                                    className={`${
                                      styles['projects-item-img']
                                    } ${
                                      project.leaderPhoto === 'default.jpeg'
                                        ? styles['default-pic']
                                        : ''
                                    }`}
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
                                } ${
                                  mode === 'dark' ? styles['dark-text'] : ''
                                }`}
                              >
                                <span className={styles['projects-item-name']}>
                                  {project.name}
                                </span>
                                <span className={styles['projects-item-count']}>
                                  {taskLength(project, 'assigned')}
                                </span>
                              </span>

                              <a
                                href={`/project/${project._id}`}
                                className={`${styles['view-project-link']} ${
                                  currentProjectData.id === project._id
                                    ? styles['current-view-project-link']
                                    : ''
                                } ${
                                  mode === 'dark' ? styles['dark-text'] : ''
                                }`}
                                onClick={(e) => e.stopPropagation()}
                                title="View Project"
                              >
                                <LuExternalLink
                                  className={styles['view-project-icon']}
                                />
                              </a>
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
                        <div
                          className={`${styles['no-projects-text']}  ${
                            mode === 'dark' ? styles['dark-word'] : ''
                          }`}
                        >
                          You don't have any assigned tasks.
                        </div>
                      )}

                    {!assignedProjectsDetails.lastPage && (
                      <div className={styles['show-more-box']}>
                        <button
                          className={styles['show-more-btn']}
                          onClick={() => nextPage('assigned')}
                        >
                          Show More
                        </button>
                      </div>
                    )}

                    {assignedProjectsDetails.error && (
                      <div
                        className={`${styles['no-projects-text']}  ${
                          mode === 'dark' ? styles['dark-word'] : ''
                        }`}
                      >
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

            <h1
              className={`${styles['tasks-section-head']} ${
                mode === 'dark' ? styles['dark-text'] : ''
              }`}
            >
              Tasks
            </h1>

            <div className={styles['add-task-btn-div']}>
              <h1
                className={`${styles['tasks-section-text']} ${
                  mode === 'dark' ? styles['dark-text'] : ''
                }`}
              >
                Tasks
              </h1>

              {personalProjects && personalProjects.length !== 0 && (
                <button
                  className={`${styles['add-task-btn']} ${
                    taskType === 'assigned' ? styles['hide-add-task'] : ''
                  }`}
                  onClick={() => setAddTask(true)}
                >
                  <HiPlus className={styles['add-task-icon']} />
                  Add task
                </button>
              )}
            </div>

            <div className={styles['article-box']}>
              {currentProject.tasks === null ? (
                ''
              ) : currentProject.tasks.length === 0 &&
                currentProjectDetails.lastPage ? (
                <>
                  {taskType === 'personal' && (
                    <div
                      className={`${styles['no-projects-text']}  ${
                        mode === 'dark' ? styles['dark-word'] : ''
                      }`}
                    >
                      You currently don't have any task on this project
                    </div>
                  )}

                  {taskType === 'assigned' && (
                    <div
                      className={`${styles['no-projects-text']}  ${
                        mode === 'dark' ? styles['dark-word'] : ''
                      }`}
                    >
                      You were not assigned any task on this project
                    </div>
                  )}
                </>
              ) : currentProject.tasks ? (
                currentProject.tasks.map((task) =>
                  taskType === 'personal' ? (
                    <TaskBox
                      key={task._id}
                      assigned={false}
                      task={task}
                      project={personalProjects[currentProjectData.index]}
                      currentProject={currentProject}
                      setCurrentProject={setCurrentProject}
                      setDeleteCount={setDeleteCount}
                      toast={toast}
                    />
                  ) : (
                    <TaskBox
                      key={task._id}
                      assigned={true}
                      task={task}
                      project={assignedProjects[currentProjectData.index]}
                      currentProject={currentProject}
                      setCurrentProject={setCurrentProject}
                      setDeleteCount={setDeleteCount}
                      toast={toast}
                    />
                  )
                )
              ) : (
                <div
                  className={`${styles['no-projects-text']}  ${
                    mode === 'dark' ? styles['dark-word'] : ''
                  }`}
                >
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
                  <button
                    className={styles['show-more-btn']}
                    onClick={() => nextPage('tasks')}
                  >
                    Show More
                  </button>
                </div>
              )}

              {currentProjectDetails.error && (
                <div
                  className={`${styles['no-projects-text']}  ${
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

export default Tasks;
