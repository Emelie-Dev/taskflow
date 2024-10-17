import React, { useRef, useState, useEffect, useContext } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // Import Cropper's CSS
import styles from '../styles/ProfilePictureCropper.module.css';
import { IoCloseSharp } from 'react-icons/io5';
import { apiClient, AuthContext } from '../App';
import { SiKashflow } from 'react-icons/si';
import { getProfilePhoto } from './Header';

const ProfilePictureCropper = ({
  mode,
  setMode,
  image,
  setImage,
  cropData,
  setCropData,
  fileRef,
  toast,
}) => {
  const {
    userData,
    setUserData,
    serverUrl,
    mode: theme,
  } = useContext(AuthContext);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [deleteMode, setDeleteMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]); // Extract the base64 data from the dataURI
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // Extract the MIME type

    const byteArray = [];
    for (let i = 0; i < byteString.length; i++) {
      byteArray.push(byteString.charCodeAt(i));
    }

    return new Blob([new Uint8Array(byteArray)], { type: mimeString });
  };

  const changeProfilePicture = async () => {
    const formData = new FormData();
    formData.append('photo', dataURItoBlob(cropData));

    setIsProcessing(true);

    try {
      const { data } = await apiClient.patch(
        `/api/v1/users/${userData._id}/photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setIsProcessing(false);
      setUserData(data.data.user);
      setImage(null);
      setCropData(null);
      setMode(null);
    } catch (err) {
      setIsProcessing(false);
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occurred during picture upload!', {
          toastId: 'toast-id1',
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id1',
        });
      }
    }
  };

  const removeProfilePicture = async () => {
    setIsProcessing(true);

    try {
      const { data } = await apiClient.delete(
        `/api/v1/users/${userData._id}/photo`
      );

      setIsProcessing(false);
      setUserData(data.data.user);
      setImage(null);
      setCropData(null);
      setMode(null);
    } catch (err) {
      setIsProcessing(false);
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occurred while removing profile picture.', {
          toastId: 'toast-id2',
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id2',
        });
      }
    }
  };

  return (
    <section className={styles.section} onClick={closeCropModal}>
      <div
        className={`${styles['modal-container']} ${
          theme === 'dark' ? styles['dark-container'] : ''
        }`}
      >
        <span
          className={`${styles['close-modal']} ${
            theme === 'dark' ? styles['dark-modal'] : ''
          }`}
        >
          <IoCloseSharp
            className={`${styles['close-modal-icon']} ${
              theme === 'dark' ? styles['dark-text'] : ''
            }`}
            onClick={() => {
              setImage(null);
              setCropData(null);
              setMode(null);
            }}
          />
        </span>
        <span
          className={`${styles.head} ${
            theme === 'dark' ? styles['dark-text'] : ''
          }`}
        >
          Edit profile picture
        </span>

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
                  <button
                    className={`${styles['save-btn']} ${
                      isProcessing ? styles['disable-btn'] : ''
                    }`}
                    onClick={changeProfilePicture}
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
                </div>
              </>
            )}
          </>
        ) : mode === 'view' ? (
          <div className={styles['view-container']}>
            {userData.photo === 'default.jpeg' ? (
              <div
                className={`${styles['no-picture-div']} ${
                  theme === 'dark' ? styles['dark-text'] : ''
                }`}
                style={{ width, height }}
              >
                No profile picture
              </div>
            ) : (
              <img
                className={styles['cropped-image']}
                style={{ width, height }}
                src={getProfilePhoto(userData, serverUrl)}
                alt="Profile Picture"
              />
            )}

            <div className={styles['btn-div']}>
              <button
                className={`${styles['cancel-btn']} ${
                  userData.photo === 'default.jpeg' ? styles['disable-btn'] : ''
                }`}
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
                <div
                  className={`${styles['delete-box']} ${
                    theme === 'dark' ? styles['dark-container'] : ''
                  }`}
                >
                  <span
                    className={`${styles['delete-text']} ${
                      theme === 'dark' ? styles['dark-text'] : ''
                    }`}
                  >
                    Are you sure you want to remove your profile picture?
                  </span>

                  <div className={styles['delete-btn-div']}>
                    <button
                      className={`${styles['save-btn']} ${
                        isProcessing ? styles['disable-btn'] : ''
                      }`}
                      onClick={removeProfilePicture}
                    >
                      {isProcessing ? (
                        <>
                          <SiKashflow className={styles['saving-icon']} />
                          Removing....
                        </>
                      ) : (
                        'Yes'
                      )}
                    </button>
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
