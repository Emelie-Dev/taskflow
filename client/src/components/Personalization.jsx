import React, { useRef, useState } from 'react';
import styles from '../styles/Personalization.module.css';

const Personalization = () => {
  const [newField, setNewField] = useState('');
  const [view, setView] = useState('grid');

  return (
    <section className={styles.section}>
      <h1 className={styles['section-head']}>Personalization</h1>
      <div className={styles['option-div']}>
        <span className={styles['option-head']}>Theme</span>
        <div className={styles['theme-container']}>
          <span className={styles['img-box']}>
            <img
              className={`${styles['theme-img']} ${styles['current-theme']}`}
              src="../../assets/images/light-mode.png"
            />
            <input type="radio" className={styles.radio} checked readOnly />
            <span className={styles['theme-type']}>Light</span>
          </span>
          <span className={styles['img-box']}>
            <img
              className={styles['theme-img']}
              src="../../assets/images/dark-mode.png"
            />
            <span className={styles['theme-type']}>Dark</span>
          </span>

          <span className={styles['img-box']}>
            <img
              className={styles['theme-img']}
              src="../../assets/images/default.jpg"
            />
            <span className={styles['theme-type']}>System default</span>
          </span>
        </div>
      </div>
      <div className={styles['option-div']}>
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
              value={'#ff0000'}
            />
          </span>
          <span className={styles['color-box']}>
            Medium:{' '}
            <input
              type="color"
              className={styles['color-input']}
              value={'#ffd700'}
            />
          </span>
          <span className={styles['color-box']}>
            Low:{' '}
            <input
              type="color"
              className={styles['color-input']}
              value={'#008000'}
            />
          </span>
        </div>
      </div>
      <div className={styles['option-div']}>
        <span className={styles['option-head']}>Custom fields</span>

        <div className={styles['fields-div']}>
          <input
            className={styles['field-input']}
            type="text"
            value={'School'}
            readOnly
          />
          <input
            className={styles['field-input']}
            type="text"
            value={'Company'}
            readOnly
          />
          <input
            className={styles['field-input']}
            type="text"
            value={newField}
            onChange={(e) => setNewField(e.target.value)}
          />
          <button className={styles['add-btn']}>Add</button>
        </div>
      </div>
    </section>
  );
};

export default Personalization;
