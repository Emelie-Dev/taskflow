import React from 'react';
import styles from '../styles/NewTask.module.css';
import { IoCloseSharp } from 'react-icons/io5';

const NewTask = ({ addTask, setAddTask, fixedProject }) => {
  const hideComponent = (e) => {
    e.target === e.currentTarget && setAddTask(false);
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date().getDate();

  return (
    <section className={styles.section} onClick={hideComponent}>
      <div className={styles['modal-container']}>
        <span
          className={styles['close-modal']}
          onClick={() => setAddTask(false)}
        >
          <IoCloseSharp className={styles['close-modal-icon']} />
        </span>
        <h1 className={styles['modal-head']}>Add Task</h1>

        <form className={styles.form}>
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
                disabled={fixedProject}
              >
                <option>Fitness App</option>
                <option>Media Player</option>
                <option>Taskflow</option>
              </select>
            </div>

            <div className={styles.category}>
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="priority">
                  Priority
                </label>
              </span>
              <select className={styles['form-select']} id="priority">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className={styles.category}>
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="status">
                  Status
                </label>
              </span>

              <select className={styles['form-select']} id="status">
                <option>Open</option>
                <option>In Progress</option>
                <option>Completed</option>
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
                type="date"
                id="due-date"
                min={`${currentYear}-0${currentMonth}-0${currentDate}`}
              />
            </div>

            <div className={styles.category}>
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="assignee">
                  Add Assignee
                </label>
              </span>

              <input
                className={styles['form-input']}
                list="team"
                id="assignee"
              />

              <datalist id="team">
                <option value={'Jon Snow'} />
                <option value={'Arya Stark'} />
                <option value={'Tyrion Lannister'} />
              </datalist>
            </div>

            <div
              className={`${styles.category} ${styles['assignees-category']}`}
            >
              <span className={styles['label-box']}>
                <label className={styles['form-label']}>Assignee(s)</label>
              </span>

              <div className={styles['assignees']}>
                <span className={styles['assignee-box']}>
                  <IoCloseSharp className={styles['remove-assignee']} />
                  <span className={styles['image-box']}>
                    <span className={styles['assignee-name']}>
                      Curtis Jones
                    </span>

                    <img
                      className={styles['assignee-img']}
                      src="../../public/assets/images/profile1.webp"
                    />
                  </span>
                </span>

                <span className={styles['assignee-box']}>
                  <IoCloseSharp className={styles['remove-assignee']} />
                  <span className={styles['image-box']}>
                    <span className={styles['assignee-name']}>John Snow</span>

                    <img
                      className={styles['assignee-img']}
                      src="../../public/assets/images/profile3.jpeg"
                    />
                  </span>
                </span>

                <span className={styles['assignee-box']}>
                  <IoCloseSharp className={styles['remove-assignee']} />
                  <span className={styles['image-box']}>
                    <span className={styles['assignee-name']}>
                      Tyrion Lannister
                    </span>

                    <img
                      className={styles['assignee-img']}
                      src="../../public/assets/images/pics1.jpg"
                    />
                  </span>
                </span>
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
              ></textarea>
            </div>
          </div>

          <div className={styles['btn-box']}>
            <input className={styles['add-task-btn']} type="submit" />
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewTask;
