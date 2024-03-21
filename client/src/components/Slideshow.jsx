import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/Slideshow.module.css';

const images = [
  '/assets/images/slideshow1.png',
  '/assets/images/slideshow2.png',
  '/assets/images/slideshow3.png',
];

const Slideshow = () => {
  const [image, setImage] = useState(1);
  const imgRef = useRef();

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setImage((prev) => (prev === 3 ? 1 : prev + 1));

      imgRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 500,
        iterations: 1,
      });
    }, 5000);
    return () => {
      clearInterval(slideInterval);
    };
  }, []);

 

  return (
    <section className={styles.section}>
      <figure className={styles.icon1}>
        <img
          className={`${styles.icon}`}
          src="/assets/images/time-management_4322864.png"
        />
      </figure>

      <figure className={styles['img-box']}>
        <img ref={imgRef} className={styles.img} src={images[image - 1]} />
      </figure>

      <figure className={styles.icon2}>
        <img
          className={styles.icon}
          src="/assets/images/planning_11319782.png"
        />
      </figure>

      {/* Icobs for smaller devices */}

      <div className={styles['second-icon-box']}>
      <figure className={styles.icon3}>
        <img
          className={`${styles.icon}`}
          src="/assets/images/time-management_4322864.png"
        />
      </figure>
      <figure className={styles.icon4}>
        <img
          className={styles.icon}
          src="/assets/images/planning_11319782.png"
        />
      </figure>

      </div>
    </section>
  );
};

export default Slideshow;
