import {createDataArray} from './utils.js';
import createRandomCard from './data.js';
import createFilter from './data-filter.js';
import {statisticChart} from './create-statistic.js';
import {Card} from './card/card.js';
import {CardDetails} from './card/card-details.js';
import {Filter} from './filter/filter.js';

// Card

const mainCardsContainer = document.querySelector(`.films`);
const cardContainer = document.querySelector(`.films-list .films-list__container`);
const cardContainersExtra = document.querySelectorAll(`.films-list--extra .films-list__container`);

const cardsData = createDataArray(7, createRandomCard);
const cardsTopData = createDataArray(2, createRandomCard);
const cardsMostCommentedData = createDataArray(2, createRandomCard);

const showCards = (data, container) => {
  container.innerHTML = ``;
  let i = 0;

  for (const cardComponentData of data) {
    i += 1;
    cardComponentData.number = i;

    const cardComponent = new Card(cardComponentData);
    const cardComponentDetails = new CardDetails(cardComponentData);

    cardComponent.onDetails = () => {
      document.body.appendChild(cardComponentDetails.render());
    };

    cardComponentDetails.onDetailsClose = (newObject) => {
      cardComponentData.commentsCount = newObject.commentsCount;
      cardComponentData.comment = newObject.comment;
      cardComponentData.userRating = newObject.userRating;
      cardComponentData.inWatchList = newObject.inWatchList;
      cardComponentData.isWatched = newObject.isWatched;

      document.body.removeChild(document.querySelector(`.film-details`));
      cardComponent.update(cardComponentData);
      cardComponentDetails.unrender();
    };

    cardComponent.onAddToWatchList = (newObject) => {
      cardComponentData.commentsCount = newObject.commentsCount;
      cardComponentData.inWatchList = newObject.inWatchList;
      cardComponentDetails.update(cardComponentData);
    };

    cardComponent.onMarkAsWatched = (newObject) => {
      cardComponentData.commentsCount = newObject.commentsCount;
      cardComponentData.isWatched = newObject.isWatched;
      cardComponentDetails.update(cardComponentData);
    };

    container.appendChild(cardComponent.render());

    const cardsExtra = document.querySelectorAll(`.films-list--extra .film-card`);
    cardsExtra.forEach((cardExtra) => {
      cardExtra.classList.add(`film-card--no-controls`);
    });
  }
};

// Filter

const filterContainer = document.querySelector(`.main-navigation`);
const statisticBtn = filterContainer.querySelector(`.main-navigation__item--additional`);

const toggleNavItemActive = (evt) => {
  const filterLinks = document.querySelectorAll(`.main-navigation__item`);
  filterLinks.forEach((linkItem) => {
    linkItem.classList.remove(`main-navigation__item--active`);
  });
  evt.target.classList.add(`main-navigation__item--active`);
};

const filterData = (data, filterName) => {
  switch (filterName) {
    case `all`:
      return data;
    case `watchlist`:
      return data.filter((film) => film.inWatchList);
    case `history`:
      return data.filter((film) => film.isWatched);
    // case `favorites`:
    //   return data;
    default:
      return data;
  }
};

const showFilter = (container) => {
  const filterComponentData = createFilter();

  return filterComponentData.map((item) => {
    const filterComponent = new Filter(item);
    container.insertBefore(filterComponent.render(), statisticBtn);

    filterComponent.onFilter = (evt) => {
      const filterName = evt.target.id;
      const filteredCards = filterData(cardsData, filterName);
      showCards(filteredCards, cardContainer);
      toggleNavItemActive(evt);

      statistic.classList.add(`visually-hidden`);
      mainCardsContainer.classList.remove(`visually-hidden`);
    };
  });
};

// statistic

const statistic = document.querySelector(`.statistic`);

const onStatsBtnClick = (evt) => {
  evt.preventDefault();
  toggleNavItemActive(evt);
  statistic.classList.remove(`visually-hidden`);
  mainCardsContainer.classList.add(`visually-hidden`);

  statisticChart(cardsData);
};

statisticBtn.addEventListener(`click`, onStatsBtnClick);

// filter

showFilter(filterContainer);

// Cards

showCards(cardsData, cardContainer);

showCards(cardsTopData, cardContainersExtra[0]);
showCards(cardsMostCommentedData, cardContainersExtra[1]);
