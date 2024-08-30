import React from 'react';
import styles from '../styles/DeleteModal.module.css';
import { SiKashflow } from 'react-icons/si';

const DeleteModal = ({ setShowDeleteBox, deleteTask, deleting }) => {
  return (
    <div className={styles['confirm-box']}>
      <span className={styles['confirm-text']}>
        Are you sure you want to delete this task?
      </span>

      <div className={styles['btn-box']}>
        <button
          className={styles.button}
          onClick={() => setShowDeleteBox(false)}
        >
          Cancel
        </button>
        <button
          className={`${styles.button}   ${deleting ? styles.deleting : ''}`}
          onClick={deleteTask}
        >
          {deleting ? (
            <>
              {' '}
              <SiKashflow className={styles['deleting-icon']} /> Deleting....
            </>
          ) : (
            'Delete'
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
