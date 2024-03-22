import React from 'react';
import styles from '../styles/BigCalendar.module.css';

import { MdArrowForwardIos, MdArrowBackIosNew } from 'react-icons/md';
import { FaCircle } from 'react-icons/fa';

const BigCalendar = ({
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
  calenderRef,
}) => {
  const maxDays = (currentMonth) => {
    const month = currentMonth;
    const arr30 = [4, 6, 9, 11];
    let days = 0;

    if (month === 2) {
      if (currentYear % 4 === 0) {
        days = 29;
      } else {
        days = 28;
      }
    } else if (arr30.includes(month)) {
      days = 30;
    } else {
      days = 31;
    }
    return days;
  };

  const maxRows = () => {
    const maxNumber = maxDays(currentMonth);
    const firstDay = new Date(`${currentYear}-${currentMonth}-1`).getDay();
    let rows = 4;

    if (maxNumber === 30) {
      if (firstDay === 0) {
        rows = 5;
      }
    } else if (maxNumber === 31) {
      if (firstDay === 0 || firstDay === 6) {
        rows = 5;
      }
    }

    return rows;
  };

  const tableData = (currentMonth, currentYear) => {
    const currentDate = new Date().getDate();
    const currentDay = new Date(`${currentYear}-${currentMonth}-1`).getDay();
    const maxNumber = maxDays(currentMonth);
    const prevMonthNumber = maxDays(currentMonth - 1);
    const rows = maxRows();

    let dataArray = [];

    let value = 0;

    for (let i = 0; i <= rows; i++) {
      let data = [];
      if (i === 0) {
        let num = prevMonthNumber - (currentDay - 1);
        let row1Num = prevMonthNumber - 6;
        for (let j = 0; j <= 6; j++) {
          if (currentDay === 0) {
            value = 1;
            let input = value;

            let current = input === currentDate;

            if (`${input}`.length < 2) {
              input = `0${input}`;
            }

            if (j === 6) {
              data.push({ input, current, member: true });
            } else {
              row1Num++;
              input = row1Num;
              data.push({ input, current: false, member: false });
            }
          } else if (j >= currentDay - 1) {
            value++;
            let input = value;

            let current = input === currentDate;

            if (`${input}`.length < 2) {
              input = `0${input}`;
            }

            data.push({ input, current, member: true });
          } else {
            num++;
            let input = num;
            data.push({ input, current: false, member: false });
          }
        }
      } else {
        let nextMonthNumber = 0;
        for (let j = 0; j <= 6; j++) {
          value++;
          let input = value;

          let current = input === currentDate;

          let member = true;

          if (`${input}`.length < 2) {
            input = `0${input}`;
          } else if (input > maxNumber) {
            nextMonthNumber++;
            member = false;
            input = `0${nextMonthNumber}`;
          }

          data.push({ input, current, member });
        }
      }
      dataArray.push(data);
    }

    return dataArray;
  };

  const moveNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }

    calenderRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 400,
      iterations: 1,
    });
  };

  const movePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
    calenderRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 400,
      iterations: 1,
    });
  };

  const checkCurrentDate = (current) => {
    return (
      current &&
      currentYear === new Date().getFullYear() &&
      currentMonth === new Date().getMonth() + 1
    );
  };

  return (
    <div className={styles['table-container']}>
      <span
        className={styles['prev-arrow-box']}
        title="Previous Month"
        onClick={movePreviousMonth}
      >
        <MdArrowBackIosNew className={styles['arrow-icon']} />
      </span>

      <div className={styles['table-box']}>
        <table className={styles.table} ref={calenderRef}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles['table-head']}>mon</th>
              <th className={styles['table-head']}>tue</th>
              <th className={styles['table-head']}>wed</th>
              <th className={styles['table-head']}>thu</th>
              <th className={styles['table-head']}>fri</th>
              <th className={styles['table-head']}>sat</th>
              <th className={styles['table-head']}>Sun</th>
            </tr>
          </thead>

          <tbody>
            {tableData(currentMonth, currentYear).map((data, index) => (
              <tr key={index}>
                {data.map(({ input, current, member }, index) => (
                  <td
                    key={index}
                    className={`${styles['table-data']} ${
                      member ? '' : styles['prev-month']
                    } ${
                      checkCurrentDate(current) ? styles['current-date'] : ''
                    }`}
                  >
                    <div className={styles['data-box']}>
                      <span>{input}</span>

                      {member && (
                        <div className={styles['priority-div']}>
                          <span className={`${styles['priority-box']} `}>
                            <FaCircle
                              className={`${styles['priority-icon']} ${styles['high-priority']}`}
                            />
                            1
                          </span>
                          <span className={`${styles['priority-box']}`}>
                            <FaCircle
                              className={`${styles['priority-icon']}  ${styles['mid-priority']} `}
                            />
                            2
                          </span>
                          <span className={`${styles['priority-box']}`}>
                            <FaCircle
                              className={`${styles['priority-icon']}  ${styles['low-priority']}`}
                            />
                            3
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <span
        className={styles['next-arrow-box']}
        title="Next Month"
        onClick={moveNextMonth}
      >
        <MdArrowForwardIos className={styles['arrow-icon']} />
      </span>
    </div>
  );
};

export default BigCalendar;
