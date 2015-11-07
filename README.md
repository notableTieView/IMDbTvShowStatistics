# IMDbTvShowStatistics
Display diagrams comparing the seasons of a TV show.

This is a userScript (to be used with Greasemonkey, Tampermonkey, ...).
On the IMDb page of a TV Show (eg. [Dr. Who](http://www.imdb.com/title/tt0436992/)), a link to the episode rating overview is added (eg. [Dr. Who episode ratings](http://www.imdb.com/title/tt0436992/eprate)).
On the latter, two diagrams are added:
* One diagram shows the average ratings per season in a bar chart
* One diagram shows a box plot (min, first quartile, median, third quartile, max) for each season.

Specials are treated are subsumed under one special season (marked S).
The table containing all episodes and their ratings, is augmented with another column (User Rank) which lists the rank of each episode.

## ChangeLog
* Version 1.1 fixed CSS Bug
* Version 1.2 added new column User Rank

## License
This script uses third party libraries and is therefore provided under the license [Creative Commons Attribution-NonCommercial 3.0](http://creativecommons.org/licenses/by-nc/3.0/).
This script uses the following external libraries which are available under different licenses:
* [jQuery](https://jquery.com/) is provided under the [MIT License](https://tldrlegal.com/license/mit-license)
* [d3](http://d3js.org/) is provided under the [BSD 3-Clause License](https://github.com/mbostock/d3/blob/master/LICENSE)
* [Chart.js](http://www.chartjs.org/) is provided under the [MIT License](http://opensource.org/licenses/MIT)
* [Highcharts](http://shop.highsoft.com/highcharts.html) is provided by [Highsoft](http://shop.highsoft.com/) for non-commercial use under the [Creative Commons Attribution-NonCommercial 3.0 license](http://creativecommons.org/licenses/by-nc/3.0/)
