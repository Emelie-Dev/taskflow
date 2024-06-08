import React from 'react';
import styles from '../styles/Project.module.css';
import { IoCloseSharp } from 'react-icons/io5';

const Project = ({ displayModal, setdisplayModal, editProject }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date().getDate();

  const hideDisplayModal = (e) => {
    e.target === e.currentTarget && setdisplayModal(false);
  };

  return (
    <section className={styles.section} onClick={hideDisplayModal}>
      <div className={styles['modal-container']}>
        <span
          className={styles['close-modal']}
          onClick={() => setdisplayModal(false)}
        >
          <IoCloseSharp className={styles['close-modal-icon']} />
        </span>
        <h1 className={styles['modal-head']}>
          {editProject ? 'Edit Project' : 'Create Project'}
        </h1>

        <form className={styles.form}>
          <div className={styles['modal-list']}>
            <div className={styles.category}>
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="project-name">
                  Project Name
                </label>
              </span>
              <input
                className={styles['form-input']}
                id="project-name"
                type="text"
              />
            </div>

            <div className={styles.category}>
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="status">
                  Status
                </label>
              </span>

              <select className={styles['form-select']} id="status">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className={styles.category}>
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="deadline">
                  Deadline
                </label>
              </span>

              <input
                className={styles['form-input']}
                type="date"
                id="deadline"
                min={`${currentYear}-0${currentMonth}-0${currentDate}`}
              />
            </div>

            <div className={styles.category}>
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="team">
                  Add Team Member
                </label>
              </span>

              <input className={styles['form-input']} type="text" id="team" />
            </div>

            <div
              className={`${styles.category} ${styles['assignees-category']}`}
            >
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="members">
                  Team Members
                </label>
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
                className={`${styles['form-input']} ${styles['project-description']}`}
                id="description"
                rows={10}
              ></textarea>
            </div>

            <div className={styles['add-files']}>
              <input
                className={styles['add-files-checkbox']}
                type="checkbox"
                id="add-files"
              />
              <label className={styles['add-files-label']} htmlFor="add-files">
                Enable team members to add files.
              </label>
            </div>
          </div>

          <div className={styles['btn-box']}>
            <input className={styles['project-btn']} type="submit" />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Project;
