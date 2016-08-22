/**
 * patching date functions because original js sucks
 * @author kolpa (Kolya Opahle)
 */

/**
 * Checks if given year is a leap year
 * @param {int} year
 * @return {boolean}
 */

Date.isLeapYear = function(year) {
  return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};

/**
 * Returns the amount of days in the month of the year
 * @param {int} year
 * @param {int} month
 * @return {int}
 */

Date.getDaysInMonth = function(year, month) {
  return [
    31, (Date.isLeapYear(year) ? 29 : 28),
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ][month];
};

/**
 * Adds the leap year check to the Date prototype
 * @return {Date}
 */

Date.prototype.isLeapYear = function() {
  return Date.isLeapYear(this.getFullYear());
};

/**
 * Adds the day in month to the Date prototype
 * @return {Date}
 */

Date.prototype.getDaysInMonth = function() {
  return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

/**
 * Add months amount of months to the current date
 * @param {int} months
 * @return {Date}
 */

Date.prototype.addMonths = function(months) {
  var n = this.getDate();
  this.setDate(1);
  this.setMonth(this.getMonth() + months);
  this.setDate(Math.min(n, this.getDaysInMonth()));
  return this;
};

/**
 * Add years amount of years to the current date
 * @param {int} years
 * @return {Date}
 */

Date.prototype.addYears = function(years) {
  return this.addMonths(years * 12);
};
