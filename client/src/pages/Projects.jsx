import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from '../styles/Projects.module.css';
import { IoMdGrid, IoIosCloseCircleOutline } from 'react-icons/io';

import {
  MdTableRows,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineSignalWifiOff,
  MdDelete,
} from 'react-icons/md';
import { HiPlus } from 'react-icons/hi';
import Project from '../components/Project';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../components/Loader';
import { generateName } from './Dashboard';
import { GrStatusGood } from 'react-icons/gr';
import { apiClient, AuthContext } from '../App';
import DeleteComponent from '../components/DeleteComponent';
import Header from '../components/Header';
import NavBar from '../components/NavBar';

export const months = [
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

const Projects = () => {
  const { userData, serverUrl } = useContext(AuthContext);
  const [displayFormat, setDisplayFormat] = useState(
    userData.personalization.defaultProjectView
  );
  const [showNav, setShowNav] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const [projects, setProjects] = useState(null);
  const [projectsDetails, setProjectsDetails] = useState({
    category: 'all',
    sort: '-createdAt',
    page: 1,
  });
  const [projectData, setProjectData] = useState({
    loading: true,
    lastPage: true,
    error: false,
    pageError: false,
  });
  const [tablePage, setTablePage] = useState(1);
  const [createCount, setCreateCount] = useState(0);
  const [deleteCount, setDeleteCount] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ value: false, type: null });
  const [deleteData, setDeleteData] = useState({});

  // For the Projects
  useEffect(() => {
    const getUserProjects = async () => {
      const { category, sort, page } = projectsDetails;

      try {
        const { data } = await apiClient(
          `/api/v1/projects/my_projects?category=${category}&sort=${sort}&page=${page}&deleteCount=${deleteCount}&createCount=${
            displayFormat === 'table' ? 0 : createCount
          }`
        );

        setProjectData({
          loading: false,
          lastPage: data.data.projects.length < 30,
          error: false,
          pageError: false,
        });

        if (page !== 1) {
          if (data.data.projects.length === 0) return projectsDetails.page--;

          setProjects({
            grid: [
              ...projects.grid,
              ...data.data.projects.filter(
                (project) =>
                  !projects.grid.find((elem) => elem._id === project._id)
              ),
            ],
            table: (() => {
              const table = [...projects.table];
              const newProjects = data.data.projects;

              if (table[table.length - 1].length < 30) {
                const diff = 30 - table[table.length - 1].length;

                const replaceProjects = newProjects.slice(0, diff);

                table[table.length - 1].push(...replaceProjects);

                newProjects.splice(0, diff);
              }

              return [...table, newProjects];
            })(),
          });

          setTablePage((page) => page + 1);
        } else {
          setProjects({
            grid: data.data.projects,
            table: [data.data.projects],
          });
        }
      } catch {
        if (page !== 1) {
          setProjectData({
            loading: false,
            lastPage: false,
            error: false,
            pageError: true,
          });
        } else {
          setProjectData({
            loading: false,
            lastPage: true,
            error: true,
            pageError: false,
          });
        }

        return toast('An error occured while fetching projects.', {
          toastId: 'toast-id1',
        });
      }
    };

    getUserProjects();
  }, [projectsDetails]);

  const nextPage = () => {
    const { category, sort, page } = projectsDetails;

    if (projectData.pageError) {
      setProjectsDetails({
        category,
        sort,
        page,
      });
    } else {
      setProjectsDetails({
        category,
        sort,
        page: page + 1,
      });
    }

    setProjectData({
      loading: true,
      lastPage: true,
      error: false,
      pageError: false,
    });
  };

  const goToPage = (nextPage) => {
    const { category, sort, page } = projectsDetails;

    if (nextPage === tablePage) {
      return;
    } else if (projects.table[nextPage - 1]) {
      setTablePage(nextPage);
    } else {
      if (projectData.pageError) {
        setProjectsDetails({
          category,
          sort,
          page,
        });
      } else {
        setProjectsDetails({
          category,
          sort,
          page: page + 1,
        });
      }

      setProjectData({
        loading: true,
        lastPage: true,
        error: false,
        pageError: false,
      });
    }
  };

  const isLastPage = () => {
    if (projectData.lastPage) {
      return projects.table.length === tablePage;
    } else {
      return projects.table.length + 1 === tablePage;
    }
  };

  const changeCategory = (category) => {
    const { sort } = projectsDetails;

    if (projectsDetails.category === category) return;

    setCreateCount(0);
    setDeleteCount(0);
    setProjectsDetails({
      category,
      sort,
      page: 1,
    });

    setProjects(null);
    setProjectData({ loading: true, lastPage: true, error: false });
  };

  const changeSortBy = (e) => {
    const { category } = projectsDetails;

    setCreateCount(0);
    setDeleteCount(0);
    setProjectsDetails({
      category,
      sort: e.target.value,
      page: 1,
    });

    setProjects(null);
    setProjectData({ loading: true, lastPage: true, error: false });
  };

  const noProjectMessage = (category) => {
    switch (category) {
      case 'all':
        return "You currently don't have any projects yet.";

      case 'progress':
        return 'You currently have no ongoing projects.';

      case 'open':
        return 'You currently have no open projects (projects with 0% progress).';

      case 'complete':
        return 'You currently have no complete projects.';

      default:
        return 'No projects available.';
    }
  };

  return (
    <main className={styles.div}>
      <ToastContainer autoClose={2000} />

      <NavBar page={'Projects'} showNav={showNav} setShowNav={setShowNav} />

      <section className={styles.section}>
        <Header page={'Projects'} setShowNav={setShowNav} />

        {displayModal && (
          <Project
            setDisplayModal={setDisplayModal}
            projects={projects}
            setProjects={setProjects}
            setCreateCount={setCreateCount}
          />
        )}

        {deleteModal.value && (
          <DeleteComponent
            toast={toast}
            type={deleteModal.type}
            typeData={deleteData}
            setDeleteModal={setDeleteModal}
            setDeleteCount={setDeleteCount}
            projectsPage={true}
            setProjects={setProjects}
          />
        )}

        <section className={styles['section-content']}>
          <div className={styles['section-head']}>
            <div className={styles['sort-div']}>
              <span className={styles['sort-text']}>Sort by:</span>
              <select className={styles['sort-select']} onChange={changeSortBy}>
                <option value={'-createdAt'}>Newest</option>
                <option value={'createdAt'}>Oldest</option>
                <option value={'name'}>Alphabetically</option>
              </select>
            </div>

            <div className={styles['filter-div']}>
              <button
                className={`${styles['filter-btn']} ${
                  projectsDetails.category === 'all'
                    ? styles['current-filter-btn']
                    : ''
                }`}
                onClick={() => changeCategory('all')}
              >
                All
              </button>
              <button
                className={`${styles['filter-btn']} ${
                  projectsDetails.category === 'progress'
                    ? styles['current-filter-btn']
                    : ''
                }`}
                onClick={() => changeCategory('progress')}
              >
                Ongoing
              </button>
              <button
                className={`${styles['filter-btn']} ${
                  projectsDetails.category === 'open'
                    ? styles['current-filter-btn']
                    : ''
                }`}
                onClick={() => changeCategory('open')}
              >
                Open
              </button>
              <button
                className={`${styles['filter-btn']} ${
                  projectsDetails.category === 'complete'
                    ? styles['current-filter-btn']
                    : ''
                }`}
                onClick={() => changeCategory('complete')}
              >
                Completed
              </button>
            </div>

            <div className={styles['project-style-div']}>
              <span
                className={`${styles['project-style-icon-box']} ${
                  displayFormat === 'grid'
                    ? styles['current-project-style-box']
                    : ''
                }`}
                title="Grid Format"
                onClick={() => setDisplayFormat('grid')}
              >
                <IoMdGrid
                  className={`${styles['project-style-icon']} ${
                    displayFormat === 'grid'
                      ? styles['current-project-style-icon']
                      : ''
                  }`}
                />
              </span>
              <span
                className={`${styles['project-style-icon-box']} ${
                  displayFormat === 'table'
                    ? styles['current-project-style-box']
                    : ''
                }`}
                title="Table Format"
                onClick={() => {
                  setDisplayFormat('table');
                  setTablePage(1);
                }}
              >
                <MdTableRows
                  className={`${styles['project-style-icon']} ${
                    displayFormat === 'table'
                      ? styles['current-project-style-icon']
                      : ''
                  }`}
                />
              </span>
              <button
                className={styles['create-project-btn']}
                onClick={() => setDisplayModal(true)}
              >
                {' '}
                <HiPlus className={styles['create-project-icon']} />
                Create Project
              </button>
            </div>
          </div>

          <div className={styles['alternate-filter-div']}>
            <button
              className={`${styles['alternate-filter-btn']} ${
                projectsDetails.category === 'all'
                  ? styles['alternate-current-filter-btn']
                  : ''
              }`}
              onClick={() => changeCategory('all')}
            >
              All
            </button>
            <button
              className={`${styles['alternate-filter-btn']} ${
                projectsDetails.category === 'progress'
                  ? styles['alternate-current-filter-btn']
                  : ''
              }`}
              onClick={() => changeCategory('progress')}
            >
              Ongoing
            </button>
            <button
              className={`${styles['alternate-filter-btn']} ${
                projectsDetails.category === 'open'
                  ? styles['alternate-current-filter-btn']
                  : ''
              }`}
              onClick={() => changeCategory('open')}
            >
              Open
            </button>
            <button
              className={`${styles['alternate-filter-btn']} ${
                projectsDetails.category === 'complete'
                  ? styles['alternate-current-filter-btn']
                  : ''
              }`}
              onClick={() => changeCategory('complete')}
            >
              Completed
            </button>
          </div>

          <div className={styles['alternate-btn-div']}>
            <span
              className={`${styles['alt-project-style-icon-box']} ${
                displayFormat === 'grid'
                  ? styles['alt-current-project-style-box']
                  : ''
              }`}
              title="Grid Format"
              onClick={() => setDisplayFormat('grid')}
            >
              <IoMdGrid
                className={`${styles['alt-project-style-icon']} ${
                  displayFormat === 'grid'
                    ? styles['alt-current-project-style-icon']
                    : ''
                }`}
              />
            </span>
            <span
              className={`${styles['alt-project-style-icon-box']} ${
                displayFormat === 'table'
                  ? styles['alt-current-project-style-box']
                  : ''
              }`}
              title="Table Format"
              onClick={() => setDisplayFormat('table')}
            >
              <MdTableRows
                className={`${styles['alt-project-style-icon']} ${
                  displayFormat === 'table'
                    ? styles['alt-current-project-style-icon']
                    : ''
                }`}
              />
            </span>

            <button
              className={styles['alternate-project-btn']}
              onClick={() => setDisplayModal(true)}
            >
              {' '}
              <HiPlus className={styles['alternate-project-icon']} />
              Create Project
            </button>
          </div>

          {displayFormat === 'grid' && (
            <>
              <div
                className={`${styles['article-box']} ${
                  !projects
                    ? ''
                    : projects.grid.length === 0
                    ? styles['empty-article-box']
                    : ''
                }`}
              >
                {projects === null ? (
                  ''
                ) : projects.grid.length === 0 ? (
                  <div className={styles['no-projects-text']}>
                    {noProjectMessage(projectsDetails.category)}
                  </div>
                ) : projects.grid ? (
                  projects.grid.map((project) => (
                    <article key={project._id} className={styles.article}>
                      <span className={styles['delete-icon-box']}>
                        {' '}
                        <MdDelete
                          className={styles['delete-icon']}
                          title="Delete Project"
                          onClick={() => {
                            setDeleteModal({ value: true, type: 'Project' });
                            setDeleteData({
                              id: project._id,
                              name: project.name,
                            });
                          }}
                        />
                      </span>

                      <h1 className={styles['project-name']}>
                        <span className={styles['project-name-value']}>
                          <a href={`/project/${project._id}`}>{project.name}</a>
                        </span>
                      </h1>
                      <span className={styles['project-tasks']}>
                        <span className={styles['open-tasks']}>
                          {project.details.open}
                        </span>{' '}
                        open {project.details.open === 1 ? 'task' : 'tasks'},{' '}
                        <span className={styles['completed-tasks']}>
                          {' '}
                          {project.details.complete}
                        </span>{' '}
                        completed
                      </span>
                      <p className={styles['project-details']}>
                        {project.description.length === 0 ? (
                          <i>No project description</i>
                        ) : (
                          project.description
                        )}
                      </p>

                      <div className={styles['property-div']}>
                        <span className={styles['property-name']}>
                          Deadline:
                        </span>
                        <span className={styles['deadline-value']}>
                          {project.deadline ? (
                            `${
                              months[new Date(project.deadline).getMonth()]
                            } ${new Date(
                              project.deadline
                            ).getDate()}, ${new Date(
                              project.deadline
                            ).getFullYear()}`
                          ) : (
                            <i>No deadline</i>
                          )}
                        </span>
                      </div>
                      <div className={styles['property-div']}>
                        <span className={styles['property-name']}>Team:</span>
                        <div
                          className={`${styles['team-pics-box']} ${
                            project.team.length === 0
                              ? styles['no-team-box']
                              : ''
                          }`}
                        >
                          {project.team.length === 0 ? (
                            <i>No team members</i>
                          ) : project.team.length > 4 ? (
                            <>
                              {project.team.slice(0, 4).map((member) => (
                                <span
                                  key={member._id}
                                  className={styles['team-pics-tooltip']}
                                >
                                  <a href={`/user/${member.username}`}>
                                    <img
                                      src={`${serverUrl}/users/${member.photo}`}
                                      className={`${styles['team-pics']} ${
                                        member.photo === 'default.jpeg'
                                          ? styles['default-pic']
                                          : ''
                                      }`}
                                    />
                                  </a>
                                  <span
                                    className={styles['team-pics-tooltip-text']}
                                  >
                                    {generateName(
                                      member.firstName,
                                      member.lastName,
                                      member.username
                                    )}
                                  </span>
                                </span>
                              ))}

                              <span className={styles['team-icon-box']}>
                                <HiPlus className={styles['team-icon']} />
                                <span className={styles['team-number']}>
                                  {project.team.length - 4}
                                </span>
                              </span>
                            </>
                          ) : (
                            project.team.map((member) => (
                              <span
                                key={member._id}
                                className={styles['team-pics-tooltip']}
                              >
                                <a href={`/user/${member.username}`}>
                                  <img
                                    src={`${serverUrl}/users/${member.photo}`}
                                    className={`${styles['team-pics']} ${
                                      member.photo === 'default.jpeg'
                                        ? styles['default-pic']
                                        : ''
                                    }`}
                                  />
                                </a>
                                <span
                                  className={styles['team-pics-tooltip-text']}
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
                      </div>

                      <div className={styles['progess-div']}>
                        <div className={styles['progess-box']}>
                          <span className={styles['progess-text']}>
                            Progress
                          </span>

                          <span className={styles['progess-value']}>
                            {project.details.projectProgress}%
                          </span>
                        </div>

                        <div className={styles['progress-bar']}>
                          <span
                            className={styles['progress-bar-value']}
                            style={{
                              width: `${project.details.projectProgress}%`,
                            }}
                          >
                            &nbsp;
                          </span>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  ''
                )}
              </div>

              {projectData.error && (
                <div className={styles['no-projects-text']}>
                  <MdOutlineSignalWifiOff className={styles['network-icon']} />{' '}
                  Unable to retrieve data
                </div>
              )}

              {projectData.loading && (
                <div className={styles['projects-loader-div']}>
                  <Loader
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      margin: '1rem 0 3rem',
                    }}
                  />
                </div>
              )}

              {!projectData.lastPage && (
                <div className={styles['more-btn-box']}>
                  <button
                    className={styles['more-task-btn']}
                    onClick={nextPage}
                  >
                    Show More
                  </button>
                </div>
              )}
            </>
          )}

          {displayFormat === 'table' && (
            <div className={styles['table-container']}>
              {projects === null ? (
                ''
              ) : projects.table[tablePage - 1].length === 0 ? (
                <div className={styles['no-projects-text']}>
                  {noProjectMessage(projectsDetails.category)}
                </div>
              ) : projects.table ? (
                <>
                  <header className={styles.footer}>
                    <div className={styles['footer-text']}>
                      Showing{' '}
                      <span className={styles['footer-entry-text']}>
                        {(tablePage - 1) * 30 + 1}
                      </span>{' '}
                      to{' '}
                      <span className={styles['footer-entry-text']}>
                        {(tablePage - 1) * 30 +
                          projects.table[tablePage - 1].length}
                      </span>{' '}
                      of{' '}
                      <span className={styles['footer-entry-text']}>
                        {projects.table.flat().length}
                      </span>{' '}
                      {projects.table.flat().length === 1 ? 'entry' : 'entries'}
                    </div>

                    <div className={styles['entry-navigation-box']}>
                      <span
                        className={`${styles['footer-content-box']} ${
                          styles['footer-arrow-box']
                        } ${tablePage === 1 ? styles['disable-box'] : ''}`}
                        onClick={() => goToPage(tablePage - 1)}
                      >
                        <MdKeyboardDoubleArrowLeft
                          className={styles['footer-icon']}
                        />
                      </span>

                      <div className={styles['pagination-box']}>
                        <>
                          {projects.table.map((page, index) => (
                            <span
                              key={index}
                              className={`${styles['footer-content-box']} ${
                                tablePage === index + 1
                                  ? styles['current-page']
                                  : ''
                              }`}
                              onClick={() => goToPage(index + 1)}
                            >
                              {index + 1}
                            </span>
                          ))}

                          {!projectData.lastPage && (
                            <span
                              className={styles['footer-content-box']}
                              onClick={() =>
                                goToPage(projects.table.length + 1)
                              }
                            >
                              {projects.table.length + 1}
                            </span>
                          )}
                        </>
                      </div>

                      <span
                        className={`${styles['footer-content-box']} ${
                          styles['footer-arrow-box']
                        } ${isLastPage() ? styles['disable-box'] : ''}`}
                        onClick={() => goToPage(tablePage + 1)}
                      >
                        <MdKeyboardDoubleArrowRight
                          className={styles['footer-icon']}
                        />
                      </span>
                    </div>
                  </header>

                  {!projectData.loading && (
                    <div className={styles['table-div']}>
                      <table className={styles['project-table']}>
                        <thead>
                          <tr className={styles['table-head-row']}>
                            <th className={styles['table-head']}>Project</th>
                            <th className={styles['table-head']}>Team</th>
                            <th className={styles['table-head']}>Deadline</th>
                            <th className={styles['table-head']}>Progress</th>
                            <th className={styles['table-head']}>Status</th>
                            <th className={styles['table-head']}></th>
                          </tr>
                        </thead>

                        <tbody>
                          {projects.table[tablePage - 1].map((project) => (
                            <tr key={project._id}>
                              <td
                                className={`${styles['table-project-data']} ${styles['table-project-name']}`}
                              >
                                <a href={`/project/${project._id}`}>
                                  {project.name}{' '}
                                </a>
                              </td>

                              <td className={styles['table-project-data']}>
                                <div className={styles['table-team-box']}>
                                  {project.team.length === 0 ? (
                                    <i className={styles['no-team-text']}>
                                      No team members
                                    </i>
                                  ) : project.team.length > 4 ? (
                                    <>
                                      {project.team
                                        .slice(0, 4)
                                        .map((member) => (
                                          <span
                                            key={member._id}
                                            className={
                                              styles['table-team-pics-box']
                                            }
                                          >
                                            <a
                                              href={`/user/${member.username}`}
                                            >
                                              <img
                                                className={`${
                                                  styles['table-team-pics']
                                                } ${
                                                  member.photo ===
                                                  'default.jpeg'
                                                    ? styles['default-pic']
                                                    : ''
                                                }`}
                                                src={`${serverUrl}/users/${member.photo}`}
                                              />
                                            </a>
                                            <span
                                              className={
                                                styles['table-team-name']
                                              }
                                            >
                                              {generateName(
                                                member.firstName,
                                                member.lastName,
                                                member.username
                                              )}
                                            </span>
                                          </span>
                                        ))}

                                      <span
                                        className={
                                          styles['table-team-icon-box']
                                        }
                                      >
                                        <HiPlus
                                          className={styles['table-team-icon']}
                                        />
                                        <span className={styles['team-number']}>
                                          {project.team.length - 4}
                                        </span>
                                      </span>
                                    </>
                                  ) : (
                                    project.team.map((member) => (
                                      <span
                                        key={member._id}
                                        className={
                                          styles['table-team-pics-box']
                                        }
                                      >
                                        <a href={`/user/${member.username}`}>
                                          <img
                                            className={`${
                                              styles['table-team-pics']
                                            } ${
                                              member.photo === 'default.jpeg'
                                                ? styles['default-pic']
                                                : ''
                                            }`}
                                            src={`${serverUrl}/users/${member.photo}`}
                                          />
                                        </a>
                                        <span
                                          className={styles['table-team-name']}
                                        >
                                          {generateName(
                                            member.firstName,
                                            member.lastName,
                                            member.username
                                          )}{' '}
                                        </span>
                                      </span>
                                    ))
                                  )}
                                </div>
                              </td>

                              <td
                                className={` ${styles['table-project-data']}  ${styles['table-project-deadline']} `}
                              >
                                {project.deadline ? (
                                  `${
                                    months[
                                      new Date(project.deadline).getMonth()
                                    ]
                                  } ${new Date(
                                    project.deadline
                                  ).getDate()}, ${new Date(
                                    project.deadline
                                  ).getFullYear()}`
                                ) : (
                                  <i className={styles['no-deadline']}>
                                    No deadline
                                  </i>
                                )}
                              </td>
                              <td
                                className={` ${styles['table-project-data']}  ${
                                  styles['table-project-progress']
                                } ${
                                  project.details.projectProgress < 40
                                    ? styles['low-progress']
                                    : project.details.projectProgress < 70
                                    ? styles['medium-progress']
                                    : project.details.projectProgress < 100
                                    ? styles['high-progress']
                                    : styles['complete-progress']
                                }`}
                              >
                                {project.details.projectProgress}%
                              </td>
                              <td
                                className={` ${styles['table-project-data']} ${styles['table-project-status']}`}
                              >
                                {project.status === 'active' ? (
                                  <span className={styles['active-project']}>
                                    {' '}
                                    <GrStatusGood
                                      className={styles['active-project-icon']}
                                    />{' '}
                                    Active
                                  </span>
                                ) : (
                                  <span className={styles['inactive-project']}>
                                    {' '}
                                    <IoIosCloseCircleOutline
                                      className={
                                        styles['inactive-project-icon']
                                      }
                                    />{' '}
                                    Inactive
                                  </span>
                                )}
                              </td>
                              <td
                                className={` ${styles['table-project-data']}`}
                              >
                                <span
                                  className={styles['table-delete-icon-box']}
                                >
                                  {' '}
                                  <MdDelete
                                    className={styles['delete-icon']}
                                    title="Delete Project"
                                    onClick={() => {
                                      setDeleteModal({
                                        value: true,
                                        type: 'Project',
                                      });
                                      setDeleteData({
                                        id: project._id,
                                        name: project.name,
                                      });
                                    }}
                                  />
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                ''
              )}

              {projectData.error && (
                <div className={styles['no-projects-text']}>
                  <MdOutlineSignalWifiOff className={styles['network-icon']} />{' '}
                  Unable to retrieve data
                </div>
              )}

              {projectData.loading && (
                <div className={styles['projects-loader-div']}>
                  <Loader
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      margin: '3rem 0',
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Projects;
