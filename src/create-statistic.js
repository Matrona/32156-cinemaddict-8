import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

const statisticTextContainer = document.querySelector(`.statistic__text-list`);
const statisticRankContainer = document.querySelector(`.statistic__rank`);
const chartContainer = document.querySelector(`.statistic__chart`);

export const statisticChart = (data) => {

  const isWatchedFilms = data.filter((film) => film.isWatched);

  const isWatchedGenres = isWatchedFilms.reduce((genresArray, film) => {
    genresArray.push(...film.genres);
    return genresArray;
  }, []);

  const isWatchedGenresSum = Object.entries(isWatchedGenres.reduce((sumArray, genre) => {
    sumArray[genre] = sumArray[genre] + 1 || 1;
    return sumArray;
  }, {}));

  const isWatchedGenresSumOrder = isWatchedGenresSum.sort((a, b) => b[1] - a[1]);

  const isWatchedRuntimeSum = isWatchedFilms.reduce((runtimeSum, film) => runtimeSum + (film.runtime * 60000), 0);

  const chartLabels = isWatchedGenresSumOrder.map((item) => item[0]);
  const chartData = isWatchedGenresSumOrder.map((item) => item[1]);

  const createStatisticText = `
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">
        ${isWatchedFilms.length}
        <span class="statistic__item-description">movies</span>
      </p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">
      ${moment.duration(isWatchedRuntimeSum).hours()}
      <span class="statistic__item-description">h</span>
      ${moment.duration(isWatchedRuntimeSum).minutes()}
      <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${chartLabels[0]}</p>
    </li>
  `;

  const createStatisticRank = `
    Your rank <span class="statistic__rank-label">${chartLabels[0]}</span>
  `;

  statisticTextContainer.innerHTML = createStatisticText;
  statisticRankContainer.innerHTML = createStatisticRank;

  return new Chart(chartContainer, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartLabels,
      datasets: [{
        data: chartData,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};
