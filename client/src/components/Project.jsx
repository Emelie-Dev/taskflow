import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/Project.module.css';
import { IoCloseSharp } from 'react-icons/io5';
import { apiClient } from '../App';
import { ToastContainer, toast } from 'react-toastify';

const Project = ({
  displayModal,
  setdisplayModal,
  editProject,
  projectData,
}) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date().getDate();

  const [project, setProject] = useState(
    projectData || {
      name: '',
      status: 'active',
      deadline: `${currentYear}-0${currentMonth}-0${currentDate}`,
      team: new Set(),
      description: '',
      addFiles: false,
    }
  );
  const [isChanged, setIsChanged] = useState(false);
  const [searching, setSearching] = useState(false);

  const memberRef = useRef();

  const initialData = projectData || {
    name: '',
    status: 'active',
    deadline: `${currentYear}-0${currentMonth}-0${currentDate}`,
    team: new Set(),
    description: '',
    addFiles: false,
  };

  useEffect(() => {
    let num = 0;
    let limit = Object.keys(project).length;
    let condition;

    if (editProject) {
      for (const prop in project) {
        if (prop === 'team') {
          if (String([...project.team]) === String([...initialData.team]))
            num++;
        } else {
          if (String(project[prop]) === String(initialData[prop])) num++;
        }
      }

      condition = num !== limit;
    } else {
      condition = String(project.name).trim() !== '';
    }

    if (condition) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [project]);

  const hideDisplayModal = (e) => {
    e.target === e.currentTarget && setdisplayModal(false);
  };

  const addMember = async () => {
    let user;
    let username = String(memberRef.current.value).trim();

    if (username === '') return;

    if (username.startsWith('@')) username = username.slice(1);

    setSearching(true);

    try {
      const { data } = await apiClient(`/api/v1/users/${username}`);

      user = data.data.user;

      setSearching(false);
    } catch (err) {
      setSearching(false);

      if (!err.response.data || err.response.status === 500) {
        return toast('An error occured while searching for user.', {
          toastId: 'toast-id1',
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id1',
        });
      }
    }

    console.log(user);
  };

  return (
    <section className={styles.section} onClick={hideDisplayModal}>
      <ToastContainer autoClose={2000} />

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
                value={project.name}
                onChange={(e) =>
                  setProject({ ...project, name: e.target.value })
                }
              />
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
                value={project.status}
                onChange={(e) =>
                  setProject({ ...project, status: e.target.value })
                }
              >
                <option value={'active'}>Active</option>
                <option value={'inactive'}>Inactive</option>
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
                min={initialData.deadline}
                value={project.deadline}
                onChange={(e) =>
                  setProject({ ...project, deadline: e.target.value })
                }
              />
            </div>

            <div className={styles.category}>
              <span className={styles['label-box']}>
                <label className={styles['form-label']} htmlFor="team">
                  Add Team Member
                </label>
              </span>

              <span className={styles['add-member-box']}>
                <input
                  className={`${styles['form-input']} ${styles['team-input']}`}
                  type="text"
                  id="team"
                  placeholder={'Provide username e.g @user1'}
                  ref={memberRef}
                />

                <button
                  className={styles['add-member-btn']}
                  type="button"
                  onClick={addMember}
                >
                  Add
                  <div className="searching-loader"></div>
                </button>
              </span>
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
                value={project.description}
                onChange={(e) =>
                  setProject({ ...project, description: e.target.value })
                }
              ></textarea>
            </div>

            <div className={styles['add-files']}>
              <input
                className={styles['add-files-checkbox']}
                type="checkbox"
                id="add-files"
                checked={project.addFiles}
                onChange={(e) =>
                  setProject({ ...project, addFiles: e.target.checked })
                }
              />
              <label className={styles['add-files-label']} htmlFor="add-files">
                Enable team members to add files.
              </label>
            </div>
          </div>

          <div className={styles['btn-box']}>
            <input
              className={`${styles['project-btn']} ${
                !isChanged ? styles['disable-submit'] : ''
              }`}
              type="submit"
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Project;
