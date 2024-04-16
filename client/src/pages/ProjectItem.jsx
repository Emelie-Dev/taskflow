import React, { useState, useRef } from 'react';
import styles from '../styles/ProjectItem.module.css';
import { SiKashflow, SiSimpleanalytics } from 'react-icons/si';
import { Link } from 'react-router-dom';

import { IoChatbubblesSharp, IoSettingsOutline } from 'react-icons/io5';
import { IoIosNotifications } from 'react-icons/io';

import { MdOutlineDashboard, MdOutlineSegment } from 'react-icons/md';
import { FaTasks, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { GoProjectTemplate } from 'react-icons/go';
import { FaRegCircleUser, FaFileImage } from 'react-icons/fa6';
import { FaFileLines } from 'react-icons/fa6';
import { BsFileEarmarkPdfFill, BsThreeDotsVertical } from 'react-icons/bs';

const ProjectItem = () => {
  const [showNav, setShowNav] = useState(false);
  const navRef = useRef();

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

          <h1 className={styles['page']}>Project</h1>

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
          <h1 className={styles['project-name']}>Fitness App</h1>

          <div className={styles['project-container']}>
            <div className={styles['left-section']}>
              <div className={styles['project-content']}>
                <span className={styles['project-leader']}>
                  <span className={styles['leader-text']}>Project Leader:</span>
                  <span className={styles['leader']}>
                    <img
                      src="../../assets/images/profile1.webp"
                      className={styles['leader-img']}
                    />{' '}
                    Jon Snow
                  </span>
                </span>

                <span className={styles['project-description']}>
                  <span className={styles['description-text']}>
                    Project Description:
                  </span>
                  <div className={styles['description']}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec vel elit neque. Class aptent taciti sociosqu ad litora
                    torquent per conubia nostra, per inceptos himenaeos.
                    Vestibulum sollicitudin libero vitae est consectetur, a
                    molestie tortor consectetur. Aenean tincidunt interdum
                    ipsum, id pellentesque diam suscipit ut. Vivamus massa mi,
                    fermentum eget neque eget, imperdiet tristique lectus. Proin
                    at purus ut sem pellentesque tempor sit amet ut lectus. Sed
                    orci augue, placerat et pretium ac, hendrerit in felis.
                    Integer scelerisque libero non metus commodo, et hendrerit
                    diam aliquet. Proin tincidunt porttitor ligula, a tincidunt
                    orci pellentesque nec. Ut ultricies maximus nulla id
                    consequat. Fusce eu consequat mi, eu euismod ligula. Aliquam
                    porttitor neque id massa porttitor, a pretium velit
                    vehicula. Morbi volutpat tincidunt urna, vel ullamcorper
                    ligula fermentum at.
                  </div>
                </span>
              </div>

              <div className={styles['files-conatiner']}>
                <span className={styles['files-text']}>Uploaded Files</span>

                <div className={styles['files-box']}>
                  <article className={styles['uploaded-file']}>
                    <BsFileEarmarkPdfFill
                      className={`${styles['file-icon']} ${styles['file-icon1']}`}
                    />
                    <div className={styles['file-content']}>
                      <span className={styles['file-name']}>
                        AHA Selfcare Mobile Application Test-Cases.xls
                      </span>
                      <span className={styles['file-details']}>
                        <span className={styles['file-property']}>Sender:</span>
                        <span className={styles['file-sender']}>
                          Arya Stark
                        </span>
                      </span>
                      <span className={styles['file-details']}>
                        <span className={styles['file-property']}>Size:</span>
                        <span className={styles['file-size']}>
                          2<span className={styles['size-unit']}>mb</span>
                        </span>
                      </span>
                      <span className={styles['file-details']}>
                        <span className={styles['file-property']}>
                          Time Sent:
                        </span>
                        <span className={styles['time-sent']}>
                          March 31st at 6:53 PM
                        </span>
                      </span>
                    </div>

                    <div className={styles['menu-box']}>
                      <BsThreeDotsVertical className={styles['menu-icon']} />
                      <ul className={styles['menu-list']}>
                        <li className={styles['menu-item']}>Download</li>
                        <li className={styles['menu-item']}>Delete</li>
                      </ul>
                    </div>
                  </article>

                  <article className={styles['uploaded-file']}>
                    <FaFileImage
                      className={`${styles['file-icon']} ${styles['file-icon2']}`}
                    />
                    <div className={styles['file-content']}>
                      <span className={styles['file-name']}>
                        AHA Selfcare Mobile Application Test-Cases.xls
                      </span>
                      <span className={styles['file-details']}>
                        <span className={styles['file-property']}>Sender:</span>
                        <span className={styles['file-sender']}>
                          Arya Stark
                        </span>
                      </span>
                      <span className={styles['file-details']}>
                        <span className={styles['file-property']}>Size:</span>
                        <span className={styles['file-size']}>
                          2<span className={styles['size-unit']}>mb</span>
                        </span>
                      </span>
                      <span className={styles['file-details']}>
                        <span className={styles['file-property']}>
                          Time Sent:
                        </span>
                        <span className={styles['time-sent']}>
                          March 31st at 6:53 PM
                        </span>
                      </span>
                    </div>
                  </article>

                  <article className={styles['uploaded-file']}>
                    <FaFileLines
                      className={`${styles['file-icon']} ${styles['file-icon3']}`}
                    />
                    <div className={styles['file-content']}>
                      <span className={styles['file-name']}>
                        AHA Selfcare Mobile Application Test-Cases.xls
                      </span>
                      <span className={styles['file-details']}>
                        <span className={styles['file-property']}>Sender:</span>
                        <span className={styles['file-sender']}>
                          Arya Stark
                        </span>
                      </span>
                      <span className={styles['file-details']}>
                        <span className={styles['file-property']}>Size:</span>
                        <span className={styles['file-size']}>
                          2<span className={styles['size-unit']}>mb</span>
                        </span>
                      </span>
                      <span className={styles['file-details']}>
                        <span className={styles['file-property']}>
                          Time Sent:
                        </span>
                        <span className={styles['time-sent']}>
                          March 31st at 6:53 PM
                        </span>
                      </span>
                    </div>
                  </article>
                </div>
              </div>
            </div>

            <div className={styles['right-section']}>
              <div className={styles['project-details-container']}>
                <span className={styles['project-details-head']}>
                  Project Details
                </span>

                <div className={styles['table-container']}>
                  <table className={styles.table}>
                    <tbody>
                      <tr>
                        <td className={styles['table-property']}>Tasks:</td>
                        <td>15</td>
                      </tr>
                      <tr>
                        <td className={styles['table-property']}>Created:</td>
                        <td>10th January, 2024</td>
                      </tr>
                      <tr>
                        <td className={styles['table-property']}>Deadline:</td>
                        <td>26 April, 2024</td>
                      </tr>
                      <tr>
                        <td className={styles['table-property']}>Team:</td>
                        <td>6 members</td>
                      </tr>
                      <tr>
                        <td className={styles['table-property']}>Status:</td>
                        <td>Active</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles['progress-div']}>
                  <span className={styles['progress-box']}>
                    <span>Progress</span>
                    <span className={styles['progress-value']}>60%</span>
                  </span>

                  <span className={styles['progress-bar']}>&nbsp;</span>
                </div>
              </div>

              <div className={styles['project-team-container']}>
                <span className={styles['team-head']}>Team</span>

                <div className={styles['team-div']}>
                  <div className={styles['member-box']}>
                    <img
                      src="../../assets/images/profile2webp.webp"
                      className={styles['member-img']}
                    />
                    <span className={styles['member-details']}>
                      <span className={styles['member-name']}>Arya Stark</span>
                      <span className={styles['member-title']}>
                        Web Designer
                      </span>
                    </span>
                  </div>

                  <div className={styles['member-box']}>
                    <img
                      src="../../assets/images/profile3.jpeg"
                      className={styles['member-img']}
                    />
                    <span className={styles['member-details']}>
                      <span className={styles['member-name']}>
                        Ramsay Bolton
                      </span>
                      <span className={styles['member-title']}>
                        Web Developer
                      </span>
                    </span>
                  </div>

                  <div className={styles['member-box']}>
                    <img
                      src="../../assets/images/profile4.jpeg"
                      className={styles['member-img']}
                    />
                    <span className={styles['member-details']}>
                      <span className={styles['member-name']}>
                        Cersei Lannister
                      </span>
                      <span className={styles['member-title']}>
                        Human resources manager
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default ProjectItem;
