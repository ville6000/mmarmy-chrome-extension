/**
 * Initialize functionality
 */
const init = () => {
  const rows = getRecordRows();

  if (!rows) {
    return;
  }
  const container = document.createElement("div");
  container.style =
    "display: flex;flex-wrap: wrap;justify-content:  space-between;";

  container.appendChild(createRecordBreakdownMarkup(recordBreakdown(rows)));

  container.appendChild(
    createRecordByOrganizationMarkup(recordByOrganization(rows))
  );

  container.appendChild(createNemesisListMarkup(nemesisList(rows)));

  container.appendChild(createStreaksMarkup(streaks(rows)));

  container.appendChild(createTitleFightStats(titleFightStats(rows)));

  container.appendChild(createStyleBreakdownMarkup(styleBreakdown(rows)));

  const recordTable = document.querySelectorAll(".record");
  document.querySelector(".middle .b").insertBefore(container, recordTable[0]);
};

/**
 * Create Fight object
 *
 * @param {Node} el Table row
 */
const Fight = function(el) {
  const getFightClass = () => {
    return el.querySelector("td:first-child").classList;
  };

  const isWin = () => {
    const tdClasses = getFightClass();
    return tdClasses.contains("win") || tdClasses.contains("winTitle");
  };

  const isTitleFight = () => {
    const tdClasses = getFightClass();
    return tdClasses.contains("lossTitle") || tdClasses.contains("winTitle");
  };

  const getResultType = () => {
    return getCellText(6);
  };

  const getOrganization = () => {
    return getCellText(8);
  };

  const getStyle = () => {
    return getCellText(1);
  };

  const getOpponentName = () => {
    return el.querySelector("td a").textContent;
  };

  const getOpponentStyle = () => {
    return getCellText(4);
  };

  const getOpponentUrl = () => {
    return el.querySelector("td a").href;
  };

  const getCellText = idx => {
    return el.querySelectorAll("td").item(idx).textContent;
  };

  return {
    isWin: isWin,
    isTitleFight: isTitleFight,
    getResultType: getResultType,
    getOrganization: getOrganization,
    getStyle: getStyle,
    getOpponentName: getOpponentName,
    getOpponentStyle: getOpponentStyle,
    getOpponentUrl: getOpponentUrl
  };
};

/**
 * Create array of Fight objects from results table
 */
const getRecordRows = () => {
  let recordTable = document.querySelectorAll(".record tr:not(:first-child)");

  if (recordTable.length === 0) {
    return false;
  }

  const FightCollection = [];
  recordTable.forEach(tr => {
    FightCollection.push(new Fight(tr));
  });

  return FightCollection;
};

/**
 * Create record breakdown object
 *
 * @param {Array} fights Array of Fight instances
 */
const recordBreakdown = fights => {
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

  fights.forEach(fight => {
    const key = fight.isWin() ? "wins" : "losses";
    const result = fight.getResultType();
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
  container.style = "padding: 10px;";

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
 * @param {Array} fights Array of Fight objects
 */
const recordByOrganization = fights => {
  const record = [];

  fights.forEach(fight => {
    const key = fight.isWin() ? "wins" : "losses";
    const organization = fight.getOrganization();

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
  container.style = "padding: 10px;";

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
 * @param {Array} fights Array of Fight objects
 */
const nemesisList = fights => {
  const record = [];

  fights.forEach(fight => {
    const key = fight.isWin() ? "wins" : "losses";
    const opponent = fight.getOpponentName();
    const opponentUrl = fight.getOpponentUrl();

    if (typeof record[opponent] === "undefined") {
      record[opponent] = {
        wins: 0,
        losses: 0,
        url: opponentUrl
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
  container.style = "padding: 10px;";

  if (Object.keys(nemesisList).length === 0) {
    return container;
  }

  const title = document.createElement("h4");
  title.textContent = "Nemesis list";
  container.appendChild(title);

  Object.keys(nemesisList).forEach(key => {
    let item = document.createElement("div");

    const opponentLink = document.createElement("a");
    opponentLink.href = nemesisList[key].url;
    opponentLink.textContent = key;
    item.appendChild(opponentLink);

    const stats = document.createElement("span");
    stats.textContent = `: ${nemesisList[key].wins} - ${
      nemesisList[key].losses
    }`;
    item.appendChild(stats);

    container.appendChild(item);
  });

  return container;
};

/**
 * Calculate streaks object
 *
 * @param {Array} fights Array of Fight objects
 */
const streaks = fights => {
  const record = {
    wins: 0,
    losses: 0
  };

  let lastResult = false;
  let currentStreak = 0;

  fights.forEach(fight => {
    let key = fight.isWin() ? "wins" : "losses";
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
  container.style = "padding: 10px;";

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
 * @param {Array} fights Array of Fight objects
 */
const styleBreakdown = fights => {
  const styles = {};

  fights.forEach(fight => {
    const style = fight.getStyle();
    const opponentStyle = fight.getOpponentStyle();

    if (typeof styles[style] === "undefined") {
      styles[style] = {};
    }

    if (typeof styles[style][opponentStyle] === "undefined") {
      styles[style][opponentStyle] = {
        wins: 0,
        losses: 0
      };
    }

    styles[style][opponentStyle][fight.isWin() ? "wins" : "losses"]++;
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
  container.style = "padding: 10px;";

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

/**
 * Create title fights object
 *
 * @param {Array} fights Array of Fight objects
 */
const titleFightStats = fights => {
  const titleFights = {
    wins: 0,
    losses: 0
  };

  fights.forEach(fight => {
    if (fight.isTitleFight()) {
      const key = fight.isWin() ? "wins" : "losses";
      titleFights[key]++;
    }
  });

  return titleFights;
};

/**
 * Create title fights markup
 *
 * @param {object} titleFights
 */
const createTitleFightStats = titleFights => {
  const container = document.createElement("div");
  container.style = "padding: 10px;";

  const title = document.createElement("h4");
  title.textContent = "Title Fights";
  container.appendChild(title);

  Object.keys(titleFights).forEach(key => {
    let item = document.createElement("div");
    item.textContent = `${key}: ${titleFights[key]}`;
    container.appendChild(item);
  });

  return container;
};

init();
