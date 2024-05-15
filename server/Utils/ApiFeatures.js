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
  let labels = [];
  let lastLabel = 0;

  for (let i = 1; i <= days; i += 3) {
    lastLabel = i;
    labels.push(i);
  }

  if (lastLabel < days) {
    const diff = days - lastLabel;
    labels.push(lastLabel + diff);
  }

  return labels;
};

export class ApiFeatures {
  constructor(query, queryString, ...excludeArray) {
    this.query = query;
    this.queryString = queryString;
    this.excludeArray = excludeArray;
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

    this.query.find(queryOptions);
    return this;
  }
}

export class QueryFeatures {
  constructor(model, queryString) {
    this.model = model;
    this.queryString = queryString;
    this.graph = {};
  }

  complete() {
    // Checks for documents that are complete
    if (this.queryString.complete === 'true') {
      this.model = this.model.filter((doc) => doc.progress === 33);
    }

    return this;
  }

  getDate() {
    if (this.queryString.month && this.queryString.year) {
      let month = parseInt(this.queryString.month);
      let year = parseInt(this.queryString.year);

      if (isNaN(month) || isNaN(year)) return this;

      delete this.queryString.range;

      if (month === 0) {
        this.graph.labels = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'June',
          'July',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        this.graph.values = new Array(12).fill(0);

        this.model = this.model.filter((doc) => {
          if (doc.createdAt.getFullYear() === year) {
            const docMonth = doc.createdAt.getMonth();
            this.graph.values[docMonth] = this.graph.values[docMonth] + 1;
          }
          return doc.createdAt.getFullYear() === year;
        });
      } else {
        const days = maxDays(month, year);

        this.graph.labels = getLabels(month, days);

        this.graph.values = new Array(this.graph.labels.length).fill(0);

        // Filter model and seperates each doc by its day of creation
        this.model = this.model.filter((doc) => {
          const docMonth = doc.createdAt.getMonth() + 1;
          const docYear = doc.createdAt.getFullYear();
          const docDate = doc.createdAt.getDate();

          if (
            docYear === year &&
            docMonth === month &&
            this.graph.labels.includes(docDate)
          ) {
            const index = Math.ceil(docDate / 3) - 1;

            this.graph.values[index] = this.graph.values[index] + 1;
          }

          return docYear === year && docMonth === month;
        });
      }
    }
    return this;
  }

  getRange() {
    const allowedValues = ['1y', '1m', '1w', '1d'];

    if (allowedValues.includes(this.queryString.range)) {
      const range = this.queryString.range;

      switch (range) {
        case '1y':
          console.log(1);
          break;
      }
    }
    return this;
  }
}
