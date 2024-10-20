import React, { useEffect, useState, useContext } from 'react';
import styles from '../styles/Personalization.module.css';
import FieldInput from './FieldInput';
import { toast } from 'react-toastify';
import { apiClient, AuthContext } from '../App';
import { SiKashflow } from 'react-icons/si';

const customId = 'toast-id';

const lightInitialValues = {
  high: '#ff0000',
  medium: '#ffa500',
  low: '#008000',
};

const darkInitialValues = {
  high: '#ffb6c1',
  medium: '#ffa500',
  low: '#7cfc00',
};

const Personalization = () => {
  const { userData, setUserData, mode, colorNotified, setColorNotified } =
    useContext(AuthContext);
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
    let colorCondition;

    for (const prop in priorityColors) {
      priorityColors[prop] === initialData.priorityColors[prop] && colorCount++;
    }

    colorCondition = colorCount !== 3;

    if (colorCondition) {
      const values = mode === 'dark' ? darkInitialValues : lightInitialValues;

      let num = 0;

      for (const prop in values) {
        priorityColors[prop] === values[prop] && num++;
      }

      colorCondition = num !== 3;
    }

    if (
      colorCondition ||
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

  useEffect(() => {
    const values = mode === 'dark' ? darkInitialValues : lightInitialValues;

    if (!isColorChanged()) {
      setPriorityColors(values);
    } else {
      setPriorityColors(userData.personalization.priorityColors);
    }
  }, [mode]);

  const colorHandler = (level) => (e) => {
    const newObj = { ...priorityColors, [level]: e.target.value };
    setPriorityColors(newObj);

    if (!colorNotified) {
      toast(
        'Priority colors automatically adjust based on the theme. If you change any of the colors, this automatic switching will be disabled.',
        {
          autoClose: false,
          theme: mode,
        }
      );
      setColorNotified(true);
    }
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
        theme: mode,
      });
    } else if (newField.length === 0) {
      return toast('Field name cannot be empty.', {
        toastId: customId,
        theme: mode,
      });
    } else if (newField.length > 20) {
      return toast('Field name cannot exceed 20 characters.', {
        toastId: customId,
        theme: mode,
      });
    } else if (newField.match(/\W/)) {
      return toast(
        'Field name must consist of letters, numbers, and underscores only.',
        {
          toastId: customId,
          theme: mode,
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
    const values = mode === 'dark' ? darkInitialValues : lightInitialValues;

    if (!isColorChanged()) {
      setPriorityColors(values);
    } else {
      setPriorityColors(userData.personalization.priorityColors);
    }

    setTheme(initialData.theme);
    setDefaultProjectView(initialData.defaultProjectView);
    setCustomFields(initialData.customFields);
  };

  const getFieldId = () => {
    return String(Math.random() + Date.now());
  };

  const submitData = async () => {
    setIsProcessing(true);
    let colors;

    if (isColorChanged()) {
      colors = priorityColors;
    } else {
      colors = lightInitialValues;
    }

    // const colors =

    try {
      const { data } = await apiClient.patch(`/api/v1/users/personalization`, {
        theme,
        defaultProjectView,
        priorityColors: colors,
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
          theme: mode,
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id1',
          theme: mode,
        });
      }
    }
  };

  const isColorChanged = () => {
    let num = 0;

    for (const prop in userData.personalization.priorityColors) {
      userData.personalization.priorityColors[prop] ===
        lightInitialValues[prop] && num++;
    }

    return num !== 3;
  };

  return (
    <section className={styles.section}>
      <h1
        className={`${styles['section-head']} ${
          mode === 'dark' ? styles['dark-text'] : ''
        }`}
      >
        Personalization
      </h1>

      <div className={styles['option-div']}>
        <span
          className={`${styles['option-head']} ${
            mode === 'dark' ? styles['dark-text'] : ''
          }`}
        >
          Theme
        </span>

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
            <span
              className={`${styles['theme-type']} ${
                mode === 'dark' ? styles['dark-word'] : ''
              }`}
            >
              Light
            </span>
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
            <span
              className={`${styles['theme-type']} ${
                mode === 'dark' ? styles['dark-word'] : ''
              }`}
            >
              Dark
            </span>
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
            <span
              className={`${styles['theme-type']} ${
                mode === 'dark' ? styles['dark-word'] : ''
              }`}
            >
              System default
            </span>
          </span>
        </div>
      </div>

      <div
        className={`${styles['option-div']} ${styles['project-div-container']}`}
      >
        <span
          className={`${styles['option-head']} ${
            mode === 'dark' ? styles['dark-text'] : ''
          }`}
        >
          Default project view
        </span>

        <div className={styles['view-div']}>
          <span
            className={`${styles['view-box']} ${
              mode === 'dark' ? styles['dark-word'] : ''
            }`}
          >
            <input
              type="radio"
              name="project-view"
              className={styles['view-radio']}
              checked={defaultProjectView === 'grid'}
              onChange={() => setDefaultProjectView('grid')}
            />{' '}
            Grid
          </span>
          <span
            className={`${styles['view-box']} ${
              mode === 'dark' ? styles['dark-word'] : ''
            }`}
          >
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
        <span
          className={`${styles['option-head']} ${
            mode === 'dark' ? styles['dark-text'] : ''
          }`}
        >
          Colors for priority levels
        </span>

        <div className={styles['color-div']}>
          <span
            className={`${styles['color-box']} ${
              mode === 'dark' ? styles['dark-word'] : ''
            }`}
          >
            High:{' '}
            <input
              type="color"
              className={styles['color-input']}
              value={priorityColors.high}
              onChange={colorHandler('high')}
            />
          </span>
          <span
            className={`${styles['color-box']} ${
              mode === 'dark' ? styles['dark-word'] : ''
            }`}
          >
            Medium:{' '}
            <input
              type="color"
              className={styles['color-input']}
              value={priorityColors.medium}
              onChange={colorHandler('medium')}
            />
          </span>
          <span
            className={`${styles['color-box']} ${
              mode === 'dark' ? styles['dark-word'] : ''
            }`}
          >
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
        <span
          className={`${styles['option-head']} ${
            mode === 'dark' ? styles['dark-text'] : ''
          }`}
        >
          Custom fields
        </span>
        <p
          className={`${styles['description']} ${
            mode === 'dark' ? styles['dark-word'] : ''
          }`}
        >
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
            } ${mode === 'dark' ? styles['dark-input'] : ''}`}
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
