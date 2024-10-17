import React, { useContext, useState } from 'react';
import styles from '../styles/Personalization.module.css';
import { IoMdClose } from 'react-icons/io';
import { AuthContext } from '../App';

const FieldInput = ({ field, inputId, customFields, setCustomFields }) => {
  const { mode } = useContext(AuthContext);

  const removeField = () => {
    const index = customFields.findIndex(({ id }) => id === inputId);

    const totalData = [...customFields];

    totalData.splice(index, 1);

    setCustomFields(totalData);
  };

  return (
    <span className={styles['input-box']}>
      <input
        className={`${styles['field-input']} ${
          mode === 'dark' ? styles['dark-input'] : ''
        }`}
        type="text"
        value={field}
        readOnly
      />
      <span
        className={`${styles['remove-box']} ${
          mode === 'dark' ? styles['dark-remove-box'] : ''
        }`}
        title="Remove"
        onClick={removeField}
      >
        <IoMdClose className={styles['remove-icon']} />
      </span>
    </span>
  );
};

export default FieldInput;
