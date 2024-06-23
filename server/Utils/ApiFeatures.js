const maxDays = (month, year) => {
  const arr30 = [4, 6, 9, 11];
  let days = 0;

  if (month === 2) {
    if (year % 4 === 0) {
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

const getLabels = (month, days) => {
  const dataLabels = {
    labelsText: [],
    labelsNum: [],
  };

  const monthLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  let lastLabel = 0;

  for (let i = 1; i <= days; i += 3) {
    lastLabel = i;
    dataLabels.labelsNum.push(i);
    dataLabels.labelsText.push(`${monthLabels[month - 1]} ${i}`);
  }

  if (lastLabel < days) {
    const diff = days - lastLabel;
    dataLabels.labelsNum.push(lastLabel + diff);
    dataLabels.labelsText.push(`${monthLabels[month - 1]} ${lastLabel + diff}`);
  }

  return dataLabels;
};

const getRangeLabels = (type, year, month, date, hour, view) => {
  const dataLabels = {
    labelsText: [],
    labelsNum: [],
  };

  const monthLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  switch (type) {
    case 'y':
      for (let i = month; dataLabels.labelsText.length < 13; i++) {
        if (!monthLabels[i]) {
          i = -1;
        } else {
          dataLabels.labelsText.push(monthLabels[i]);
        }
      }

      break;

    case 'm':
      const daysDiff = maxDays(month, year);
      const dataLength = Math.ceil(daysDiff / 3) + 1;
      month--;

      for (let i = date; dataLabels.labelsNum.length < dataLength; i += 3) {
        if (i > daysDiff) {
          i = i - daysDiff - 3;
          month++;
        } else {
          if (month === 12) {
            month = 0;
          }
          dataLabels.labelsText.push(`${monthLabels[month]} ${i}`);

          dataLabels.labelsNum.push(i);
        }
      }

      dataLabels.labelsNum[dataLabels.labelsNum.length - 1] = date;
      dataLabels.labelsText[
        dataLabels.labelsText.length - 1
      ] = `${monthLabels[month]} ${date}`;

      if (view === 1 || view === 2) {
        const dateIndex = dataLabels.labelsText.findIndex((text) => {
          const num = parseInt(text.replace(monthLabels[month], ''));
          return text.startsWith(monthLabels[month]) && num > date - view;
        });

        if (dateIndex) {
          dataLabels.labelsNum.splice(dateIndex);
          dataLabels.labelsText.splice(dateIndex);

          if (
            dataLabels.labelsNum[dataLabels.labelsNum.length - 1] !==
            date - view
          ) {
            dataLabels.labelsNum.push(date - view);
            dataLabels.labelsText.push(`${monthLabels[month]} ${date - view}`);
          }
        }
      }

      break;

    case 'w':
      const days = maxDays(month, year);
      month--;

      for (let i = date; dataLabels.labelsNum.length < 8; i++) {
        if (i > days) {
          i = 0;
          month++;
        } else {
          if (month === 12) {
            month = 0;
          }

          dataLabels.labelsText.push(`${monthLabels[month]} ${i}`);

          dataLabels.labelsNum.push(i);
        }
      }

      break;

    case 'd':
      for (let i = hour; dataLabels.labelsNum.length < 13; i += 2) {
        if (i > 23) {
          i = i - 26;
        } else {
          const txt =
            i === 0
              ? '12 AM'
              : i === 12
              ? '12 PM'
              : i > 12
              ? `${i - 12} PM`
              : `${i} AM`;

          dataLabels.labelsNum.push(i);
          dataLabels.labelsText.push(`${txt}`);
        }
      }

      if (view === 1) {
        const lastNum =
          dataLabels.labelsNum[dataLabels.labelsNum.length - 1] - 1;

        dataLabels.labelsNum[dataLabels.labelsNum.length - 1] = lastNum;

        const txt =
          lastNum === 0
            ? '12 AM'
            : lastNum === 12
            ? '12 PM'
            : lastNum > 12
            ? `${lastNum - 12} PM`
            : `${lastNum} AM`;

        dataLabels.labelsText[dataLabels.labelsText.length - 1] = txt;
      }
  }

  return dataLabels;
};

export class ApiFeatures {
  constructor(collection, query, queryString, ...excludeArray) {
    this.collection = collection;
    this.query = query;
    this.queryString = queryString;
    this.excludeArray = [
      ...excludeArray,
      'sort',
      'fields',
      'page',
      'limit',
      'filter',
      'calendar',
      'category',
    ];
  }

  filter() {
    const queryObj = { ...this.queryString };

    this.excludeArray &&
      this.excludeArray.forEach((field) => delete queryObj[field]);

    let queryOptions = JSON.parse(
      JSON.stringify(queryObj).replace(
        /\b(gte|lte|lt|gt)\b/g,
        (field) => `$${field}`
      )
    );

    // Filters model based on the value of the request query and collection
    if (this.collection === 'tasks') {
      if (this.queryString.filter) {
        this.query.filterTasks(this.queryString.filter);
        this.query
          .find(queryOptions)
          .populate({
            path: 'project',
            select: 'name details',
            populate: {
              path: 'team',
              select: 'photo username firstName lastName',
            },
          })
          .populate({
            path: 'leader',
            select: 'username firstName lastName photo',
          });
      } else if (this.queryString.calendar) {
        const { year, month, day } = this.queryString;
        this.query.scheduledTasks(year, month, day);
        this.query
          .find(queryOptions)
          .populate({
            path: 'leader user',
            select: 'username firstName lastName photo',
          })
          .populate({
            path: 'project',
            select: 'name',
          });
      }
    } else if (this.collection === 'projects') {
      this.query.find(queryOptions).populate({
        path: 'team',
        select: 'username firstName lastName photo',
      });

      this.query.filterByCategory(this.queryString.category);
    } else {
      this.query.find(queryOptions);
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    if (this.queryString.page || this.queryString.limit) {
      const page = this.queryString.page || 1;
      const limit = this.queryString.limit || 30;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
    }

    return this;
  }
}

export class QueryFeatures {
  constructor(model, queryString, type, date) {
    this.model = model;
    this.queryString = queryString;
    this.graph = {};
    this.type = type;
    this.date = date;
  }

  condition(doc) {
    if (this.type === 'tasks') {
      return doc.status === 'complete';
    } else {
      return doc.progress === 100;
    }
  }

  getDate() {
    if (
      this.queryString.month &&
      this.queryString.year &&
      this.queryString.day
    ) {
      let month = parseInt(this.queryString.month);
      let year = parseInt(this.queryString.year);
      let day = parseInt(this.queryString.day);

      if (isNaN(month) || isNaN(year) || isNaN(day)) return this;

      delete this.queryString.range;

      if (month === 0 && day === 0) {
        this.graph.labels = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        this.graph.values = {
          created: new Array(12).fill(0),
          completed: new Array(12).fill(0),
        };

        // Filter model and seperates each doc by date value
        this.model = this.model.filter((doc) => {
          if (doc[this.date]) {
            if (doc[this.date].getFullYear() === year) {
              const docMonth = doc[this.date].getMonth();

              // stats for completed status
              if (this.condition(doc)) {
                this.graph.values.completed[docMonth] =
                  this.graph.values.completed[docMonth] + 1;
              }

              // stats for all status
              this.graph.values.created[docMonth] =
                this.graph.values.created[docMonth] + 1;
            }
            return doc[this.date].getFullYear() === year;
          } else {
            return false;
          }
        });
      } else if (day === 0) {
        const days = maxDays(month, year);

        this.graph.labels = getLabels(month, days);

        this.graph.values = {
          created: new Array(this.graph.labels.labelsNum.length).fill(0),
          completed: new Array(this.graph.labels.labelsNum.length).fill(0),
        };

        // Filter model and seperates each doc by the date value
        this.model = this.model.filter((doc) => {
          if (doc[this.date]) {
            const docMonth = doc[this.date].getMonth() + 1;
            const docYear = doc[this.date].getFullYear();
            const docDate = doc[this.date].getDate();

            if (
              docYear === year &&
              docMonth === month &&
              this.graph.labels.labelsNum.includes(docDate)
            ) {
              const index = Math.ceil(docDate / 3) - 1;

              // stats for completed status
              if (this.condition(doc)) {
                this.graph.values.completed[index] =
                  this.graph.values.completed[index] + 1;
              }

              // stats for all status
              this.graph.values.created[index] =
                this.graph.values.created[index] + 1;
            }

            return docYear === year && docMonth === month;
          } else {
            return false;
          }
        });
      } else {
        this.graph.labels = [];

        this.graph.values = {
          created: new Array(12).fill(0),
          completed: new Array(12).fill(0),
        };

        // Filter model and seperates each doc by its time of creation
        this.model = this.model.filter((doc) => {
          if (doc[this.date]) {
            const docMonth = doc[this.date].getMonth() + 1;
            const docYear = doc[this.date].getFullYear();
            const docDate = doc[this.date].getDate();
            const docHour = doc[this.date].getHours();

            if (
              docYear === year &&
              docMonth === month &&
              docDate === day &&
              docHour % 2 === 0
            ) {
              const index = docHour / 2;

              // stats for completed status
              if (this.condition(doc)) {
                this.graph.values.completed[index] =
                  this.graph.values.completed[index] + 1;
              }

              // stats for all status
              this.graph.values.created[index] =
                this.graph.values.created[index] + 1;
            }

            return docYear === year && docMonth === month && docDate === day;
          } else {
            return false;
          }
        });
      }
    }
    return this;
  }

  getRange() {
    if (this.queryString.range) {
      const range = this.queryString.range;
      const view = parseInt(this.queryString.view) || 0;
      const allowedValues = ['1y', '1m', '1w', '1d'];

      if (allowedValues.includes(this.queryString.range)) {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        let currentDate = new Date().getDate();
        const currentHour = new Date().getHours() + view;
        const current = new Date(
          `${currentYear}-${currentMonth + 1}-${currentDate}`
        );

        let previousYear, previousDate, days;

        switch (range) {
          case '1y':
            previousDate = new Date(`${currentYear - 1}-${currentMonth + 1}`);

            this.graph.labels = getRangeLabels('y', currentYear, currentMonth);
            this.graph.values = {
              created: new Array(13).fill(0),
              completed: new Array(13).fill(0),
            };

            this.model = this.model.filter((doc) => {
              const docYear = doc.createdAt.getFullYear();
              const docMonth = doc.createdAt.getMonth();

              if (
                doc.createdAt >= previousDate &&
                doc.createdAt <= new Date()
              ) {
                let index;

                if (docYear < currentYear) {
                  index = docMonth - currentMonth;
                } else {
                  index = docMonth + (12 - currentMonth);
                }

                // stats for completed status
                if (this.condition(doc)) {
                  this.graph.values.completed[index] =
                    this.graph.values.completed[index] + 1;
                }

                // stats for all status
                this.graph.values.created[index] =
                  this.graph.values.created[index] + 1;
              }
              return (
                doc.createdAt >= previousDate && doc.createdAt <= new Date()
              );
            });

            break;

          case '1m':
            currentDate = currentDate + view;

            // check if current month is january
            if (currentMonth === 0) {
              previousYear = currentYear - 1;
              previousDate = new Date(`${previousYear}-012-${currentDate}`);
              days = 31;
              this.graph.labels = getRangeLabels(
                'm',
                previousYear,
                12,
                currentDate,
                null,
                view
              );
            } else {
              previousDate = new Date(
                `${currentYear}-${currentMonth}-${currentDate}`
              );
              days = maxDays(currentMonth, currentYear);
              this.graph.labels = getRangeLabels(
                'm',
                currentYear,
                currentMonth,
                currentDate,
                null,
                view
              );
            }

            this.graph.values = {
              created: new Array(this.graph.labels.labelsNum.length).fill(0),
              completed: new Array(this.graph.labels.labelsNum.length).fill(0),
            };

            this.model = this.model.filter((doc) => {
              const docYear = doc.createdAt.getFullYear();
              const docMonth = doc.createdAt.getMonth();
              const docDate = doc.createdAt.getDate();

              if (
                doc.createdAt >= previousDate &&
                doc.createdAt <= new Date() &&
                this.graph.labels.labelsNum.includes(docDate)
              ) {
                let index;

                // check if current month is january
                if (currentMonth === 0) {
                  if (docYear < currentYear) {
                    index = (docDate - currentDate) / 3;
                  } else {
                    index = Math.ceil((docDate + (days - currentDate)) / 3);
                  }
                } else {
                  if (docMonth < currentMonth) {
                    index = (docDate - currentDate) / 3;
                  } else {
                    index = Math.ceil((docDate + (days - currentDate)) / 3);
                  }
                }

                // stats for completed status
                if (this.condition(doc)) {
                  this.graph.values.completed[index] =
                    this.graph.values.completed[index] + 1;
                }

                // stats for all status
                this.graph.values.created[index] =
                  this.graph.values.created[index] + 1;
              }

              return (
                doc.createdAt >= previousDate && doc.createdAt <= new Date()
              );
            });

            break;

          case '1w':
            if (currentDate < 8) {
              if (currentMonth === 0) {
                previousYear = currentYear - 1;

                previousDate = new Date(
                  `${previousYear}-012-${31 - (7 - currentDate)}`
                );
                this.graph.labels = getRangeLabels(
                  'w',
                  previousYear,
                  12,
                  31 - (7 - currentDate)
                );
              } else {
                previousDate = new Date(
                  `${currentYear}-${currentMonth}-${
                    maxDays(currentMonth, currentYear) - (7 - currentDate)
                  }`
                );

                this.graph.labels = getRangeLabels(
                  'w',
                  currentYear,
                  currentMonth,
                  maxDays(currentMonth, currentYear) - (7 - currentDate)
                );
              }
            } else {
              previousDate = new Date(
                `${currentYear}-${currentMonth + 1}-${currentDate - 7}`
              );

              this.graph.labels = getRangeLabels(
                'w',
                currentYear,
                currentMonth + 1,
                currentDate - 7
              );
            }

            this.graph.values = {
              created: new Array(8).fill(0),
              completed: new Array(8).fill(0),
            };

            this.model = this.model.filter((doc) => {
              const docYear = doc.createdAt.getFullYear();
              const docMonth = doc.createdAt.getMonth();
              const docDate = doc.createdAt.getDate();

              if (
                doc.createdAt >= previousDate &&
                doc.createdAt <= new Date()
              ) {
                let index;

                if (currentDate < 8) {
                  if (currentMonth === 0) {
                    if (docYear < currentYear) {
                      index = docDate - 31 + (7 - currentDate);
                    } else {
                      index = docDate + (7 - currentDate);
                    }
                  } else {
                    if (docMonth < currentMonth) {
                      index =
                        docDate -
                        maxDays(docMonth + 1, currentYear) +
                        (7 - currentDate);
                    } else {
                      index = docDate + (7 - currentDate);
                    }
                  }
                } else {
                  index = 7 - (currentDate - docDate);
                }

                // stats for completed status
                if (this.condition(doc)) {
                  this.graph.values.completed[index] =
                    this.graph.values.completed[index] + 1;
                }

                // stats for all status
                this.graph.values.created[index] =
                  this.graph.values.created[index] + 1;
              }

              return (
                doc.createdAt >= previousDate && doc.createdAt <= new Date()
              );
            });

            break;

          case '1d':
            previousDate = new Date();
            previousDate.setDate(currentDate - 1);
            previousDate.setHours(currentHour);
            previousDate.setMinutes(0);
            previousDate.setSeconds(0);
            previousDate.setMilliseconds(0);

            this.graph.labels = getRangeLabels(
              'd',
              null,
              null,
              null,
              currentHour,
              view
            );

            this.graph.values = {
              created: new Array(13).fill(0),
              completed: new Array(13).fill(0),
            };

            this.model = this.model.filter((doc) => {
              const docHour = doc.createdAt.getHours();

              if (
                doc.createdAt >= previousDate &&
                doc.createdAt <= new Date() &&
                this.graph.labels.labelsNum.includes(docHour)
              ) {
                let index;

                if (doc.createdAt < current) {
                  index = (docHour - currentHour) / 2;
                } else {
                  index = 12 - (currentHour - docHour) / 2;
                }

                // stats for completed status
                if (this.condition(doc)) {
                  this.graph.values.completed[index] =
                    this.graph.values.completed[index] + 1;
                }

                // stats for all status
                this.graph.values.created[index] =
                  this.graph.values.created[index] + 1;
              }

              return (
                doc.createdAt >= previousDate && doc.createdAt <= new Date()
              );
            });
        }
      }
    }
    return this;
  }
}
