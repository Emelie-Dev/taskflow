import React from 'react';
import styles from '../styles/Calendar.module.css';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

const Calendar = ({
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
  calenderRef,
}) => {
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

  const tableData = (currentMonth, currentYear) => {
    const currentDate = new Date().getDate();
    const currentDay = new Date(`${currentYear}-${currentMonth}-1`).getDay();

    let dataArray = [];

    let value = 0;

    for (let i = 0; i <= 5; i++) {
      let data = [];
      if (i === 0) {
        for (let j = 0; j <= 6; j++) {
          if (currentDay === 0) {
            value = 1;
            let input = value;

            let current = input === currentDate;

            if (`${input}`.length < 2) {
              input = `0${input}`;
            }

            if (j === 6) {
              data.push({ input, current });
            } else {
              data.push({ input: '', current: false });
            }
          } else if (j >= currentDay - 1) {
            value++;
            let input = value;

            let current = input === currentDate;

            if (`${input}`.length < 2) {
              input = `0${input}`;
            }

            data.push({ input, current });
          } else {
            data.push({ input: '', current: false });
          }
        }
      } else {
        for (let j = 0; j <= 6; j++) {
          value++;
          let input = value;

          let current = input === currentDate;

          if (`${input}`.length < 2) {
            input = `0${input}`;
          } else if (input > 31) {
            input = '';
          }

          data.push({ input, current });
        }
      }
      dataArray.push(data);
    }

    return dataArray;
  };

  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const displayMonth =
    new Date().getMonth() === currentMonth - 1 &&
    new Date().getFullYear() === currentYear;

  const checkCurrentDate = (current) => {
    return (
      current &&
      currentYear === new Date().getFullYear() &&
      currentMonth === new Date().getMonth() + 1
    );
  };

  return (
    <div className={styles['calender-div']}>
      <h1
        className={`${styles['current-month']} ${
          displayMonth ? styles['hide-month'] : ''
        }`}
      >
        {month[currentMonth - 1]} {currentYear}{' '}
      </h1>

      <div className={styles['calendar-box']}>
        <IoIosArrowBack
          className={styles['calendar-back-arrow']}
          onClick={movePreviousMonth}
        />
        <table className={styles['calendar-table']} ref={calenderRef}>
          <thead>
            <tr className={styles['calendar-row']}>
              <th className={styles['calendar-head']}>Mon</th>
              <th className={styles['calendar-head']}>Tue</th>
              <th className={styles['calendar-head']}>Wed</th>
              <th className={styles['calendar-head']}>Thu</th>
              <th className={styles['calendar-head']}>Fri</th>
              <th className={styles['calendar-head']}>Sat</th>
              <th className={styles['calendar-head']}>Sun</th>
            </tr>
          </thead>

          <tbody>
            {tableData(currentMonth, currentYear).map((data, index) => {
              return (
                <tr key={index}>
                  {data.map(({ input, current }, index) => {
                    return (
                      <td
                        key={index}
                        className={`${styles['calendar-data']} ${
                          checkCurrentDate(current)
                            ? styles['current-date']
                            : ''
                        }`}
                      >
                        {input}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <IoIosArrowForward
          className={styles['calendar-front-arrow']}
          onClick={moveNextMonth}
        />
      </div>
    </div>
  );
};

export default Calendar;
