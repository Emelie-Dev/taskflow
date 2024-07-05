import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from '../styles/TaskBox.module.css';
import { GrStatusGood } from 'react-icons/gr';
import { RxCross2 } from 'react-icons/rx';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { MdOutlineModeEditOutline } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AuthContext } from '../App';
import { VscIssueReopened } from 'react-icons/vsc';
import { generateName } from '../pages/Dashboard';
import { months } from '../pages/Projects';
import Loader from './Loader';
import axios from 'axios';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentDate = new Date().getDate();

const TaskBox = ({ task, project, toast }) => {
  const { userData } = useContext(AuthContext);
  const [showDetails, setShowDetails] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [taskActivities, setTaskActivities] = useState(null);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [activitiesData, setActivitiesData] = useState({
    loading: true,
    lastPage: true,
    error: false,
  });

  useEffect(() => {
    const getActivities = async () => {
      if (!taskActivities) {
        setActivitiesData({
          loading: false,
          lastPage: false,
          error: false,
        });

        setTaskActivities(task.activities);
      } else {
        try {
          const { data } = await axios.get(
            `/api/v1/tasks/${task._id}/activities?page=${activitiesPage}`
          );
        } catch (err) {
          setActivitiesData({
            loading: false,
            lastPage: false,
            error: false,
          });

          return toast('An error occured while fetching task activities.', {
            toastId: 'toast-id1',
          });
        }
      }
    };

    getActivities();
  }, [activitiesPage]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleEdit = () => {
    setEditTask(!editTask);
  };

  const getActivityMessage = (activity) => {
    // A user is assigned ✔
    // A user is deassigned ✔
    // A task is updated ✔
    // A deadline is changed

    if (activity.action === 'assignment') {
      const newNames = activity.state.assignee.newAssigneesData.map(
        ({ firstName, lastName, username }, index, array) => (
          <a key={index} href="#" className={styles['activity-names']}>
            {index !== 0 ? ' ' : ''}
            {generateName(firstName, lastName, username)}
            {index !== array.length - 1 ? ',' : ''}
          </a>
        )
      );

      const oldNames = activity.state.assignee.oldAssigneesData.map(
        ({ firstName, lastName, username }, index, array) => (
          <a key={index} href="#" className={styles['activity-names']}>
            {index !== 0 ? ' ' : ''}
            {generateName(firstName, lastName, username)}
            {index !== array.length - 1 ? ',' : ''}
          </a>
        )
      );

      if (activity.state.assignee.oldAssigneesData.length === 0) {
        return (
          <>
            {newNames}{' '}
            {activity.state.assignee.newAssigneesData.length === 1
              ? 'was'
              : 'were'}{' '}
            added to the assignees.
          </>
        );
      } else if (activity.state.assignee.newAssigneesData.length === 0) {
        return (
          <>
            {oldNames}{' '}
            {activity.state.assignee.oldAssigneesData.length === 1
              ? 'was'
              : 'were'}{' '}
            removed from the assignees.
          </>
        );
      } else {
        return (
          <>
            {newNames}{' '}
            {activity.state.assignee.newAssigneesData.length === 1
              ? 'was'
              : 'were'}{' '}
            added to the assignees while {oldNames}{' '}
            {activity.state.assignee.oldAssigneesData.length === 1
              ? 'was'
              : 'were'}{' '}
            removed from the assignees.
          </>
        );
      }
    } else if (
      activity.action === 'deletion' &&
      activity.type.includes('assignedTask')
    ) {
      return (
        <>
          <a key={index} href="#" className={styles['activity-names']}>
            {generateName(
              activity.performer.firstName,
              activity.performer.lastName,
              activity.performer.username
            )}
          </a>{' '}
          deleted the task they were assigned.
        </>
      );
    } else if (activity.action === 'update') {
      return `The task's ${activity.type.includes('name') ? 'name' : ''} ${
        activity.type.length > 1 ? 'and' : ''
      } ${activity.type.includes('description') ? 'description' : ''} ${
        activity.type.length > 1 ? 'were' : 'was'
      }  updated.`;
    } else if (activity.action === 'transition') {
      if (!activity.performer) {
        return (
          <>
            The task's
            {activity.type.includes('status') ? (
              <>
                &nbsp;status was changed from{' '}
                <span className={styles['activity-text']}>
                  {activity.state.status.from === 'progress'
                    ? 'ongoing'
                    : activity.state.status.from === 'complete'
                    ? 'completed'
                    : activity.state.status.from}
                </span>{' '}
                to{' '}
                <span className={styles['activity-text']}>
                  {activity.state.status.to === 'progress'
                    ? 'ongoing'
                    : activity.state.status.to === 'complete'
                    ? 'completed'
                    : activity.state.status.to}
                </span>
              </>
            ) : (
              ''
            )}
            {activity.type.includes('priority') ? (
              <>
                {activity.type.length > 1 ? ` and it's` : ``} priority was
                changed from{' '}
                <span className={styles['activity-text']}>
                  {activity.state.priority.from}
                </span>{' '}
                to{' '}
                <span className={styles['activity-text']}>
                  {activity.state.priority.to}
                </span>
              </>
            ) : (
              ''
            )}
            .
          </>
        );
      } else {
        return (
          <>
            {activity.type.includes('status') ? (
              <>
                <a href="#" className={styles['activity-names']}>
                  {generateName(
                    activity.performer.firstName,
                    activity.performer.lastName,
                    activity.performer.username
                  )}
                </a>{' '}
                changed the task's status from{' '}
                <span className={styles['activity-text']}>
                  {activity.state.status.from === 'progress'
                    ? 'ongoing'
                    : activity.state.status.from === 'complete'
                    ? 'completed'
                    : activity.state.status.from}
                </span>{' '}
                to{' '}
                <span className={styles['activity-text']}>
                  {activity.state.status.to === 'progress'
                    ? 'ongoing'
                    : activity.state.status.to === 'complete'
                    ? 'completed'
                    : activity.state.status.to}
                </span>
              </>
            ) : (
              ''
            )}
            .
          </>
        );
      }
    } else if (
      activity.action === 'reduction' ||
      activity.action === 'extension'
    ) {
      let dateDfifference;

      const timeDifference =
        Date.parse(activity.state.deadline.to) -
        Date.parse(activity.state.deadline.from);

      if (timeDifference >= 86400000) {
        dateDfifference = `${
          Math.floor(timeDifference / 86400000) === 1
            ? 'a day'
            : `${Math.floor(timeDifference / 86400000)} days`
        }`;
      } else if (timeDifference >= 3600000) {
        dateDfifference = `${
          Math.floor(timeDifference / 3600000) === 1
            ? 'an hour'
            : `${Math.floor(timeDifference / 3600000)} hours`
        }`;
      }

      return (
        <>
          The deadline was
          {activity.action === 'reduction' ? ' shortened' : ' extended'}
          <span className={styles['activity-text']}>
            {dateDfifference ? ` by ${dateDfifference}` : ''}
          </span>
          .
        </>
      );
    }
  };

  const nextActivitiesPage = () => {
    setActivitiesPage((value) => value + 1);

    setActivitiesData({ loading: true, lastPage: true, error: false });
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
      <h1
        className={`${styles['task-name']} ${
          editTask ? styles['show-editable'] : ''
        }`}
        contentEditable={editTask}
      >
        {task.name}
      </h1>
      <div className={styles['property-div']}>
        <span className={styles['property-name']}>Status:</span>
        <span
          className={`${styles['status-value']} ${
            editTask ? styles['hide-data'] : ''
          }`}
        >
          {task.status === 'complete' ? (
            <span
              className={`${styles['status-box']} ${styles['status-box1']}`}
            >
              <GrStatusGood className={styles['status-icon']} /> Completed
            </span>
          ) : task.status === 'progress' ? (
            <span
              className={`${styles['status-box']} ${styles['status-box2']}`}
            >
              {' '}
              <svg
                className={styles['progress-icon']}
                stroke="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
              >
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM18 12C18 15.3137 15.3137 18 12 18V6C15.3137 6 18 8.68629 18 12Z"></path>
              </svg>
              Ongoing{' '}
            </span>
          ) : (
            <span
              className={`${styles['status-box']} ${styles['status-box3']}`}
            >
              {' '}
              <VscIssueReopened className={styles['status-icon']} /> Open{' '}
            </span>
          )}
        </span>
        <select
          className={`${styles['status-select']} ${
            editTask ? styles['show-data'] : ''
          }`}
          defaultValue={task.status}
        >
          <option value={'open'}>Open</option>
          <option value={'progress'}>Ongoing</option>
          <option value={'complete'}>Completed</option>
        </select>
      </div>

      <div className={styles['property-div']}>
        <span className={styles['property-name']}>Priority:</span>

        <span
          className={`${styles['priority-value']} ${
            editTask ? styles['hide-data'] : ''
          }`}
          style={{
            color: userData.personalization.priorityColors[task.priority],
            backgroundColor: `${
              task.priority === 'low'
                ? `${userData.personalization.priorityColors[task.priority]}33`
                : task.priority === 'medium'
                ? `${userData.personalization.priorityColors[task.priority]}30`
                : `${userData.personalization.priorityColors[task.priority]}1a`
            }`,
          }}
        >
          {task.priority === 'high'
            ? 'High'
            : task.priority === 'medium'
            ? 'Medium'
            : 'Low'}
        </span>

        <select
          className={`${styles['priority-select']} ${
            editTask ? styles['show-data'] : ''
          }`}
          defaultValue={task.priority}
        >
          <option value={'high'}>High</option>
          <option value={'medium'}>Medium</option>
          <option value={'low'}>Low</option>
        </select>
      </div>

      <div
        className={`${styles['property-div']} ${styles['assignee-container']}`}
      >
        <span className={styles['property-name']}>
          {task.assignee.length === 1 ? 'Assignee' : 'Assignees'}:
        </span>

        <div className={styles['assignees-box']}>
          {task.assignee.length === 0 ? (
            <i
              className={`${styles['no-assignee-txt']} ${
                editTask ? styles['hide-data'] : ''
              }`}
            >
              No assignees
            </i>
          ) : (
            task.assignee.map((assignee, index) => (
              <span
                key={assignee._id}
                className={`${styles['assignee-value']} ${
                  editTask ? styles['hide-data'] : ''
                }`}
              >
                <a href="#" className={styles['assignee-link']}>
                  <img
                    src={`../../assets/images/users/${assignee.photo}`}
                    className={styles['assignee-img']}
                  />

                  <span className={styles['assignee-name']}>
                    {' '}
                    {generateName(
                      assignee.firstName,
                      assignee.lastName,
                      assignee.username
                    ).length <= 30
                      ? generateName(
                          assignee.firstName,
                          assignee.lastName,
                          assignee.username
                        )
                      : `${generateName(
                          assignee.firstName,
                          assignee.lastName,
                          assignee.username
                        ).slice(0, 30)}...`}
                  </span>
                  {index !== task.assignee.length - 1 ? ',' : ''}
                </a>
              </span>
            ))
          )}
        </div>

        <div
          className={`${styles['assignee-div']} ${
            editTask ? styles['show-data'] : ''
          }`}
        >
          <div className={styles['members-container']}>
            {task.assignee.map((assignee) => (
              <span key={assignee._id} className={styles['assignee-box']}>
                <img
                  className={styles['assignee-pics']}
                  src={`../../assets/images/users/${assignee.photo}`}
                />
                <RxCross2
                  className={styles['remove-assignee-icon']}
                  title="Remove"
                />
              </span>
            ))}
          </div>

          <div className={styles['add-assignee-container']}>
            <select
              className={`${styles['assignees-select']} ${
                editTask ? styles['show-data'] : ''
              }`}
            >
              {project.team.map((member) => (
                <option key={member._id}>
                  {generateName(
                    member.firstName,
                    member.lastName,
                    member.username
                  )}
                </option>
              ))}
            </select>

            <button className={styles['add-assignee-btn']}>Add</button>
          </div>
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
          <span className={styles['date-created-value']}>
            {' '}
            {task.createdAt ? (
              `${months[new Date(task.createdAt).getMonth()]} ${new Date(
                task.createdAt
              ).getDate()}, ${new Date(task.createdAt).getFullYear()}`
            ) : (
              <i className={styles['no-assignee-txt']}>Not available</i>
            )}
          </span>
        </div>
        <div className={styles['more-property-div']}>
          <span className={styles['property-name']}>Due Date:</span>
          <span
            className={`${styles['due-date-value']} ${
              editTask ? styles['hide-data'] : ''
            }`}
          >
            {task.deadline ? (
              `${months[new Date(task.deadline).getMonth()]} ${new Date(
                task.deadline
              ).getDate()} ${new Date(task.deadline).getFullYear()}, 
              ${
                new Date(task.deadline).getHours() === 0
                  ? `12 AM`
                  : new Date(task.deadline).getHours() === 12
                  ? `12 PM`
                  : new Date(task.deadline).getHours() > 12
                  ? `${new Date(task.deadline).getHours() - 12} PM`
                  : `${new Date(task.deadline).getHours()} AM`
              }`
            ) : (
              <i className={styles['no-assignee-txt']}>No due date</i>
            )}
          </span>
          <input
            type="datetime-local"
            min={`${currentYear}-0${currentMonth + 1}-${currentDate}T00:00`}
            className={`${styles['due-date-input']} ${
              editTask ? styles['show-data'] : ''
            }`}
          />
        </div>

        <div className={`${styles['more-property-div']} ${styles.description}`}>
          <span className={styles['property-name']}>Description:</span>
          <div
            className={`${styles['description-value']} ${
              editTask ? styles['show-editable'] : ''
            }`}
            contentEditable={editTask}
          >
            {task.description.trim().length === 0 ? (
              <i className={styles['no-assignee-txt']}>No description</i>
            ) : (
              task.description
            )}
          </div>
        </div>

        <div
          className={`${styles['more-property-div']} ${styles['activity-log-box']}`}
        >
          <span className={styles['property-name']}>Activity Log:</span>
          <div className={styles['activity-log']}>
            {taskActivities === null ? (
              ''
            ) : taskActivities.length === 0 ? (
              <i className={styles['no-recent-activity']}>No recent activity</i>
            ) : (
              taskActivities.map((activity) => (
                <span key={activity._id} className={styles['activity-box']}>
                  {' '}
                  <span className={styles['activity-date']}>
                    - [{' '}
                    {activity.time ? (
                      `${months[new Date(activity.time).getMonth()].slice(
                        0,
                        3
                      )} ${new Date(activity.time).getDate()} ${new Date(
                        activity.time
                      ).getFullYear()}, ${
                        new Date(activity.time).getHours() < 10
                          ? `0${new Date(activity.time).getHours()}`
                          : `${new Date(activity.time).getHours()}`
                      }:${
                        new Date(activity.time).getMinutes() < 10
                          ? `0${new Date(activity.time).getMinutes()}`
                          : `${new Date(activity.time).getMinutes()}`
                      }`
                    ) : (
                      <i className={styles['no-assignee-txt']}>
                        No time available
                      </i>
                    )}
                    ]
                  </span>{' '}
                  <span className={styles['activity-data']}>
                    {getActivityMessage(activity)}
                  </span>
                </span>
              ))
            )}

            {activitiesData.loading && (
              <div className={styles['loader-box']}>
                <Loader
                  style={{
                    width: '2rem',
                    height: '2rem',
                  }}
                />
              </div>
            )}

            <div className={styles['more-activity-box']}>
              {' '}
              <button
                className={styles['more-activity-btn']}
                onClick={nextActivitiesPage}
              >
                Show More
              </button>
            </div>
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

export default TaskBox;
