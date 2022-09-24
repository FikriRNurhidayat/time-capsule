const { typeIs } = require("../lib");
const { TYPE_STRING } = require("../consts");

class SortManager {
  constructor(whitelistedSortMap = new Map()) {
    this.whitelistedSortMap = whitelistedSortMap;
  }

  // Pass req.query.sort
  parse = (sort = "") => {
    if (!typeIs(sort, TYPE_STRING)) throw errors.INTERNAL_SERVER_ERROR;

    // Remove all whitespaces
    sort = sort.replace(/\s/g, "");
    return sort.split(",").reduce((out, sortStr) => {
      const isDescending = sortStr.startsWith("-");
      const params = isDescending ? sortStr.substring(1) : sortStr;
      const key = this.whitelistedSortMap.get(params);
      if (!!key) out.push([key, isDescending ? "DESC" : "ASC"]);

      return out;
    }, []);
  };
}

module.exports = SortManager;
