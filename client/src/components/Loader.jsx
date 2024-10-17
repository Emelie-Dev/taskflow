import React, { useContext } from 'react';
import { SiKashflow } from 'react-icons/si';
import styles from '../styles/Loader.module.css';
import { AuthContext } from '../App';

const Loader = ({ style }) => {
  const { mode } = useContext(AuthContext);

  return (
    <SiKashflow
      className={`${mode === 'dark' ? styles['dark-loader'] : styles.loader}`}
      style={style}
    />
  );
};

export default Loader;
