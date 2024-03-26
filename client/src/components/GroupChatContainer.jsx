import React from 'react';
import styles from '../styles/ChatContainer.module.css';

import { IoCheckmarkDoneSharp } from 'react-icons/io5';

import { MdInsertPhoto } from 'react-icons/md';
import { GrAttachment } from 'react-icons/gr';
import { BsSendFill } from 'react-icons/bs';
import { GoArrowDown } from 'react-icons/go';
import { BiSolidFileDoc } from 'react-icons/bi';
import { BsFillFileEarmarkTextFill } from 'react-icons/bs';
import { TbClock } from 'react-icons/tb';
import { FaSearch } from 'react-icons/fa';

const ChatBox = ({ emptyMode, chatMode }) => {
  return (
    <div
      className={`${styles['chat-box']} ${
        chatMode === 'group' && emptyMode.group === false
          ? styles['show-chats']
          : ''
      }`}
    >
      <div className={styles['contact-head']}>
        <figure className={styles['profile-img-box']}>
          <img
            src="../../assets/images/profile3.jpeg"
            className={styles['profile-img']}
          />
        </figure>

        <div className={styles['name-box']}>
          <h1 className={styles['chat-name']}>Boolean Autocrats</h1>
          {/* <span className={styles['last-time-seen']}>
            Last seen today at 9:50 AM
          </span> */}
        </div>
        <div className={styles['search-div']}>
          <FaSearch className={styles['chat-search-icon']} />
        </div>
      </div>

      <div className={styles['chat-container']}>
        <span className={styles['move-down-box']}>
          <GoArrowDown className={styles['move-down-arrow']} />
        </span>

        <article
          className={`${styles['chat-bubble']} ${styles['owner-chat-bubble']}`}
        >
          {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Yesterday</span>
                  </div> */}
          <div className={styles['owner-chat-content']}>
            <div className={styles['thread-container']}>
              <span className={styles['thread-box']}>
                <span className={styles['thread-owner']}>Arya Stark</span>
                <span className={styles.thread}>When will you come back</span>
              </span>
              {/* <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span> */}
            </div>
            <span className={styles['chat-response']}>
              I think next tomorrow.
            </span>
            <div className={styles['chat-details']}>
              <time className={styles['chat-send-time']}>12:30 PM</time>
              <IoCheckmarkDoneSharp
                className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
              />
            </div>
          </div>
        </article>

        <article
          className={`${styles['chat-bubble']} ${styles['others-chat-bubble']} `}
        >
          <div className={styles['chat-date-container']}>
            <span className={styles['chat-date']}>Yesterday</span>
          </div>
          <div className={styles['others-chat-content']}>
            <div className={styles['thread-container']}>
              <span className={styles['thread-box']}>
                <span className={styles['thread-owner']}>You</span>
                <span className={styles.thread}>I think next tomorrow.</span>
              </span>
              {/* <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span> */}
            </div>
            <span className={styles['chat-response']}>Ok, no problem</span>
            <div className={styles['chat-details']}>
              <time className={styles['chat-send-time']}>03:42 PM</time>
              {/* <IoCheckmarkDoneSharp
                        className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
                      /> */}
            </div>
          </div>
        </article>

        <article
          className={`${styles['chat-bubble']} ${styles['others-chat-bubble2']}`}
        >
          {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Yesterday</span>
                  </div> */}
          <div className={styles['others-chat-content2']}>
            {/* <div className={styles['thread-container']}>
                      <span className={styles['thread-box']}>
                      <span className={styles['thread-owner']}>You</span>
                      <span className={styles.thread}>
                        I think next tomorrow.
                      </span>
                      </span>
                      <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span>
                    </div> */}
            <span className={styles['chat-response']}>
              Please send me a picture of the place you are staying before you
              come back
            </span>
            <div className={styles['chat-details']}>
              <time className={styles['chat-send-time']}>03:43 PM</time>
              {/* <IoCheckmarkDoneSharp
                        className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
                      /> */}
            </div>
          </div>
        </article>

        <article
          className={`${styles['chat-bubble']} ${styles['owner-chat-bubble']}`}
        >
          {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Yesterday</span>
                  </div> */}
          <div
            className={`${styles['owner-chat-content']} ${styles['media-chat-content']}`}
          >
            <div className={styles['thread-container']}>
              <span className={styles['thread-box']}>
                <span className={styles['thread-owner']}>Arya Stark</span>
                <span className={styles.thread}>
                  Please send me a picture of the place you are staying before
                  you come back
                </span>
              </span>
              {/* <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span> */}
            </div>
            <span
              className={`${styles['chat-response']} ${styles['media-response']}`}
            >
              <img
                src="../../assets/images/pics1.jpg"
                className={styles['chat-pics']}
              />
              <span className={styles['media-caption']}>
                This is the living room
              </span>
            </span>
            <div className={styles['chat-details']}>
              <time className={styles['chat-send-time']}>06:27 PM</time>
              <IoCheckmarkDoneSharp
                className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
              />
            </div>
          </div>
        </article>

        <article
          className={`${styles['chat-bubble']} ${styles['others-chat-bubble']} `}
        >
          {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Yesterday</span>
                  </div> */}
          <div className={styles['others-chat-content']}>
            {/* <div className={styles['thread-container']}>
                      <span className={styles['thread-box']}>
                        <span className={styles['thread-owner']}>You</span>
                        <span className={styles.thread}>
                          I think next tomorrow.
                        </span>
                      </span>
                      <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span>
                    </div> */}
            <span className={styles['chat-response']}>
              Send more pictures na
            </span>
            <div className={styles['chat-details']}>
              <time className={styles['chat-send-time']}>10:16 PM</time>
              {/* <IoCheckmarkDoneSharp
                        className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
                      /> */}
            </div>
          </div>
        </article>

        <article
          className={`${styles['chat-bubble']} ${styles['owner-chat-bubble']}`}
        >
          <div className={styles['chat-date-container']}>
            <span className={styles['chat-date']}>Today</span>
          </div>
          <div
            className={`${styles['owner-chat-content']} ${styles['media-chat-content']}`}
          >
            <div className={styles['thread-container']}>
              <span className={styles['thread-box']}>
                <span className={styles['thread-owner']}>Arya Stark</span>
                <span className={styles.thread}>Send more pictures na</span>
              </span>
              {/* <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span> */}
            </div>
            <span
              className={`${styles['chat-response']} ${styles['multi-media-response']}`}
            >
              <img
                src="../../assets/images/pics4.jpeg"
                className={styles['multi-chat-pics']}
              />
              <img
                src="../../assets/images/pics2.jpeg"
                className={styles['multi-chat-pics']}
              />
              <img
                src="../../assets/images/pics3.jpeg"
                className={styles['multi-chat-pics']}
              />
              <span className={styles['more-media-box']}>+ 2</span>
            </span>
            <div className={styles['chat-details']}>
              <time className={styles['chat-send-time']}>07:35 AM</time>
              <IoCheckmarkDoneSharp
                className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
              />
            </div>
          </div>
        </article>

        <article
          className={`${styles['chat-bubble']} ${styles['others-chat-bubble']} `}
        >
          {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Yesterday</span>
                  </div> */}
          <div className={styles['others-chat-content']}>
            <div className={styles['thread-container']}>
              <span className={styles['thread-box']}>
                <span className={styles['thread-owner']}>You</span>
                <span className={styles.thread}>
                  <MdInsertPhoto className={styles['thread-media-icon']} /> This
                  is the living room
                </span>
              </span>
              <span className={styles['thread-media-box']}>
                <img
                  src="../../assets/images/pics1.jpg"
                  className={styles['thread-media']}
                />
              </span>
            </div>
            <span className={styles['chat-response']}>Thank you</span>
            <div className={styles['chat-details']}>
              <time className={styles['chat-send-time']}>12:34 PM</time>
              {/* <IoCheckmarkDoneSharp
                        className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
                      /> */}
            </div>
          </div>
        </article>

        <article
          className={`${styles['chat-bubble']} ${styles['owner-chat-bubble']}`}
        >
          {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Today</span>
                  </div> */}
          <div
            className={`${styles['owner-chat-content']} ${styles['media-chat-content']}`}
          >
            <div className={styles['thread-container']}>
              <span className={styles['thread-box']}>
                <span className={styles['thread-owner']}>Arya Stark</span>
                <span className={styles.thread}>Thank you</span>
              </span>
              {/* <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span> */}
            </div>
            <span className={`${styles['chat-response']} `}>
              You are welcome. Please send me that document you collected from
              professor
            </span>
            <div className={styles['chat-details']}>
              <time className={styles['chat-send-time']}>12:36 PM</time>
              <IoCheckmarkDoneSharp
                className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
              />
            </div>
          </div>
        </article>

        <article
          className={`${styles['chat-bubble']} ${styles['others-chat-bubble']} `}
        >
          {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Yesterday</span>
                  </div> */}
          <div className={styles['others-chat-content']}>
            {/* <div className={styles['thread-container']}>
                      <span className={styles['thread-box']}>
                        <span className={styles['thread-owner']}>You</span>
                        <span className={styles.thread}>
                          <MdInsertPhoto
                            className={styles['thread-media-icon']}
                          />{' '}
                          This is the living room
                        </span>
                      </span>
                      <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span>
                    </div> */}
            <div
              className={`${styles['chat-response']} ${styles['file-response']}`}
            >
              <div className={styles['file-container']}>
                <div className={styles['file-box']}>
                  <BiSolidFileDoc className={styles['file-icon']} />
                  <span className={styles['file-details']}>
                    <span className={styles['file-name']}>
                      Maths 121 complete note.doc
                    </span>
                    <span className={styles['file-size']}>40 KB</span>
                  </span>
                </div>
                <button className={styles['file-download-btn']}>
                  Download
                </button>
              </div>
              <span className={styles['file-caption']}>
                This is only for first semester
              </span>
            </div>

            <div className={styles['chat-details']}>
              <time className={styles['chat-send-time']}>4:12 PM</time>
              {/* <IoCheckmarkDoneSharp
                        className={`${styles['chat-status-icon']} ${styles['chat-status-icon3']}`}
                      /> */}
            </div>
          </div>
        </article>

        <article
          className={`${styles['chat-bubble']} ${styles['owner-chat-bubble']}`}
        >
          {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Today</span>
                  </div> */}
          <div
            className={`${styles['owner-chat-content']} ${styles['media-chat-content']}`}
          >
            <div className={styles['thread-container']}>
              <span className={styles['thread-box']}>
                <span className={styles['thread-owner']}>Arya Stark</span>
                <span className={styles.thread}>
                  <BsFillFileEarmarkTextFill
                    className={styles['thread-files-icon']}
                  />
                  Maths 121 complete note.doc
                </span>
              </span>
              {/* <span className={styles['thread-media-box']}>
                        <img
                          src="../../assets/images/pics1.jpg"
                          className={styles['thread-media']}
                        />
                      </span> */}
            </div>
            <span className={`${styles['chat-response']} `}>Thanks</span>
            <div className={styles['chat-details']}>
              <time className={styles['chat-send-time']}>06:36 PM</time>
              <IoCheckmarkDoneSharp
                className={`${styles['chat-status-icon']}`}
              />
            </div>
          </div>
        </article>

        <article
          className={`${styles['chat-bubble']} ${styles['owner-chat-bubble']}`}
        >
          {/* <div className={styles['chat-date-container']}>
                    <span className={styles['chat-date']}>Today</span>
                  </div> */}
          <div
            className={`${styles['owner-chat-content']} ${styles['media-chat-content']}`}
          >
            {/* <div className={styles['thread-container']}>
                      <span className={styles['thread-box']}>
                        <span className={styles['thread-owner']}>
                          Arya Stark
                        </span>
                        <span className={styles.thread}>
                          <BsFillFileEarmarkTextFill
                            className={styles['thread-files-icon']}
                          />
                          Maths 121 complete note.doc
                        </span>
                      </span>
                    
                    </div> */}

            <span className={`${styles['chat-response']} `}>
              I will see you tomorrow.
            </span>
            <div className={styles['chat-details']}>
              <time className={styles['chat-send-time']}>6:38 PM</time>
              <TbClock className={`${styles['chat-status-icon']}`} />
            </div>
          </div>
        </article>
      </div>

      <div className={styles['chat-input-container']}>
        <GrAttachment className={styles['attachment-icon']} />
        <div className={styles['chat-input-box']}>
          <textarea className={styles['chat-input']} rows={1}></textarea>
          <span className={styles['send-icon-box']}>
            <BsSendFill className={styles['send-icon']} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
