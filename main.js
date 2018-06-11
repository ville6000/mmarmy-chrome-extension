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

  const recordTable = document.querySelectorAll(".record");

  document.querySelector(".middle .b").insertBefore(container, recordTable[0]);
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

init();
