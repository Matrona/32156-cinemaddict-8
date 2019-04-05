import {toggleBlockForm} from './utils.js';
import createFilter from './data-filter.js';
import {statisticChart} from './create-statistic.js';
import {Card} from './card/card.js';
import {CardDetails} from './card/card-details.js';
import {Filter} from './filter/filter.js';

import {API} from './api.js';

const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;

const api = new API(END_POINT, AUTHORIZATION);

// Card

let movies;
const mainCardsContainer = document.querySelector(`.films`);
const cardContainer = document.querySelector(`.films-list .films-list__container`);
const cardContainersExtra = document.querySelectorAll(`.films-list--extra .films-list__container`);

const showCards = (data, container) => {
  container.innerHTML = ``;

  for (const cardComponentData of data) {

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

    cardComponentDetails.onCommentSend = (newObject) => {
      cardComponentData.comment = newObject.comment;
      toggleBlockForm(cardComponentDetails.element.querySelector(`.film-details__comment-input`), true);

      api.updateMovie(cardComponentData.number, cardComponentData.toRAW())
        .then((newCardComponentData) => {
          toggleBlockForm(cardComponentDetails.element.querySelector(`.film-details__comment-input`), false);
          cardComponentDetails.createNewComment();
          cardComponent.update(newCardComponentData);
        })
        .catch(() => {
          cardComponentData.comment.pop();
          cardComponentData.comment = newObject.comment;
          cardComponentDetails.update(cardComponentData);
          cardComponentDetails.shake();
          cardComponentDetails.element.querySelector(`.film-details__comment-input`).style.borderColor = `red`;
          toggleBlockForm(cardComponentDetails.element.querySelector(`.film-details__comment-input`), false);
        });
    };

    cardComponentDetails.onUserRatingSend = (newObject) => {
      cardComponentData.userRating = newObject.userRating;
      toggleBlockForm(cardComponentDetails.element.querySelector(`.film-details__inner`), true);

      api.updateMovie(cardComponentData.number, cardComponentData.toRAW())
        .then((newCardComponentData) => {
          toggleBlockForm(cardComponentDetails.element.querySelector(`.film-details__inner`), false);
          cardComponent.update(newCardComponentData);
        })
        .catch(() => {
          toggleBlockForm(cardComponentDetails.element.querySelector(`.film-details__inner`), false);
          cardComponentDetails.shake();
          cardComponentDetails.element.querySelector(`.film-details__user-rating-input:checked + label`).style.background = `red`;
        });
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

const showFilter = (data, container) => {
  const filterComponentData = createFilter();

  return filterComponentData.map((item) => {
    const filterComponent = new Filter(item);
    container.insertBefore(filterComponent.render(), statisticBtn);

    filterComponent.onFilter = (evt) => {
      const filterName = evt.target.id;
      const filteredCards = filterData(data, filterName);
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

  statisticChart(movies);
};

// Cards

const filmsTitle = document.querySelector(`.films-list__title`);

const createLoadMessage = () => {
  filmsTitle.classList.remove(`visually-hidden`);
  filmsTitle.textContent = `Loading movies...`;
};

createLoadMessage();

api.getMovies()
  .then((data) => {
    movies = data;
    showCards(movies, cardContainer);
    filmsTitle.classList.add(`visually-hidden`);

    const cardsTopData = movies.sort(() => 0.5 - Math.random()).slice(0, 2);
    showCards(cardsTopData, cardContainersExtra[0]);
    const cardsMostCommentedData = movies.sort(() => 0.5 - Math.random()).slice(0, 2);
    showCards(cardsMostCommentedData, cardContainersExtra[1]);

    showFilter(movies, filterContainer);
    statisticBtn.addEventListener(`click`, onStatsBtnClick);
  })
  .catch(() => {
    filmsTitle.textContent = `Something went wrong while loading movies. Check your connection or try again later`;
  });
