import React, { useEffect, useRef, useState, useContext } from 'react';
import styles from '../styles/Project.module.css';
import { IoCloseSharp } from 'react-icons/io5';
import { apiClient, AuthContext } from '../App';
import { generateName } from '../pages/Dashboard';
import { SiKashflow } from 'react-icons/si';
import { ToastContainer, toast } from 'react-toastify';
import { getProfilePhoto } from './Header';

const Project = ({
  setDisplayModal,
  editProject,
  projectData,
  projectTeam,
  setProject: setNewProject,
  projects,
  setProjects,
  setCreateCount,
}) => {
  const { serverUrl } = useContext(AuthContext);
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const currentDate = String(new Date().getDate()).padStart(2, '0');

  const [project, setProject] = useState(
    projectData || {
      name: '',
      status: 'active',
      deadline: `${currentYear}-${currentMonth}-${currentDate}`,
      team: new Set(),
      description: '',
      addFiles: false,
    }
  );
  const [isChanged, setIsChanged] = useState(false);
  const [searching, setSearching] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [team, setTeam] = useState(projectTeam || []);
  const [isProcessing, setIsProcessing] = useState(false);

  const initialData = projectData || {
    name: '',
    status: 'active',
    deadline: `${currentYear}-${currentMonth}-${currentDate}`,
    team: new Set(),
    description: '',
    addFiles: false,
  };

  // Checks if project data has changed
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

  // Checks if new member name is valid or it exists already
  useEffect(() => {
    let username = memberName.trim();

    if (username.startsWith('@')) username = username.slice(1);

    const user = team.find((member) => member.username === username);

    if (username === '') {
      setIsNameValid(false);
    } else if (username.match(/\W/)) {
      setIsNameValid(false);
    } else if (user) {
      setIsNameValid(false);
    } else {
      setIsNameValid(true);
    }
  }, [memberName]);

  const hideDisplayModal = (e) => {
    e.target === e.currentTarget && setDisplayModal(false);
  };

  const addMember = async () => {
    let user;
    let username = memberName.trim();

    if (username === '') return;

    if (username.startsWith('@')) username = username.slice(1);

    setSearching(true);

    try {
      const { data } = await apiClient(`/api/v1/users/${username}?team=true`);

      user = data.data.user;

      setSearching(false);
      setIsNameValid(false);
    } catch (err) {
      setSearching(false);

      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occured while searching for user.', {
          toastId: 'toast-id1',
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id1',
        });
      }
    }

    if (!project.team.has(user._id)) {
      const members = new Set([...project.team]);
      members.add(user._id);

      setTeam([...team, user]);
      setProject({ ...project, team: members });
    }
  };

  const removeMember = (id) => () => {
    let username = memberName.trim();
    if (username.startsWith('@')) username = username.slice(1);

    const newTeam = [...team];
    const teamSet = new Set([...project.team]);

    const index = newTeam.findIndex((member) => member._id === id);

    if (index !== -1) {
      if (username === newTeam[index].username) setIsNameValid(true);

      newTeam.splice(index, 1);
      teamSet.delete(id);

      setTeam(newTeam);
      setProject({ ...project, team: teamSet });
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    let body = { ...project };
    delete body.team;

    let request = editProject
      ? apiClient.patch(`/api/v1/projects/${project.id}`, body)
      : apiClient.post('/api/v1/projects', body);

    setIsProcessing(true);

    try {
      let response = await request;

      const projectId = editProject
        ? project.id
        : response.data.data.project._id;

      // If team members were updated
      if (String([...project.team]) !== String([...initialData.team])) {
        const newTeam = [...project.team];

        try {
          response = await apiClient.patch(
            `/api/v1/projects/${projectId}/team`,
            { team: newTeam, status: editProject ? body.status : 'active' }
          );

          toast(response.data.data.message, {
            toastId: 'toast-id3',
          });
        } catch {
          toast('An error occured while updating the team members.', {
            toastId: 'toast-id3',
          });
        }
      }

      setIsProcessing(false);
      setDisplayModal(false);

      if (editProject) {
        setNewProject(response.data.data.project);
      } else {
        setProjects({
          grid: [response.data.data.project, ...projects.grid],
          table: (() => {
            const table = [...projects.table];

            if (
              !table[0].find(
                (page) => page._id === response.data.data.project._id
              )
            )
              table[0].unshift(response.data.data.project);

            table.forEach((page, index, array) => {
              if (page.length > 30) {
                if (array[index + 1]) array[index + 1].unshift(page.pop());
                else page.pop();
              }
            });

            return table;
          })(),
        });
        setCreateCount((prevCount) => prevCount + 1);
      }
    } catch (err) {
      // Fix deadline issue
      const message = editProject
        ? 'An error occured while saving project.'
        : 'An error occured while creating project.';

      setIsProcessing(false);

      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast(message, {
          toastId: 'toast-id2',
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id2',
        });
      }
    }
  };

  return (
    <section className={styles.section} onClick={hideDisplayModal}>
      <ToastContainer autoClose={2000} />

      <div className={styles['modal-container']}>
        <span
          className={styles['close-modal']}
          onClick={() => setDisplayModal(false)}
        >
          <IoCloseSharp className={styles['close-modal-icon']} />
        </span>
        <h1 className={styles['modal-head']}>
          {editProject ? 'Edit Project' : 'Create Project'}
        </h1>

        <form
          className={styles.form}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
          onSubmit={submitForm}
          noValidate
        >
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
                min={`${currentYear}-${currentMonth}-${currentDate}`}
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
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                />

                <button
                  className={`${styles['add-member-btn']} ${
                    !isNameValid ? styles['disable-btn'] : ''
                  }`}
                  type="button"
                  onClick={addMember}
                >
                  {searching ? (
                    <div className={styles['searching-loader']}></div>
                  ) : (
                    'Add'
                  )}
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
                {team.length === 0 ? (
                  <i className={styles['no-team-text']}>No team member</i>
                ) : (
                  team.map((member) => (
                    <span key={member._id} className={styles['assignee-box']}>
                      <IoCloseSharp
                        className={styles['remove-assignee']}
                        onClick={removeMember(member._id)}
                        title="Remove"
                      />
                      <span className={styles['image-box']}>
                        <span className={styles['assignee-name']}>
                          {generateName(
                            member.firstName,
                            member.lastName,
                            member.username
                          )}
                        </span>

                        <img
                          className={styles['assignee-img']}
                          src={getProfilePhoto(member, serverUrl)}
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
            <button
              className={`${styles['project-btn']} ${
                !isChanged ? styles['disable-btn'] : ''
              } ${isProcessing ? styles['processing-button'] : ''}`}
              type="submit"
            >
              {!isProcessing ? (editProject ? 'Save' : 'Submit') : ''}
              {isProcessing ? (
                editProject ? (
                  <>
                    <SiKashflow className={styles['creating-icon']} />{' '}
                    Saving....
                  </>
                ) : (
                  <>
                    <SiKashflow className={styles['creating-icon']} />{' '}
                    Processing....
                  </>
                )
              ) : (
                ''
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Project;
