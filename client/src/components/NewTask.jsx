import React, { useEffect, useContext, useRef, useState } from 'react';
import styles from '../styles/NewTask.module.css';
import { IoCloseSharp } from 'react-icons/io5';
import { generateName } from '../pages/Dashboard';
import { ToastContainer, toast } from 'react-toastify';
import { SiKashflow } from 'react-icons/si';
import { apiClient, AuthContext } from '../App';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentDate = new Date().getDate();

const NewTask = ({
  setAddTask,
  fixedProject,
  projects,
  currentProjectIndex,
  currentProject,
  setCurrentProject,
  setCreateCount,
  setScheduleDetails,
  setScheduleData,
  projectsDetails,
  setReloadProject,
  projectPage,
  setProject,
  setTasks,
  category,
}) => {
  const { userData, setUserData } = useContext(AuthContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [taskData, setTaskData] = useState({
    name: '',
    project: `${
      fixedProject
        ? projects[currentProjectIndex]._id
        : projects.length === 0
        ? ''
        : projects[currentIndex]._id
    }`,
    priority: 'high',
    status: 'open',
    get deadline() {
      const date = new Date();
      date.setMinutes(0, 0, 0);

      return date;
    },
    assignees: new Set(),
    description: '',
  });

  const [assigneesData, setAssigneesData] = useState([]);
  const [validAssignee, setValidAssignee] = useState(false);
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customFields, setCustomFields] = useState(
    userData.personalization.customFields.map((obj) => ({
      field: obj.field,
      value: '',
    }))
  );

  const assigneeRef = useRef();

  useEffect(() => {
    if (
      String(taskData.name).trim() !== '' &&
      String(taskData.project).trim() !== ''
    ) {
      setEnableSubmit(true);
    } else {
      setEnableSubmit(false);
    }
  }, [taskData]);

  useEffect(() => {
    if (!fixedProject) {
      if (!projectsDetails.error) {
        setTaskData({ ...taskData, project: projects[currentIndex]._id });
      }
    }
  }, [projectsDetails]);

  const hideComponent = (e) => {
    e.target === e.currentTarget && setAddTask(false);
  };

  const changeDeadline = (e) => {
    let deadline = new Date(e.target.value);

    if (Date.parse(deadline) < Date.parse(new Date())) deadline = new Date();
    deadline.setMinutes(0, 0, 0);

    setTaskData({ ...taskData, deadline });
  };

  const deadlineValue = () => {
    const date = new Date(taskData.deadline);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:00`;
  };

  const addAssignee = () => {
    const name = assigneeRef.current.value;

    const assignees = new Set([...taskData.assignees]);

    const assignee = projects[currentProjectIndex || currentIndex].team.find(
      (member) =>
        generateName(member.firstName, member.lastName, member.username) ===
        name
    );

    if (!assignee) return;

    if (taskData.assignees.has(assignee._id)) return;

    assignees.add(assignee._id);

    setTaskData({ ...taskData, assignees });
    setAssigneesData([...assigneesData, assignee]);
  };

  const removeAssignee = (index) => {
    const assignee = assigneesData[index]._id;

    const assignees = new Set([...taskData.assignees]);
    assignees.delete(assignee);

    const assigneesArray = [...assigneesData];
    assigneesArray.splice(index, 1);

    setTaskData({ ...taskData, assignees });
    setAssigneesData(assigneesArray);
  };

  const validateAssignee = (e) => {
    const value = e.target.value;

    let assignee = false;

    if (projects[currentProjectIndex || currentIndex]) {
      assignee = projects[currentProjectIndex || currentIndex].team.find(
        (member) =>
          generateName(member.firstName, member.lastName, member.username) ===
          value
      );
    }

    if (assignee) {
      setValidAssignee(true);
    } else {
      setValidAssignee(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    if (taskData.name.trim() === '') {
      return toast('Please provide a value for the name field.', {
        toastId: 'toast-id1',
      });
    }

    const body = { ...taskData };
    delete body.assignees;

    if (customFields.length > 0) {
      const fields = customFields.reduce((accumulator, field) => {
        if (String(field.value).trim().length !== 0) accumulator.push(field);

        return accumulator;
      }, []);
      body.customFields = fields;
    }

    setIsProcessing(true);

    try {
      let response = await apiClient.post(`/api/v1/tasks`, body);

      let task = response.data.data.task;

      if (taskData.assignees.size !== 0) {
        try {
          response = await apiClient.patch(
            `/api/v1/tasks/${task._id}/assignees`,
            {
              assignee: [...taskData.assignees],
            }
          );

          if (fixedProject && !projectPage) {
            const { data } = await apiClient.get(
              `/api/v1/tasks/${task._id}/activities?page=1`
            );

            task = response.data.data.task;
            task.activities = data.data.activities;
          }
        } catch (err) {
          if (
            !err.response ||
            !err.response.data ||
            err.response.status === 500
          ) {
            toast('An error occured while assigning the task.', {
              toastId: 'toast-id2',
            });
          } else {
            toast(err.response.data.message, {
              toastId: 'toast-id2',
            });
          }
        }
      }

      if (fixedProject && !projectPage) {
        setCurrentProject({
          tasks: [task, ...currentProject.tasks],
        });
        projects[currentProjectIndex].details[task.status]++;
        setCreateCount((prevCount) => prevCount + 1);
      } else if (projectPage) {
        if (category === 'all' || category === task.status) {
          setTasks((tasks) => [task, ...tasks]);
          setCreateCount((prevCount) => prevCount + 1);
        }
      } else if (!fixedProject) {
        if (new Date(task.deadline).getDate() === new Date().getDate()) {
          setScheduleDetails({
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
            page: 1,
          });

          setScheduleData({
            loading: true,
            lastPage: true,
            error: false,
            pageError: false,
          });
        }
      }

      setAddTask(false);
    } catch (err) {
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occured while creating task.', {
          toastId: 'toast-id2',
        });
      }

      return toast(err.response.data.message, {
        toastId: 'toast-id2',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFieldChange = (field) => (e) => {
    setCustomFields((fields) => {
      const newFields = [...fields];
      const updatedField = newFields.find((obj) => obj.field === field);
      updatedField.value = e.target.value;
      return newFields;
    });
  };

  return (
    <section className={styles.section} onClick={hideComponent}>
      <ToastContainer autoClose={2000} />

      <div className={styles['modal-container']}>
        <span
          className={styles['close-modal']}
          onClick={() => setAddTask(false)}
        >
          <IoCloseSharp className={styles['close-modal-icon']} />
        </span>
        <h1 className={styles['modal-head']}>Add Task</h1>

        <form
          className={styles.form}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
          onSubmit={createTask}
        >
          <div className={styles['modal-list']}>
            <div className={styles.category}>
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="task-name">
                  Task Name
                </label>
              </span>
              <input
                className={styles['form-input']}
                id="task-name"
                type="text"
                value={taskData.name}
                onChange={(e) =>
                  setTaskData({ ...taskData, name: e.target.value })
                }
              />
            </div>

            <div className={styles.category}>
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="project">
                  Project
                </label>
              </span>

              <select
                className={styles['form-select']}
                id="project"
                value={taskData.project}
                onChange={(e) => {
                  setCurrentIndex(e.target.selectedIndex);
                  setTaskData({ ...taskData, project: e.target.value });
                }}
                disabled={fixedProject}
              >
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>

              {!fixedProject && projectsDetails.error && (
                <span className={styles['project-error-box']}>
                  <i className={styles['project-error-text']}>
                    Unable to load some projects
                  </i>{' '}
                  <button
                    type="button"
                    className={styles['project-reload-btn']}
                    onClick={() => setReloadProject(Symbol('true'))}
                  >
                    Retry
                  </button>
                </span>
              )}
            </div>

            <div className={styles.category}>
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="priority">
                  Priority
                </label>
              </span>
              <select
                className={styles['form-select']}
                id="priority"
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

            <div className={styles.category}>
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="status">
                  Status
                </label>
              </span>

              <select
                className={styles['form-select']}
                id="status"
                value={taskData.status}
                onChange={(e) =>
                  setTaskData({ ...taskData, status: e.target.value })
                }
              >
                <option value={'open'}>Open</option>
                <option value={'progress'}>In Progress</option>
                <option value={'complete'}>Completed</option>
              </select>
            </div>

            <div className={styles.category}>
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="due-date">
                  Due Date
                </label>
              </span>

              <input
                className={styles['form-input']}
                type="datetime-local"
                id="due-date"
                min={`${currentYear}-0${currentMonth + 1}-${currentDate}T00:00`}
                value={deadlineValue()}
                onChange={changeDeadline}
              />
            </div>

            <div className={styles.category}>
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="assignee">
                  Add Assignee
                </label>
              </span>

              <span className={styles['assignees-box']}>
                <input
                  className={`${styles['form-input']} ${styles['assignee-input']}`}
                  list="team"
                  id="assignee"
                  ref={assigneeRef}
                  onChange={(e) => validateAssignee(e)}
                />

                <button
                  type="button"
                  className={`${styles['add-assignee-btn']} ${
                    !validAssignee ? styles['disable-btn'] : ''
                  }`}
                  onClick={addAssignee}
                >
                  Add
                </button>
              </span>

              <datalist id="team">
                {projects[currentProjectIndex || currentIndex] &&
                  projects[currentProjectIndex || currentIndex].team.map(
                    (member) => (
                      <option
                        key={member._id}
                        value={generateName(
                          member.firstName,
                          member.lastName,
                          member.username
                        )}
                      />
                    )
                  )}
              </datalist>
            </div>

            <div
              className={`${styles.category} ${styles['assignees-category']}`}
            >
              <span className={styles['label-box']}>
                <label className={styles['form-label']}>
                  {assigneesData.length === 1 ? 'Assignee' : 'Assignees'}
                </label>
              </span>

              <div className={styles['assignees']}>
                {assigneesData.length === 0 ? (
                  <i className={styles['no-assignees-txt']}>No Assignees</i>
                ) : (
                  assigneesData.map((assignee, index) => (
                    <span key={assignee._id} className={styles['assignee-box']}>
                      <IoCloseSharp
                        className={styles['remove-assignee']}
                        onClick={() => removeAssignee(index)}
                      />
                      <span className={styles['image-box']}>
                        <span className={styles['assignee-name']}>
                          {generateName(
                            assignee.firstName,
                            assignee.lastName,
                            assignee.username
                          )}
                        </span>

                        <img
                          className={styles['assignee-img']}
                          src={`../../assets/images/users/${assignee.photo}`}
                        />
                      </span>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className={styles.category}>
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="description">
                  Description
                </label>
              </span>

              <textarea
                className={`${styles['form-input']} ${styles['task-description']}`}
                id="description"
                rows={5}
                value={taskData.description}
                onChange={(e) =>
                  setTaskData({ ...taskData, description: e.target.value })
                }
              ></textarea>
            </div>

            {customFields.length > 0 && (
              <div className={styles.category}>
                <span className={styles['label-box']}>
                  <label className={styles['form-label']} htmlFor="description">
                    Custom Fields
                  </label>

                  <div className={styles['custom-fields-container']}>
                    {customFields.map((obj, index) => (
                      <div key={index} className={styles['custom-field-box']}>
                        <label
                          className={styles['custom-field-label']}
                          htmlFor={obj.field}
                        >
                          {obj.field}:
                        </label>
                        <input
                          className={styles['custom-field']}
                          id={obj.field}
                          type="text"
                          maxLength={30}
                          value={obj.value}
                          onChange={handleFieldChange(obj.field)}
                        />
                      </div>
                    ))}
                  </div>
                </span>
              </div>
            )}
          </div>

          <div className={styles['btn-box']}>
            <button
              className={`${styles['add-task-btn']} ${
                !enableSubmit ? styles['disable-btn'] : ''
              } ${isProcessing ? styles['creating-button'] : ''}`}
              type="submit"
            >
              {isProcessing ? (
                <>
                  <SiKashflow className={styles['creating-icon']} />{' '}
                  Processing....
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewTask;
