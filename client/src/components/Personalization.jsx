import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/Personalization.module.css';
import FieldInput from './FieldInput';
import { ToastContainer, toast } from 'react-toastify';

const initialData = {
  theme: 'light',
  view: 'grid',
  colors: {
    high: '#ff0000',
    medium: '#ffd700',
    low: '#008000',
  },
  fields: [
    { value: 'School', id: 1 },
    { value: 'Company', id: 2 },
  ],
};

const customId = 'toast-id';

const Personalization = () => {
  const [newField, setNewField] = useState('');
  const [enableBtn, setEnableBtn] = useState(false);
  const [inputIndex, setInputIndex] = useState(0);
  const [fieldData, setFieldData] = useState([
    { value: 'School', id: Math.random() },
    { value: 'Company', id: Math.random() },
  ]);
  const [view, setView] = useState('grid');
  const [theme, setTheme] = useState('light');
  const [colors, setColors] = useState({
    high: '#ff0000',
    medium: '#ffd700',
    low: '#008000',
  });

  useEffect(() => {
    let colorCount = 0;

    for (const prop in colors) {
      colors[prop] === initialData.colors[prop] && colorCount++;
    }

    if (
      colorCount !== 3 ||
      theme !== initialData.theme ||
      view !== initialData.view ||
      initialData.fields.length !== fieldData.length
    ) {
      setEnableBtn(true);
    } else if (initialData.fields.length === fieldData.length) {
      const fieldArray = fieldData.map((field) =>
        String(field.value).toLowerCase()
      );

      for (let { value } of initialData.fields) {
        fieldArray.includes(String(value).toLowerCase()) === false
          ? setEnableBtn(true)
          : setEnableBtn(false);
      }
    } else {
      setEnableBtn(false);
    }
  }, [theme, view, colors, fieldData]);

  const colorHandler = (e, level) => {
    const newObj = { ...colors, [level]: e.target.value };
    setColors(newObj);
  };

  const addField = () => {
    const fieldArray = fieldData.map((field) =>
      String(field.value).toLowerCase()
    );

    if (fieldData.length >= 5) {
      return;
    } else if (fieldArray.includes(String(newField).toLowerCase())) {
      toast('Field name already exists.', {
        toastId: customId,
      });
      return;
    } else if (newField.length === 0) {
      toast('Field name cannot be empty.', {
        toastId: customId,
      });
      return;
    } else if (newField.length > 20) {
      toast('Field name cannot exceed 20 characters.', {
        toastId: customId,
      });
      return;
    } else if (newField.match(/\W/)) {
      toast(
        'Field name must consist of letters, numbers, and underscores only.',
        {
          toastId: customId,
        }
      );
      return;
    } else {
      const newObj = {
        value: newField,
        id: Math.random(),
      };
      const newArr = [...fieldData];
      newArr.push(newObj);

      setFieldData(newArr);
      setNewField('');
    }
  };

  const resetData = () => {
    setTheme(initialData.theme);
    setView(initialData.view);
    setColors(initialData.colors);
    setFieldData(initialData.fields);
  };

  return (
    <section className={styles.section}>
      <ToastContainer autoClose={2500} />
      <h1 className={styles['section-head']}>Personalization</h1>
      <div className={styles['option-div']}>
        <span className={styles['option-head']}>Theme</span>
        <div className={styles['theme-container']}>
          <span className={styles['img-box']}>
            <img
              className={`${styles['theme-img']} ${
                theme === 'light' ? styles['current-theme'] : ''
              }`}
              src="../../assets/images/light-mode.png"
              onClick={() => setTheme('light')}
            />
            <input
              type="radio"
              className={`${styles.radio} ${
                theme === 'light' ? styles['show-theme-radio'] : ''
              }`}
              checked
              readOnly
            />
            <span className={styles['theme-type']}>Light</span>
          </span>
          <span className={styles['img-box']}>
            <img
              className={`${styles['theme-img']} ${
                theme === 'dark' ? styles['current-theme'] : ''
              }`}
              src="../../assets/images/dark-mode.png"
              onClick={() => setTheme('dark')}
            />
            <input
              type="radio"
              className={`${styles.radio} ${
                theme === 'dark' ? styles['show-theme-radio'] : ''
              }`}
              checked
              readOnly
            />
            <span className={styles['theme-type']}>Dark</span>
          </span>

          <span className={styles['img-box']}>
            <img
              className={`${styles['theme-img']} ${
                theme === 'system' ? styles['current-theme'] : ''
              }`}
              src="../../assets/images/default.jpg"
              onClick={() => setTheme('system')}
            />
            <input
              type="radio"
              className={`${styles.radio} ${
                theme === 'system' ? styles['show-theme-radio'] : ''
              }`}
              checked
              readOnly
            />
            <span className={styles['theme-type']}>System default</span>
          </span>
        </div>
      </div>
      <div
        className={`${styles['option-div']} ${styles['project-div-container']}`}
      >
        <span className={styles['option-head']}>Default project view</span>

        <div className={styles['view-div']}>
          <span className={styles['view-box']}>
            <input
              type="radio"
              name="project-view"
              className={styles['view-radio']}
              checked={view === 'grid'}
              onChange={() => setView('grid')}
            />{' '}
            Grid
          </span>
          <span className={styles['view-box']}>
            <input
              type="radio"
              name="project-view"
              className={styles['view-radio']}
              checked={view === 'table'}
              onChange={() => setView('table')}
            />{' '}
            Table
          </span>
        </div>
      </div>
      <div className={styles['option-div']}>
        <span className={styles['option-head']}>
          Colors for priority levels
        </span>

        <div className={styles['color-div']}>
          <span className={styles['color-box']}>
            High:{' '}
            <input
              type="color"
              className={styles['color-input']}
              value={colors.high}
              onChange={() => colorHandler(event, 'high')}
            />
          </span>
          <span className={styles['color-box']}>
            Medium:{' '}
            <input
              type="color"
              className={styles['color-input']}
              value={colors.medium}
              onChange={() => colorHandler(event, 'medium')}
            />
          </span>
          <span className={styles['color-box']}>
            Low:{' '}
            <input
              type="color"
              className={styles['color-input']}
              value={colors.low}
              onChange={() => colorHandler(event, 'low')}
            />
          </span>
        </div>
      </div>
      <div className={styles['option-div']}>
        <span className={styles['option-head']}>Custom fields</span>
        <p className={styles['description']}>
          Enable users to create and customize additional fields for tasks.
        </p>

        <div className={styles['fields-div']}>
          {fieldData.map(({ value, id }) => (
            <FieldInput
              key={id}
              value={value}
              id={id}
              fieldData={fieldData}
              setFieldData={setFieldData}
            />
          ))}

          <input
            className={`${styles['new-field-input']} ${
              fieldData.length >= 5 ? styles['hide-new-field'] : ''
            }`}
            type="text"
            value={newField}
            onChange={(e) => setNewField(e.target.value)}
          />
          <button
            className={`${styles['add-btn']} ${
              fieldData.length >= 5 ? styles['disable-btn'] : ''
            }`}
            onClick={addField}
          >
            Add
          </button>
        </div>
      </div>

      <button
        className={`${styles['save-btn']} ${
          enableBtn ? styles['enable-btn'] : ''
        }`}
      >
        Save Changes
      </button>

      <button
        className={`${styles['reset-btn']} ${
          enableBtn ? styles['enable-btn'] : ''
        }`}
        onClick={resetData}
      >
        Reset
      </button>
    </section>
  );
};

export default Personalization;
