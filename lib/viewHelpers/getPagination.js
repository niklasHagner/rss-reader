"use strict";

module.exports = function getPagination(currentPage) {
  currentPage = Number(currentPage);
  const returnValue = {
    showNext: currentPage <= 10,
    nextPage: currentPage + 1,
    showPrev: currentPage > 1,
    prevPage: currentPage - 1,
    pageNumber: currentPage
  };

  return returnValue;
};
