import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../styles/TaskBox.module.css';
import { GrStatusGood } from 'react-icons/gr';
import { RxCross2 } from 'react-icons/rx';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { ToastContainer, toast } from 'react-toastify';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { apiClient, AuthContext } from '../App';
import { VscIssueReopened } from 'react-icons/vsc';
import { generateName } from '../pages/Dashboard';
import { months } from '../pages/Projects';
import Loader from './Loader';
import { SiKashflow } from 'react-icons/si';
import DeleteModal from './DeleteModal';
import { IoColorPaletteSharp } from 'react-icons/io5';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentDate = new Date().getDate();

const TaskBox = ({
  assigned,
  task,
  project,
  currentProject,
  setCurrentProject,
  setDeleteCount,
}) => {
  const { userData } = useContext(AuthContext);
  const [showDetails, setShowDetails] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [taskObj, setTaskObj] = useState(task);
  const [taskActivities, setTaskActivities] = useState(null);
  const [activitiesDetails, setActivitiesDetails] = useState({ page: 1 });
  const [activitiesData, setActivitiesData] = useState({
    loading: true,
    lastPage: true,
    error: false,
  });
  const [taskAssignees, setTaskAssignees] = useState(taskObj.assignee);
  const [taskData, setTaskData] = useState({
    name: taskObj.name,
    status: taskObj.status,
    priority: taskObj.priority,
    deadline: taskObj.deadline ? new Date(taskObj.deadline) : '',
    description: taskObj.description,
    assignees: new Set(taskObj.assignee.map((assignee) => assignee._id)),
    customFields: [...taskObj.customFields],
  });
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const assigneeRef = useRef();

  const initalData = {
    name: taskObj.name,
    status: taskObj.status,
    priority: taskObj.priority,
    deadline: new Date(taskObj.deadline),
    description: taskObj.description,
    assignees: new Set(taskObj.assignee.map((assignee) => assignee._id)),
    customFields: [...taskObj.customFields],
  };

  // For fetching task activities
  useEffect(() => {
    const getActivities = async () => {
      if (!assigned && !taskActivities) {
        setActivitiesData({
          loading: false,
          lastPage: taskObj.activities.length < 50,
          error: false,
        });

        setTaskActivities(taskObj.activities);
      } else {
        try {
          const { data } = await apiClient.get(
            `/api/v1/tasks/${taskObj._id}/activities?page=${activitiesDetails.page}`
          );

          setActivitiesData({
            loading: false,
            lastPage: data.data.activities.length < 50,
            error: false,
          });

          if (activitiesDetails.page === 1) {
            setTaskActivities(data.data.activities);
          } else {
            setTaskActivities([...taskActivities, ...data.data.activities]);
          }
        } catch (err) {
          setActivitiesData({
            loading: false,
            lastPage: false,
            error: true,
          });

          if (activitiesDetails.page === 1) {
            setTaskActivities([]);
          }

          return toast('An error occured while fetching task activities.', {
            toastId: 'toast-id1',
          });
        }
      }
    };

    getActivities();
  }, [activitiesDetails]);

  // For detecting change in taskData
  useEffect(() => {
    let value = 0;

    for (const prop in taskData) {
      if (prop === 'assignees') {
        if (
          String([...taskData.assignees]) === String([...initalData.assignees])
        )
          value++;
      } else if (prop === 'customFields') {
        const isChanged = taskData.customFields.some((field) => {
          const initialField = initalData.customFields.find(
            (elem) => elem.field === field.field
          );

          if (initialField) {
            return (
              String(field.value).trim() !== String(initialField.value).trim()
            );
          } else if (String(field.value).trim() === '') {
            return false;
          } else return true;
        });

        if (isChanged) value--;
        else value++;
      } else {
        if (String(taskData[prop]).trim() === String(initalData[prop]).trim()) {
          value++;
        }
      }
    }

    setIsDataChanged(value !== 7);
  }, [taskData]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleEdit = () => {
    setEditTask(!editTask);
    setTaskData(initalData);
    setTaskAssignees(taskObj.assignee);
  };

  const updateTask = async () => {
    // Checks if task data is changed
    let value = 7;
    const body = {};
    for (const prop in taskData) {
      if (prop === 'assignees') {
        if (
          String([...taskData.assignees]) !== String([...initalData.assignees])
        ) {
          value--;
          body[prop] = taskData[prop];
        }
      } else {
        if (String(taskData[prop]).trim() !== String(initalData[prop]).trim()) {
          body[prop] = taskData[prop];
          value--;
          body.otherFields = true;
        }
      }
    }

    if (value === 7) return;

    if (String(body.deadline) === 'Invalid Date') body.deadline = '';

    try {
      setUpdating(true);

      let response;

      if (body.otherFields) {
        delete body.otherFields;

        response = await apiClient.patch(`/api/v1/tasks/${taskObj._id}`, body);
      }

      if (body.assignees) {
        try {
          response = await apiClient.patch(
            `/api/v1/tasks/${taskObj._id}/assignees`,
            {
              assignee: [...body.assignees],
            }
          );
        } catch (err) {
          if (!err.response.data || err.response.status === 500) {
            toast('An error occured while updating the assignees.', {
              toastId: 'toast-id2',
            });
          } else {
            toast(err.response.data.message, {
              toastId: 'toast-id2',
            });
          }
        }
      }

      setUpdating(false);
      setIsDataChanged(false);
      setEditTask(false);

      setTaskObj(response.data.data.task);
      setShowDetails(true);

      setActivitiesDetails({ page: 1 });
      setActivitiesData({ loading: true, lastPage: true, error: false });
    } catch (err) {
      setUpdating(false);

      if (!err.response.data) {
        return toast('An error occured while saving the task.', {
          toastId: 'toast-id2',
        });
      }

      return toast(err.response.data.message, {
        toastId: 'toast-id2',
      });
    }
  };

  const deleteTask = async () => {
    try {
      setDeleting(true);

      await apiClient.delete(`/api/v1/tasks/${task._id}`);

      setDeleting(false);

      setCurrentProject({
        tasks: currentProject.tasks.filter((obj) => obj._id !== taskObj._id),
      });
      setDeleteCount((prevCount) => prevCount + 1);

      if (!assigned) {
        project.details[task.status]--;
      } else {
        project.tasks--;
      }
    } catch (err) {
      setDeleting(false);

      if (!err.response.data) {
        return toast('An error occured while deleting the task.', {
          toastId: 'toast-id3',
        });
      }

      return toast(err.response.data.message, {
        toastId: 'toast-id3',
      });
    }
  };

  const nextActivitiesPage = () => {
    if (activitiesData.error) {
      setActivitiesDetails({ page: activitiesDetails.page });
    } else {
      setActivitiesDetails({ page: activitiesDetails.page + 1 });
    }

    setActivitiesData({ loading: true, lastPage: true, error: false });
  };

  const getActivityMessage = (activity) => {
    // A user is assigned ✔
    // A user is deassigned ✔
    // A task is updated ✔
    // A deadline is changed ✔

    if (activity.action === 'assignment') {
      const newNames = activity.state.assignee.newAssigneesData[0]
        ? activity.state.assignee.newAssigneesData.map(
            ({ _id, firstName, lastName, username }, index, array) => (
              <a key={index} href="#" className={styles['activity-names']}>
                {index !== 0 ? ' ' : ''}
                {_id === userData._id
                  ? 'You'
                  : generateName(firstName, lastName, username)}
                {index !== array.length - 1 ? ',' : ''}
              </a>
            )
          )
        : [];

      // Update activities message
      const oldNames = activity.state.assignee.oldAssigneesData[0]
        ? activity.state.assignee.oldAssigneesData.map(
            ({ firstName, lastName, username }, index, array) => (
              <a key={index} href="#" className={styles['activity-names']}>
                {index !== 0 ? ' ' : ''}
                {generateName(firstName, lastName, username)}
                {index !== array.length - 1 ? ',' : ''}
              </a>
            )
          )
        : [];

      if (!activity.state.assignee.oldAssigneesData[0])
        activity.state.assignee.oldAssigneesData.length = 0;

      if (!activity.state.assignee.newAssigneesData[0])
        activity.state.assignee.newAssigneesData.length = 0;

      if (activity.state.assignee.oldAssigneesData.length === 0) {
        return (
          <>
            {newNames}{' '}
            {activity.state.assignee.newAssigneesData.length === 1 &&
            activity.state.assignee.to[0] === userData._id
              ? 'were'
              : activity.state.assignee.newAssigneesData.length === 1
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
            {activity.state.assignee.newAssigneesData.length === 1 &&
            activity.state.assignee.to[0] === userData._id
              ? 'were'
              : activity.state.assignee.newAssigneesData.length === 1
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
          <a href="#" className={styles['activity-names']}>
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
      return (
        <>
          {userData._id === activity.user._id ? (
            'You'
          ) : (
            <a href="#" className={styles['activity-names']}>
              {generateName(
                activity.user.firstName,
                activity.user.lastName,
                activity.user.username
              )}
            </a>
          )}{' '}
          updated the task's {activity.type.includes('name') ? 'name' : ''}
          {activity.type.length > 1 ? ' and ' : ''}
          {activity.type.includes('description') ? 'description' : ''}.
        </>
      );
    } else if (activity.action === 'transition') {
      if (!activity.performer) {
        return (
          <>
            {userData._id === activity.user._id ? (
              'You'
            ) : (
              <a href="#" className={styles['activity-names']}>
                {generateName(
                  activity.user.firstName,
                  activity.user.lastName,
                  activity.user.username
                )}{' '}
              </a>
            )}{' '}
            changed the task's
            {activity.type.includes('status') ? (
              <>
                &nbsp;status from{' '}
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
            {activity.type.includes('priority') &&
            activity.user._id === userData._id ? (
              <>
                {activity.type.length > 1 ? ` and it's` : ``} priority from{' '}
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
                {userData._id === activity.performer._id ? (
                  'You '
                ) : (
                  <a href="#" className={styles['activity-names']}>
                    {generateName(
                      activity.performer.firstName,
                      activity.performer.lastName,
                      activity.performer.username
                    )}{' '}
                  </a>
                )}
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
      let dateDifference;

      const timeDifference = Math.abs(
        Date.parse(activity.state.deadline.to) -
          Date.parse(activity.state.deadline.from)
      );

      if (timeDifference >= 86400000) {
        dateDifference = `${
          Math.floor(timeDifference / 86400000) === 1
            ? 'a day'
            : `${Math.floor(timeDifference / 86400000)} days`
        }`;
      } else if (timeDifference >= 3600000) {
        dateDifference = `${
          Math.floor(timeDifference / 3600000) === 1
            ? 'an hour'
            : `${Math.floor(timeDifference / 3600000)} hours`
        }`;
      }

      return (
        <>
          {userData._id === activity.user._id
            ? 'You'
            : generateName(
                activity.user.firstName,
                activity.user.lastName,
                activity.user.username
              )}
          {activity.action === 'reduction' ? ' shortened' : ' extended'} the
          deadline
          {dateDifference ? ' by ' : ''}
          <span className={styles['activity-text']}>
            {dateDifference ? `${dateDifference}` : ''}
          </span>
          .
        </>
      );
    } else if (
      activity.action === 'addition' &&
      activity.type.includes('deadline')
    ) {
      return 'The Task deadline was set.';
    } else if (
      activity.action === 'deletion' &&
      activity.type.includes('deadline')
    ) {
      return 'The Task deadline was removed.';
    } else if (
      activity.action === 'deletion' &&
      activity.type.includes('account')
    ) {
      return (
        <>
          <span className={styles['deleted-users']}>
            {generateName(
              activity.performer.firstName,
              activity.performer.lastName,
              activity.performer.username
            )}
          </span>{' '}
          was no longer available and was subsequently removed from the
          assignees.
        </>
      );
    } else if (
      activity.action === 'exit' &&
      activity.type.includes('project')
    ) {
      return (
        <>
          <span className={styles['deleted-users']}>
            {generateName(
              activity.performer.firstName,
              activity.performer.lastName,
              activity.performer.username
            )}
          </span>{' '}
          left the project and was subsequently removed from the assignees.
        </>
      );
    }
  };

  const deadlineValue = () => {
    const date = new Date(taskData.deadline);

    if (Date.parse(date)) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      const hours =
        Date.parse(date) < Date.parse(new Date())
          ? String(new Date().getHours()).padStart(2, '0')
          : String(date.getHours()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:00`;
    } else {
      return '';
    }
  };

  const addAssignee = () => {
    const assignee = assigneeRef.current.value;

    if (taskData.assignees.has(assignee)) return;

    const member = project.team.find((member) => member._id === assignee);
    const assignees = taskData.assignees.add(assignee);

    setTaskAssignees([...taskAssignees, member]);
    setTaskData({ ...taskData, assignees });
  };

  const removeAssignee = (index) => {
    const assignee = taskAssignees[index]._id;

    const members = [...taskAssignees];
    members.splice(index, 1);

    const assignees = taskData.assignees;
    assignees.delete(assignee);

    setTaskAssignees(members);
    setTaskData({ ...taskData, assignees });
  };

  const handleCustomField = (field) => (e) => {
    const customFields = [...taskData.customFields];
    const index = customFields.findIndex((elem) => elem.field === field);

    if (index === -1) {
      customFields.push({ field, value: e.target.value });
    } else {
      customFields[index].value = e.target.value;
    }

    setTaskData({ ...taskData, customFields });
    console.log({ taskData, taskObj });
  };

  return (
    <article className={styles['task-box']}>
      <ToastContainer autoClose={2000} />
      {showDeleteBox && (
        <DeleteModal
          setShowDeleteBox={setShowDeleteBox}
          deleteTask={deleteTask}
          deleting={deleting}
        />
      )}
      <div className={styles['task-container']}>
        <div
          className={`${styles['menu-div']} ${
            editTask
              ? styles['hide-data']
              : showDeleteBox
              ? styles['hide-data']
              : ''
          }`}
        >
          <BsThreeDotsVertical className={styles['task-menu-icon']} />

          <ul className={styles['menu-action-list']}>
            <li className={styles['menu-action-item']} onClick={toggleEdit}>
              <MdOutlineModeEditOutline className={styles['action-icon']} />
              Edit
            </li>
            <li
              className={styles['menu-action-item']}
              onClick={() => setShowDeleteBox(true)}
            >
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
          className={`${styles['task-name']}  ${
            !assigned ? (editTask ? styles['show-editable'] : '') : ''
          }`}
          contentEditable={!assigned && editTask}
          onBlur={(e) =>
            setTaskData({ ...taskData, name: e.target.textContent.trim() })
          }
        >
          {taskData.name}
        </h1>

        <div className={styles['property-div']}>
          <span className={styles['property-name']}>Status:</span>
          <span
            className={`${styles['status-value']} ${
              editTask ? styles['hide-data'] : ''
            }`}
          >
            {taskData.status === 'complete' ? (
              <span
                className={`${styles['status-box']} ${styles['status-box1']}`}
              >
                <GrStatusGood className={styles['status-icon']} /> Completed
              </span>
            ) : taskData.status === 'progress' ? (
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
                In Progress{' '}
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
            value={taskData.status}
            onChange={(e) =>
              setTaskData({ ...taskData, status: e.target.value })
            }
          >
            <option value={'open'}>Open</option>
            <option value={'progress'}>In progress</option>
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
              color: userData.personalization.priorityColors[taskData.priority],
              backgroundColor: `${
                taskData.priority === 'low'
                  ? `${
                      userData.personalization.priorityColors[taskData.priority]
                    }33`
                  : taskData.priority === 'medium'
                  ? `${
                      userData.personalization.priorityColors[taskData.priority]
                    }30`
                  : `${
                      userData.personalization.priorityColors[taskData.priority]
                    }1a`
              }`,
            }}
          >
            {taskData.priority === 'high'
              ? 'High'
              : taskData.priority === 'medium'
              ? 'Medium'
              : 'Low'}
          </span>

          <select
            className={`${styles['priority-select']} ${
              editTask ? styles['show-data'] : ''
            }`}
            value={taskData.priority}
            onChange={(e) =>
              setTaskData({ ...taskData, priority: e.target.value })
            }
          >
            <option value={'high'}>High</option>
            <option value={'medium'}>Medium</option>
            <option value={'low'}>Low</option>
          </select>
        </div>

        {!assigned && (
          <div
            className={`${styles['property-div']} ${styles['assignee-container']}`}
          >
            <span className={styles['property-name']}>
              {taskObj.assignee.length === 1 ? 'Assignee' : 'Assignees'}:
            </span>

            <div className={styles['assignees-box']}>
              {taskObj.assignee.length === 0 ? (
                <i
                  className={`${styles['no-assignee-txt']} ${
                    editTask ? styles['hide-data'] : ''
                  }`}
                >
                  No assignee
                </i>
              ) : (
                taskObj.assignee.map((assignee, index) => (
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
                      {index !== taskObj.assignee.length - 1 ? ',' : ''}
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
                {taskAssignees.map((assignee, index) => (
                  <span key={assignee._id} className={styles['assignee-box']}>
                    <img
                      className={styles['assignee-pics']}
                      src={`../../assets/images/users/${assignee.photo}`}
                    />
                    <RxCross2
                      className={styles['remove-assignee-icon']}
                      title="Remove"
                      onClick={() => removeAssignee(index)}
                    />
                  </span>
                ))}
              </div>

              <div className={styles['add-assignee-container']}>
                <select
                  className={`${styles['assignees-select']} ${
                    editTask ? styles['show-data'] : ''
                  }`}
                  ref={assigneeRef}
                >
                  {project.team.map((member) => (
                    <option key={member._id} value={member._id}>
                      {generateName(
                        member.firstName,
                        member.lastName,
                        member.username
                      )}
                    </option>
                  ))}
                </select>

                <button
                  className={`${styles['add-assignee-btn']} ${
                    project.team.length === 0 ? styles['disable-add-btn'] : ''
                  }`}
                  onClick={addAssignee}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {assigned && (
          <div className={styles['more-property-div']}>
            <span className={styles['property-name']}>Date Assigned:</span>
            <span className={styles['date-created-value']}>
              {' '}
              {taskObj.createdAt ? (
                `${months[new Date(taskObj.createdAt).getMonth()]} ${new Date(
                  taskObj.createdAt
                ).getDate()}, ${new Date(taskObj.createdAt).getFullYear()}`
              ) : (
                <i className={styles['no-assignee-txt']}>Not available</i>
              )}
            </span>
          </div>
        )}

        <div
          className={`${styles['details-btn-div']} ${
            editTask ? styles['hide-data'] : ''
          }`}
        >
          <button
            className={styles['more-details-btn']}
            onClick={toggleDetails}
          >
            {showDetails ? 'hide details' : 'more details'}
          </button>
        </div>

        {/* More details div */}

        <div
          className={`${styles['more-details-div']} 
      ${showDetails ? styles['show-details-div'] : ''}
      ${editTask ? styles['show-details-div'] : ''}`}
        >
          {!assigned && (
            <div className={styles['more-property-div']}>
              <span className={styles['property-name']}>Date Created:</span>
              <span className={styles['date-created-value']}>
                {' '}
                {taskObj.createdAt ? (
                  `${months[new Date(taskObj.createdAt).getMonth()]} ${new Date(
                    taskObj.createdAt
                  ).getDate()}, ${new Date(taskObj.createdAt).getFullYear()}`
                ) : (
                  <i className={styles['no-assignee-txt']}>Not available</i>
                )}
              </span>
            </div>
          )}

          <div className={styles['more-property-div']}>
            <span className={styles['property-name']}>Due Date:</span>
            <span
              className={`${styles['due-date-value']} ${
                !assigned ? (editTask ? styles['hide-data'] : '') : ''
              }`}
            >
              {deadlineValue() ? (
                `${
                  months[taskData.deadline.getMonth()]
                } ${taskData.deadline.getDate()} ${taskData.deadline.getFullYear()}, 
              ${
                taskData.deadline.getHours() === 0
                  ? `12 AM`
                  : taskData.deadline.getHours() === 12
                  ? `12 PM`
                  : taskData.deadline.getHours() > 12
                  ? `${taskData.deadline.getHours() - 12} PM`
                  : `${taskData.deadline.getHours()} AM`
              }`
              ) : (
                <i className={styles['no-assignee-txt']}>No due date</i>
              )}
            </span>

            <input
              type="datetime-local"
              min={`${currentYear}-0${currentMonth + 1}-${currentDate}T00:00`}
              className={`${styles['due-date-input']}   ${
                !assigned ? (editTask ? styles['show-data'] : '') : ''
              }`}
              value={deadlineValue()}
              onChange={(e) =>
                setTaskData({ ...taskData, deadline: new Date(e.target.value) })
              }
            />
          </div>

          <div
            className={`${styles['more-property-div']} ${styles.description}`}
          >
            <span className={styles['property-name']}>Description:</span>
            <div
              className={`${styles['description-value']} ${
                !assigned ? (editTask ? styles['show-editable'] : '') : ''
              }`}
              contentEditable={!assigned && editTask}
              onBlur={(e) =>
                setTaskData({
                  ...taskData,
                  description: e.target.textContent.trim(),
                })
              }
            >
              {taskData.description.trim().length === 0 ? (
                <i className={styles['no-assignee-txt']}>No description</i>
              ) : (
                taskData.description
              )}
            </div>
          </div>

          {!editTask && taskData.customFields.length > 0 && (
            <>
              {taskData.customFields.map((obj) => (
                <div
                  key={obj._id}
                  className={`${styles['more-property-div']} ${styles['custom-field-box']}`}
                >
                  <span
                    className={styles['custom-property-name']}
                    title="Custom Field"
                  >
                    <IoColorPaletteSharp className={styles['custom-icon']} />
                    {obj.field}:
                  </span>

                  <span className={styles['custom-field-value']}>
                    {obj.value}
                  </span>
                </div>
              ))}
            </>
          )}

          {editTask && userData.personalization.customFields.length > 0 && (
            <>
              {userData.personalization.customFields.map((obj) => (
                <div
                  key={obj._id}
                  className={`${styles['more-property-div']} ${styles['custom-field-box']}`}
                >
                  <label
                    className={styles['custom-property-label']}
                    title="Custom Field"
                    htmlFor={obj.field}
                  >
                    <IoColorPaletteSharp className={styles['custom-icon']} />
                    {obj.field}:
                  </label>

                  <input
                    className={styles['custom-field']}
                    id={obj.field}
                    type="text"
                    defaultValue={
                      taskData.customFields.find(
                        (elem) => elem.field === obj.field
                      )
                        ? taskData.customFields.find(
                            (elem) => elem.field === obj.field
                          ).value
                        : ''
                    }
                    maxLength={30}
                    onChange={handleCustomField(obj.field)}
                  />
                </div>
              ))}
            </>
          )}

          <div
            className={`${styles['more-property-div']} ${
              styles['activity-log-box']
            } ${task.customFields.length > 0 ? styles['add-margin'] : ''}`}
          >
            <span className={styles['property-name']}>Activity Log:</span>
            <div className={styles['activity-log']}>
              {taskActivities === null ? (
                ''
              ) : taskActivities.length === 0 ? (
                <i className={styles['no-recent-activity']}>
                  {!activitiesData.loading
                    ? activitiesData.error
                      ? 'Unable to retrieve data'
                      : 'No recent activity'
                    : ''}
                </i>
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

              {/*  Loading animation */}
              {activitiesData.loading && (
                <div className={styles['loader-box']}>
                  <Loader
                    style={{
                      width: '2rem',
                      height: '2rem',
                      margin: '1.7rem 0 0.5rem',
                    }}
                  />
                </div>
              )}

              {!activitiesData.lastPage && (
                <div className={styles['more-activity-box']}>
                  {' '}
                  <button
                    className={styles['more-activity-btn']}
                    onClick={nextActivitiesPage}
                  >
                    {activitiesDetails.page === 1
                      ? activitiesData.error
                        ? 'Retry'
                        : 'Show More'
                      : 'Show More'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className={`${styles['save-btn-div']} ${
              editTask ? styles['show-save-btn'] : ''
            }`}
          >
            {' '}
            <button
              className={`${styles['save-btn']} ${
                !isDataChanged ? styles['disable-save-btn'] : ''
              } ${updating ? styles['updating-btn'] : ''}`}
              onClick={updateTask}
            >
              {updating ? (
                <>
                  {' '}
                  <SiKashflow className={styles['updating-icon']} /> Saving....
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>{' '}
    </article>
  );
};

export default TaskBox;
