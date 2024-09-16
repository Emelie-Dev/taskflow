import React, { useRef, useState, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // Import Cropper's CSS
import styles from '../styles/ProfilePictureCropper.module.css';
import { IoCloseSharp } from 'react-icons/io5';

const ProfilePictureCropper = ({ image, setImage, cropData, setCropData }) => {
  const cropperRef = useRef(null);

  const onCrop = () => {
    if (cropperRef.current) {
      setCropData(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles['modal-container']}>
        <span className={styles['close-modal']}>
          <IoCloseSharp
            className={styles['close-modal-icon']}
            onClick={() => {
              setImage(null);
              setCropData('#');
            }}
          />
        </span>
        <span className={styles.head}>Edit profile picture</span>

        <Cropper
          src={image}
          className={styles.cropper}
          ref={cropperRef}
          initialAspectRatio={1}
          guides={false}
          background={false}
          viewMode={1}
        />
        <button onClick={onCrop}>Crop</button>
        {cropData && <img src={cropData} alt="Cropped Image" />}
      </div>
    </section>
  );
};

export default ProfilePictureCropper;
