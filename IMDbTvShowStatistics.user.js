// ==UserScript==
// @name        IMDbTvShowStatistics
// @namespace   notableTieView
// @author      notableTieView
// @description Shows season statistics for TV Shows on IMDB
// @include     http://www.imdb.com/title/*
// @include     http://www.imdb.com/title/*/eprate*
// @version     1.0
// @grant       none
// @license Creative Commons Attribution-NonCommercial 3.0 http://creativecommons.org/licenses/by-nc/3.0/
//
// This script uses the following external libraries which are available under different licenses:
// jQuery (https://jquery.com/) is provided under the MIT License https://tldrlegal.com/license/mit-license
// d3 (http://d3js.org/) is provided under the BSD 3-Clause License https://github.com/mbostock/d3/blob/master/LICENSE
// Chart.js (http://www.chartjs.org/) is provided under the MIT License http://opensource.org/licenses/MIT
// Highcharts (http://shop.highsoft.com/highcharts.html) is provided by Highsoft (http://shop.highsoft.com/) for non-commercial use under the Creative Commons Attribution-NonCommercial 3.0 license: http://creativecommons.org/licenses/by-nc/3.0/
//
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js
// @require http://code.highcharts.com/highcharts.js
// @require http://code.highcharts.com/highcharts-more.js
// @require http://code.highcharts.com/modules/exporting.js
//
// ==/UserScript==

// compatibility
this.$ = this.jQuery = jQuery.noConflict(true);
/*
Plot a box plot for every season (min, q1, median, q3, max)
divId - the div to add the plot to
plotData - the data
*/
function plotBoxPlot(divId, plotData, width) {
  $(divId).highcharts({
    chart: {
      type: 'boxplot',
      width: width,
      height: 200
    },
    title: {
      text: ''
    },
    legend: {
      enabled: false
    },
    xAxis: {
      categories: plotData.labels,
      title: {
        text: '' //Seasons'
      }
    },
    yAxis: {
      title: {
        text: ''
      },
      plotLines: [
        {
          value: plotData.median,
          color: 'red',
          width: 2,
          label: {
            align: 'left',
            style: {
              color: 'gray'
            }
          }
        }
      ]
    },
    series: [
      {
        name: 'Stats',
        data: plotData.quartiles,
        tooltip: {
          headerFormat: '<em>Season {point.key}</em><br/>'
        }
      }
    ]
  });
}
/*
Compute the average over an array
ar - the array (numeric)
*/

function getAverage(ar) {
  var count = 0;
  for (var i = 0, n = ar.length; i < n; i++) {
    count += ar[i];
  }
  return count / ar.length;
}
/*
Get a quartile of an array
ar - array, sorted (highest first)
q - the quartile we want: e.g. 0.25, 0.5 (median), 0.75
*/

function getQuartile(q, ar) {
  var realQ = (1 - q) * ar.length;
  var floorQ = Math.ceil(realQ);
  if (realQ === floorQ) {
    if (floorQ === 0) {
      return ar[0];
    } else if (floorQ === ar.length) {
      return ar[ar.length - 1];
    } else {
      return getAverage([ar[floorQ - 1], ar[floorQ]]);
    }
  }
  return ar[floorQ];
}
/*
Transform seasonData into data structure thats easy to use for plotting
seasonData - a hash with an array of ratings for each season 
the index in the hash is the seaons, season 0 is for specials
*/

function getPlotData(seasonData) {
  seasons = Object.keys(seasonData);
  n = seasons.length;
  seasonLabels = [
  ];
  seasonAverages = [
  ];
  seasonQuartiles = [
    []
  ];
  allRatings = [
  ];
  specials = false;
  seasons.forEach(function (season) {
    index = season - 1;
    if (season == 0) {
      index = n - 1;
      seasonLabels[index] = 'S'; //specials';
      specials = true;
    } else {
      seasonLabels[index] = season.toString();
    }
    seasonAverages[index] = getAverage(seasonData[season]);
    seasonQuartiles[index] = [
      Math.min.apply(null, seasonData[season]),
      getQuartile(0.25, seasonData[season]),
      getQuartile(0.5, seasonData[season]),
      getQuartile(0.75, seasonData[season]),
      Math.max.apply(null, seasonData[season])
    ];
    allRatings = allRatings.concat(seasonData[season]);
  });
  allRatings.sort(function (a, b) {
    return b - a
  }); //sort in reverse order
  averageData = {
    averages: seasonAverages,
    labels: seasonLabels,
    quartiles: seasonQuartiles,
    minimumFloor: Math.max(Math.floor(Math.min.apply(null, seasonAverages)) - 1, 0),
    median: getQuartile(0.5, allRatings),
    num: n,
    specials: specials
  };
  return averageData;
}
/*
Plot a simple chart with season averages as bars
divId - the id to add the plot to
plotData - the datastructure 
*/

function plotChart(divId, plotData) {
  var data = {
    labels: plotData.labels,
    datasets: [
      {
        label: 'Average Season Ratings',
        fillColor: 'rgba(19,108,178,0.5)',
        strokeColor: 'rgba(220,220,220,0.8)',
        highlightFill: 'rgba(19,108,178,0.9)',
        highlightStroke: 'rgba(220,220,220,1)',
        data: plotData.averages
      }
    ]
  };
  var options = {
    scaleOverride: true,
    scaleStepWidth: 1,
    scaleSteps: (10 - averageData.minimumFloor),
    scaleStartValue: averageData.minimumFloor,
  }
  var ctx = $(divId).get(0).getContext('2d');
  new Chart(ctx).Bar(data, options);
}
/*
Extract the data from one table row of the ratings table
row - the row (jquery object)
scoresBySeason - the hash of arrays to append the extracted rating to
*/

function workOnTableRow(row, scoresBySeason) {
  seasonEpisodeField = $(row).children().eq(0);
  if (seasonEpisodeField.is('th')) {
    //return;
  } else {
    seasonEpisode = $.trim(seasonEpisodeField.text());
    season = 0;
    if (seasonEpisode != '-') {
      season = seasonEpisode.split('.') [0];
    }
    rating = parseFloat($(row).children().eq(2).text());
    if (season in scoresBySeason) {
      scoresBySeason[season].push(rating);
    } else {
      scoresBySeason[season] = [
        rating
      ];
    }
  }
}
/*
Extract a hash with rating arrays for each season from the ratings table
*/

function collectDataPointsBySeason() {
  scoresBySeason = {
  };
  tabRowsVar = $('#tn15content table').eq(0).find('tr');
  tabRowsVar.each(function () {
    workOnTableRow(this, scoresBySeason);
  });
  return scoresBySeason;
}
/*
Plot all the Charts (use on a eprate page)
*/

function addPlotsToEpRatePage() {
  var seasonData = collectDataPointsBySeason();
  plotData = getPlotData(seasonData);
  n = plotData.num;
  width = Math.max(300, n * 30);
  addGlobalStyle('.statsHeading { margin-left:10px !important; margin-bottom:10px !important; }');
  addGlobalStyle('.statsDiv { float:left; max-width:100%; margin-top:10px; width:'.concat(width).concat('px;}'));
  addGlobalStyle('#seasonAverage { margin-top: -3px; height: 190px; max-width:100%; width:'.concat(width).concat('px;}'));
  addGlobalStyle('#seasonBoxPlot { margin-left: -10px; }');
  addGlobalStyle('#statisticsClear { clear:both; margin-bottom: 10px; }');
  
  clearDivContent='';
  if (plotData.specials) {
    clearDivContent='(S = Specials)';
  }
  $('#tn15adrhs').css('display', 'none');
  var statisticsHtml = $('<div style="overflow:hidden;">\
                            <h4>Season Statistics</h4>\
                            <div class="statsDiv">\
                              <h5 class="statsHeading">Rating Averages</h5>\
                              <canvas id="seasonAverage"></canvas>\
                            </div>\
                            <div class="statsDiv">\
                              <h5 class="statsHeading">Rating Box Plots</h5>\
                              <div id="seasonBoxPlot"></div>\
                            </div>\
                            <div id="statisticsClear">'.concat(clearDivContent).concat('</div>\
                          </div>'
  ));
  $('div#tn15content h4').before(statisticsHtml);
  plotChart('#seasonAverage', plotData);
  plotBoxPlot('#seasonBoxPlot', plotData, width);
}
/*
Add a Link to a regular page, linking to the eprate page
if it is a TV-Show pages
*/

function addLinkToTVShowPage(linkDest) {
  episodesHeadline = $('#maindetails_center_bottom .article h2');
  if ((episodesHeadline != undefined) && (episodesHeadline.eq(0).text() == 'Episodes')) {
    // this is a TV show
    $('#overview-top .star-box-details').eq(0).append('<br/><a href=\''.concat(linkDest).concat('eprate\'>Show Episode Ranking</a>'));
  }
}
/*
Add CSS
*/

function addGlobalStyle(css) {
  var head,
  style;
  head = document.getElementsByTagName('head') [0];
  if (!head) {
    return;
  }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}
/*
Run on every matching imdb page
*/

currURL = document.URL.split('?') [0];
if (currURL.match(/eprate/g) != undefined) {
  // we are on an eprate page
  addPlotsToEpRatePage();
} else {
  addLinkToTVShowPage(currURL);
}
