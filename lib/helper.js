"use strict";

function getUniqueByValue(arr, prop) {
  const a = [], l = arr.length;
  for (let i = 0; i < l; i++) {
    for (let j = i + 1; j < l; j++) {
      if (arr[i][prop] === arr[j][prop]) j = ++i;
    }
    a.push(arr[i]);
  }
  return a;
}

function decodeHtml(str) {
  return str.replace(/&#([0-9]{1,3});/gi, (match, numStr) => {
    const num = parseInt(numStr, 10);
    return String.fromCharCode(num);
  });
}

//Fisher-Yates Algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = temp;
  }

  return array;
}

module.exports = {
  getUniqueByValue,
  shuffleArray,
  decodeHtml
};

