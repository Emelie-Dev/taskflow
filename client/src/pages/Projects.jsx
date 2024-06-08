import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Projects.module.css';
import { SiKashflow, SiSimpleanalytics } from 'react-icons/si';
import { Link } from 'react-router-dom';

import { IoChatbubblesSharp, IoSettingsOutline } from 'react-icons/io5';
import {
  IoIosSearch,
  IoMdClose,
  IoIosNotifications,
  IoMdGrid,
} from 'react-icons/io';

import {
  MdOutlineDashboard,
  MdTableRows,
  MdOutlineSegment,
  MdOutlineModeEditOutline,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { FaTasks, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { GoProjectTemplate } from 'react-icons/go';
import { HiPlus } from 'react-icons/hi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaRegDotCircle } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaRegCircleUser } from 'react-icons/fa6';
import { IoCloseSharp } from 'react-icons/io5';
import Project from '../components/Project';

const Projects = () => {
  const [searchText, setSearchText] = useState('');
  const [currentAction, setCurrentAction] = useState(0);
  const [displayFormat, setDisplayFormat] = useState('grid');
  const [showNav, setShowNav] = useState(false);
  const [displayModal, setdisplayModal] = useState(false);
  const searchRef = useRef();
  const actionRef = useRef();
  const menuRef = useRef();
  const navRef = useRef();

  useEffect(() => {
    const hideAction = (e) => {
      if (currentRef.current) {
        if (!currentRef.current.contains(e.target)) {
          setCurrentAction(0);
        }
      }
    };

    window.addEventListener('click', hideAction);

    return () => {
      window.removeEventListener('click', hideAction);
    };
  }, [currentAction]);

  let currentRef = menuRef;

  const handleSearchText = (e) => {
    setSearchText(e.target.value);
  };

  const clearSearchText = () => {
    setSearchText('');
    searchRef.current.focus();
  };

  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0];

  const handleAction = (index) => {
    setCurrentAction(index + 1);
    currentRef = actionRef;
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
            <li className={styles['side-nav-item']}>
              <Link to={'/dashboard'} className={styles['side-nav-link']}>
                <MdOutlineDashboard className={styles['side-nav-icon']} />{' '}
                Dashboard
              </Link>
            </li>
            <li className={`${styles['side-nav-item']} ${styles.projects}`}>
              <Link
                to={'/projects'}
                className={`${styles['side-nav-link']} ${styles['projects-link']}`}
              >
                <GoProjectTemplate
                  className={`${styles['side-nav-icon']}  ${styles['projects-icon']}`}
                />{' '}
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
          <li className={styles['side-nav-item']}>
            <Link to={'/dashboard'} className={styles['side-nav-link']}>
              <MdOutlineDashboard className={styles['side-nav-icon']} />{' '}
              Dashboard
            </Link>
          </li>
          <li className={`${styles['side-nav-item']} ${styles.projects}`}>
            <Link
              to={'/projects'}
              className={`${styles['side-nav-link']} ${styles['projects-link']}`}
            >
              <GoProjectTemplate
                className={`${styles['side-nav-icon']}  ${styles['projects-icon']}`}
              />{' '}
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

          <h1 className={styles['page']}>Projects</h1>

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

        {displayModal && (
          <Project
            displayModal={displayModal}
            setdisplayModal={setdisplayModal}
          />
        )}

        <section className={styles['section-content']}>
          <div className={styles['section-head']}>
            <div className={styles['sort-div']}>
              <span className={styles['sort-text']}>Sort by:</span>
              <select className={styles['sort-select']}>
                <option value={'newest'}>Newest</option>
                <option value={'oldest'}>Oldest</option>
                <option value={'alphabetically'}>Alphabetically</option>
              </select>
            </div>

            <div className={styles['filter-div']}>
              <button
                className={`${styles['filter-btn']} ${styles['current-filter-btn']}`}
              >
                All
              </button>
              <button className={styles['filter-btn']}>Ongoing</button>
              <button className={styles['filter-btn']}>Open</button>
              <button className={styles['filter-btn']}>Completed</button>
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
                onClick={() => setDisplayFormat('table')}
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
                onClick={() => setdisplayModal(true)}
              >
                {' '}
                <HiPlus className={styles['create-project-icon']} />
                Create Project
              </button>
            </div>
          </div>

          <div className={styles['alternate-filter-div']}>
            <button
              className={`${styles['alternate-filter-btn']} ${styles['alternate-current-filter-btn']}`}
            >
              All
            </button>
            <button className={styles['alternate-filter-btn']}>Ongoing</button>
            <button className={styles['alternate-filter-btn']}>Open</button>
            <button className={styles['alternate-filter-btn']}>
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
              onClick={() => setdisplayModal(true)}
            >
              {' '}
              <HiPlus className={styles['alternate-project-icon']} />
              Create Project
            </button>
          </div>

          {displayFormat === 'grid' && (
            <div className={styles['article-box']}>
              {arr.map((value, index) => (
                <article key={index} className={styles.article}>
                  <div className={styles['menu-div']}>
                    <BsThreeDotsVertical className={styles['grid-menu-icon']} />
                    <ul className={styles['menu-action-list']}>
                      <li className={styles['menu-action-item']}>
                        <MdOutlineModeEditOutline
                          className={styles['action-icon']}
                        />
                        Edit
                      </li>
                      <li className={styles['menu-action-item']}>
                        <RiDeleteBin6Line className={styles['action-icon']} />{' '}
                        Delete
                      </li>
                    </ul>
                  </div>

                  <h1 className={styles['project-name']}>Fitness App</h1>
                  <span className={styles['project-tasks']}>
                    <span className={styles['open-tasks']}>2</span> open tasks,{' '}
                    <span className={styles['completed-tasks']}>9</span>{' '}
                    completed
                  </span>
                  <p className={styles['project-details']}>
                    A cutting-edge fitness application designed to revolutionize
                    your health and wellness journey.
                  </p>

                  <div className={styles['property-div']}>
                    <span className={styles['property-name']}>Deadline:</span>
                    <span className={styles['deadline-value']}>
                      18 Mar, 2024
                    </span>
                  </div>
                  <div className={styles['property-div']}>
                    <span className={styles['property-name']}>
                      Project Leader:
                    </span>
                    <span className={styles['property-tooltip']}>
                      <img
                        className={styles['leader-img']}
                        src="../../assets/images/download.jpeg"
                      />
                      <span className={styles['property-tooltip-text']}>
                        John Snow
                      </span>
                    </span>
                  </div>
                  <div className={styles['property-div']}>
                    <span className={styles['property-name']}>Team:</span>
                    <div className={styles['team-pics-box']}>
                      <span className={styles['team-pics-tooltip']}>
                        <img
                          src="../../assets/images/profile1.webp"
                          className={styles['team-pics']}
                        />
                        <span className={styles['team-pics-tooltip-text']}>
                          Rob Stark
                        </span>
                      </span>
                      <span className={styles['team-pics-tooltip']}>
                        <img
                          src="../../assets/images/profile2webp.webp"
                          className={styles['team-pics']}
                        />
                        <span className={styles['team-pics-tooltip-text']}>
                          Sansa Stark
                        </span>
                      </span>
                      <span className={styles['team-pics-tooltip']}>
                        <img
                          src="../../assets/images/profile3.jpeg"
                          className={styles['team-pics']}
                        />
                        <span className={styles['team-pics-tooltip-text']}>
                          Ramsay Bolton
                        </span>
                      </span>
                      <span className={styles['team-pics-tooltip']}>
                        <img
                          src="../../assets/images/profile4.jpeg"
                          className={styles['team-pics']}
                        />
                        <span className={styles['team-pics-tooltip-text']}>
                          Jamie Lannister
                        </span>
                      </span>
                      <span className={styles['team-icon-box']}>
                        <HiPlus className={styles['team-icon']} />
                        <span className={styles['team-number']}>10</span>
                      </span>
                    </div>
                  </div>

                  <div className={styles['progess-div']}>
                    <div className={styles['progess-box']}>
                      <span className={styles['progess-text']}>Progress</span>
                      <span className={styles['progess-value']}>60%</span>
                    </div>

                    <div className={styles['progress-bar']}>&nbsp;</div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {displayFormat === 'table' && (
            <div className={styles['table-container']}>
              <div className={styles['entry-box']}>
                Show&nbsp;
                <select className={styles['entry-select']}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                &nbsp;entries
              </div>

              <div className={styles['table-div']}>
                <table className={styles['project-table']}>
                  <thead>
                    <tr className={styles['table-head-row']}>
                      <th className={styles['table-head']}>Project</th>
                      <th className={styles['table-head']}>Leader</th>
                      <th className={styles['table-head']}>Team</th>
                      <th className={styles['table-head']}>Deadline</th>
                      <th className={styles['table-head']}>Progress</th>
                      <th className={styles['table-head']}>Status</th>
                      <th className={styles['table-head']}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {arr.map((value, index) => (
                      <tr key={index}>
                        <td className={styles['table-project-name']}>
                          Fitness App
                        </td>
                        <td>
                          <span className={styles['table-project-leader-box']}>
                            <img
                              className={styles['table-project-leader']}
                              src="../../assets/images/download.jpeg"
                            />
                            <span
                              className={styles['table-project-leader-name']}
                            >
                              John Snow
                            </span>
                          </span>
                        </td>
                        <td>
                          <div className={styles['table-team-box']}>
                            <span className={styles['table-team-pics-box']}>
                              <img
                                className={styles['table-team-pics']}
                                src="../../assets/images/profile1.webp"
                              />
                              <span className={styles['table-team-name']}>
                                Rob Stark
                              </span>
                            </span>
                            <span className={styles['table-team-pics-box']}>
                              <img
                                className={styles['table-team-pics']}
                                src="../../assets/images/profile2webp.webp"
                              />
                              <span className={styles['table-team-name']}>
                                Sansa Stark
                              </span>
                            </span>
                            <span className={styles['table-team-pics-box']}>
                              <img
                                className={styles['table-team-pics']}
                                src="../../assets/images/profile3.jpeg"
                              />
                              <span className={styles['table-team-name']}>
                                Ramsay Bolton
                              </span>
                            </span>
                            <span className={styles['table-team-pics-box']}>
                              <img
                                className={styles['table-team-pics']}
                                src="../../assets/images/profile4.jpeg"
                              />
                              <span className={styles['table-team-name']}>
                                Jamie Lannister
                              </span>
                            </span>
                            <span className={styles['table-team-icon-box']}>
                              <HiPlus className={styles['table-team-icon']} />
                              <span className={styles['team-number']}>10</span>
                            </span>
                          </div>
                        </td>
                        <td className={styles['table-project-deadline']}>
                          18 Mar, 2024
                        </td>
                        <td className={styles['table-project-progress']}>
                          30%
                        </td>
                        <td>
                          <select
                            className={styles['table-project-select']}
                            disabled={(index + 1) % 4 === 0 ? false : true}
                          >
                            <option value={'active'}>Active</option>
                            <option value={'inactive'}>Inactive</option>
                          </select>
                        </td>
                        <td
                          className={styles['table-project-action']}
                          ref={currentAction === index + 1 ? menuRef : null}
                        >
                          <BsThreeDotsVertical
                            className={styles['table-project-menu']}
                            onClick={() => handleAction(index)}
                          />
                          <ul
                            ref={currentAction === index + 1 ? actionRef : null}
                            className={`${styles['action-box']} ${
                              currentAction === index + 1
                                ? styles['show-action-box']
                                : ''
                            }`}
                          >
                            <li className={styles['action-option']}>
                              <MdOutlineModeEditOutline
                                className={styles['action-icon']}
                              />
                              Edit
                            </li>
                            <li className={styles['action-option']}>
                              <RiDeleteBin6Line
                                className={styles['action-icon']}
                              />{' '}
                              Delete
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <footer className={styles.footer}>
                  <div className={styles['footer-text']}>
                    Showing{' '}
                    <span className={styles['footer-entry-text']}>1</span> to{' '}
                    <span className={styles['footer-entry-text']}>25</span> of{' '}
                    <span className={styles['footer-entry-text']}>250</span>{' '}
                    entries
                  </div>

                  <div className={styles['entry-navigation-box']}>
                    <span className={styles['footer-content-box']}>
                      <MdKeyboardDoubleArrowLeft
                        className={styles['footer-icon']}
                      />
                    </span>
                    <span className={styles['footer-content-box']}>1</span>
                    <span className={styles['footer-content-box']}>2</span>
                    <span className={styles['footer-content-box']}>3</span>
                    <span className={styles['footer-content-box']}>
                      <MdKeyboardDoubleArrowRight
                        className={styles['footer-icon']}
                      />
                    </span>
                  </div>
                </footer>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Projects;
