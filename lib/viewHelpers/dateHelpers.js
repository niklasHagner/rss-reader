"use strict";

const moment = require("moment");

const weekDays = ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"];
const months = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

module.exports = {
  dateFormat,
  formattedDay,
  formattedTimeSpan,
  getRelativeDate,
  durationFormat
};

function dateFormat(time, format = "YYYY-MM-DD") {
  return moment(time || new Date()).format(format);
}

function formattedDay(date) {
  const weekDay = weekDays[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];

  return `${weekDay} ${day} ${month}`;
}

function formattedTimeSpan(startDate, endDate) {
  const fromHours = getHours(startDate);
  const toHours = getHours(endDate);
  return `kl. ${fromHours} - ${toHours}`;
}

function getHours(date) {
  const hours = date.getHours();
  return `0${hours}`.slice(-2);
}

function getRelativeDate(date) {
  const now = moment();
  date = moment(date);
  if (now.diff(date, "days") === 0) {
    return date.format("HH:mm");
  } else if (now.diff(date, "days") === 1) {
    return `Igår ${date.format("HH:mm")}`;
  } else {
    return date.format("YYYY-MM-DD HH:mm");
  }
}

function durationFormat(duration, format = "mm:ss") {
  const ms = moment.duration(duration).asMilliseconds();
  if (!ms) return null;

  return moment(ms).format(format);
}
