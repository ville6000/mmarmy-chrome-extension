/**
 * Initialize functionality
 */
const init = () => {
  const rows = getRecordRows();

  if (!rows) {
    return;
  }
  const container = document.createElement("div");

  const breakdown = recordBreakdown(rows);
  container.appendChild(createRecordBreakdownMarkup(breakdown));

  container.appendChild(
    createRecordByOrganizationMarkup(recordByOrganization(rows))
  );

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

  if (recordTable.length === 0) {
    return false;
  }

  return recordTable;
};

/**
 * Create record breakdown object
 *
 * @param {NodeList} rows List of table rows
 */
const recordBreakdown = rows => {
  const breakdown = [];

  rows.forEach((el, idx) => {
    const tdClasses = el.querySelector("td:first-child").classList;
    const key =
      tdClasses.contains("win") || tdClasses.contains("winTitle")
        ? "wins"
        : "losses";

    const result = el.querySelectorAll("td").item(5).textContent;
    let resultKey = "ko";

    if (result.indexOf("Decision") >= 0) {
      resultKey = "decision";
    } else if (result.indexOf("Submission") >= 0) {
      resultKey = "submission";
    }

    if (typeof breakdown[key] === "undefined") {
      breakdown[key] = {
        decision: 0,
        submission: 0,
        ko: 0
      };
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

init();
