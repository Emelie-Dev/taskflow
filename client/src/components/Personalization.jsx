import React, { useEffect, useState, useContext } from 'react';
import styles from '../styles/Personalization.module.css';
import FieldInput from './FieldInput';
import { ToastContainer, toast } from 'react-toastify';
import { apiClient, AuthContext } from '../App';
import { SiKashflow } from 'react-icons/si';

const customId = 'toast-id';

const Personalization = () => {
  const { userData, setUserData } = useContext(AuthContext);
  const [initialData, setInitialData] = useState({
    theme: userData.personalization.theme,
    defaultProjectView: userData.personalization.defaultProjectView,
    priorityColors: {
      high: userData.personalization.priorityColors.high,
      medium: userData.personalization.priorityColors.medium,
      low: userData.personalization.priorityColors.low,
    },
    customFields: userData.personalization.customFields,
  });
  const [newField, setNewField] = useState('');
  const [enableBtn, setEnableBtn] = useState(false);
  const [customFields, setCustomFields] = useState(initialData.customFields);
  const [defaultProjectView, setDefaultProjectView] = useState(
    initialData.defaultProjectView
  );
  const [theme, setTheme] = useState(initialData.theme);
  const [priorityColors, setPriorityColors] = useState(
    initialData.priorityColors
  );
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let colorCount = 0;

    for (const prop in priorityColors) {
      priorityColors[prop] === initialData.priorityColors[prop] && colorCount++;
    }

    if (
      colorCount !== 3 ||
      theme !== initialData.theme ||
      defaultProjectView !== initialData.defaultProjectView ||
      initialData.customFields.length !== customFields.length
    ) {
      setEnableBtn(true);
    } else if (initialData.customFields.length === customFields.length) {
      if (customFields.length === 0) setEnableBtn(false);

      for (let { field } of customFields) {
        if (
          !initialData.customFields.find(
            (elem) =>
              String(elem.field).toLowerCase() === String(field).toLowerCase()
          )
        ) {
          setEnableBtn(true);
          break;
        } else {
          setEnableBtn(false);
        }
      }

      setEnableBtn(false);
    } else {
      setEnableBtn(false);
    }
  }, [theme, defaultProjectView, priorityColors, customFields]);

  const colorHandler = (level) => (e) => {
    const newObj = { ...priorityColors, [level]: e.target.value };
    setPriorityColors(newObj);
  };

  const addField = () => {
    const fieldArray = customFields.map((field) =>
      String(field.field).toLowerCase()
    );

    if (customFields.length >= 5) {
      return;
    } else if (fieldArray.includes(String(newField).toLowerCase())) {
      return toast('Field name already exists.', {
        toastId: customId,
      });
    } else if (newField.length === 0) {
      return toast('Field name cannot be empty.', {
        toastId: customId,
      });
    } else if (newField.length > 20) {
      return toast('Field name cannot exceed 20 characters.', {
        toastId: customId,
      });
    } else if (newField.match(/\W/)) {
      return toast(
        'Field name must consist of letters, numbers, and underscores only.',
        {
          toastId: customId,
        }
      );
    } else {
      const newObj = {
        field: newField,
        id: (() => {
          let id = getFieldId();
          const Ids = customFields.map(({ id }) => String(id));

          while (Ids.includes(id)) {
            id = getFieldId();
          }

          return id;
        })(),
      };
      const newArr = [...customFields];
      newArr.push(newObj);

      setCustomFields(newArr);
      setNewField('');
    }
  };

  const resetData = () => {
    setTheme(initialData.theme);
    setDefaultProjectView(initialData.defaultProjectView);
    setPriorityColors(initialData.priorityColors);
    setCustomFields(initialData.customFields);
  };

  const getFieldId = () => {
    return String(Math.random() + Date.now());
  };

  const submitData = async () => {
    setIsProcessing(true);

    try {
      const { data } = await apiClient.patch(`/api/v1/users/personalization`, {
        theme,
        defaultProjectView,
        priorityColors,
        customFields,
      });

      const {
        theme: theme2,
        defaultProjectView: defaultProjectView2,
        priorityColors: priorityColors2,
        customFields: customFields2,
      } = data.data.userData.personalization;

      setIsProcessing(false);
      setUserData(data.data.userData);
      setInitialData({
        theme: theme2,
        defaultProjectView: defaultProjectView2,
        priorityColors: priorityColors2,
        customFields: customFields2,
      });
      setEnableBtn(false);
    } catch (err) {
      setIsProcessing(false);
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occured while saving data.', {
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
    <section className={styles.section}>
      <ToastContainer autoClose={2500} />

      <h1 className={styles['section-head']}>Personalization</h1>
      {/* <div className={styles['option-div']}>
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
      </div> */}

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
              checked={defaultProjectView === 'grid'}
              onChange={() => setDefaultProjectView('grid')}
            />{' '}
            Grid
          </span>
          <span className={styles['view-box']}>
            <input
              type="radio"
              name="project-view"
              className={styles['view-radio']}
              checked={defaultProjectView === 'table'}
              onChange={() => setDefaultProjectView('table')}
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
              value={priorityColors.high}
              onChange={colorHandler('high')}
            />
          </span>
          <span className={styles['color-box']}>
            Medium:{' '}
            <input
              type="color"
              className={styles['color-input']}
              value={priorityColors.medium}
              onChange={colorHandler('medium')}
            />
          </span>
          <span className={styles['color-box']}>
            Low:{' '}
            <input
              type="color"
              className={styles['color-input']}
              value={priorityColors.low}
              onChange={colorHandler('low')}
            />
          </span>
        </div>
      </div>

      <div className={styles['option-div']}>
        <span className={styles['option-head']}>Custom fields</span>
        <p className={styles['description']}>
          Enable users to create additional fields for tasks.
        </p>

        <div className={styles['fields-div']}>
          {customFields.map(({ field, id }) => (
            <FieldInput
              key={id}
              field={field}
              inputId={id}
              customFields={customFields}
              setCustomFields={setCustomFields}
            />
          ))}

          <input
            className={`${styles['new-field-input']} ${
              customFields.length >= 5 ? styles['hide-new-field'] : ''
            }`}
            type="text"
            value={newField}
            onChange={(e) => setNewField(e.target.value)}
          />
          <button
            className={`${styles['add-btn']} ${
              customFields.length >= 5 ? styles['disable-btn'] : ''
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
        } ${isProcessing ? styles['disable-btn'] : ''}`}
        onClick={submitData}
      >
        {isProcessing ? (
          <>
            <SiKashflow className={styles['saving-icon']} />
            Saving....
          </>
        ) : (
          'Save'
        )}
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
