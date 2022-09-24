class PaginationManager {
  constructor({ defaultPageSize = 10 }) {
    this.defaultPageSize = defaultPageSize;
  }

  createPaginationObject({ pageNumber = 1, pageSize = 10 }) {
    // Normalize Page Parameter
    if (pageNumber <= 0) pageNumber = 1;
    if (pageSize <= 0) pageSize = 10;

    return {
      pageNumber,
      pageSize,
    };
  }

  convertToOffsetBased({ pageNumber = 1, pageSize = 10 }) {
    // Normalize Page Parameter
    if (pageNumber <= 0) pageNumber = 1;
    if (pageSize <= 0) pageSize = 10;

    const limit = pageSize;
    const offset = (pageNumber - 1) * pageSize;

    return {
      limit,
      offset,
    };
  }

  createMetaPaginationObject({ pageNumber = 1, pageSize = 10, size = 0 }) {
    // Normalize Page Parameter
    pageNumber = Number(pageNumber);
    if (pageNumber <= 0 || Number.isNaN(pageNumber)) pageNumber = 1;

    pageSize = Number(pageSize);
    if (pageSize <= 0 || Number.isNaN(pageSize)) pageSize = 10;

    const pageCount = Math.ceil(size / pageSize);

    return {
      pageNumber,
      pageSize,
      pageCount,
      size,
    };
  }
}

module.exports = PaginationManager;
