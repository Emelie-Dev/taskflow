import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from '../styles/ProjectItem.module.css';
import { SiKashflow } from 'react-icons/si';
import {
  MdDelete,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineSignalWifiOff,
} from 'react-icons/md';
import { FaTasks, FaFileAlt } from 'react-icons/fa';
import { BsThreeDotsVertical, BsPeopleFill } from 'react-icons/bs';
import { GrStatusGood } from 'react-icons/gr';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { RxUpdate } from 'react-icons/rx';
import Project from '../components/Project';
import { IoCloseSharp } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import NewTask from '../components/NewTask';
import { useParams } from 'react-router-dom';
import { apiClient } from '../App';
import Loader from '../components/Loader';
import DeleteComponent from '../components/DeleteComponent';
import { generateName } from './Dashboard';
import { months } from './Dashboard';
import { BiSolidSelectMultiple } from 'react-icons/bi';
import { AuthContext } from '../App';
import { VscIssueReopened } from 'react-icons/vsc';
import { FiDownload } from 'react-icons/fi';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from 'react-icons/io';

const ProjectItem = () => {
  const { userData, serverUrl } = useContext(AuthContext);
  const [showNav, setShowNav] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const [addTask, setAddTask] = useState(false);
  const [project, setProject] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [projectTeam, setProjectTeam] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ value: false, type: null });
  const [freeSpace, setFreeSpace] = useState(0);
  const [fileUploading, setFileUploading] = useState(false);
  const [selectMode, setSelectMode] = useState({ value: false, index: null });
  const [activitySelectMode, setActivitySelectMode] = useState({
    value: false,
    index: null,
  });
  const [disposableFiles, setDisposableFiles] = useState([]);
  const [deleteData, setDeleteData] = useState({});
  const [projectActivities, setProjectActivities] = useState([[]]);
  const [activitiesData, setActivitiesData] = useState({
    loading: true,
    lastPage: true,
    error: false,
  });
  const [tablePage, setTablePage] = useState(1);
  const [disposableActivities, setDisposableActivities] = useState([]);
  const [deletingActivity, setDeletingActivity] = useState({
    value: false,
    id: null,
  });
  const [createCount, setCreateCount] = useState(0);
  const [deleteCount, setDeleteCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [tasksDetails, setTasksDetails] = useState({
    category: 'all',
    page: 1,
  });
  const [tasksData, setTasksData] = useState({
    loading: true,
    lastPage: true,
    error: false,
    pageError: false,
  });

  const navRef = useRef();
  const fileRef = useRef();
  const namesRef = useRef([]);
  const checkBoxRef = useRef([]);
  const activitiesRef = useRef([]);

  const { projectId } = useParams();

  useEffect(() => {
    if (fileRef.current) {
      if (!showFiles) {
        fileRef.current.files = new DataTransfer().files;
        namesRef.current = [];
      }
    }
  }, [showFiles]);

  // Fetch project data
  useEffect(() => {
    const getProjectData = async () => {
      try {
        const { data } = await apiClient(`/api/v1/projects/${projectId}`);

        setProject(data.data.project);
      } catch (err) {
        if (
          !err.response ||
          !err.response.data ||
          err.response.status === 500
        ) {
          setProject({ error: true, code: 500 });
          return toast('Unable to load project.', {
            toastId: 'toast-id1',
            autoClose: 2000,
          });
        } else {
          if (err.response.status === 404) {
            setProject({ error: true, code: 404 });
          } else {
            setProject({ error: true, code: 400 });
          }

          return toast(err.response.data.message, {
            toastId: 'toast-id1',
            autoClose: 2000,
          });
        }
      }
    };

    getProjectData();
  }, []);

  useEffect(() => {
    if (project) {
      if (!project.error) {
        const filesSize = project.files.reduce(
          (total, file) => total + file.size,
          0
        );

        setFreeSpace(5 * 1024 * 1024 - filesSize);
        setProjectData({
          id: project._id,
          name: project.name,
          status: project.status,
          get deadline() {
            const date = new Date(project.deadline);

            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${date.getFullYear()}-${month}-${day}`;
          },
          team: new Set(project.team.map((member) => member._id)),
          description: project.description,
          addFiles: project.addFiles,
        });
        setProjectTeam(project.team);
        setActivitiesData({
          loading: false,
          lastPage: project.activities.length < 50,
          error: false,
        });
        setTablePage(1);
        setProjectActivities(
          project.activities.length !== 0 ? [project.activities] : []
        );
      }
    }
  }, [project]);

  // Fetch tasks
  useEffect(() => {
    const getTasks = async () => {
      const { category, page } = tasksDetails;

      try {
        const { data } = await apiClient(
          `/api/v1/projects/${projectId}/tasks?${
            category === 'open'
              ? 'status=open&'
              : category === 'progress'
              ? 'status=progress&'
              : category === 'complete'
              ? 'status=complete&'
              : ''
          }page=${page}&projectPage=true&deleteCount=${deleteCount}&createCount=${createCount}`
        );

        setTasksData({
          loading: false,
          lastPage: data.data.tasks.length < 30,
          error: false,
          pageError: false,
        });

        if (page === 1) {
          setTasks(data.data.tasks);
        } else {
          setTasks([...tasks, ...data.data.tasks]);
        }
      } catch (err) {
        if (page === 1) {
          setTasksData({
            loading: false,
            lastPage: true,
            error: true,
            pageError: false,
          });
        } else {
          setTasksData({
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
          return toast('An error occured while fetching tasks.', {
            toastId: 'toast-id7',
            autoClose: 2000,
          });
        } else {
          return toast(err.response.data.message, {
            toastId: 'toast-id7',
            autoClose: 2000,
          });
        }
      }
    };

    getTasks();
  }, [tasksDetails]);

  const hideNav = (e) => {
    if (e.target === navRef.current) {
      setShowNav(false);
    }
  };

  const hideFilesModal = (e) => {
    e.target === e.currentTarget && setShowFiles(false);
  };

  const displayFiles = (e) => {
    const newFiles = [...e.target.files];

    const totalSize = newFiles.reduce((total, file) => total + file.size, 0);

    if (totalSize > freeSpace) {
      e.target.files = new DataTransfer().files;

      return toast(
        `The total file size for upload must be under ${
          calculateSize(freeSpace).value
        }${calculateSize(freeSpace).unit}.`,
        {
          toastId: 'toast-id2',
        }
      );
    }

    setShowFiles(true);
    setFiles(newFiles);
  };

  const calculateSize = (size) => {
    size = parseFloat(size) || 0;

    let value, unit;

    if (size > 1024 * 1024) {
      value = Number(size / (1024 * 1024)).toFixed(2);
      unit = 'mb';
    } else if (size > 1024) {
      value = Number(size / 1024).toFixed(2);
      unit = 'kb';
    } else {
      value = size;
      unit = 'b';
    }

    return { value: Number(value), unit };
  };

  const removeFile = (indexToRemove) => {
    const files = fileRef.current.files;

    const dataTransfer = new DataTransfer();

    for (let i = 0; i < files.length; i++) {
      if (i !== indexToRemove) {
        dataTransfer.items.add(files[i]);
      }
    }

    fileRef.current.files = dataTransfer.files;

    const newFiles = [...fileRef.current.files];

    setFiles(newFiles);

    newFiles.length === 0 && setShowFiles(false);
  };

  const addToRef = (ref) => (el) => {
    if (el && !ref.current.includes(el)) {
      ref.current.push(el);
    }
  };

  const uploadFiles = async () => {
    const formData = new FormData();

    files.forEach((file) => formData.append('files', file));

    const fileNames = namesRef.current.map((file, index) => {
      let name = String(file.value).trim();

      if (name === '') {
        name = files[index].name;
      }

      return name;
    });

    setFileUploading(true);

    try {
      const { data } = await apiClient.post(
        `/api/v1/projects/${projectId}/files`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-file-names': fileNames,
          },
        }
      );

      setFileUploading(false);
      setShowFiles(false);
      setProject(data.data.project);
    } catch (err) {
      setFileUploading(false);
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast(`Unable to upload file${files.length === 1 ? '' : 's'}.`, {
          toastId: 'toast-id3',
          autoClose: 2000,
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id3',
          autoClose: 2000,
        });
      }
    }
  };

  const getFileName = (name, path) => {
    name = String(name).trim();
    path = String(path).trim();

    const fileName =
      name.lastIndexOf('.') !== -1
        ? name.slice(0, name.lastIndexOf('.'))
        : name;

    const ext =
      path.lastIndexOf('.') !== -1 ? path.slice(path.lastIndexOf('.')) : '';

    const newName = `${fileName}${ext}`;

    return { name: newName, ext, serverName: path.slice(21) };
  };

  const fileDate = (date) => {
    date = new Date(date);

    const time =
      date.getHours() === 0
        ? `12:${String(date.getMinutes()).padStart(2, '0')} AM`
        : date.getHours() === 12
        ? `12:${String(date.getMinutes()).padStart(2, '0')} PM`
        : date.getHours() > 12
        ? `${date.getHours() - 12}:${String(date.getMinutes()).padStart(
            2,
            '0'
          )}PM`
        : `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}AM`;

    return `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()} at ${time}`;
  };

  const fileICon = (ext) => {
    let icon;

    switch (ext) {
      case '.html':
      case '.htm':
        icon = 'html.png';
        break;

      case '.css':
        icon = 'css.png';
        break;

      case '.js':
        icon = 'js.png';
        break;

      case '.py':
        icon = 'py.webp';
        break;

      case '.java':
        icon = 'java.webp';
        break;

      case '.jsx':
        icon = 'jsx.png';
        break;

      case '.pdf':
        icon = 'pdf.png';
        break;

      case '.json':
        icon = 'json.png';
        break;

      case '.php':
        icon = 'php-128.png';
        break;

      case '.ts':
        icon = 'ts.png';
        break;

      case '.txt':
        icon = 'txt.png';
        break;

      case '.doc':
      case '.docx':
        icon = 'doc.png';
        break;

      case '.cpp':
        icon = 'c++.png';
        break;

      case '.swift':
        icon = 'swift.png';
        break;

      case '.env':
        icon = 'env.png;';
        break;

      case '.tif':
      case '.tiff':
      case '.jpg':
      case '.jpeg':
      case '.wpeg':
      case '.webp':
      case '.gif':
      case '.png':
      case '.eps':
      case '.ai':
      case '.bmp':
      case '.ico':
      case '.svg':
      case '.ps':
      case '.psd':
        icon = 'img.png';
        break;

      case '.mkv':
      case '.mp4':
      case '.3g2':
      case '.3gp':
      case '.avi':
      case '.flv':
      case '.h264':
      case '.m4v':
      case '.mov':
      case '.mpg':
      case '.mpeg':
      case '.rm':
      case '.swf':
      case '.vob':
      case '.webm':
      case '.wmv':
        icon = 'video.png';
        break;

      case '.mp3':
      case '.ogg':
      case '.aif':
      case '.cda':
      case '.mid':
      case '.midi':
      case '.mpa':
      case '.wav':
      case '.wma':
      case '.wpl':
      case '.aac':
        icon = 'audio.png';
        break;

      case '.7z':
      case '.arj':
      case '.deb':
      case '.pkg':
      case '.rar':
      case '.rpm':
      case '.gz':
      case '.tar.gz':
      case '.tar':
      case '.tgz':
      case '.tar.bz2':
      case '.tbz2':
      case '.tar.xz':
      case '.txz':
      case '.z':
      case '.zip':
      case '.bz2':
      case '.xz':
      case '.lzma':
      case '.Z':
      case '.cab':
      case '.sit':
      case '.lzh':
      case '.lha':
      case '.gzipped':
      case '.zipped':
        icon = 'zip.png';
        break;

      case '.csv':
      case '.dat':
      case '.db':
      case '.dbf':
      case '.log':
      case '.mdb':
      case '.sav':
      case '.sql':
      case '.xml':
      case '.accdb':
        icon = 'db.png';
        break;

      case '.srt':
      case '.sub':
      case '.ssa':
      case '.smi':
      case '.vtt':
        icon = 'sub.png';
        break;

      default:
        icon = 'others.png';
        break;
    }

    return icon;
  };

  const handleCheckBox = (type, data) => (e) => {
    const value = e.target.checked;

    const dataList =
      type === 'files'
        ? new Set(disposableFiles)
        : type === 'activities'
        ? new Set(disposableActivities)
        : '';

    const setDataList =
      type === 'files'
        ? setDisposableFiles
        : type === 'activities'
        ? setDisposableActivities
        : '';

    if (value) {
      dataList.add(data);
    } else {
      dataList.delete(data);
    }

    setDataList([...dataList]);
  };

  const selectAllData = (type, ref) => () => {
    const selectLength =
      type === 'files'
        ? disposableFiles.length
        : type === 'activities'
        ? disposableActivities.length
        : 0;

    const setDataList =
      type === 'files'
        ? setDisposableFiles
        : type === 'activities'
        ? setDisposableActivities
        : '';

    const data =
      type === 'files'
        ? project.files.filter(
            (file) => isOwner() || file.sender.userId === userData._id
          )
        : type === 'activities'
        ? projectActivities[tablePage - 1]
        : 0;

    if (selectLength === data.length) {
      setDataList([]);
      ref.current.forEach((el) => (el.checked = false));
    } else {
      if (type === 'files') {
        setDataList(data.map((file) => file.name));
      } else if (type === 'activities') {
        setDataList(data.map((activity) => activity._id));
      }

      ref.current.forEach((el) => (el.checked = true));
    }
  };

  const getActivityMessage = (activity) => {
    if (activity.action === 'update') {
      return `The project ${activity.type.includes('name') ? 'name' : ''} ${
        activity.type.length > 1 ? 'and' : ''
      } ${activity.type.includes('description') ? 'description' : ''} ${
        activity.type.length > 1 ? 'were' : 'was'
      } updated`;
    } else if (
      activity.action === 'reduction' ||
      activity.action === 'extension'
    ) {
      let dateDifference;

      const timeDifference = Math.abs(
        Date.parse(activity.state.deadline.to) -
          Date.parse(activity.state.deadline.from)
      );

      dateDifference = `${
        Math.floor(timeDifference / 86400000) === 1
          ? 'a day'
          : `${Math.floor(timeDifference / 86400000)} days`
      }`;

      return (
        <>
          The project deadline was
          {activity.action === 'reduction' ? ' shortened' : ' extended'}
          {dateDifference ? ' by ' : ''}
          <span className={styles['activity-text']}>
            {dateDifference ? `${dateDifference}` : ''}
          </span>
        </>
      );
    } else if (activity.action === 'transition') {
      if (activity.type.includes('status')) {
        return (
          <>
            The project status was changed to{' '}
            <span className={styles['activity-text']}>
              {activity.state.status.to}
            </span>
          </>
        );
      }
    } else if (activity.action === 'filePermission') {
      return `Team members were ${
        activity.state.addFiles.to
          ? 'given permission to add files'
          : 'disabled from adding files'
      }`;
    } else if (activity.action === 'addition') {
      if (activity.type.includes('files')) {
        return (
          <>
            {userData._id === activity.performer.id ? (
              'You '
            ) : (
              <a
                href={`/user/${activity.performer.username}`}
                className={styles['activity-names']}
              >
                {generateName(
                  activity.performer.firstName,
                  activity.performer.lastName,
                  activity.performer.username
                )}{' '}
              </a>
            )}
            added{' '}
            {activity.performer.filesLength === 1
              ? 'a'
              : activity.performer.filesLength}{' '}
            {activity.performer.filesLength === 1 ? 'file' : 'files'}
          </>
        );
      } else if (activity.type.includes('team')) {
        return (
          <>
            <a
              href={`/user/${activity.state.username}`}
              className={styles['activity-names']}
            >
              {generateName(
                activity.state.firstName,
                activity.state.lastName,
                activity.state.username
              )}{' '}
            </a>
            was added to the team
          </>
        );
      } else if (activity.type.includes('deadline')) {
        return 'The Project deadline was set.';
      }
    } else if (activity.action === 'deletion') {
      if (activity.type.includes('files')) {
        return (
          <>
            {userData._id === activity.performer.id ? (
              'You '
            ) : (
              <a
                href={`/user/${activity.performer.username}`}
                className={styles['activity-names']}
              >
                {generateName(
                  activity.performer.firstName,
                  activity.performer.lastName,
                  activity.performer.username
                )}{' '}
              </a>
            )}
            deleted{' '}
            {activity.performer.filesLength === 1
              ? 'a'
              : activity.performer.filesLength}{' '}
            {activity.performer.filesLength === 1 ? 'file' : 'files'}
          </>
        );
      } else if (activity.type.includes('task')) {
        return 'A task was deleted';
      } else if (activity.type.includes('deadline')) {
        return 'The Project deadline was removed.';
      } else if (activity.type.includes('account')) {
        return (
          <>
            <span className={styles['deleted-users']}>
              {generateName(
                activity.performer.firstName,
                activity.performer.lastName,
                activity.performer.username
              )}
            </span>{' '}
            was no longer available and was subsequently removed from the team
          </>
        );
      }
    } else if (activity.action === 'removal') {
      if (activity.type.includes('team')) {
        return (
          <>
            {activity.state.oldMembers.map((member, index, array) => (
              <a
                key={member._id}
                href={`/user/${member.username}`}
                className={styles['activity-names']}
              >
                {index !== 0 ? ' ' : ''}
                {generateName(
                  member.firstName,
                  member.lastName,
                  member.username
                )}
                {index !== array.length - 1 ? ',' : ''}
              </a>
            ))}{' '}
            {activity.state.oldMembers.length === 1 ? 'was' : 'were'} removed
            from the team
          </>
        );
      }
    } else if (activity.action === 'creation') {
      return 'A task was created';
    } else if (
      activity.action === 'exit' &&
      activity.type.includes('project')
    ) {
      return (
        <>
          <a
            href={`/user/${activity.performer.username}`}
            className={styles['activity-names']}
          >
            {generateName(
              activity.performer.firstName,
              activity.performer.lastName,
              activity.performer.username
            )}
          </a>{' '}
          left the project.
        </>
      );
    }
  };

  const goToPage = async (nextPage) => {
    if (nextPage === tablePage) return;
    else if (projectActivities[nextPage - 1]) setTablePage(nextPage);
    else {
      setActivitiesData({
        loading: true,
        lastPage: false,
        error: false,
      });

      try {
        const { data } = await apiClient(
          `/api/v1/projects/${projectId}/activities?page=${nextPage}`
        );

        setActivitiesData({
          loading: false,
          lastPage: data.data.activities.length < 50,
          error: false,
        });

        if (data.data.activities.length === 0) return;

        setProjectActivities([...projectActivities, data.data.activities]);
        setTablePage(nextPage);
      } catch (err) {
        setActivitiesData({
          loading: false,
          lastPage: false,
          error: true,
        });

        if (
          !err.response ||
          !err.response.data ||
          err.response.status === 500
        ) {
          return toast('An error occured while fetching activities.', {
            toastId: 'toast-id5',
            autoClose: 2000,
          });
        } else {
          return toast(err.response.data.message, {
            toastId: 'toast-id5',
            autoClose: 2000,
          });
        }
      }
    }
  };

  const isLastPage = () => {
    if (activitiesData.lastPage) {
      return projectActivities.length === tablePage;
    } else {
      return projectActivities.length + 1 === tablePage;
    }
  };

  const deleteActivity = (id) => async () => {
    setDeletingActivity({ id, value: true });

    try {
      const { data } = await apiClient.patch(
        `/api/v1/projects/${projectId}/activities`,
        {
          activities: [id],
        }
      );
      setDeletingActivity({ value: false, id: null });
      setProject(data.data.project);
    } catch (err) {
      setDeletingActivity({ value: false, id: null });
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occured while deleting activity.', {
          toastId: 'toast-id6',
          autoClose: 2000,
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id6',
          autoClose: 2000,
        });
      }
    }
  };

  const changeTaskCategory = (category) => () => {
    if (category === tasksDetails.category) return;

    setDeleteCount(0);
    setCreateCount(0);
    setTasks([]);
    setTasksData({
      loading: true,
      lastPage: true,
      error: false,
      pageError: false,
    });
    setTasksDetails({ category, page: 1 });
  };

  const nextTaskPage = () => {
    const { page, category } = tasksDetails;

    if (tasksData.pageError) {
      setTasksDetails({ page, category });
    } else {
      setTasksDetails({ page: page + 1, category });
    }

    setTasksData({
      loading: true,
      lastPage: true,
      error: false,
      pageError: false,
    });
  };

  const isOwner = () => {
    return userData._id === project.user._id;
  };

  return (
    <main className={styles.div}>
      <ToastContainer autoClose={2500} />

      <NavBar page={'Project'} showNav={showNav} setShowNav={setShowNav} />

      <section className={styles.section}>
        <Header page={'Project'} setShowNav={setShowNav} />

        {displayModal && (
          <Project
            setDisplayModal={setDisplayModal}
            editProject={true}
            projectData={projectData}
            projectTeam={projectTeam}
            setProject={setProject}
          />
        )}

        {deleteModal.value && (
          <DeleteComponent
            toast={toast}
            type={deleteModal.type}
            typeData={deleteData}
            setDeleteModal={setDeleteModal}
            setProject={setProject}
            setSelectMode={
              deleteModal.type.startsWith('File')
                ? setSelectMode
                : deleteModal.type.startsWith('Activit')
                ? setActivitySelectMode
                : null
            }
            setDeleteCount={setDeleteCount}
            setTasks={setTasks}
          />
        )}

        {showFiles && (
          <section
            className={styles['show-files-section']}
            onClick={hideFilesModal}
          >
            <div className={styles['modal-container']}>
              <span
                className={styles['close-modal']}
                onClick={() => setShowFiles(false)}
              >
                <IoCloseSharp className={styles['close-modal-icon']} />
              </span>
              <h1 className={styles['modal-head']}>Add Files</h1>

              <ul className={styles['files-list']}>
                {files.map((file, index) => (
                  <li key={file.name} className={styles['file-item']}>
                    <RiDeleteBin6Line
                      className={styles['remove-file-icon']}
                      title="Remove File"
                      onClick={() => removeFile(index)}
                    />

                    <span className={styles['file-no']}>{index + 1}.</span>
                    <div className={styles['file-info']}>
                      <div
                        className={`${styles['file-info-box']} ${styles['file-name-box']}`}
                      >
                        <span className={styles['file-info-property']}>
                          Original Name:
                        </span>
                        <span className={styles['file-info-value']}>
                          {file.name}
                        </span>
                      </div>

                      <div className={styles['file-info-box']}>
                        <label className={styles['file-info-property']}>
                          New Name:
                        </label>
                        <input
                          className={styles['file-new-name']}
                          type="text"
                          placeholder="Leave blank to use the original name"
                          ref={addToRef(namesRef)}
                        />
                      </div>

                      <div
                        className={`${styles['file-info-box']} ${styles['file-size-box']}`}
                      >
                        <span
                          className={`${styles['file-info-property']} ${styles['file-info-size']}`}
                        >
                          Size:
                        </span>
                        <span className={styles['file-info-value']}>
                          {calculateSize(file.size).value}
                          <span className={styles['file-size-unit']}>
                            {calculateSize(file.size).unit}
                          </span>
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className={styles['btn-box']}>
                <button
                  className={`${styles['upload-btn']} ${
                    fileUploading ? styles['uploading-button'] : ''
                  }`}
                  onClick={uploadFiles}
                >
                  {fileUploading ? (
                    <>
                      <SiKashflow className={styles['creating-icon']} />{' '}
                      Uploading....
                    </>
                  ) : (
                    'Upload'
                  )}
                </button>
              </div>
            </div>
          </section>
        )}

        {addTask && (
          <NewTask
            setAddTask={setAddTask}
            fixedProject={true}
            projectPage={true}
            projects={[project]}
            currentProjectIndex={0}
            setCreateCount={setCreateCount}
            setProject={setProject}
            setTasks={setTasks}
            category={tasksDetails.category}
          />
        )}

        <section className={styles['section-content']}>
          {project === null ? (
            <div className={styles['loader-box']}>
              <Loader
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  marginBottom: '7rem',
                }}
              />
            </div>
          ) : project.error ? (
            project.code === 500 ? (
              <span className={styles['error-text']}>
                Unable to load project. Please check the URL or your network
                connection and try reloading the page.
              </span>
            ) : project.code === 404 ? (
              <span className={styles['error-text']}>
                This project does not exist.
              </span>
            ) : (
              <span className={styles['error-text']}>
                Unable to load project.
              </span>
            )
          ) : (
            <>
              <h1 className={styles['project-name']}>
                {project.name}{' '}
                {project.status === 'inactive' ? (
                  <IoIosCloseCircleOutline
                    className={styles['inactive-icon']}
                  />
                ) : (
                  <IoIosCheckmarkCircleOutline
                    className={styles['active-icon']}
                  />
                )}
              </h1>

              {isOwner() ? (
                <div className={styles['edit-btn-div']}>
                  <button
                    className={styles['edit-btn']}
                    onClick={() => setDisplayModal(true)}
                  >
                    Edit Project
                  </button>

                  <button
                    className={styles['delete-btn']}
                    onClick={() => {
                      setDeleteModal({ value: true, type: 'Project' });
                      setDeleteData({ id: project._id, name: project.name });
                    }}
                  >
                    Delete Project
                  </button>
                </div>
              ) : (
                <div className={styles['edit-btn-div']}>
                  <button
                    className={styles['delete-btn']}
                    onClick={() => {
                      setDeleteModal({ value: true, type: 'Team' });
                      setDeleteData({ id: project._id });
                    }}
                  >
                    Exit Project
                  </button>
                </div>
              )}

              {!isOwner() && <div> &nbsp;</div>}

              <div className={styles['project-container']}>
                <div className={styles['left-section']}>
                  <div className={styles['project-content']}>
                    <span className={styles['project-leader']}>
                      <span className={styles['leader-text']}>
                        Project Leader:
                      </span>
                      <span className={styles['leader']}>
                        <a
                          href={
                            isOwner() ? null : `/user/${project.user.username}`
                          }
                          className={styles['project-leader-link']}
                        >
                          <img
                            src={`${serverUrl}/users/${project.user.photo}`}
                            className={`${styles['leader-img']} ${
                              project.user.photo === 'default.jpeg'
                                ? styles['default-pic']
                                : ''
                            }`}
                          />{' '}
                          {generateName(
                            project.user.firstName,
                            project.user.lastName,
                            project.user.username
                          )}
                        </a>
                      </span>
                    </span>

                    <span className={styles['project-description']}>
                      <span className={styles['description-text']}>
                        Project Description:
                      </span>
                      <div className={styles['description']}>
                        {project.description.length === 0 ? (
                          <i className={styles['italic-text']}>
                            No description
                          </i>
                        ) : (
                          project.description
                        )}
                      </div>
                    </span>
                  </div>

                  <div className={styles['alt-project-details-container']}>
                    <span className={styles['project-details-head']}>
                      Project Details
                    </span>

                    <div className={styles['table-container']}>
                      <table className={styles.table}>
                        <tbody>
                          <tr>
                            <td
                              className={`${styles['table-project-data']} ${styles['table-property']}`}
                            >
                              Tasks:
                            </td>
                            <td className={styles['table-project-data']}>
                              {project.details.complete +
                                project.details.open +
                                project.details.progress}
                            </td>
                          </tr>
                          <tr>
                            <td
                              className={`${styles['table-project-data']} ${styles['table-property']}`}
                            >
                              Created:
                            </td>
                            <td className={styles['table-project-data']}>{`${
                              months[new Date(project.createdAt).getMonth()]
                            } ${new Date(
                              project.createdAt
                            ).getDate()}, ${new Date(
                              project.createdAt
                            ).getFullYear()}`}</td>
                          </tr>
                          <tr>
                            <td
                              className={`${styles['table-project-data']} ${styles['table-property']}`}
                            >
                              Deadline:
                            </td>
                            <td className={styles['table-project-data']}>
                              {project.deadline ? (
                                `${
                                  months[new Date(project.deadline).getMonth()]
                                } ${new Date(
                                  project.deadline
                                ).getDate()}, ${new Date(
                                  project.deadline
                                ).getFullYear()}`
                              ) : (
                                <i>No deadline</i>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td
                              className={`${styles['table-project-data']} ${styles['table-property']}`}
                            >
                              Team:
                            </td>
                            <td className={styles['table-project-data']}>
                              {project.team.length}{' '}
                              {project.team.length === 1 ? 'member' : 'members'}
                            </td>
                          </tr>
                          <tr>
                            <td
                              className={`${styles['table-project-data']} ${styles['table-property']}`}
                            >
                              Status:
                            </td>
                            <td
                              className={`${styles['table-project-data']} ${styles['project-status']}`}
                            >
                              {project.status}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className={styles['progress-div']}>
                      <span className={styles['progress-box']}>
                        <span>Progress</span>
                        <span className={styles['progress-value']}>
                          {project.details.projectProgress}%
                        </span>
                      </span>

                      <span className={styles['progress-bar-box']}>
                        <span
                          className={styles['progress-bar']}
                          style={{
                            width: `${project.details.projectProgress}%`,
                          }}
                        >
                          &nbsp;
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className={styles['alt-project-team-container']}>
                    <span className={styles['team-head']}>Team</span>

                    <div className={styles['team-div']}>
                      {project.team.length === 0 ? (
                        <div className={styles['no-content-box']}>
                          {' '}
                          <i className={styles['italic-text']}>No member</i>
                        </div>
                      ) : (
                        project.team.map((member) => (
                          <a
                            key={member._id}
                            className={styles['member-box']}
                            href={
                              member._id === userData._id
                                ? '/profile'
                                : `/user/${member.username}`
                            }
                          >
                            <img
                              src={`${serverUrl}/users/${member.photo}`}
                              className={`${styles['member-img']} ${
                                member.photo === 'default.jpeg'
                                  ? styles['default-pic']
                                  : ''
                              }`}
                            />
                            <span className={styles['member-details']}>
                              <span className={styles['member-name']}>
                                {generateName(
                                  member.firstName,
                                  member.lastName,
                                  member.username
                                )}
                              </span>
                              <span className={styles['member-title']}>
                                {member.occupation}
                              </span>
                            </span>
                          </a>
                        ))
                      )}
                    </div>
                  </div>

                  <div className={styles['files-conatiner']}>
                    {selectMode.value ? (
                      <div className={styles['delete-files-box']}>
                        <span className={styles['delete-files-text']}>
                          Selected {disposableFiles.length}{' '}
                          {disposableFiles.length === 1 ? 'file' : 'files'}
                        </span>

                        <div className={styles['delete-btn-div']}>
                          <button
                            className={styles['cancel-file-btn']}
                            onClick={() => {
                              setSelectMode({ value: false, index: null });
                              setDisposableFiles([]);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className={`${styles['delete-file-btn']} ${
                              disposableFiles.length === 0
                                ? styles['disable-btn']
                                : ''
                            }`}
                            onClick={() => {
                              setDeleteModal({
                                value: true,
                                type: `${
                                  disposableFiles.length === 1
                                    ? 'File'
                                    : 'Files'
                                }`,
                              });
                              setDeleteData({
                                id: project._id,
                                files: disposableFiles,
                              });
                            }}
                          >
                            Delete
                          </button>
                          <BiSolidSelectMultiple
                            className={`${styles['select-all-icon']} ${
                              disposableFiles.length ===
                              project.files.filter(
                                (file) =>
                                  isOwner() ||
                                  file.sender.userId === userData._id
                              ).length
                                ? styles['select-all-icon2']
                                : ''
                            }`}
                            onClick={selectAllData('files', checkBoxRef)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className={styles['file-container-head']}>
                        {' '}
                        <h1 className={styles['files-text']}>
                          Project Files
                          {!isOwner() && !project.addFiles ? (
                            ''
                          ) : (
                            <span className={styles['files-size-left']}>
                              {' '}
                              ({calculateSize(freeSpace).value}
                              <span className={styles['files-size-unit']}>
                                {calculateSize(freeSpace).unit}
                              </span>{' '}
                              free)
                            </span>
                          )}
                        </h1>
                        {!isOwner() && !project.addFiles ? (
                          ''
                        ) : (
                          <div className={styles['add-files-box']}>
                            <button
                              className={styles['add-files-btn']}
                              onClick={() => fileRef.current.click()}
                            >
                              Add Files
                            </button>
                            <input
                              type="file"
                              className={styles['add-file-input']}
                              ref={fileRef}
                              onChange={displayFiles}
                              multiple
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className={styles['files-box']}>
                      {project.files.length === 0 ? (
                        <div className={styles['no-content-box']}>
                          {' '}
                          <i className={styles['italic-text']}>No file</i>{' '}
                        </div>
                      ) : (
                        project.files.map((file, index) => (
                          <article
                            key={file._id}
                            className={styles['uploaded-file']}
                          >
                            <img
                              className={styles['file-icon']}
                              src={`../../assets/file-icons/${fileICon(
                                getFileName(file.name, file.path).ext
                              )}`}
                            />
                            <div className={styles['file-content']}>
                              <span className={styles['file-name']}>
                                {getFileName(file.name, file.path).name}
                              </span>
                              <span className={styles['file-details']}>
                                <span className={styles['file-property']}>
                                  Sender:
                                </span>
                                <span
                                  className={`${styles['file-sender']} ${
                                    file.sender.userId !== userData._id
                                      ? styles['file-sender2']
                                      : ''
                                  }`}
                                >
                                  <a
                                    href={
                                      file.sender.userId === userData._id
                                        ? null
                                        : `/user/${file.sender.username}`
                                    }
                                  >
                                    {generateName(
                                      file.sender.firstName,
                                      file.sender.lastName,
                                      file.sender.username
                                    )}
                                  </a>
                                </span>
                              </span>
                              <span className={styles['file-details']}>
                                <span className={styles['file-property']}>
                                  Size:
                                </span>
                                <span className={styles['file-size']}>
                                  {calculateSize(file.size).value}
                                  <span className={styles['size-unit']}>
                                    {calculateSize(file.size).unit}
                                  </span>
                                </span>
                              </span>
                              <span className={styles['file-details']}>
                                <span className={styles['file-property']}>
                                  Time:
                                </span>
                                <span className={styles['time-sent']}>
                                  {fileDate(file.time)}
                                </span>
                              </span>
                            </div>
                            {!isOwner() &&
                            file.sender.userId !== userData._id ? (
                              <a
                                href={
                                  import.meta.env.MODE === 'production'
                                    ? `${
                                        import.meta.env.VITE_BACKEND_URL
                                      }/project-files/${project._id}/${
                                        getFileName(file.name, file.path)
                                          .serverName
                                      }`
                                    : `${
                                        import.meta.env.VITE_LOCAL_BACKEND_URL
                                      }/project-files/${project._id}/${
                                        getFileName(file.name, file.path)
                                          .serverName
                                      }`
                                }
                                className={styles['download-link']}
                                download={true}
                              >
                                <FiDownload
                                  title="Download"
                                  className={styles['download-icon']}
                                />
                              </a>
                            ) : selectMode.value ? (
                              <input
                                className={styles['file-checkbox']}
                                type="checkbox"
                                ref={addToRef(checkBoxRef)}
                                defaultChecked={selectMode.index === index}
                                onChange={handleCheckBox('files', file.name)}
                              />
                            ) : (
                              <div className={styles['menu-box']}>
                                <BsThreeDotsVertical
                                  className={styles['menu-file-icon']}
                                />

                                <ul className={styles['menu-list']}>
                                  <li
                                    className={styles['menu-item']}
                                    onClick={() => {
                                      setSelectMode({ value: true, index });
                                      setDisposableFiles([file.name]);
                                    }}
                                  >
                                    Select
                                  </li>

                                  <li className={styles['menu-item']}>
                                    <a
                                      href={
                                        import.meta.env.MODE === 'production'
                                          ? `${
                                              import.meta.env.VITE_BACKEND_URL
                                            }/project-files/${project._id}/${
                                              getFileName(file.name, file.path)
                                                .serverName
                                            }`
                                          : `${
                                              import.meta.env
                                                .VITE_LOCAL_BACKEND_URL
                                            }/project-files/${project._id}/${
                                              getFileName(file.name, file.path)
                                                .serverName
                                            }`
                                      }
                                      className={styles['download-link']}
                                      download={true}
                                    >
                                      Download
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </article>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles['right-section']}>
                  <div className={styles['project-details-container']}>
                    <span className={styles['project-details-head']}>
                      Project Details
                    </span>

                    <div className={styles['table-container']}>
                      <table className={styles.table}>
                        <tbody>
                          <tr>
                            <td
                              className={`${styles['table-project-data']} ${styles['table-property']}`}
                            >
                              Tasks:
                            </td>
                            <td className={styles['table-project-data']}>
                              {' '}
                              {project.details.complete +
                                project.details.open +
                                project.details.progress}
                            </td>
                          </tr>
                          <tr>
                            <td
                              className={` ${styles['table-project-data']} ${styles['table-property']}`}
                            >
                              Created:
                            </td>
                            <td className={styles['table-project-data']}>{`${
                              months[new Date(project.createdAt).getMonth()]
                            } ${new Date(
                              project.createdAt
                            ).getDate()}, ${new Date(
                              project.createdAt
                            ).getFullYear()}`}</td>
                          </tr>
                          <tr>
                            <td
                              className={` ${styles['table-project-data']} ${styles['table-property']}`}
                            >
                              Deadline:
                            </td>
                            <td className={styles['table-project-data']}>
                              {project.deadline ? (
                                `${
                                  months[new Date(project.deadline).getMonth()]
                                } ${new Date(
                                  project.deadline
                                ).getDate()}, ${new Date(
                                  project.deadline
                                ).getFullYear()}`
                              ) : (
                                <i>No deadline</i>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td
                              className={`${styles['table-project-data']} ${styles['table-property']}`}
                            >
                              Team:
                            </td>
                            <td className={styles['table-project-data']}>
                              {' '}
                              {project.team.length}{' '}
                              {project.team.length === 1 ? 'member' : 'members'}
                            </td>
                          </tr>
                          <tr>
                            <td
                              className={`${styles['table-project-data']} ${styles['table-property']}`}
                            >
                              Status:
                            </td>
                            <td
                              className={`${styles['table-project-data']} ${styles['project-status']}`}
                            >
                              {' '}
                              {project.status}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className={styles['progress-div']}>
                      <span className={styles['progress-box']}>
                        <span>Progress</span>
                        <span className={styles['progress-value']}>
                          {' '}
                          {project.details.projectProgress}%
                        </span>
                      </span>

                      <span className={styles['progress-bar-box']}>
                        <span
                          className={styles['progress-bar']}
                          style={{
                            width: `${project.details.projectProgress}%`,
                          }}
                        >
                          &nbsp;
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className={styles['project-team-container']}>
                    <span className={styles['team-head']}>Team</span>

                    <div className={styles['team-div']}>
                      {project.team.length === 0 ? (
                        <div className={styles['no-content-box']}>
                          {' '}
                          <i className={styles['italic-text']}>No member</i>
                        </div>
                      ) : (
                        project.team.map((member) => (
                          <a
                            key={member._id}
                            className={styles['member-box']}
                            href={
                              member._id === userData._id
                                ? '/profile'
                                : `/user/${member.username}`
                            }
                          >
                            <img
                              src={`${serverUrl}/users/${member.photo}`}
                              className={`${styles['member-img']} ${
                                member.photo === 'default.jpeg'
                                  ? styles['default-pic']
                                  : ''
                              }`}
                            />
                            <span className={styles['member-details']}>
                              <span className={styles['member-name']}>
                                {generateName(
                                  member.firstName,
                                  member.lastName,
                                  member.username
                                )}
                              </span>
                              <span className={styles['member-title']}>
                                {member.occupation}
                              </span>
                            </span>
                          </a>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles['activities-container']}>
                <h1 className={styles['activity-head']}>Activities</h1>

                {projectActivities.length === 0 ? (
                  <div className={styles['no-project-activity-box']}>
                    {' '}
                    <i className={styles['no-project-activity-txt']}>
                      No activity
                    </i>{' '}
                  </div>
                ) : (
                  <>
                    <div className={styles['activity-header']}>
                      <div className={styles['activity-header-text']}>
                        {activitySelectMode.value ? (
                          <span className={styles['delete-activity-text']}>
                            {disposableActivities.length} selected{' '}
                          </span>
                        ) : (
                          <>
                            Showing
                            <span className={styles['activity-entry-text']}>
                              {' '}
                              {(tablePage - 1) * 50 + 1}
                            </span>{' '}
                            to
                            <span className={styles['activity-entry-text']}>
                              {' '}
                              {(tablePage - 1) * 50 +
                                projectActivities[tablePage - 1].length}
                            </span>{' '}
                            of
                            <span className={styles['activity-entry-text']}>
                              {' '}
                              {projectActivities.flat().length}
                            </span>
                          </>
                        )}
                      </div>

                      {activitySelectMode.value ? (
                        <div>
                          <button
                            className={styles['cancel-activity-btn']}
                            onClick={() => {
                              setActivitySelectMode({
                                value: false,
                                index: null,
                              });
                              setDisposableActivities([]);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className={`${styles['delete-activity-btn']}  ${
                              disposableActivities.length === 0
                                ? styles['disable-btn']
                                : ''
                            }`}
                            onClick={() => {
                              setDeleteModal({
                                value: true,
                                type:
                                  disposableActivities.length !== 1
                                    ? 'Activities'
                                    : 'Activity',
                              });
                              setDeleteData({
                                id: project._id,
                                activities: disposableActivities,
                              });
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div className={styles['entry-navigation-box']}>
                          <span
                            className={`${styles['activity-content-box']} ${
                              styles['activity-arrow-box']
                            } ${tablePage === 1 ? styles['disable-box'] : ''}`}
                            onClick={() => goToPage(tablePage - 1)}
                          >
                            <MdKeyboardDoubleArrowLeft
                              className={styles['activity-icon']}
                            />
                          </span>

                          <div className={styles['pagination-box']}>
                            <>
                              {projectActivities.map((page, index) => (
                                <span
                                  key={index}
                                  className={`${
                                    styles['activity-content-box']
                                  } ${
                                    tablePage === index + 1
                                      ? styles['current-page']
                                      : ''
                                  }`}
                                  onClick={() => goToPage(index + 1)}
                                >
                                  {index + 1}
                                </span>
                              ))}

                              {!activitiesData.lastPage && (
                                <span
                                  className={styles['activity-content-box']}
                                  onClick={() =>
                                    goToPage(projectActivities.length + 1)
                                  }
                                >
                                  {activitiesData.loading ? (
                                    <div
                                      className={styles['searching-loader']}
                                    ></div>
                                  ) : (
                                    projectActivities.length + 1
                                  )}
                                </span>
                              )}
                            </>
                          </div>

                          <span
                            className={`${styles['activity-content-box']} ${
                              styles['activity-arrow-box']
                            } ${isLastPage() ? styles['disable-box'] : ''}`}
                            onClick={() => goToPage(tablePage + 1)}
                          >
                            <MdKeyboardDoubleArrowRight
                              className={styles['activity-icon']}
                            />
                          </span>
                        </div>
                      )}
                    </div>

                    <div className={styles['activity-table-container']}>
                      <table className={styles['activity-table']}>
                        <thead className={styles['table-head-row']}>
                          <tr>
                            <th className={styles['table-head']}>Activity</th>
                            <th className={styles['table-head']}>Type</th>
                            <th className={styles['table-head']}>Date</th>
                            <th className={styles['table-head']}>Time</th>
                            {isOwner() && (
                              <th className={styles['table-head']}>
                                {activitySelectMode.value ? (
                                  <BiSolidSelectMultiple
                                    className={`${
                                      styles['select-all-activity']
                                    } ${
                                      disposableActivities.length ===
                                      projectActivities[tablePage - 1].length
                                        ? styles['select-all-activity2']
                                        : ''
                                    }`}
                                    onClick={selectAllData(
                                      'activities',
                                      activitiesRef
                                    )}
                                  />
                                ) : (
                                  ''
                                )}
                              </th>
                            )}
                          </tr>
                        </thead>

                        <tbody>
                          {projectActivities[tablePage - 1].map(
                            (activity, index) => (
                              <tr key={activity._id}>
                                <td className={styles['activity-table-data']}>
                                  {getActivityMessage(activity)}
                                </td>
                                <td className={styles['activity-table-data']}>
                                  {(activity.action === 'creation' ||
                                    (activity.action === 'deletion' &&
                                      activity.type.includes('task'))) && (
                                    <span
                                      className={`${styles['activity-type']} ${styles['activity-type1']}`}
                                    >
                                      <FaTasks
                                        className={styles['activity-type-icon']}
                                      />{' '}
                                      Task
                                    </span>
                                  )}

                                  {(activity.action === 'update' ||
                                    activity.action === 'reduction' ||
                                    activity.action === 'extension' ||
                                    activity.action === 'transition') && (
                                    <span
                                      className={`${styles['activity-type']} ${styles['activity-type3']}`}
                                    >
                                      <RxUpdate
                                        className={styles['activity-type-icon']}
                                      />{' '}
                                      Update
                                    </span>
                                  )}

                                  {((activity.action === 'addition' &&
                                    activity.type.includes('team')) ||
                                    (activity.action === 'removal' &&
                                      activity.type.includes('team')) ||
                                    (activity.action === 'deletion' &&
                                      activity.type.includes('account')) ||
                                    (activity.action === 'exit' &&
                                      activity.type.includes('project'))) && (
                                    <span
                                      className={`${styles['activity-type']} ${styles['activity-type2']}`}
                                    >
                                      <BsPeopleFill
                                        className={styles['activity-type-icon']}
                                      />{' '}
                                      Team
                                    </span>
                                  )}

                                  {((activity.action === 'addition' &&
                                    activity.type.includes('files')) ||
                                    (activity.action === 'deletion' &&
                                      activity.type.includes('files')) ||
                                    activity.action === 'filePermission') && (
                                    <span
                                      className={`${styles['activity-type']} ${styles['activity-type4']}`}
                                    >
                                      <FaFileAlt
                                        className={
                                          styles['activity-type-icon2']
                                        }
                                      />{' '}
                                      File
                                    </span>
                                  )}

                                  {(activity.action === 'addition' ||
                                    activity.action === 'deletion') &&
                                    activity.type.includes('deadline') && (
                                      <span
                                        className={`${styles['activity-type']} ${styles['activity-type3']}`}
                                      >
                                        <RxUpdate
                                          className={
                                            styles['activity-type-icon']
                                          }
                                        />{' '}
                                        Update
                                      </span>
                                    )}
                                </td>

                                <td className={styles['activity-table-data']}>
                                  {months[new Date(activity.time).getMonth()]}{' '}
                                  {new Date(activity.time).getDate()},{' '}
                                  {new Date(activity.time).getFullYear()}
                                </td>
                                <td className={styles['activity-table-data']}>
                                  {new Date(activity.time).getHours() === 0 ||
                                  new Date(activity.time).getHours() === 12
                                    ? 12
                                    : new Date(activity.time).getHours() > 12
                                    ? String(
                                        new Date(activity.time).getHours() - 12
                                      ).padStart(2, '0')
                                    : String(
                                        new Date(activity.time).getHours()
                                      ).padStart(2, '0')}
                                  :
                                  {String(
                                    new Date(activity.time).getMinutes()
                                  ).padStart(2, '0')}{' '}
                                  <span className={styles['activity-time']}>
                                    {new Date(activity.time).getHours() >= 12
                                      ? 'pm'
                                      : 'am'}
                                  </span>
                                </td>
                                {isOwner() && (
                                  <td className={styles['activity-table-data']}>
                                    {deletingActivity.id === activity._id ? (
                                      <div
                                        className={styles['searching-loader2']}
                                      ></div>
                                    ) : activitySelectMode.value ? (
                                      <input
                                        type="checkbox"
                                        className={styles['activity-checkbox']}
                                        ref={addToRef(activitiesRef)}
                                        defaultChecked={
                                          activitySelectMode.index === index
                                        }
                                        onChange={handleCheckBox(
                                          'activities',
                                          activity._id
                                        )}
                                      />
                                    ) : (
                                      <span
                                        className={
                                          styles['activity-action-container']
                                        }
                                      >
                                        <BsThreeDotsVertical
                                          className={styles['activity-menu']}
                                        />

                                        <ul
                                          className={
                                            styles['activity-action-box']
                                          }
                                        >
                                          <li
                                            className={styles['action-option']}
                                            onClick={() => {
                                              setActivitySelectMode({
                                                value: true,
                                                index,
                                              });
                                              setDisposableActivities([
                                                activity._id,
                                              ]);
                                            }}
                                          >
                                            Select
                                          </li>

                                          <li
                                            className={styles['action-option']}
                                            onClick={deleteActivity(
                                              activity._id
                                            )}
                                          >
                                            Delete
                                          </li>
                                        </ul>
                                      </span>
                                    )}
                                  </td>
                                )}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

              <div className={styles['task-container']}>
                <div className={styles['task-head-div']}>
                  <h1 className={styles['task-head']}>Tasks</h1>

                  {isOwner() && (
                    <button
                      className={styles['add-task-btn']}
                      onClick={() => setAddTask(true)}
                    >
                      Add Task
                    </button>
                  )}
                </div>
                <div className={styles['task-category-div']}>
                  <ul className={styles['tasks-category-list']}>
                    <li
                      className={`${styles['taks-category']} ${
                        tasksDetails.category === 'all'
                          ? styles['current-task-category']
                          : ''
                      }`}
                      onClick={changeTaskCategory('all')}
                    >
                      All tasks
                    </li>
                    <li
                      className={`${styles['taks-category']} ${
                        tasksDetails.category === 'open'
                          ? styles['current-task-category']
                          : ''
                      }`}
                      onClick={changeTaskCategory('open')}
                    >
                      Open
                    </li>
                    <li
                      className={`${styles['taks-category']} ${
                        tasksDetails.category === 'progress'
                          ? styles['current-task-category']
                          : ''
                      }`}
                      onClick={changeTaskCategory('progress')}
                    >
                      In Progress
                    </li>
                    <li
                      className={`${styles['taks-category']} ${
                        tasksDetails.category === 'complete'
                          ? styles['current-task-category']
                          : ''
                      }`}
                      onClick={changeTaskCategory('complete')}
                    >
                      Completed
                    </li>
                  </ul>
                </div>

                {tasksData.loading ? (
                  <div className={styles['tasks-loader-box']}>
                    <Loader
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                      }}
                    />
                  </div>
                ) : tasksData.error ? (
                  <div className={styles['no-tasks-text']}>
                    <MdOutlineSignalWifiOff
                      className={styles['network-icon']}
                    />{' '}
                    Unable to retrieve data
                  </div>
                ) : tasks.length === 0 ? (
                  <div className={styles['no-tasks-text']}>
                    {' '}
                    No task availaible{' '}
                  </div>
                ) : (
                  <ul className={styles['tasks-list']}>
                    {tasks.map((task) => (
                      <li key={task._id} className={styles['task-item']}>
                        <span className={styles['task-box']}>
                          {task.status === 'complete' ? (
                            <GrStatusGood className={styles['status-icon']} />
                          ) : task.status === 'progress' ? (
                            <svg
                              className={`${styles['status-icon']} ${styles['status-icon3']}`}
                              stroke="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM18 12C18 15.3137 15.3137 18 12 18V6C15.3137 6 18 8.68629 18 12Z"></path>
                            </svg>
                          ) : (
                            <VscIssueReopened
                              className={`${styles['status-icon']}  ${styles['status-icon2']}`}
                            />
                          )}

                          <span className={styles['task-name']}>
                            {task.name}
                          </span>

                          {isOwner() && (
                            <span className={styles['action-box']}>
                              <span
                                className={styles['delete-icon-box']}
                                title="Delete Task"
                              >
                                <MdDelete
                                  className={styles['delete-icon']}
                                  onClick={() => {
                                    setDeleteModal({
                                      value: true,
                                      type: 'Task',
                                    });
                                    setDeleteData({
                                      id: project._id,
                                      task: task._id,
                                    });
                                  }}
                                />
                              </span>
                            </span>
                          )}
                        </span>

                        {isOwner() && (
                          <span className={styles['alt-action-box']}>
                            <span
                              className={styles['delete-icon-box']}
                              title="Delete Task"
                            >
                              <MdDelete
                                className={styles['delete-icon']}
                                onClick={() => {
                                  setDeleteModal({
                                    value: true,
                                    type: 'Task',
                                  });
                                  setDeleteData({
                                    id: project._id,
                                    task: task._id,
                                  });
                                }}
                              />
                            </span>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {!tasksData.lastPage && (
                  <div className={styles['show-more-box']}>
                    <button
                      className={styles['show-more-btn']}
                      onClick={nextTaskPage}
                    >
                      Show More
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
};

export default ProjectItem;
