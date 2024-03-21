import React, { useRef, useState } from 'react';
import styles from '../styles/TaskBox2.module.css';
import { GrStatusGood } from 'react-icons/gr';
import { RxCross2 } from 'react-icons/rx';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { MdOutlineModeEditOutline } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';

const TaskBox2 = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [editTask, setEditTask] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleEdit = () => {
    setEditTask(!editTask);
  };

  return (
    <article className={styles['task-box']}>
      <div
        className={`${styles['menu-div']} ${
          editTask ? styles['hide-data'] : ''
        }`}
      >
        <BsThreeDotsVertical className={styles['task-menu-icon']} />

        <ul className={styles['menu-action-list']}>
          <li className={styles['menu-action-item']} onClick={toggleEdit}>
            <MdOutlineModeEditOutline className={styles['action-icon']} />
            Edit
          </li>
          <li className={styles['menu-action-item']}>
            <RiDeleteBin6Line className={styles['action-icon']} /> Delete
          </li>
        </ul>
      </div>

      <RxCross2
        className={`${styles['cancel-edit-icon']} ${
          editTask ? styles['show-cancel-icon'] : ''
        }`}
        title="Cancel"
        onClick={toggleEdit}
      />
      <h1 className={styles['task-name']}>
        Make a single landing page and dashboard
      </h1>
      <div className={styles['property-div']}>
        <span className={styles['property-name']}>Status:</span>
        <span
          className={`${styles['status-value']} ${
            editTask ? styles['hide-data'] : ''
          }`}
        >
          <GrStatusGood className={styles['status-icon']} /> Completed
        </span>
        <select
          className={`${styles['status-select']} ${
            editTask ? styles['show-data'] : ''
          }`}
        >
          <option value={'open'}>Open</option>
          <option value={'inprogress'}>In Progress</option>
          <option value={'completed'}>Completed</option>
        </select>
      </div>

      <div className={styles['property-div']}>
        <span className={styles['property-name']}>Priority:</span>
        <span
          className={`${styles['priority-value']} ${
            editTask ? styles['hide-data'] : ''
          }`}
        >
          High
        </span>
        <select
          className={`${styles['priority-select']} ${
            editTask ? styles['show-data'] : ''
          }`}
        >
          <option value={'high'}>High</option>
          <option value={'medium'}>Medium</option>
          <option value={'low'}>Low</option>
        </select>
      </div>

      <div className={styles['property-div']}>
        <span className={styles['property-name']}>Leader:</span>
        <span className={styles['leader-value']}>
          <img
            src="../../assets/images/download.jpeg"
            className={styles['leader-pics']}
          />
          John Snow
        </span>
      </div>

      <div
        className={`${styles['property-div']} ${styles['assignee-container']}`}
      >
        <span className={styles['property-name']}>Assignee:</span>
        <span
          className={`${styles['assignee-value']} ${
            editTask ? styles['hide-data'] : ''
          }`}
        >
          None
        </span>
        <div
          className={`${styles['assignee-div']} ${
            editTask ? styles['show-data'] : ''
          }`}
        >
          <span className={styles['assignee-box']}>
            <img
              className={styles['assignee-pics']}
              src="../../assets/images/profile3.jpeg"
            />
            <RxCross2
              className={styles['remove-assignee-icon']}
              title="Remove"
            />
          </span>

          <button className={styles['add-assignee-btn']}>Add</button>
        </div>
      </div>

      <div
        className={`${styles['details-btn-div']} ${
          editTask ? styles['hide-data'] : ''
        }`}
      >
        <button className={styles['more-details-btn']} onClick={toggleDetails}>
          {showDetails ? 'hide details' : 'more details'}
        </button>
      </div>

      {/* More details div */}

      <div
        className={`${styles['more-details-div']} 
      ${showDetails ? styles['show-details-div'] : ''}
      ${editTask ? styles['show-details-div'] : ''}`}
      >
        <div className={styles['more-property-div']}>
          <span className={styles['property-name']}>Date Created:</span>
          <span className={styles['date-created-value']}>March 23, 2024</span>
        </div>
        <div className={styles['more-property-div']}>
          <span className={styles['property-name']}>Due Date:</span>
          <span className={styles['due-date-value']}>March 30, 2024</span>
        </div>

        <div className={`${styles['more-property-div']} ${styles.description}`}>
          <span className={styles['property-name']}>Description:</span>
          <div className={styles['description-value']}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel
            elit neque. Class aptent taciti sociosqu ad litora torquent per
            conubia nostra, per inceptos himenaeos. Vestibulum sollicitudin
            libero vitae est consectetur, a molestie tortor consectetur. Aenean
            tincidunt interdum ipsum, id pellentesque diam suscipit ut. Vivamus
            massa mi, fermentum eget neque eget, imperdiet tristique lectus.
          </div>
        </div>

        <div
          className={`${styles['more-property-div']} ${styles['activity-log-box']}`}
        >
          <span className={styles['property-name']}>Activity Log:</span>
          <div className={styles['activity-log']}>
            <span className={styles['activity-box']}>
              {' '}
              <span className={styles['activity-date']}>
                - [March 24 2024, 12:30]
              </span>{' '}
              <span>
              <b className={styles['activity-names']}>John&nbsp;</b>
              changed the status to ongoing.
              </span>
            </span>

            <span className={styles['activity-box']}>
              {' '}
              <span className={styles['activity-date']}>
                - [March 26 2024, 14:27]
              </span>{' '}
              <span>
              <b className={styles['activity-names']}>John&nbsp;</b> assigned
              the task to{' '}
              <b className={styles['activity-names']}>&nbsp;Anita</b>.
              </span>
            </span>

            <span className={styles['activity-box']}>
              {' '}
              <span className={styles['activity-date']}>
                - [March 27 2024, 09:30]
              </span>{' '}
              <span>
              <b className={styles['activity-names']}>Anita&nbsp;</b> updated
              the task description.
              </span>
            </span>

            <span className={styles['activity-box']}>
              {' '}
              <span className={styles['activity-date']}>
                - [March 29 2024, 15:45]
              </span>{' '}
              <span>
              <b className={styles['activity-names']}>John&nbsp;</b> set the
              status to completed.
              </span>
            </span>
          </div>
        </div>

        <div
          className={`${styles['save-btn-div']} ${
            editTask ? styles['show-save-btn'] : ''
          }`}
        >
          {' '}
          <button className={styles['save-btn']}>Save</button>
        </div>
      </div>
    </article>
  );
};

export default TaskBox2;
