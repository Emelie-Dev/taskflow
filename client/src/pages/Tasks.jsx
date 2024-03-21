import React, { useState, useRef } from 'react';
import styles from '../styles/Tasks.module.css';
import { SiKashflow, SiSimpleanalytics } from 'react-icons/si';
import { Link } from 'react-router-dom';

import { IoChatbubblesSharp, IoSettingsOutline } from 'react-icons/io5';
import { IoIosSearch, IoMdClose, IoIosNotifications } from 'react-icons/io';

import {
  MdOutlineDashboard,
  MdOutlineSegment,
  MdKeyboardDoubleArrowDown,
} from 'react-icons/md';
import { FaTasks, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { GoProjectTemplate } from 'react-icons/go';
import { BsThreeDotsVertical } from 'react-icons/bs';
import TaskBox from '../components/TaskBox';
import TaskBox2 from '../components/TaskBox2';

const Tasks = () => {
  const [searchText, setSearchText] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [taskType, setTaskType] = useState('personal');
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

  const handleProjects = () => {
    setShowProjects(!showProjects);
  };

  const tasks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
              <Link to={'/projects'} className={styles['side-nav-link']}>
                <FaCalendarAlt className={styles['side-nav-icon']} /> Calendar
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
            <Link to={'/projects'} className={styles['side-nav-link']}>
              <FaCalendarAlt className={styles['side-nav-icon']} /> Calendar
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
          <section className={`${styles['projects-section']} `}>
            <h1 className={styles['projects-section-head']}>Projects</h1>

            {/* Personal Tasks */}
            <div className={styles['projects-div']}>
              <p className={styles['projects-head']}>Personal</p>
              <ul className={styles['projects-list']}>
                <li
                  className={`${styles['projects-list-item']} ${
                    taskType === 'personal'
                      ? styles['current-project-list-item']
                      : ''
                  }`}
                  onClick={() => setTaskType('personal')}
                >
                  <img
                    src="../../assets/images/download.jpeg"
                    className={styles['projects-item-img']}
                  />
                  <span
                    className={`${styles['projects-item-details']} ${
                      taskType === 'personal'
                        ? styles['current-projects-item-details']
                        : ''
                    }`}
                  >
                    <span className={styles['projects-item-name']}>
                      Fitness App
                    </span>
                    <span className={styles['projects-item-count']}>
                      35 tasks
                    </span>
                  </span>
                  <span className={styles['projects-item-action']}>
                    <BsThreeDotsVertical
                      className={`${styles['projects-item-menu']} ${
                        taskType === 'personal'
                          ? styles['current-projects-item-menu']
                          : ''
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    />

                    <span
                      className={styles['view-project-link']}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Project
                    </span>
                  </span>
                </li>
                <li className={styles['projects-list-item']}>
                  <img
                    src="../../assets/images/download.jpeg"
                    className={styles['projects-item-img']}
                  />
                  <span className={styles['projects-item-details']}>
                    <span className={styles['projects-item-name']}>
                      Fitness App
                    </span>
                    <span className={styles['projects-item-count']}>
                      35 tasks
                    </span>
                  </span>
                  <span className={styles['projects-item-action']}>
                    <BsThreeDotsVertical
                      className={styles['projects-item-menu']}
                    />

                    <span className={styles['view-project-link']}>
                      View Project
                    </span>
                  </span>
                </li>
                <li className={styles['projects-list-item']}>
                  <img
                    src="../../assets/images/download.jpeg"
                    className={styles['projects-item-img']}
                  />
                  <span className={styles['projects-item-details']}>
                    <span className={styles['projects-item-name']}>
                      Fitness App
                    </span>
                    <span className={styles['projects-item-count']}>
                      35 tasks
                    </span>
                  </span>
                  <span className={styles['projects-item-action']}>
                    <BsThreeDotsVertical
                      className={styles['projects-item-menu']}
                    />

                    <span className={styles['view-project-link']}>
                      View Project
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            <br />

            {/* Assigned Tasks */}
            <div className={styles['projects-div']}>
              <p className={styles['projects-head']}>Assigned</p>
              <ul className={styles['projects-list']}>
                <li
                  className={`${styles['projects-list-item']}  ${
                    taskType === 'assigned'
                      ? styles['current-project-list-item']
                      : ''
                  }`}
                  onClick={() => setTaskType('assigned')}
                >
                  <img
                    src="../../assets/images/profile1.webp"
                    className={styles['projects-item-img']}
                  />
                  <span
                    className={`${styles['projects-item-details']} ${
                      taskType === 'assigned'
                        ? styles['current-projects-item-details']
                        : ''
                    }`}
                  >
                    <span className={styles['projects-item-name']}>
                      Fitness App
                    </span>
                    <span className={styles['projects-item-count']}>
                      35 tasks
                    </span>
                  </span>
                  <span className={styles['projects-item-action']}>
                    <BsThreeDotsVertical
                      className={`${styles['projects-item-menu']} ${
                        taskType === 'assigned'
                          ? styles['current-projects-item-menu']
                          : ''
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    />

                    <span
                      className={styles['view-project-link']}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Project
                    </span>
                  </span>
                </li>
                <li className={styles['projects-list-item']}>
                  <img
                    src="../../assets/images/profile2webp.webp"
                    className={styles['projects-item-img']}
                  />
                  <span className={styles['projects-item-details']}>
                    <span className={styles['projects-item-name']}>
                      Fitness App
                    </span>
                    <span className={styles['projects-item-count']}>
                      35 tasks
                    </span>
                  </span>
                  <span className={styles['projects-item-action']}>
                    <BsThreeDotsVertical
                      className={styles['projects-item-menu']}
                    />

                    <span className={styles['view-project-link']}>
                      View Project
                    </span>
                  </span>
                </li>
                <li className={styles['projects-list-item']}>
                  <img
                    src="../../assets/images/profile4.jpeg"
                    className={styles['projects-item-img']}
                  />
                  <span className={styles['projects-item-details']}>
                    <span className={styles['projects-item-name']}>
                      Fitness App
                    </span>
                    <span className={styles['projects-item-count']}>
                      35 tasks
                    </span>
                  </span>
                  <span className={styles['projects-item-action']}>
                    <BsThreeDotsVertical
                      className={styles['projects-item-menu']}
                    />

                    <span className={styles['view-project-link']}>
                      View Project
                    </span>
                  </span>
                </li>
              </ul>
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
                  <ul className={styles['alt-projects-list']}>
                    <li
                      className={`${styles['alt-projects-list-item']} ${
                        taskType === 'personal'
                          ? styles['current-project-list-item']
                          : ''
                      }`}
                      onClick={() => setTaskType('personal')}
                    >
                      <img
                        src="../../assets/images/download.jpeg"
                        className={styles['projects-item-img']}
                      />
                      <span
                        className={`${styles['projects-item-details']} ${
                          taskType === 'personal'
                            ? styles['current-projects-item-details']
                            : ''
                        }`}
                      >
                        <span className={styles['projects-item-name']}>
                          Fitness App
                        </span>
                        <span className={styles['projects-item-count']}>
                          35 tasks
                        </span>
                      </span>
                      <span className={styles['projects-item-action']}>
                        <BsThreeDotsVertical
                          className={`${styles['projects-item-menu']} ${
                            taskType === 'personal'
                              ? styles['current-projects-item-menu']
                              : ''
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        />

                        <span
                          className={styles['view-project-link']}
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Project
                        </span>
                      </span>
                    </li>
                    <li className={styles['alt-projects-list-item']}>
                      <img
                        src="../../assets/images/download.jpeg"
                        className={styles['projects-item-img']}
                      />
                      <span className={styles['projects-item-details']}>
                        <span className={styles['projects-item-name']}>
                          Fitness App
                        </span>
                        <span className={styles['projects-item-count']}>
                          35 tasks
                        </span>
                      </span>
                      <span className={styles['projects-item-action']}>
                        <BsThreeDotsVertical
                          className={styles['projects-item-menu']}
                        />

                        <span className={styles['view-project-link']}>
                          View Project
                        </span>
                      </span>
                    </li>
                    <li className={styles['alt-projects-list-item']}>
                      <img
                        src="../../assets/images/download.jpeg"
                        className={styles['projects-item-img']}
                      />
                      <span className={styles['projects-item-details']}>
                        <span className={styles['projects-item-name']}>
                          Fitness App
                        </span>
                        <span className={styles['projects-item-count']}>
                          35 tasks
                        </span>
                      </span>
                      <span className={styles['projects-item-action']}>
                        <BsThreeDotsVertical
                          className={styles['projects-item-menu']}
                        />

                        <span className={styles['view-project-link']}>
                          View Project
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>

                <br />

                {/* Assigned Tasks */}
                <div className={styles['projects-div']}>
                  <p className={styles['projects-head']}>Assigned</p>
                  <ul className={styles['alt-projects-list']}>
                    <li
                      className={`${styles['alt-projects-list-item']}  ${
                        taskType === 'assigned'
                          ? styles['current-project-list-item']
                          : ''
                      }`}
                      onClick={() => setTaskType('assigned')}
                    >
                      <img
                        src="../../assets/images/profile1.webp"
                        className={styles['projects-item-img']}
                      />
                      <span
                        className={`${styles['projects-item-details']} ${
                          taskType === 'assigned'
                            ? styles['current-projects-item-details']
                            : ''
                        }`}
                      >
                        <span className={styles['projects-item-name']}>
                          Fitness App
                        </span>
                        <span className={styles['projects-item-count']}>
                          35 tasks
                        </span>
                      </span>
                      <span className={styles['projects-item-action']}>
                        <BsThreeDotsVertical
                          className={`${styles['projects-item-menu']} ${
                            taskType === 'assigned'
                              ? styles['current-projects-item-menu']
                              : ''
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        />

                        <span
                          className={styles['view-project-link']}
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Project
                        </span>
                      </span>
                    </li>
                    <li className={styles['alt-projects-list-item']}>
                      <img
                        src="../../assets/images/profile2webp.webp"
                        className={styles['projects-item-img']}
                      />
                      <span className={styles['projects-item-details']}>
                        <span className={styles['projects-item-name']}>
                          Fitness App
                        </span>
                        <span className={styles['projects-item-count']}>
                          35 tasks
                        </span>
                      </span>
                      <span className={styles['projects-item-action']}>
                        <BsThreeDotsVertical
                          className={styles['projects-item-menu']}
                        />

                        <span className={styles['view-project-link']}>
                          View Project
                        </span>
                      </span>
                    </li>
                    <li className={styles['alt-projects-list-item']}>
                      <img
                        src="../../assets/images/profile4.jpeg"
                        className={styles['projects-item-img']}
                      />
                      <span className={styles['projects-item-details']}>
                        <span className={styles['projects-item-name']}>
                          Fitness App
                        </span>
                        <span className={styles['projects-item-count']}>
                          35 tasks
                        </span>
                      </span>
                      <span className={styles['projects-item-action']}>
                        <BsThreeDotsVertical
                          className={styles['projects-item-menu']}
                        />

                        <span className={styles['view-project-link']}>
                          View Project
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <h1 className={styles['tasks-section-head']}>Tasks</h1>

            <div className={styles['add-task-btn-div']}>
              <h1 className={styles['tasks-section-text']}>Tasks</h1>
              <button className={styles['add-task-btn']}>Add task</button>
            </div>

            <div className={styles['article-box']}>
              {taskType === 'personal' &&
                tasks.map((task, index) => <TaskBox key={index} />)}

              {taskType === 'assigned' &&
                tasks.map((task, index) => <TaskBox2 key={index} />)}
            </div>
          </section>
        </section>
      </section>
      
    </main>
  );
};

export default Tasks;
