import React, { useEffect, useState } from 'react';
import styles from '../styles/DeleteComponent.module.css';
import { IoCloseSharp } from 'react-icons/io5';
import { apiClient } from '../App';
import { SiKashflow } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';

const DeleteComponent = ({
  toast,
  type,
  typeData,
  setDeleteModal,
  setProject,
  setSelectMode,
}) => {
  const [isNameValid, setIsNameValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState('');

  const navigate = useNavigate();

  // Checks if project name is correct
  useEffect(() => {
    if (String(name) !== String(typeData.name)) {
      setIsNameValid(false);
    } else {
      setIsNameValid(true);
    }
  }, [name]);

  const hideDisplayModal = (e) => {
    e.target === e.currentTarget &&
      setDeleteModal({ value: false, type: null });
  };

  const deleteProject = async () => {
    if (!isNameValid) {
      return toast('Type in the correct project name to delete the project.', {
        toastId: 'toast-id1',
      });
    }

    setIsProcessing(true);

    try {
      await apiClient.delete(`/api/v1/projects/${typeData.id}`);
      setIsProcessing(false);
      navigate('/projects');
    } catch (err) {
      setIsProcessing(false);

      if (!err.response || !err.response.data || err.response.status === 500) {
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

  const deleteFiles = async () => {
    setIsProcessing(true);

    try {
      const { data } = await apiClient.patch(
        `/api/v1/projects/${typeData.id}/files`,
        { files: typeData.files }
      );

      setIsProcessing(false);
      setProject(data.data.project);
      setDeleteModal({ value: false, type: null });
      setSelectMode({ value: false, index: null });

      if (data.data.message !== '') {
        toast(data.data.message, {
          toastId: 'toast-id2',
        });
      }
    } catch (err) {
      setIsProcessing(false);
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast(
          `An error occured while deleting ${
            typeData.files.length === 1 ? 'file' : 'files'
          }.`,
          {
            toastId: 'toast-id2',
          }
        );
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id2',
        });
      }
    }
  };

  return (
    <section className={styles.section} onClick={hideDisplayModal}>
      <div className={styles['modal-container']}>
        <span
          className={styles['close-modal']}
          onClick={() => setDeleteModal({ value: false, type: null })}
        >
          <IoCloseSharp className={styles['close-modal-icon']} />
        </span>

        <h1 className={styles['modal-head']}>Delete {type}</h1>

        <div className={styles['delete-content']}>
          {type === 'Project' ? (
            <>
              <span className={styles['delete-text']}>
                Deleting this project will permanently remove all associated
                tasks and files. This action cannot be undone. Type the project
                name <b>{typeData.name}</b> to continue.
              </span>

              <input
                className={styles['delete-input']}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </>
          ) : type.startsWith('File') ? (
            <span className={styles['delete-text']}>
              Deleting {typeData.files.length !== 1 ? 'these' : 'this'} file
              {typeData.files.length !== 1 ? 's' : ''} is permanent and cannot
              be undone.
            </span>
          ) : (
            ''
          )}
        </div>

        <div className={styles['btn-div']}>
          <button
            className={`${styles['delete-btn']} ${
              type === 'Project'
                ? !isNameValid
                  ? styles['disable-btn']
                  : ''
                : ''
            } ${isProcessing ? styles['processing-button'] : ''} `}
            onClick={
              type === 'Project'
                ? deleteProject
                : type.startsWith('File')
                ? deleteFiles
                : null
            }
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
