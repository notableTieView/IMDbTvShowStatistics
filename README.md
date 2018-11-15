# IMDbTvShowStatistics
Display diagrams comparing the seasons of a TV show.

## STATUS: Discontinued
IMDb has removed the respective pages containing all episodes of one show in favor of one page per season in a different layout. The userScript therefore no longer works.

## Description
This is a userScript (to be used with Greasemonkey, Tampermonkey, ...).
The script is available for installation on [Greasy Fork](https://greasyfork.org/en/users/19427-notabletieview).
On the IMDb page of a TV Show (eg. [Doctor Who](http://www.imdb.com/title/tt0436992/)), a link to the episode rating overview is added (eg. [Doctor Who episode ratings](http://www.imdb.com/title/tt0436992/eprate)).
On the latter, two diagrams are added:
* One diagram shows the average ratings per season in a bar chart
* One diagram shows a box plot (min, first quartile, median, third quartile, max) for each season.

Specials are subsumed under one special season (marked S).
The table containing all episodes and their ratings, is augmented with another column (User Rank) which lists the rank of each episode.
The top three episodes of each season are highlighted in the table (gold, silver, bronze). The worst episode of each season is colored red.

## ChangeLog
* Version 1.1 fixed CSS Bug
* Version 1.2 added new column User Rank
* Version 1.4 added highlighting of top and worst episodes
* Version 1.5 adapted to new id in TV show pages
* Version 1.6 adapted to new Layout of IMDb pages

## License
This script uses third party libraries and is therefore provided under the license [Creative Commons Attribution-NonCommercial 3.0](http://creativecommons.org/licenses/by-nc/3.0/).
This script uses the following external libraries which are available under different licenses:
* [jQuery](https://jquery.com/) is provided under the [MIT License](https://tldrlegal.com/license/mit-license)
* [d3](http://d3js.org/) is provided under the [BSD 3-Clause License](https://github.com/mbostock/d3/blob/master/LICENSE)
* [Chart.js](http://www.chartjs.org/) is provided under the [MIT License](http://opensource.org/licenses/MIT)
* [Highcharts](http://shop.highsoft.com/highcharts.html) is provided by [Highsoft](http://shop.highsoft.com/) for non-commercial use under the [Creative Commons Attribution-NonCommercial 3.0 license](http://creativecommons.org/licenses/by-nc/3.0/)
