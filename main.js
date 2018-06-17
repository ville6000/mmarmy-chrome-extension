/**
 * Initialize functionality
 */
const init = () => {
  const rows = getRecordRows();

  if (!rows) {
    return;
  }
  const container = document.createElement("div");

  container.appendChild(createRecordBreakdownMarkup(recordBreakdown(rows)));

  container.appendChild(
    createRecordByOrganizationMarkup(recordByOrganization(rows))
  );

  container.appendChild(createNemesisListMarkup(nemesisList(rows)));

  container.appendChild(createStreaksMarkup(streaks(rows)));

  container.appendChild(createStyleBreakdownMarkup(styleBreakdown(rows)));

  const recordTable = document.querySelectorAll(".record");
  document.querySelector(".middle .b").insertBefore(container, recordTable[0]);
};

/**
 * Is current table row win or title win
 *
 * @param {Node} el Table row
 */
const isWin = el => {
  const tdClasses = el.querySelector("td:first-child").classList;
  return tdClasses.contains("win") || tdClasses.contains("winTitle");
};

/**
 * Get record rows from DOM
 */
const getRecordRows = () => {
  let recordTable = document.querySelectorAll(".record tr:not(:first-child)");

  return recordTable.length === 0 ? false : recordTable;
};

/**
 * Create record breakdown object
 *
 * @param {NodeList} rows List of table rows
 */
const recordBreakdown = rows => {
  const breakdown = {
    wins: {
      decision: 0,
      submission: 0,
      ko: 0
    },
    losses: {
      decision: 0,
      submission: 0,
      ko: 0
    }
  };

  rows.forEach((el, idx) => {
    const key = isWin(el) ? "wins" : "losses";
    const result = el.querySelectorAll("td").item(5).textContent;
    let resultKey = "ko";

    if (result.indexOf("Decision") >= 0) {
      resultKey = "decision";
    } else if (result.indexOf("Submission") >= 0) {
      resultKey = "submission";
    }

    breakdown[key][resultKey]++;
  });

  return breakdown;
};

/**
 * Create markup for record breakdown
 *
 * @param {object} breakdown
 */
const createRecordBreakdownMarkup = breakdown => {
  const container = document.createElement("div");

  const lossTitle = document.createElement("h4");
  lossTitle.textContent = "Losses";
  container.appendChild(lossTitle);

  const lossKo = document.createElement("div");
  lossKo.textContent = `KO: ${breakdown.losses.ko}`;
  container.appendChild(lossKo);

  const lossSubmission = document.createElement("div");
  lossSubmission.textContent = `Submission: ${breakdown.losses.submission}`;
  container.appendChild(lossSubmission);

  const lossDecision = document.createElement("div");
  lossDecision.textContent = `Decision: ${breakdown.losses.decision}`;
  container.appendChild(lossDecision);

  const winTitle = document.createElement("h4");
  winTitle.textContent = "Wins";
  container.appendChild(winTitle);

  const winKo = document.createElement("div");
  winKo.textContent = `KO: ${breakdown.wins.ko}`;
  container.appendChild(winKo);

  const winSubmission = document.createElement("div");
  winSubmission.textContent = `Submission: ${breakdown.wins.submission}`;
  container.appendChild(winSubmission);

  const winDecision = document.createElement("div");
  winDecision.textContent = `Decision: ${breakdown.wins.decision}`;
  container.appendChild(winDecision);

  return container;
};

/**
 * Create record by organization object
 *
 * @param {NodeList} rows List of table rows
 */
const recordByOrganization = rows => {
  const record = [];

  rows.forEach((el, idx) => {
    const key = isWin(el) ? "wins" : "losses";
    const organization = el.querySelectorAll("td").item(7).textContent;

    if (typeof record[organization] === "undefined") {
      record[organization] = {
        wins: 0,
        losses: 0
      };
    }

    record[organization][key]++;
  });

  return record;
};

/**
 * Create markup for record by organization
 *
 * @param {object} record
 */
const createRecordByOrganizationMarkup = record => {
  const container = document.createElement("div");
  const title = document.createElement("h4");
  title.textContent = "Record by Organization";
  container.appendChild(title);

  Object.keys(record).forEach(key => {
    let item = document.createElement("div");
    item.textContent = `${key}: ${record[key].wins} - ${record[key].losses}`;

    container.appendChild(item);
  });

  return container;
};

/**
 * Create nemesis list.
 *
 * @param {NodeList} rows List of table rows
 */
const nemesisList = rows => {
  const record = [];

  rows.forEach(el => {
    const key = isWin(el) ? "wins" : "losses";
    const opponent = el.querySelector("td a").textContent;

    if (typeof record[opponent] === "undefined") {
      record[opponent] = {
        wins: 0,
        losses: 0
      };
    }

    record[opponent][key]++;
  });

  const approved = [];
  Object.keys(record).forEach(key => {
    if (record[key].wins + record[key].losses >= 3) {
      approved[key] = record[key];
    }
  });

  return approved;
};

/**
 * Create nemesis list markup.
 *
 * @param {object} nemesisList
 */
const createNemesisListMarkup = nemesisList => {
  const container = document.createElement("div");

  if (Object.keys(nemesisList).length === 0) {
    return container;
  }

  const title = document.createElement("h4");
  title.textContent = "Nemesis list";
  container.appendChild(title);

  Object.keys(nemesisList).forEach(key => {
    let item = document.createElement("div");
    item.textContent = `${key}: ${nemesisList[key].wins} - ${
      nemesisList[key].losses
    }`;

    container.appendChild(item);
  });

  return container;
};

/**
 * Calculate streaks object
 *
 * @param {NodeList} rows List of table rows
 */
const streaks = rows => {
  const record = {
    wins: 0,
    losses: 0
  };

  let lastResult = false;
  let currentStreak = 0;

  rows.forEach(el => {
    let key = isWin(el) ? "wins" : "losses";
    currentStreak = lastResult === key ? currentStreak + 1 : 1;
    lastResult = key;

    if (record[key] < currentStreak) {
      record[key] = currentStreak;
    }
  });

  return record;
};

/**
 * Create streaks markup
 *
 * @params {object} Streaks object containing keys for wins and losses
 */
const createStreaksMarkup = streaks => {
  const container = document.createElement("div");
  const title = document.createElement("h4");
  title.textContent = "Streaks";
  container.appendChild(title);

  Object.keys(streaks).forEach(key => {
    let item = document.createElement("div");
    item.textContent = `${key}: ${streaks[key]}`;
    container.appendChild(item);
  });

  return container;
};

/**
 * Calculate style breakdown
 *
 * @param {NodeList} rows List of table rows
 */
const styleBreakdown = rows => {
  const styles = {};

  rows.forEach(el => {
    const style = el.querySelectorAll("td").item(1).textContent;
    const opponentStyle = el.querySelectorAll("td").item(3).textContent;

    if (typeof styles[style] === "undefined") {
      styles[style] = {};
    }

    if (typeof styles[style][opponentStyle] === "undefined") {
      styles[style][opponentStyle] = {
        wins: 0,
        losses: 0
      };
    }

    styles[style][opponentStyle][isWin(el) ? "wins" : "losses"]++;
  });

  return styles;
};

/**
 * Create style breakdown markup
 *
 * @param {object} styles
 */
const createStyleBreakdownMarkup = styles => {
  const container = document.createElement("div");
  const title = document.createElement("h4");
  title.textContent = "Style Breakdown";
  container.appendChild(title);

  const table = document.createElement("table");

  Object.keys(styles).forEach(styleKey => {
    Object.keys(styles[styleKey]).forEach(opponenStyleKey => {
      let row = document.createElement("tr");

      let cell = document.createElement("td");
      cell.textContent = styleKey;
      row.appendChild(cell);

      cell = document.createElement("td");
      cell.textContent = " - ";
      row.appendChild(cell);

      cell = document.createElement("td");
      cell.textContent = opponenStyleKey;
      row.appendChild(cell);

      cell = document.createElement("td");
      cell.textContent = styles[styleKey][opponenStyleKey]["wins"];
      row.appendChild(cell);

      cell = document.createElement("td");
      cell.textContent = " - ";
      row.appendChild(cell);

      cell = document.createElement("td");
      cell.textContent = styles[styleKey][opponenStyleKey]["losses"];
      row.appendChild(cell);

      table.appendChild(row);
    });
  });

  container.appendChild(table);

  return container;
};

init();
