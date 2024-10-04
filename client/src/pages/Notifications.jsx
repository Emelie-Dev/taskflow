import React, { useEffect, useState, useContext, useRef } from 'react';
import styles from '../styles/Notifications.module.css';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import { apiClient, AuthContext } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../components/Loader';
import { MdOutlineSignalWifiOff } from 'react-icons/md';
import NotificationContainer from '../components/NotificationContainer';
import useDebounce from '../hooks/useDebounce';
import { IoCloseSharp } from 'react-icons/io5';
import { BiSolidSelectMultiple } from 'react-icons/bi';
import DeleteComponent from '../components/DeleteComponent';

const Notifications = () => {
  const { userData, serverUrl } = useContext(AuthContext);
  const [showNav, setShowNav] = useState(false);
  const [category, setCategory] = useState('unread');
  const [notifications, setNotifications] = useState(null);
  const [groups, setGroups] = useState(null);
  const [page, setPage] = useState(1);
  const [notificationData, setNotificationData] = useState({
    loading: true,
    lastPage: true,
    error: false,
    pageError: false,
  });
  const [deleteMode, setDeleteMode] = useState({ value: false, all: null });
  const [deleteList, setDeleteList] = useState({});
  const [headerHeight, setHeaderHeight] = useState(null);
  const [deleteLength, setDeleteLength] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ value: false, type: null });
  const [deleteCount, setDeleteCount] = useState(0);

  const bodyRef = useRef();

  useEffect(() => {
    const getNotifications = async () => {
      try {
        setNotificationData({
          loading: true,
          lastPage: true,
          error: false,
          pageError: false,
        });

        const { data } = await apiClient(
          `/api/v1/notifications/${userData._id}?page=${page}&deleteCount=${deleteCount}`
        );

        setNotifications(data.data.notifications);
        setNotificationData({
          loading: false,
          lastPage: data.data.notifications.length < 100,
          error: false,
          pageError: false,
        });
      } catch (err) {
        if (page === 1) {
          setNotificationData({
            loading: false,
            lastPage: true,
            error: true,
            pageError: false,
          });
        } else {
          setNotificationData({
            loading: false,
            lastPage: false,
            error: false,
            pageError: true,
          });
        }

        if (
          !err.response ||
          !err.response.data ||
          err.response.status === 500
        ) {
          return toast('An error occured while fetching notifications.', {
            toastId: 'toast-id1',
          });
        } else {
          return toast(err.response.data.message, {
            toastId: 'toast-id1',
          });
        }
      }
    };

    getNotifications();
  }, [page]);

  useEffect(() => {
    if (notifications) {
      const notificationGroups = notifications.reduce(
        (accumulator, notification) => {
          let date = new Date(notification.time);
          date.setHours(0, 0, 0, 0);
          date = date.toISOString();

          if (!accumulator[date]) accumulator[date] = [];

          accumulator[date].push(notification);

          return accumulator;
        },
        (() => {
          if (page === 1) return {};
          else return groups;
        })()
      );

      setGroups(notificationGroups);
    }
  }, [notifications]);

  // Updates total length
  useEffect(() => {
    if (groups) {
      setTotalLength(
        Object.entries(groups).reduce(
          (accumulator, [key, value]) => accumulator + value.length,
          0
        )
      );
    }
  }, [groups]);

  // Fetches next page of notifications
  useEffect(() => {
    const scrollHandler = () => {
      const scrollLevel =
        bodyRef.current.scrollTop + bodyRef.current.offsetHeight;

      if (!(notificationData.error || notificationData.lastPage)) {
        if (scrollLevel >= bodyRef.current.scrollHeight - 10) {
          if (notificationData.pageError) setPage(new Number(page));
          else setPage((prev) => prev + 1);
        }
      }
    };

    const debouncedScrollHandler = useDebounce(scrollHandler, 200);

    if (bodyRef.current)
      bodyRef.current.addEventListener('scroll', debouncedScrollHandler);

    return () => {
      if (bodyRef.current)
        bodyRef.current.removeEventListener('scroll', debouncedScrollHandler);
    };
  }, [notificationData]);

  useEffect(() => {
    const data = Object.entries(deleteList);

    const itemLength = data.reduce(
      (accumulator, [key, value]) => accumulator + value.length,
      0
    );

    setDeleteLength(itemLength);

    if (deleteMode.value) {
      if (itemLength === totalLength) deleteMode.all = true;
      else deleteModal.all = null;
    }
  }, [deleteList]);

  const selectAll = () => {
    if (!deleteMode.all) {
      const list = { ...groups };

      for (let prop in list) list[prop] = list[prop].map((data) => data._id);

      setDeleteList(list);
      setDeleteMode({ value: true, all: true });
    } else {
      setDeleteList([]);
      setDeleteMode({ value: true, all: false });
    }
  };

  // Do responsive for this page

  return (
    <main className={styles.div}>
      <ToastContainer autoClose={2000} />

      <NavBar
        page={'Notifications'}
        showNav={showNav}
        setShowNav={setShowNav}
      />

      {deleteModal.value && (
        <DeleteComponent
          toast={toast}
          type={'Notifications'}
          typeData={{ deleteList, deleteLength }}
          setDeleteModal={setDeleteModal}
          setDeleteCount={setDeleteCount}
          setDeleteMode={setDeleteMode}
          setGroups={setGroups}
          setDeleteLength={setDeleteLength}
        />
      )}

      {deleteMode.value && (
        <div
          className={styles['select-container']}
          style={{ height: `${headerHeight}px` }}
        >
          <span
            className={styles['cancel-box']}
            onClick={() => {
              setDeleteMode({ value: false, all: null });
              setDeleteList({});
            }}
          >
            <IoCloseSharp className={styles['cancel-icon']} />
          </span>

          <span className={styles['select-length-txt']}>
            {deleteLength} selected
          </span>

          <span className={styles['delete-container']}>
            <BiSolidSelectMultiple
              className={`${styles['select-all-icon']} ${
                deleteLength === totalLength ? styles['select-all-icon2'] : ''
              }`}
              onClick={selectAll}
            />

            <span className={styles['delete-notification-box']}>
              <button
                className={`${styles['delete-notification-btn']} ${
                  deleteLength === 0 ? styles['disable-delete-btn'] : ''
                }`}
                onClick={() => {
                  setDeleteModal({ value: true });
                }}
              >
                Delete
              </button>
            </span>
          </span>
        </div>
      )}

      <section className={styles.section}>
        <Header
          page={'Notifications'}
          setShowNav={setShowNav}
          setHeaderHeight={setHeaderHeight}
        />

        <section className={styles['section-content']} ref={bodyRef}>
          <div className={styles['notification-container']}>
            {groups === null ? (
              ''
            ) : Object.entries(groups).length === 0 ? (
              <div className={styles['no-notifications-text']}>
                No notifications available
              </div>
            ) : groups ? (
              Object.entries(groups).map(([key, value]) => (
                <NotificationContainer
                  key={key}
                  date={key}
                  group={value}
                  setGroups={setGroups}
                  deleteMode={deleteMode}
                  setDeleteMode={setDeleteMode}
                  deleteList={deleteList}
                  setDeleteList={setDeleteList}
                  setDeleteCount={setDeleteCount}
                />
              ))
            ) : (
              ''
            )}

            {notificationData.loading && (
              <div
                className={`${styles['notifications-loader-div']} ${
                  page === 1 ? styles['loader-margin'] : ''
                }`}
              >
                <Loader
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                  }}
                />
              </div>
            )}

            {notificationData.error && (
              <div className={styles['no-notifications-text']}>
                <MdOutlineSignalWifiOff className={styles['network-icon']} />
                Unable to retrieve data
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Notifications;
