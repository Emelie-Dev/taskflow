import React from 'react';
import { SiKashflow } from 'react-icons/si';
import styles from '../styles/Loader.module.css';

const Loader = ({ style }) => {
  return <SiKashflow className={styles.loader} style={style} />;
};

export default Loader;
