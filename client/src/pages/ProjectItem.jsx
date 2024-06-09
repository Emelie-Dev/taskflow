import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/ProjectItem.module.css';
import { SiKashflow, SiSimpleanalytics } from 'react-icons/si';
import { Link } from 'react-router-dom';

import { IoChatbubblesSharp, IoSettingsOutline } from 'react-icons/io5';
import { IoIosNotifications } from 'react-icons/io';

import {
  MdOutlineDashboard,
  MdOutlineSegment,
  MdDelete,
  MdRemoveRedEye,
  MdOpenInNew,
} from 'react-icons/md';
import { FaTasks, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { GoProjectTemplate } from 'react-icons/go';
import { FaRegCircleUser, FaFileImage } from 'react-icons/fa6';
import { FaFileLines } from 'react-icons/fa6';
import {
  BsFileEarmarkPdfFill,
  BsThreeDotsVertical,
  BsPeopleFill,
} from 'react-icons/bs';
import { GrStatusGood } from 'react-icons/gr';
import { RiContrastLine, RiDeleteBin6Line } from 'react-icons/ri';
import { RxUpdate } from 'react-icons/rx';
import Project from '../components/Project';
import { IoCloseSharp } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import NewTask from '../components/NewTask';

const ProjectItem = () => {
  const [showNav, setShowNav] = useState(false);
  const [taskCategory, setTaskCategory] = useState('all');
  const [displayModal, setdisplayModal] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const [addTask, setAddTask] = useState(false);
  const navRef = useRef();
  const fileRef = useRef();

  useEffect(() => {
    if (!showFiles) {
      fileRef.current.files = new DataTransfer().files;
    }
  }, [showFiles]);

  const freeSpace = 3.65 * 1024 * 1024;
  const toastId = 'toast-id';

  const hideNav = (e) => {
    if (e.target === navRef.current) {
      setShowNav(false);
    }
  };

  const hideFilesModal = (e) => {
    e.target === e.currentTarget && setShowFiles(false);
  };

  const displayFiles = (e) => {
    const newFiles = [...e.target.files];

    const totalSize = newFiles.reduce((total, file) => total + file.size, 0);

    if (totalSize > freeSpace) {
      e.target.files = new DataTransfer().files;

      return toast(`The total file size for uploads must be under 3.65mb`, {
        toastId,
      });
    }

    setShowFiles(true);
    setFiles(newFiles);
  };

  const calculateSize = (size) => {
    size = parseFloat(size) || 0;

    let value, unit;

    if (size > 1024 * 1024) {
      value = Number(size / (1024 * 1024)).toFixed(2);
      unit = 'mb';
    } else if (size > 1024) {
      value = Number(size / 1024).toFixed(2);
      unit = 'kb';
    } else {
      value = size;
      unit = 'b';
    }

    return { value: Number(value), unit };
  };

  const removeFile = (indexToRemove) => {
    const files = fileRef.current.files;

    const dataTransfer = new DataTransfer();

    for (let i = 0; i < files.length; i++) {
      if (i !== indexToRemove) {
        dataTransfer.items.add(files[i]);
      }
    }

    fileRef.current.files = dataTransfer.files;

    const newFiles = [...fileRef.current.files];

    setFiles(newFiles);

    newFiles.length === 0 && setShowFiles(false);
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

      <ToastContainer autoClose={3000} />

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

        {displayModal && (
          <Project
            displayModal={displayModal}
            setdisplayModal={setdisplayModal}
            editProject={true}
          />
        )}

        {showFiles && (
          <section
            className={styles['show-files-section']}
            onClick={hideFilesModal}
          >
            <div className={styles['modal-container']}>
              <span
                className={styles['close-modal']}
                onClick={() => setShowFiles(false)}
              >
                <IoCloseSharp className={styles['close-modal-icon']} />
              </span>
              <h1 className={styles['modal-head']}>Add Files</h1>

              <ul className={styles['files-list']}>
                {files.map((file, index) => (
                  <li key={file.name} className={styles['file-item']}>
                    <RiDeleteBin6Line
                      className={styles['remove-file-icon']}
                      title="Remove File"
                      onClick={() => removeFile(index)}
                    />

                    <span className={styles['file-no']}>{index + 1}.</span>
                    <div className={styles['file-info']}>
                      <div
                        className={`${styles['file-info-box']} ${styles['file-name-box']}`}
                      >
                        <span className={styles['file-info-property']}>
                          Original Name:
                        </span>
                        <span className={styles['file-info-value']}>
                          {file.name}
                        </span>
                      </div>

                      <div className={styles['file-info-box']}>
                        <label className={styles['file-info-property']}>
                          New Name:
                        </label>
                        <input
                          className={styles['file-new-name']}
                          type="text"
                          placeholder="Leave blank to use the original name"
                        />
                      </div>

                      <div
                        className={`${styles['file-info-box']} ${styles['file-size-box']}`}
                      >
                        <span
                          className={`${styles['file-info-property']} ${styles['file-info-size']}`}
                        >
                          Size:
                        </span>
                        <span className={styles['file-info-value']}>
                          {calculateSize(file.size).value}
                          <span className={styles['file-size-unit']}>
                            {calculateSize(file.size).unit}
                          </span>
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className={styles['btn-box']}>
                <input
                  className={styles['upload-btn']}
                  type="submit"
                  value={'Upload'}
                />
              </div>
            </div>
          </section>
        )}

        {addTask && (
          <NewTask
            addTask={addTask}
            setAddTask={setAddTask}
            fixedProject={true}
          />
        )}

        <section className={styles['section-content']}>
          <h1 className={styles['project-name']}>Fitness App</h1>

          <div className={styles['edit-btn-div']}>
            <button
              className={styles['edit-btn']}
              onClick={() => setdisplayModal(true)}
            >
              Edit Project
            </button>
          </div>

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

              <div className={styles['alt-project-details-container']}>
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

              <div className={styles['alt-project-team-container']}>
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

              <div className={styles['files-conatiner']}>
                <h1 className={styles['files-text']}>
                  Project Files
                  <span className={styles['files-size-left']}>
                    {' '}
                    (3.65<span className={styles['files-size-unit']}>
                      mb
                    </span>{' '}
                    free)
                  </span>
                </h1>

                <div className={styles['add-files-box']}>
                  <button
                    className={styles['add-files-btn']}
                    onClick={() => fileRef.current.click()}
                  >
                    Add Files
                  </button>
                  <input
                    type="file"
                    className={styles['add-file-input']}
                    ref={fileRef}
                    onChange={displayFiles}
                    multiple
                  />
                </div>

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
                        <span className={styles['file-property']}>Time:</span>
                        <span className={styles['time-sent']}>
                          March 31st at 6:53 PM
                        </span>
                      </span>
                    </div>

                    <div className={styles['menu-box']}>
                      <BsThreeDotsVertical
                        className={styles['menu-file-icon']}
                      />
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
                        <span className={styles['file-property']}>Time:</span>
                        <span className={styles['time-sent']}>
                          March 31st at 6:53 PM
                        </span>
                      </span>
                    </div>
                    <div className={styles['menu-box']}>
                      <BsThreeDotsVertical
                        className={styles['menu-file-icon']}
                      />
                      <ul className={styles['menu-list']}>
                        <li className={styles['menu-item']}>Download</li>
                        <li className={styles['menu-item']}>Delete</li>
                      </ul>
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
                        <span className={styles['file-property']}>Time:</span>
                        <span className={styles['time-sent']}>
                          March 31st at 6:53 PM
                        </span>
                      </span>
                    </div>
                    <div className={styles['menu-box']}>
                      <BsThreeDotsVertical
                        className={styles['menu-file-icon']}
                      />
                      <ul className={styles['menu-list']}>
                        <li className={styles['menu-item']}>Download</li>
                        <li className={styles['menu-item']}>Delete</li>
                      </ul>
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

          <div className={styles['activities-container']}>
            <h1 className={styles['activity-head']}>Activities</h1>

            <div className={styles['activity-table-container']}>
              <table className={styles['activity-table']}>
                <thead className={styles['table-head-row']}>
                  <tr>
                    <th className={styles['table-head']}>Activity</th>
                    <th className={styles['table-head']}>Type</th>
                    <th className={styles['table-head']}>Performed By</th>
                    <th className={styles['table-head']}>Date</th>
                    <th className={styles['table-head']}>Time</th>
                    <th className={styles['table-head']}></th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>A task was deleted</td>
                    <td>
                      <span
                        className={`${styles['activity-type']} ${styles['activity-type1']}`}
                      >
                        <FaTasks className={styles['activity-type-icon']} />{' '}
                        Task
                      </span>
                    </td>
                    <td className={styles.performer}>Tyrion Lannister</td>
                    <td>June 8, 2024</td>
                    <td>
                      11:00 <span className={styles['activity-time']}>am</span>
                    </td>
                    <td>
                      <RiDeleteBin6Line
                        className={styles['delete-activity-icon']}
                        title="Delete Activity"
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>A new member joined the team</td>
                    <td>
                      <span
                        className={`${styles['activity-type']} ${styles['activity-type2']}`}
                      >
                        <BsPeopleFill
                          className={styles['activity-type-icon']}
                        />{' '}
                        Team
                      </span>
                    </td>
                    <td className={styles.performer}>Robert Baratheon</td>
                    <td>June 5, 2024</td>
                    <td>
                      01:27 <span className={styles['activity-time']}>pm</span>
                    </td>
                    <td>
                      <RiDeleteBin6Line
                        className={styles['delete-activity-icon']}
                        title="Delete Activity"
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>The Project description was updated</td>
                    <td>
                      <span
                        className={`${styles['activity-type']} ${styles['activity-type3']}`}
                      >
                        <RxUpdate className={styles['activity-type-icon']} />{' '}
                        Update
                      </span>
                    </td>
                    <td className={styles.performer}>Jon Snow</td>
                    <td>May 27, 2024</td>
                    <td>
                      08:27 <span className={styles['activity-time']}>pm</span>
                    </td>
                    <td>
                      <RiDeleteBin6Line
                        className={styles['delete-activity-icon']}
                        title="Delete Activity"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles['task-container']}>
            <div className={styles['task-head-div']}>
              <h1 className={styles['task-head']}>Tasks</h1>

              <button
                className={styles['add-task-btn']}
                onClick={() => setAddTask(true)}
              >
                Add Task
              </button>
            </div>
            <div className={styles['task-category-div']}>
              <ul className={styles['tasks-category-list']}>
                <li
                  className={`${styles['taks-category']} ${
                    taskCategory === 'all'
                      ? styles['current-task-category']
                      : ''
                  }`}
                  onClick={() => setTaskCategory('all')}
                >
                  All tasks
                </li>
                <li
                  className={`${styles['taks-category']} ${
                    taskCategory === 'open'
                      ? styles['current-task-category']
                      : ''
                  }`}
                  onClick={() => setTaskCategory('open')}
                >
                  Open
                </li>
                <li
                  className={`${styles['taks-category']} ${
                    taskCategory === 'progress'
                      ? styles['current-task-category']
                      : ''
                  }`}
                  onClick={() => setTaskCategory('progress')}
                >
                  In Progress
                </li>
                <li
                  className={`${styles['taks-category']} ${
                    taskCategory === 'completed'
                      ? styles['current-task-category']
                      : ''
                  }`}
                  onClick={() => setTaskCategory('completed')}
                >
                  Completed
                </li>
              </ul>
            </div>
            {taskCategory === 'all' && (
              <ul className={styles['tasks-list']}>
                <li className={styles['task-item']}>
                  <span className={styles['task-box']}>
                    <GrStatusGood className={styles['status-icon']} />{' '}
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <span className={styles['action-box']}>
                      <span
                        className={styles['view-icon-box']}
                        title="View Task"
                      >
                        <MdRemoveRedEye className={styles['view-icon']} />
                      </span>
                      <span
                        className={styles['delete-icon-box']}
                        title="Delete Task"
                      >
                        <MdDelete className={styles['delete-icon']} />
                      </span>
                    </span>
                  </span>
                  <span className={styles['alt-action-box']}>
                    <span className={styles['view-icon-box']} title="View Task">
                      <MdRemoveRedEye className={styles['view-icon']} />
                    </span>
                    <span
                      className={styles['delete-icon-box']}
                      title="Delete Task"
                    >
                      <MdDelete className={styles['delete-icon']} />
                    </span>
                  </span>
                </li>
                <li className={styles['task-item']}>
                  <span className={styles['task-box']}>
                    <MdOpenInNew
                      className={`${styles['status-icon']} ${styles['status-icon2']}`}
                    />{' '}
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <span className={styles['action-box']}>
                      <span
                        className={styles['view-icon-box']}
                        title="View Task"
                      >
                        <MdRemoveRedEye className={styles['view-icon']} />
                      </span>
                      <span
                        className={styles['delete-icon-box']}
                        title="Delete Task"
                      >
                        <MdDelete className={styles['delete-icon']} />
                      </span>
                    </span>
                  </span>
                  <span className={styles['alt-action-box']}>
                    <span className={styles['view-icon-box']} title="View Task">
                      <MdRemoveRedEye className={styles['view-icon']} />
                    </span>
                    <span
                      className={styles['delete-icon-box']}
                      title="Delete Task"
                    >
                      <MdDelete className={styles['delete-icon']} />
                    </span>
                  </span>
                </li>
                <li className={styles['task-item']}>
                  <span className={styles['task-box']}>
                    <GrStatusGood className={styles['status-icon']} />{' '}
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <span className={styles['action-box']}>
                      <span
                        className={styles['view-icon-box']}
                        title="View Task"
                      >
                        <MdRemoveRedEye className={styles['view-icon']} />
                      </span>
                      <span
                        className={styles['delete-icon-box']}
                        title="Delete Task"
                      >
                        <MdDelete className={styles['delete-icon']} />
                      </span>
                    </span>
                  </span>
                  <span className={styles['alt-action-box']}>
                    <span className={styles['view-icon-box']} title="View Task">
                      <MdRemoveRedEye className={styles['view-icon']} />
                    </span>
                    <span
                      className={styles['delete-icon-box']}
                      title="Delete Task"
                    >
                      <MdDelete className={styles['delete-icon']} />
                    </span>
                  </span>
                </li>
                <li className={styles['task-item']}>
                  <span className={styles['task-box']}>
                    <RiContrastLine
                      className={`${styles['status-icon']} ${styles['status-icon3']}`}
                    />{' '}
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <span className={styles['action-box']}>
                      <span
                        className={styles['view-icon-box']}
                        title="View Task"
                      >
                        <MdRemoveRedEye className={styles['view-icon']} />
                      </span>
                      <span
                        className={styles['delete-icon-box']}
                        title="Delete Task"
                      >
                        <MdDelete className={styles['delete-icon']} />
                      </span>
                    </span>
                  </span>
                  <span className={styles['alt-action-box']}>
                    <span className={styles['view-icon-box']} title="View Task">
                      <MdRemoveRedEye className={styles['view-icon']} />
                    </span>
                    <span
                      className={styles['delete-icon-box']}
                      title="Delete Task"
                    >
                      <MdDelete className={styles['delete-icon']} />
                    </span>
                  </span>
                </li>
                <li className={styles['task-item']}>
                  <span className={styles['task-box']}>
                    <RiContrastLine
                      className={`${styles['status-icon']} ${styles['status-icon3']}`}
                    />{' '}
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <span className={styles['action-box']}>
                      <span
                        className={styles['view-icon-box']}
                        title="View Task"
                      >
                        <MdRemoveRedEye className={styles['view-icon']} />
                      </span>
                      <span
                        className={styles['delete-icon-box']}
                        title="Delete Task"
                      >
                        <MdDelete className={styles['delete-icon']} />
                      </span>
                    </span>
                  </span>
                  <span className={styles['alt-action-box']}>
                    <span className={styles['view-icon-box']} title="View Task">
                      <MdRemoveRedEye className={styles['view-icon']} />
                    </span>
                    <span
                      className={styles['delete-icon-box']}
                      title="Delete Task"
                    >
                      <MdDelete className={styles['delete-icon']} />
                    </span>
                  </span>
                </li>
              </ul>
            )}

            {taskCategory === 'open' && (
              <ul className={styles['tasks-list']}>
                <li className={styles['task-item']}>
                  <span className={styles['task-box']}>
                    <MdOpenInNew
                      className={`${styles['status-icon']} ${styles['status-icon2']}`}
                    />{' '}
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <span className={styles['action-box']}>
                      <span
                        className={styles['view-icon-box']}
                        title="View Task"
                      >
                        <MdRemoveRedEye className={styles['view-icon']} />
                      </span>
                      <span
                        className={styles['delete-icon-box']}
                        title="Delete Task"
                      >
                        <MdDelete className={styles['delete-icon']} />
                      </span>
                    </span>
                  </span>
                  <span className={styles['alt-action-box']}>
                    <span className={styles['view-icon-box']} title="View Task">
                      <MdRemoveRedEye className={styles['view-icon']} />
                    </span>
                    <span
                      className={styles['delete-icon-box']}
                      title="Delete Task"
                    >
                      <MdDelete className={styles['delete-icon']} />
                    </span>
                  </span>
                </li>
              </ul>
            )}

            {taskCategory === 'progress' && (
              <ul className={styles['tasks-list']}>
                <li className={styles['task-item']}>
                  <span className={styles['task-box']}>
                    <RiContrastLine
                      className={`${styles['status-icon']} ${styles['status-icon3']}`}
                    />{' '}
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <span className={styles['action-box']}>
                      <span
                        className={styles['view-icon-box']}
                        title="View Task"
                      >
                        <MdRemoveRedEye className={styles['view-icon']} />
                      </span>
                      <span
                        className={styles['delete-icon-box']}
                        title="Delete Task"
                      >
                        <MdDelete className={styles['delete-icon']} />
                      </span>
                    </span>
                  </span>
                  <span className={styles['alt-action-box']}>
                    <span className={styles['view-icon-box']} title="View Task">
                      <MdRemoveRedEye className={styles['view-icon']} />
                    </span>
                    <span
                      className={styles['delete-icon-box']}
                      title="Delete Task"
                    >
                      <MdDelete className={styles['delete-icon']} />
                    </span>
                  </span>
                </li>
                <li className={styles['task-item']}>
                  <span className={styles['task-box']}>
                    <RiContrastLine
                      className={`${styles['status-icon']} ${styles['status-icon3']}`}
                    />{' '}
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <span className={styles['action-box']}>
                      <span
                        className={styles['view-icon-box']}
                        title="View Task"
                      >
                        <MdRemoveRedEye className={styles['view-icon']} />
                      </span>
                      <span
                        className={styles['delete-icon-box']}
                        title="Delete Task"
                      >
                        <MdDelete className={styles['delete-icon']} />
                      </span>
                    </span>
                  </span>
                  <span className={styles['alt-action-box']}>
                    <span className={styles['view-icon-box']} title="View Task">
                      <MdRemoveRedEye className={styles['view-icon']} />
                    </span>
                    <span
                      className={styles['delete-icon-box']}
                      title="Delete Task"
                    >
                      <MdDelete className={styles['delete-icon']} />
                    </span>
                  </span>
                </li>
              </ul>
            )}

            {taskCategory === 'completed' && (
              <ul className={styles['tasks-list']}>
                <li className={styles['task-item']}>
                  <span className={styles['task-box']}>
                    <GrStatusGood className={styles['status-icon']} />{' '}
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <span className={styles['action-box']}>
                      <span
                        className={styles['view-icon-box']}
                        title="View Task"
                      >
                        <MdRemoveRedEye className={styles['view-icon']} />
                      </span>
                      <span
                        className={styles['delete-icon-box']}
                        title="Delete Task"
                      >
                        <MdDelete className={styles['delete-icon']} />
                      </span>
                    </span>
                  </span>
                  <span className={styles['alt-action-box']}>
                    <span className={styles['view-icon-box']} title="View Task">
                      <MdRemoveRedEye className={styles['view-icon']} />
                    </span>
                    <span
                      className={styles['delete-icon-box']}
                      title="Delete Task"
                    >
                      <MdDelete className={styles['delete-icon']} />
                    </span>
                  </span>
                </li>

                <li className={styles['task-item']}>
                  <span className={styles['task-box']}>
                    <GrStatusGood className={styles['status-icon']} />{' '}
                    <span className={styles['task-name']}>
                      Make a single landing page and dashboard
                    </span>
                    <span className={styles['action-box']}>
                      <span
                        className={styles['view-icon-box']}
                        title="View Task"
                      >
                        <MdRemoveRedEye className={styles['view-icon']} />
                      </span>
                      <span
                        className={styles['delete-icon-box']}
                        title="Delete Task"
                      >
                        <MdDelete className={styles['delete-icon']} />
                      </span>
                    </span>
                  </span>
                  <span className={styles['alt-action-box']}>
                    <span className={styles['view-icon-box']} title="View Task">
                      <MdRemoveRedEye className={styles['view-icon']} />
                    </span>
                    <span
                      className={styles['delete-icon-box']}
                      title="Delete Task"
                    >
                      <MdDelete className={styles['delete-icon']} />
                    </span>
                  </span>
                </li>
              </ul>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

export default ProjectItem;
