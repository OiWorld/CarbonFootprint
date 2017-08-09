var CarbonFootprintCommon = function() {
  this.treeGrowthPerYear = 8.3; // Check EstimationSources/toronto-university-CO2-sequested-by-tree
};

/**
 * computes trees that would be required to curb footprints
 * @param {number} carbonFootprint
 * @return {number} trees
 */

CarbonFootprintCommon.prototype.computeTrees = function(carbonFootprint) {
    var trees = carbonFootprint / this.treeGrowthPerYear;
    trees = Math.round(trees * 100) / 100;
    console.log('Trees: ' + trees);
    return trees;
};

/**
 * return an appropriate message based on trees required
 * @param {number} trees
 * @return {string}
 */

CarbonFootprintCommon.prototype.treesToString = function(trees) {
  if (trees > 1) {
    return 'You will need ' + Math.round(trees) +
      ' tropical trees growing for 1 year to capture that much CO₂!' +
      ' (or ' + Math.round(trees * 12) +
      ' trees growing for 1 month, or ' + Math.round(trees * 365) +
      ' trees growing for 1 day)';
  } else if (trees * 12 > 1) {
    return 'You will need ' + Math.round(trees * 12) +
      ' tropical trees growing for 1 month to capture that much CO₂!' +
      ' (or ' + Math.round(trees * 365) +
      ' trees growing for 1 day)';
  } else if (trees * 365 > 1) {
    return 'You will need ' + Math.round(trees * 365) +
      ' tropical trees growing for 1 day to capture that much CO₂!';
  } else {
    return 'Your Carbon Emission is almost nil. Great going!';
  }
};

/**
 * return question mark svg
 * @return {string}
 */

CarbonFootprintCommon.prototype.getSVG = function(){
  return '<svg id="quest_mark_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 92"><path d="M45.4 0C20 0.3-0.3 21.2 0 46.6c0.3 25.4 21.2 45.7 46.6 45.4 25.4-0.3 45.7-21.2 45.4-46.6C91.7 20 70.8-0.3 45.4 0zM45.3 74l-0.3 0c-3.9-0.1-6.7-3-6.6-6.9 0.1-3.8 2.9-6.5 6.7-6.5l0.2 0c4 0.1 6.7 3 6.6 6.9C51.9 71.3 49.1 74 45.3 74zM61.7 41.3c-0.9 1.3-2.9 2.9-5.5 4.9l-2.8 1.9c-1.5 1.2-2.5 2.3-2.8 3.4 -0.3 0.9-0.4 1.1-0.4 2.9l0 0.5H39.4l0-0.9c0.1-3.7 0.2-5.9 1.8-7.7 2.4-2.8 7.8-6.3 8-6.4 0.8-0.6 1.4-1.2 1.9-1.9 1.1-1.6 1.6-2.8 1.6-4 0-1.7-0.5-3.2-1.5-4.6 -0.9-1.3-2.7-2-5.3-2 -2.6 0-4.3 0.8-5.4 2.5 -1.1 1.7-1.6 3.5-1.6 5.4v0.5H27.9l0-0.5c0.3-6.8 2.7-11.6 7.2-14.5C37.9 18.9 41.4 18 45.5 18c5.3 0 9.9 1.3 13.4 3.9 3.6 2.6 5.4 6.5 5.4 11.6C64.4 36.3 63.5 38.9 61.7 41.3z" /></svg>';
};
