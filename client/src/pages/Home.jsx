import React, { useEffect } from 'react';
import { SiKashflow } from 'react-icons/si';
import styles from '../styles/Home.module.css';
import Slideshow from '../components/Slideshow';
import { SiAwsorganizations } from 'react-icons/si';
import { MdLowPriority } from 'react-icons/md';
import { IoMdClock } from 'react-icons/io';
import AnimatedText from '../components/AnimatedText';
import { FaSquareFacebook } from 'react-icons/fa6';
import { FaSquareInstagram } from 'react-icons/fa6';
import { SiDiscord } from 'react-icons/si';
import { RiTwitterXFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
const features = [
  {
    src: '/assets/images/depositphotos_135721568-stock-photo-woman-writing-in-notebook.jpg',
    title: 'Task Creation',
    text: 'Easily create new tasks, including setting titles, descriptions, due dates, priorities, and any other relevant details.',
    color: 'darkred',
  },
  {
    src: '/assets/images/depositphotos_11027407-stock-photo-bright-paper-trays-and-stationery.jpg',
    title: 'Task Organization',
    text: 'Organize tasks efficiently, such as grouping them by project, category, or status.',
    color: 'gold',
  },
  {
    src: '/assets/images/high-priority-man-fingers-setting-button-highest-position-concept-image-illustration-priorities-management-56237000.webp',
    title: 'Priority Setting',
    text: 'Prioritize tasks based on urgency or importance.',
    color: 'gray',
  },
  {
    src: '/assets/images/gettyimages-1301426166-612x612.jpg',
    title: 'Deadline Management',
    text: 'Set deadlines for tasks and receive reminders or notifications as deadlines approach.',
    color: 'red',
  },
  {
    src: '/assets/images/gettyimages-1392016982-612x612.jpg',
    title: 'Collaboration and Sharing',
    text: 'Allows you to share tasks, assign tasks to team members, and communicate with each other.',
    color: 'midnightblue',
  },
  {
    src: '/assets/images/gettyimages-117247268-612x612.jpg',
    title: 'Progress Tracking',
    text: 'Track the progress of your tasks and generate reports to monitor productivity and performance over time.',
    color: 'dodgerblue',
  },
];

const Home = () => {
  useEffect(() => {
    document.body.classList.remove('dark-theme');
  }, []);

  return (
    <>
      {/* Header  and Description */}

      <section className={styles.section}>
        .
        <header className={styles.header}>
          <div className={styles.head}>
            <SiKashflow className={styles.logo} />
            <h1>TaskFlow</h1>
          </div>
          <Link className={styles['login-link']} to="/login">
            <button className={styles.button}>Log in</button>
          </Link>
        </header>
        <div className={styles.content}>
          <h1 className={styles.headText}>Manage your task easily</h1>
          <p className={styles.description}>
            A user-friendly platform for organizing tasks individually or
            collaboratively. It offers features like task creation,
            categorization, prioritization, and deadline reminders to enhance
            productivity.
          </p>
          <br />
        </div>
      </section>

      {/* For the Social media icons */}

      <aside className={styles.aside}>
        <span>
          <svg className={styles.icon} x="0px" y="0px" viewBox="0 0 48 48">
            <linearGradient
              id="awSgIinfw5_FS5MLHI~A9a_yGcWL8copNNQ_gr1"
              x1="6.228"
              x2="42.077"
              y1="4.896"
              y2="43.432"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#0d61a9"></stop>
              <stop offset="1" stopColor="#16528c"></stop>
            </linearGradient>
            <path
              fill="url(#awSgIinfw5_FS5MLHI~A9a_yGcWL8copNNQ_gr1)"
              d="M42,40c0,1.105-0.895,2-2,2H8c-1.105,0-2-0.895-2-2V8c0-1.105,0.895-2,2-2h32	c1.105,0,2,0.895,2,2V40z"
            ></path>
            <path
              d="M25,38V27h-4v-6h4v-2.138c0-5.042,2.666-7.818,7.505-7.818c1.995,0,3.077,0.14,3.598,0.208	l0.858,0.111L37,12.224L37,17h-3.635C32.237,17,32,18.378,32,19.535V21h4.723l-0.928,6H32v11H25z"
              opacity=".05"
            ></path>
            <path
              d="M25.5,37.5v-11h-4v-5h4v-2.638c0-4.788,2.422-7.318,7.005-7.318c1.971,0,3.03,0.138,3.54,0.204	l0.436,0.057l0.02,0.442V16.5h-3.135c-1.623,0-1.865,1.901-1.865,3.035V21.5h4.64l-0.773,5H31.5v11H25.5z"
              opacity=".07"
            ></path>
            <path
              fill="#fff"
              d="M33.365,16H36v-3.754c-0.492-0.064-1.531-0.203-3.495-0.203c-4.101,0-6.505,2.08-6.505,6.819V22h-4v4	h4v11h5V26h3.938l0.618-4H31v-2.465C31,17.661,31.612,16,33.365,16z"
            ></path>
          </svg>
        </span>
        <span>
          <svg className={styles.icon} x="0px" y="0px" viewBox="0 0 48 48">
            <radialGradient
              id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1"
              cx="19.38"
              cy="42.035"
              r="44.899"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#fd5"></stop>
              <stop offset=".328" stopColor="#ff543f"></stop>
              <stop offset=".348" stopColor="#fc5245"></stop>
              <stop offset=".504" stopColor="#e64771"></stop>
              <stop offset=".643" stopColor="#d53e91"></stop>
              <stop offset=".761" stopColor="#cc39a4"></stop>
              <stop offset=".841" stopColor="#c837ab"></stop>
            </radialGradient>
            <path
              fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)"
              d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
            ></path>
            <radialGradient
              id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2"
              cx="11.786"
              cy="5.54"
              r="29.813"
              gradientTransform="matrix(1 0 0 .6663 0 1.849)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#4168c9"></stop>
              <stop offset=".999" stopColor="#4168c9" stopOpacity="0"></stop>
            </radialGradient>
            <path
              fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)"
              d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
            ></path>
            <path
              fill="#fff"
              d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"
            ></path>
            <circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle>
            <path
              fill="#fff"
              d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"
            ></path>
          </svg>
        </span>
        <span>
          <svg className={styles.icon} x="0px" y="0px" viewBox="0 0 48 48">
            <radialGradient
              id="Fr~bqA9iZI6v1mPZVXxEWa_LOWwEDik1xs8_gr1"
              cx="24"
              cy="560.111"
              r="32.253"
              gradientTransform="matrix(1 0 0 -1 0 570.11)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#8c9eff"></stop>
              <stop offset=".368" stopColor="#889af8"></stop>
              <stop offset=".889" stopColor="#7e8fe6"></stop>
              <stop offset="1" stopColor="#7b8ce1"></stop>
            </radialGradient>
            <path
              fill="url(#Fr~bqA9iZI6v1mPZVXxEWa_LOWwEDik1xs8_gr1)"
              d="M40.107,12.15c-0.065-0.102-0.139-0.182-0.236-0.255c-0.355-0.267-5.744-3.889-9.865-3.889	c-0.258,0-0.825,1.1-1.016,1.987c-1.994,0.002-7.996-0.003-9.993,0.006c-0.236-0.838-0.844-1.99-1.008-1.99	c-4.122,0-9.487,3.606-9.861,3.887c-0.097,0.073-0.17,0.153-0.236,0.255c-0.708,1.107-5.049,8.388-5.892,21.632	c-0.009,0.142,0.04,0.289,0.135,0.395C6.728,39.321,13.318,39.929,14.724,40c0.167,0.008,0.335-0.059,0.427-0.199l1.099-1.665	l-3.246-1.54v-1.609c6.329,2.817,15.356,3.104,21.993,0.017l0.027,1.588l-3.205,1.65l1.028,1.559c0.092,0.14,0.26,0.208,0.427,0.199	c1.407-0.072,7.996-0.679,12.588-5.823c0.095-0.106,0.144-0.253,0.135-0.395C45.156,20.538,40.815,13.257,40.107,12.15z"
            ></path>
            <ellipse cx="30.5" cy="26" opacity=".05" rx="4.5" ry="5"></ellipse>
            <ellipse cx="30.5" cy="26" opacity=".05" rx="4" ry="4.5"></ellipse>
            <ellipse cx="30.5" cy="26" fill="#fff" rx="3.5" ry="4"></ellipse>
            <ellipse cx="17.5" cy="26" opacity=".05" rx="4.5" ry="5"></ellipse>
            <ellipse cx="17.5" cy="26" opacity=".05" rx="4" ry="4.5"></ellipse>
            <ellipse cx="17.5" cy="26" fill="#fff" rx="3.5" ry="4"></ellipse>
          </svg>
        </span>
        <span>
          <svg className={styles.icon} x="0px" y="0px" viewBox="0 0 48 48">
            <linearGradient
              id="U8Yg0Q5gzpRbQDBSnSCfPa_yoQabS8l0qpr_gr1"
              x1="4.338"
              x2="38.984"
              y1="-10.056"
              y2="49.954"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#4b4b4b"></stop>
              <stop offset=".247" stopColor="#3e3e3e"></stop>
              <stop offset=".686" stopColor="#2b2b2b"></stop>
              <stop offset="1" stopColor="#252525"></stop>
            </linearGradient>
            <path
              fill="url(#U8Yg0Q5gzpRbQDBSnSCfPa_yoQabS8l0qpr_gr1)"
              d="M38,42H10c-2.209,0-4-1.791-4-4V10c0-2.209,1.791-4,4-4h28c2.209,0,4,1.791,4,4v28	C42,40.209,40.209,42,38,42z"
            ></path>
            <path
              fill="#fff"
              d="M34.257,34h-6.437L13.829,14h6.437L34.257,34z M28.587,32.304h2.563L19.499,15.696h-2.563 L28.587,32.304z"
            ></path>
            <polygon
              fill="#fff"
              points="15.866,34 23.069,25.656 22.127,24.407 13.823,34"
            ></polygon>
            <polygon
              fill="#fff"
              points="24.45,21.721 25.355,23.01 33.136,14 31.136,14"
            ></polygon>
          </svg>
        </span>
      </aside>

      {/* For the Slideshow */}

      <Slideshow />

      {/* For the features */}

      <section className={styles['features-section']}>
        <p className={styles['features-paragraph']}>
          <b className={styles['site-name']}>TaskFlow</b> boasts a plethora of
          features, catering to a wide range of needs and enhancing user
          experience with a comprehensive suite of tools and functionalities.
        </p>

        <div className={styles['card-box']}>
          {features.map(({ src, title, text, color }, index) => (
            <article
              key={index}
              className={`${styles.article} ${styles[color]}`}
            >
              <figure className={styles['card-details']}>
                <img className={styles['card-img']} src={src} />
                <h1 className={styles['card-head']}>{title}</h1>
                <p className={styles['card-paragraph']}>{text}</p>
              </figure>

              <span>
                {color === 'darkred' && (
                  <svg
                    className={styles['card-icon']}
                    shapeRendering="geometricPrecision"
                    textRendering="geometricPrecision"
                    imageRendering="optimizeQuality"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    viewBox="0 0 419 511.67"
                  >
                    <path d="M314.98 303.62c57.47 0 104.02 46.59 104.02 104.03 0 57.47-46.58 104.02-104.02 104.02-57.47 0-104.02-46.58-104.02-104.02 0-57.47 46.58-104.03 104.02-104.03zM41.73 59.27h23.93v24.38H41.73c-4.54 0-8.7 1.76-11.8 4.61l-.45.49c-3.14 3.13-5.1 7.48-5.1 12.24v315.53c0 4.75 1.96 9.1 5.1 12.24 3.13 3.15 7.48 5.11 12.25 5.11h142.62c1.68 8.44 4.17 16.6 7.36 24.38H41.73c-11.41 0-21.86-4.71-29.42-12.26C4.72 438.44 0 427.99 0 416.52V100.99c0-11.48 4.7-21.92 12.25-29.47l.79-.72c7.5-7.13 17.62-11.53 28.69-11.53zm297.55 217.37V100.99c0-4.74-1.96-9.09-5.12-12.24-3.11-3.15-7.47-5.1-12.24-5.1h-23.91V59.27h23.91c11.45 0 21.86 4.72 29.42 12.26 7.61 7.56 12.32 18.02 12.32 29.46V283.6c-7.79-3.06-15.95-5.41-24.38-6.96zm-206.75-8.07c-7.13 0-12.92-5.79-12.92-12.92s5.79-12.93 12.92-12.93h142.83c7.13 0 12.92 5.8 12.92 12.93s-5.79 12.92-12.92 12.92H132.53zM89.5 241.22c7.98 0 14.44 6.46 14.44 14.44 0 7.97-6.46 14.43-14.44 14.43-7.97 0-14.44-6.46-14.44-14.43 0-7.98 6.47-14.44 14.44-14.44zm0 78.62c7.98 0 14.44 6.46 14.44 14.44 0 7.97-6.46 14.43-14.44 14.43-7.97 0-14.44-6.46-14.44-14.43 0-7.98 6.47-14.44 14.44-14.44zm43.04 27.35c-7.13 0-12.93-5.79-12.93-12.92s5.8-12.93 12.93-12.93h80.96a133.608 133.608 0 0 0-17.26 25.85h-63.7zM89.5 162.6c7.98 0 14.44 6.46 14.44 14.44 0 7.98-6.46 14.44-14.44 14.44-7.97 0-14.44-6.46-14.44-14.44 0-7.98 6.47-14.44 14.44-14.44zm43.03 27.37c-7.13 0-12.92-5.8-12.92-12.93s5.79-12.92 12.92-12.92h142.83c7.13 0 12.92 5.79 12.92 12.92s-5.79 12.93-12.92 12.93H132.53zM93 39.4h46.13C141.84 17.18 159.77 0 181.52 0c21.62 0 39.45 16.95 42.34 38.94l46.76.46c2.61 0 4.7 2.09 4.7 4.71v51.84c0 2.6-2.09 4.7-4.7 4.7H93.05c-2.56 0-4.71-2.1-4.71-4.7V44.11A4.638 4.638 0 0 1 93 39.4zm88.03-19.25c12.3 0 22.26 9.98 22.26 22.27 0 12.3-9.96 22.26-22.26 22.26-12.29 0-22.26-9.96-22.26-22.26 0-12.29 9.97-22.27 22.26-22.27zm118.39 346.9c-.04-4.59-.46-7.86 5.23-7.79l18.45.23c5.95-.04 7.53 1.86 7.46 7.43v25.16h25.02c4.59-.03 7.86-.46 7.78 5.24l-.22 18.44c.03 5.96-1.86 7.54-7.43 7.48h-25.15v25.14c.07 5.57-1.51 7.46-7.46 7.43l-18.45.22c-5.69.09-5.27-3.2-5.23-7.79v-25h-25.16c-5.59.06-7.47-1.52-7.44-7.48l-.22-18.44c-.09-5.7 3.2-5.27 7.79-5.24h25.03v-25.03z" />
                  </svg>
                )}

                {color === 'gold' && (
                  <SiAwsorganizations
                    className={`${styles['card-icon']} ${styles['organization-icon']}`}
                  />
                )}

                {color === 'gray' && (
                  <MdLowPriority className={styles['card-icon']} />
                )}
                {color === 'red' && (
                  <IoMdClock
                    className={`${styles['card-icon']} ${styles['clock-icon']}`}
                  />
                )}

                {color === 'midnightblue' && (
                  <svg
                    className={`${styles['card-icon']} ${styles['organization-icon']}`}
                    viewBox="0 0 297.23 297.23"
                    enableBackground="new 0 0 297.23 297.23"
                  >
                    <g>
                      <path d="m149.416,61.02c14.139,0 25.642-11.503 25.642-25.642 0-14.139-11.503-25.642-25.642-25.642s-25.642,11.503-25.642,25.642c0,14.139 11.503,25.642 25.642,25.642z" />
                      <path d="m108.813,139.678h80.845c5.265,0 9.533-4.268 9.533-9.533v-35.25c0-9.758-6.271-18.41-15.544-21.448l-.043-.014-13.563-2.246c-1.154-0.355-2.388,0.256-2.803,1.395l-15.389,42.224c-0.888,2.436-4.333,2.436-5.221,0l-15.389-42.224c-0.335-0.92-1.203-1.496-2.133-1.496-0.22,0-0.445,0.033-0.667,0.101l-13.566,2.243c-9.349,3.115-15.595,11.782-15.595,21.582v35.133c0.002,5.265 4.27,9.533 9.535,9.533z" />
                      <path d="m50.188,208.836c14.139,0 25.642-11.503 25.642-25.642s-11.503-25.642-25.642-25.642c-14.139,0-25.642,11.503-25.642,25.642s11.503,25.642 25.642,25.642z" />
                      <path d="m84.368,221.262l-.043-.014-13.563-2.246c-1.154-0.355-2.388,0.256-2.803,1.395l-15.389,42.224c-0.888,2.436-4.333,2.436-5.221,0l-15.389-42.224c-0.335-0.92-1.203-1.496-2.133-1.496-0.22,0-0.445,0.033-0.667,0.101l-13.566,2.243c-9.348,3.115-15.594,11.782-15.594,21.582v35.133c0,5.265 4.268,9.533 9.533,9.533h80.845c5.265,0 9.533-4.268 9.533-9.533v-35.25c0-9.757-6.27-18.41-15.543-21.448z" />
                      <path d="m247.277,208.836c14.139,0 25.642-11.503 25.642-25.642s-11.503-25.642-25.642-25.642c-14.139,0-25.642,11.503-25.642,25.642s11.502,25.642 25.642,25.642z" />
                      <path d="m281.686,221.262l-.043-.014-13.563-2.246c-1.154-0.355-2.388,0.256-2.803,1.395l-15.389,42.224c-0.888,2.436-4.333,2.436-5.221,0l-15.389-42.224c-0.335-0.92-1.203-1.496-2.133-1.496-0.22,0-0.445,0.033-0.667,0.101l-13.566,2.243c-9.349,3.115-15.595,11.782-15.595,21.582v35.133c0,5.265 4.268,9.533 9.533,9.533h80.845c5.265,0 9.533-4.268 9.533-9.533v-35.25c0.002-9.757-6.269-18.41-15.542-21.448z" />
                      <path d="m157.872,146.894h-16.922v38.55l-39.834,39.834c3.606,4.936 5.679,10.989 5.679,17.431v0.822l42.616-42.617 40.975,40.976c0.205-6.527 2.528-12.62 6.417-17.515l-38.931-38.931v-38.55z" />
                      <path d="m155.539,71.055c-0.667-0.726-1.641-1.092-2.627-1.092h-7.353c-0.986,0-1.96,0.365-2.627,1.092-1.032,1.124-1.182,2.748-0.449,4.018l3.93,5.925-1.84,15.522 3.623,9.638c0.353,0.969 1.724,0.969 2.078,0l3.623-9.638-1.84-15.522 3.93-5.925c0.733-1.27 0.584-2.894-0.448-4.018z" />
                      <path d="m56.259,218.901c-0.667-0.726-1.641-1.092-2.627-1.092h-7.353c-0.986,0-1.96,0.365-2.627,1.092-1.032,1.124-1.182,2.748-0.449,4.018l3.93,5.925-1.84,15.521 3.623,9.638c0.353,0.969 1.724,0.969 2.077,0l3.623-9.638-1.84-15.521 3.93-5.925c0.734-1.269 0.585-2.893-0.447-4.018z" />
                      <path d="m253.577,218.901c-0.667-0.726-1.641-1.092-2.627-1.092h-7.353c-0.986,0-1.96,0.365-2.627,1.092-1.032,1.124-1.182,2.748-0.449,4.018l3.93,5.925-1.84,15.521 3.623,9.638c0.353,0.969 1.724,0.969 2.077,0l3.623-9.638-1.84-15.521 3.93-5.925c0.735-1.269 0.585-2.893-0.447-4.018z" />
                    </g>
                  </svg>
                )}

                {color === 'dodgerblue' && (
                  <svg
                    className={`${styles['card-icon']} ${styles['track-icon']}`}
                    viewBox="-0.5 0 25 25"
                  >
                    <path
                      d="M7.05005 15.81L10.6201 12.11C10.8201 11.9 11.1501 11.91 11.3401 12.12L12.14 12.98C12.34 13.19 12.6701 13.19 12.8701 12.98L14.94 10.81"
                      stroke="white"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.88 12.86L16.95 9.41C16.95 9.1 16.7001 8.84 16.4001 8.84L12.9301 8.86"
                      stroke="white"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 22C17.2467 22 21.5 17.7467 21.5 12.5C21.5 7.25329 17.2467 3 12 3C6.75329 3 2.5 7.25329 2.5 12.5C2.5 17.7467 6.75329 22 12 22Z"
                      stroke="white"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </article>

            // <article className={styles.card}>
            //   <span className={styles['card-icon-box']}>
            //     <MdLowPriority className={styles['card-icon']} />
            //   </span>

            //   <h2 className={styles['card-title']}>{title}</h2>

            //   <p className={styles['card-description']}>{text}</p>
            // </article>
          ))}
        </div>
      </section>

      {/* Animated Text */}

      <AnimatedText />

      {/* Footer */}

      <footer className={styles.footer}>
        <div className={styles['footer-details']}>
          <SiKashflow className={styles['footer-logo']} />
          <p className={styles['footer-text']}>Manage your task easily.</p>

          <div className={styles['icon-box']}>
            <FaSquareFacebook className={styles['footer-icon']} />
            <FaSquareInstagram className={styles['footer-icon']} />
            <SiDiscord className={styles['footer-icon']} />
            <RiTwitterXFill className={styles['footer-icon']} />
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
