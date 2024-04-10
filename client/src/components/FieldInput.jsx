import React, { useState } from 'react';
import styles from '../styles/Personalization.module.css';
import { IoMdClose } from 'react-icons/io';

const FieldInput = ({ value, id, fieldData, setFieldData }) => {
  const removeField = () => {
    const inputId = parseFloat(id);

    const index = fieldData.findIndex(({ id }) => id === inputId);

    const totalData = [...fieldData];

    totalData.splice(index, 1);

    setFieldData(totalData);
  };

  return (
    <span className={styles['input-box']}>
      <input
        className={styles['field-input']}
        type="text"
        value={value}
        readOnly
      />
      <span
        className={styles['remove-box']}
        title="Remove"
        onClick={removeField}
      >
        <IoMdClose className={styles['remove-icon']} />
      </span>
    </span>
  );
};

export default FieldInput;
