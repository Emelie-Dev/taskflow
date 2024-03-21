import React, { useEffect, useState } from 'react';
import styles from '../styles/AnimatedText.module.css';

const text = [
  'Effortlessly organize tasks with customizable details.',
  'Collaborate seamlessly for effective teamwork.',
  'Stay on top of deadlines with timely notifications.',
  'Track progress for informed decision-making.',
];

const AnimatedText = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentId, setCurrentId] = useState(0);
  const [id, setId] = useState(0);

  const erase = () => {
    let value = text[currentId];

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        value = `${value.slice(0, value.length - 1)}`;
        setCurrentText(value);
        if (value.length === 0) {
          clearInterval(interval);
          clearTimeout(timeout);
          setCurrentId((prev) => (prev === 3 ? 0 : prev + 1));
          setId(0);
          return;
        }
      }, 50);
    }, 4000);
  };

  useEffect(() => {
    if (id === text[currentId].length) {
      erase();
      return;
    }

    const interval = setInterval(() => {
      setCurrentText((prev) => `${prev}${text[currentId][id]}`);
      setId((prev) => prev + 1);
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [id, currentId]);

  return <p className={styles.text}>{currentText}</p>;
};

export default AnimatedText;
