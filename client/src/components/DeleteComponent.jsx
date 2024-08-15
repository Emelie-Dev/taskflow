import React, { useEffect, useState } from 'react';
import styles from '../styles/DeleteComponent.module.css';
import { IoCloseSharp } from 'react-icons/io5';
import { apiClient } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import { SiKashflow } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';

const DeleteComponent = ({ projectId, projectName, setDeleteModal }) => {
  const [isNameValid, setIsNameValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState('');

  const navigate = useNavigate();

  // Checks if project name is correct
  useEffect(() => {
    if (String(name) !== String(projectName)) {
      setIsNameValid(false);
    } else {
      setIsNameValid(true);
    }
  }, [name]);

  const hideDisplayModal = (e) => {
    e.target === e.currentTarget && setDeleteModal(false);
  };

  const deleteProject = async () => {
    if (!isNameValid) {
      return toast('Type in the correct project name to delete the project.', {
        toastId: 'toast-id1',
      });
    }

    setIsProcessing(true);

    try {
      await apiClient.delete(`/api/v1/projects/${projectId}`);
      setIsProcessing(false);
      navigate('/projects');
    } catch (err) {
      setIsProcessing(false);

      if (!err.response.data || err.response.status === 500) {
        return toast('An error occured while deleting project.', {
          toastId: 'toast-id1',
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id1',
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
          onClick={() => setDeleteModal(false)}
        >
          <IoCloseSharp className={styles['close-modal-icon']} />
        </span>

        <h1 className={styles['modal-head']}>Delete Project</h1>

        <div className={styles['delete-content']}>
          <span className={styles['delete-text']}>
            Deleting this project will permanently remove all associated tasks
            and files. This action cannot be undone. Type the project name{' '}
            <b>{projectName}</b> to continue.
          </span>

          <input
            className={styles['delete-input']}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles['btn-div']}>
          <button
            className={styles['cancel-btn']}
            onClick={() => setDeleteModal(false)}
          >
            Cancel
          </button>
          <button
            className={`${styles['delete-btn']} ${
              !isNameValid ? styles['disable-btn'] : ''
            } ${isProcessing ? styles['processing-button'] : ''} `}
            onClick={deleteProject}
          >
            {isProcessing ? (
              <>
                <SiKashflow className={styles['deleting-icon']} />
                Deleting....
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default DeleteComponent;
