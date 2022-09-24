const severity = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

const { LOG_LEVEL = "4" } = process.env;

function normalizeSeverity(severity) {
  if (severity.length === 4) return severity + " ";
  return severity;
}

function log(severity, ...args) {
  const date = new Date();
  console.log(
    `[${date.toISOString()}] `,
    normalizeSeverity(severity),
    "--",
    ":",
    ...args
  );
}

exports.error = function error(...args) {
  if (Number(LOG_LEVEL) >= 2) log(severity.ERROR, ...args);
};

exports.warn = function warn(...args) {
  if (Number(LOG_LEVEL) >= 3) log(severity.WARN, ...args);
};

exports.info = function info(...args) {
  if (Number(LOG_LEVEL) >= 4) log(severity.INFO, ...args);
};

exports.debug = function debug(...args) {
  if (Number(LOG_LEVEL) >= 5) log(severity.DEBUG, ...args);
};
