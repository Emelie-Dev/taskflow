import React, { forwardRef, useRef, useContext } from 'react';
import styles from '../styles/NavBar.module.css';
import { Link } from 'react-router-dom';
import { SiKashflow, SiSimpleanalytics } from 'react-icons/si';
import { MdOutlineDashboard } from 'react-icons/md';
import { GoProjectSymlink } from 'react-icons/go';
import { FaTasks, FaCalendarAlt } from 'react-icons/fa';
import { IoChatbubblesSharp, IoSettingsOutline } from 'react-icons/io5';
import { IoIosNotifications } from 'react-icons/io';
import { FaRegCircleUser } from 'react-icons/fa6';
import { AuthContext } from '../App';

const NavBar = forwardRef(({ page, showNav, setShowNav }, ref) => {
  const { mode } = useContext(AuthContext);
  const navRef = useRef();

  const hideNav = (e) => {
    if (e.target === navRef.current) {
      setShowNav(false);
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`${styles['responsive-nav']} ${
          showNav ? styles['show-nav'] : ''
        } `}
        onClick={hideNav}
      >
        <section
          className={`${styles['responsive-section']}  ${
            mode === 'dark' ? styles['dark-nav'] : ''
          }`}
        >
          <div
            className={`${styles['responsive-head']} ${
              mode === 'dark' ? styles['dark-head'] : ''
            } `}
          >
            <span className={styles['icon-box']}>
              <Link to={'/'}>
                <SiKashflow className={styles.icon} />
              </Link>
            </span>

            <span
              className={`${styles['head-text']} ${
                mode === 'dark' ? styles['dark-head-text'] : ''
              } `}
            >
              TaskFlow
            </span>
          </div>

          <ul className={styles['responsive-side-nav']}>
            <li
              className={`${styles['side-nav-item']} ${
                page === 'Dashboard' ? styles.page : ''
              }`}
            >
              <Link
                to={'/dashboard'}
                className={`${styles['side-nav-link']} ${
                  page === 'Dashboard' ? styles['page-link'] : ''
                }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
              >
                <MdOutlineDashboard
                  className={`${styles['side-nav-icon']} ${
                    page === 'Dashboard' ? styles['page-icon'] : ''
                  }`}
                />{' '}
                Dashboard
              </Link>
            </li>

            <li
              className={`${styles['side-nav-item']} ${
                page.startsWith('Project') ? styles.page : ''
              }`}
            >
              <Link
                to={'/projects'}
                className={`${styles['side-nav-link']} ${
                  page.startsWith('Project') ? styles['page-link'] : ''
                }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
              >
                <GoProjectSymlink
                  className={`${styles['side-nav-icon']} ${
                    page.startsWith('Project') ? styles['page-icon'] : ''
                  }`}
                />
                Projects
              </Link>
            </li>

            <li
              className={`${styles['side-nav-item']} ${
                page === 'Tasks' ? styles.page : ''
              }  `}
            >
              <Link
                to={'/tasks'}
                className={`${styles['side-nav-link']} ${
                  page === 'Tasks' ? styles['page-link'] : ''
                } ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
              >
                <FaTasks
                  className={`${styles['side-nav-icon']} ${
                    page === 'Tasks' ? styles['page-icon'] : ''
                  }`}
                />{' '}
                Tasks
              </Link>
            </li>

            <li
              className={`${styles['side-nav-item']} ${
                page === 'Calendar' ? styles.page : ''
              }`}
            >
              <Link
                to={'/calendar'}
                className={`${styles['side-nav-link']} ${
                  page === 'Calendar' ? styles['page-link'] : ''
                }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
              >
                <FaCalendarAlt
                  className={`${styles['side-nav-icon']} ${
                    page === 'Calendar' ? styles['page-icon'] : ''
                  }`}
                />{' '}
                Calendar
              </Link>
            </li>

            <li
              className={`${styles['side-nav-item']} ${
                page === 'Chats' ? styles.page : ''
              }`}
            >
              <Link
                to={'/chats'}
                className={`${styles['side-nav-link']} ${
                  page === 'Chats' ? styles['page-link'] : ''
                }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
              >
                <IoChatbubblesSharp
                  className={`${styles['side-nav-icon']} ${
                    page === 'Chats' ? styles['page-icon'] : ''
                  }`}
                />{' '}
                Chats
              </Link>
            </li>

            <li
              className={`${styles['side-nav-item']} ${
                page === 'Analytics' ? styles.page : ''
              }`}
            >
              <Link
                to={'/analytics'}
                className={`${styles['side-nav-link']} ${
                  page === 'Analytics' ? styles['page-link'] : ''
                }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
              >
                <SiSimpleanalytics
                  className={`${styles['side-nav-icon']} ${
                    page === 'Analytics' ? styles['page-icon'] : ''
                  }`}
                />{' '}
                Analytics
              </Link>
            </li>

            <li
              className={`${styles['side-nav-item']} ${
                page === 'Notifications' ? styles.page : ''
              } ${page === 'Notifications' ? '' : styles.notifications}  `}
            >
              <Link
                to={'/notifications'}
                className={`${styles['side-nav-link']} ${
                  page === 'Notifications' ? styles['page-link'] : ''
                }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
              >
                <IoIosNotifications
                  className={`${styles['side-nav-icon2']} ${
                    page === 'Notifications' ? styles['page-icon'] : ''
                  }`}
                />{' '}
                Notifications
              </Link>
            </li>

            <li
              className={`${styles['side-nav-item']} ${
                page === 'Profile' ? styles.page : ''
              }`}
            >
              <Link
                to={'/profile'}
                className={`${styles['side-nav-link']} ${
                  page === 'Profile' ? styles['page-link'] : ''
                }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
              >
                <FaRegCircleUser
                  className={`${styles['side-nav-icon']} ${
                    page === 'Profile' ? styles['page-icon'] : ''
                  }`}
                />{' '}
                Profile
              </Link>
            </li>

            {page === 'Users' && (
              <li
                className={`${styles['side-nav-item']} ${
                  page === 'Users' ? styles.page : ''
                }`}
              >
                <Link
                  to={'#'}
                  className={`${styles['side-nav-link']} ${
                    page === 'Users' ? styles['page-link'] : ''
                  }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
                >
                  <FaRegCircleUser
                    className={`${styles['side-nav-icon']} ${
                      page === 'Users' ? styles['page-icon'] : ''
                    }`}
                  />{' '}
                  Users
                </Link>
              </li>
            )}

            <li
              className={`${styles['side-nav-item']} ${
                page === 'Settings' ? styles.page : ''
              }`}
            >
              <Link
                to={'/settings'}
                className={`${styles['side-nav-link']} ${
                  page === 'Settings' ? styles['page-link'] : ''
                }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
              >
                <IoSettingsOutline
                  className={`${styles['side-nav-icon']} ${
                    page === 'Settings' ? styles['page-icon'] : ''
                  }`}
                />{' '}
                Settings
              </Link>
            </li>
          </ul>
        </section>
      </nav>

      <nav
        className={`${styles.nav} ${
          page === 'Dashboard' ? styles['dashboard-nav'] : ''
        }  ${mode === 'dark' ? styles['dark-nav'] : ''}`}
        ref={ref}
      >
        <div
          className={`${styles.head}  ${
            mode === 'dark' ? styles['dark-head'] : ''
          } `}
        >
          <span className={styles['icon-box']}>
            <Link to={'/'}>
              <SiKashflow className={styles.icon} />
            </Link>
          </span>

          <span
            className={`${styles['head-text']} ${
              mode === 'dark' ? styles['dark-head-text'] : ''
            } `}
          >
            TaskFlow
          </span>
        </div>

        <ul className={styles['side-nav']}>
          <li
            className={`${styles['side-nav-item']} ${
              page === 'Dashboard' ? styles.page : ''
            }`}
          >
            <Link
              to={'/dashboard'}
              className={`${styles['side-nav-link']} ${
                page === 'Dashboard' ? styles['page-link'] : ''
              }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
            >
              <MdOutlineDashboard
                className={`${styles['side-nav-icon']} ${
                  page === 'Dashboard' ? styles['page-icon'] : ''
                }`}
              />{' '}
              Dashboard
            </Link>
          </li>

          <li
            className={`${styles['side-nav-item']} ${
              page.startsWith('Project') ? styles.page : ''
            }`}
          >
            <Link
              to={'/projects'}
              className={`${styles['side-nav-link']} ${
                page.startsWith('Project') ? styles['page-link'] : ''
              } ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
            >
              <GoProjectSymlink
                className={`${styles['side-nav-icon']} ${
                  page.startsWith('Project') ? styles['page-icon'] : ''
                }`}
              />{' '}
              Projects
            </Link>
          </li>

          <li
            className={`${styles['side-nav-item']} ${
              page === 'Tasks' ? styles.page : ''
            } `}
          >
            <Link
              to={'/tasks'}
              className={`${styles['side-nav-link']} ${
                page === 'Tasks' ? styles['page-link'] : ''
              }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
            >
              <FaTasks
                className={`${styles['side-nav-icon']} ${
                  page === 'Tasks' ? styles['page-icon'] : ''
                }`}
              />{' '}
              Tasks
            </Link>
          </li>

          <li
            className={`${styles['side-nav-item']} ${
              page === 'Calendar' ? styles.page : ''
            }`}
          >
            <Link
              to={'/calendar'}
              className={`${styles['side-nav-link']} ${
                page === 'Calendar' ? styles['page-link'] : ''
              }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
            >
              <FaCalendarAlt
                className={`${styles['side-nav-icon']} ${
                  page === 'Calendar' ? styles['page-icon'] : ''
                }`}
              />{' '}
              Calendar
            </Link>
          </li>

          <li
            className={`${styles['side-nav-item']} ${
              page === 'Chats' ? styles.page : ''
            }`}
          >
            <Link
              to={'/chats'}
              className={`${styles['side-nav-link']} ${
                page === 'Chats' ? styles['page-link'] : ''
              }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
            >
              <IoChatbubblesSharp
                className={`${styles['side-nav-icon']} ${
                  page === 'Chats' ? styles['page-icon'] : ''
                }`}
              />{' '}
              Chats
            </Link>
          </li>

          <li
            className={`${styles['side-nav-item']} ${
              page === 'Analytics' ? styles.page : ''
            }`}
          >
            <Link
              to={'/analytics'}
              className={`${styles['side-nav-link']} ${
                page === 'Analytics' ? styles['page-link'] : ''
              }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
            >
              <SiSimpleanalytics
                className={`${styles['side-nav-icon']} ${
                  page === 'Analytics' ? styles['page-icon'] : ''
                }`}
              />{' '}
              Analytics
            </Link>
          </li>

          <li
            className={`${styles['side-nav-item']} ${
              page === 'Notifications' ? styles.page : ''
            } ${page === 'Notifications' ? '' : styles.notifications} `}
          >
            <Link
              to={'/notifications'}
              className={`${styles['side-nav-link']} ${
                page === 'Notifications' ? styles['page-link'] : ''
              }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
            >
              <IoIosNotifications
                className={`${styles['side-nav-icon2']} ${
                  page === 'Notifications' ? styles['page-icon'] : ''
                }`}
              />{' '}
              Notifications
            </Link>
          </li>

          <li
            className={`${styles['side-nav-item']} ${
              page === 'Profile' ? styles.page : ''
            }`}
          >
            <Link
              to={'/profile'}
              className={`${styles['side-nav-link']} ${
                page === 'Profile' ? styles['page-link'] : ''
              }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
            >
              <FaRegCircleUser
                className={`${styles['side-nav-icon']} ${
                  page === 'Profile' ? styles['page-icon'] : ''
                }`}
              />{' '}
              Profile
            </Link>
          </li>

          {page === 'Users' && (
            <li
              className={`${styles['side-nav-item']} ${
                page === 'Users' ? styles.page : ''
              }`}
            >
              <Link
                to={'#'}
                className={`${styles['side-nav-link']} ${
                  page === 'Users' ? styles['page-link'] : ''
                }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
              >
                <FaRegCircleUser
                  className={`${styles['side-nav-icon']} ${
                    page === 'Users' ? styles['page-icon'] : ''
                  }`}
                />{' '}
                Users
              </Link>
            </li>
          )}

          <li
            className={`${styles['side-nav-item']} ${
              page === 'Settings' ? styles.page : ''
            }`}
          >
            <Link
              to={'/settings'}
              className={`${styles['side-nav-link']} ${
                page === 'Settings' ? styles['page-link'] : ''
              }  ${mode === 'dark' ? styles['dark-side-nav'] : ''}`}
            >
              <IoSettingsOutline
                className={`${styles['side-nav-icon']} ${
                  page === 'Settings' ? styles['page-icon'] : ''
                }`}
              />{' '}
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
});

export default NavBar;
