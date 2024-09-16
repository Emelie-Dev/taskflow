import React, { useRef, useState, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // Import Cropper's CSS
import styles from '../styles/ProfilePictureCropper.module.css';
import { IoCloseSharp } from 'react-icons/io5';

const ProfilePictureCropper = ({
  mode,
  setMode,
  image,
  setImage,
  cropData,
  setCropData,
  imageName,
  fileRef,
}) => {
  const [cropped, setCropped] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [deleteMode, setDeleteMode] = useState(false);

  const cropperRef = useRef(null);

  useEffect(() => {
    const sizeHandler = () => {
      setWidth((4109 / 283 + window.innerWidth * (3 / 283)) * 16);
      setHeight((4343 / 283 + window.innerWidth * (2 / 283)) * 16);
    };

    sizeHandler();

    window.addEventListener('resize', sizeHandler);

    return () => {
      window.removeEventListener('resize', sizeHandler);
    };
  }, []);

  const onCrop = () => {
    if (cropperRef.current)
      setCropData(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
  };

  const closeCropModal = (e) => {
    if (e.target === e.currentTarget) {
      setImage(null);
      setCropData(null);
      setMode(null);
    }
  };

  const changeProfilePicture = async () => {};

  return (
    <section className={styles.section} onClick={closeCropModal}>
      <div className={styles['modal-container']}>
        <span className={styles['close-modal']}>
          <IoCloseSharp
            className={styles['close-modal-icon']}
            onClick={() => {
              setImage(null);
              setCropData(null);
              setMode(null);
            }}
          />
        </span>
        <span className={styles.head}>Edit profile picture</span>

        {mode === 'edit' ? (
          <>
            {!cropData && width !== 0 ? (
              <>
                <Cropper
                  src={image}
                  className={styles.cropper}
                  ref={cropperRef}
                  style={{ width, height }}
                  initialAspectRatio={1} // Keep a 1:1 aspect ratio
                  guides={false} // Disable guides/grid lines
                  background={false} // Remove background grid
                  viewMode={1} // Allow free scaling
                  responsive={true} // Ensure responsive behavior
                  zoomable={false} // Disable zoom to prevent manual zooming
                  scalable={false} // Disable scaling the image
                />

                <button className={styles['crop-btn']} onClick={onCrop}>
                  Done
                </button>
              </>
            ) : (
              <>
                <img
                  className={styles['cropped-image']}
                  style={{ width, height }}
                  src={cropData}
                  alt="Cropped Image"
                />

                <div className={styles['btn-div']}>
                  <button
                    className={styles['cancel-btn']}
                    onClick={() => setCropData(null)}
                  >
                    Cancel
                  </button>
                  <button className={styles['save-btn']}>Save</button>
                </div>
              </>
            )}
          </>
        ) : mode === 'view' ? (
          <div className={styles['view-container']}>
            <img
              className={styles['cropped-image']}
              style={{ width, height }}
              src={`../../assets/images/users/${imageName}`}
              alt="Profile Picture"
            />

            <div className={styles['btn-div']}>
              <button
                className={styles['cancel-btn']}
                onClick={() => setDeleteMode(true)}
              >
                Remove
              </button>
              <button
                className={styles['save-btn']}
                onClick={() => fileRef.current.click()}
              >
                Change
              </button>
            </div>

            {deleteMode && (
              <div className={styles['delete-container']}>
                <div className={styles['delete-box']}>
                  <span className={styles['delete-text']}>
                    Are you sure you want to remove your profile picture?
                  </span>

                  <div className={styles['delete-btn-div']}>
                    <button className={styles['save-btn']}>Yes</button>
                    <button
                      className={styles['cancel-btn']}
                      onClick={() => setDeleteMode(false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          ''
        )}
      </div>
    </section>
  );
};

export default ProfilePictureCropper;
